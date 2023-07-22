import {
    PartialSourceManga,
    RequestManager,
    Tag,
    TagSection
} from '@paperback/types';

import entities = require('entities');

export const DOMAIN = 'https://ksk.moe';
export const REGEX_ASIAN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u3131-\uD79D]/;
export const REGEX_PATH_NAME = /^(?:(?:\w{3,5}:)?\/\/[^/]+)?(?:\/|^)((?:[^#./:?\n\r]+\/?)+(?=\?|#|$|\.|\/))/;

export async function getTags(requestManager: RequestManager, cheerio: CheerioAPI): Promise<Tag[]> {
    const request = App.createRequest({
        url: `${DOMAIN}/tags/page/1`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const tagElements = $('main', 'main').children().toArray();

    const request2 = App.createRequest({
        url: `${DOMAIN}/tags/page/2`,
        method: 'GET'
    });
    const data2 = await requestManager.schedule(request2, 1);
    const $$ = cheerio.load(data2.data as string);
    const tagElements2 = $$('main', 'main').children().toArray();
    
    const tags: Tag[] = [];

    for (const element of tagElements) {
        const id = $('a', element).attr('href') ?? '';
        const label = $('span', element).first().text() ?? '';
        tags.push(App.createTag({ id, label }));
    }

    for (const element of tagElements2) {
        const id = $$('a', element).attr('href') ?? '';
        const label = $$('span', element).first().text() ?? '';
        tags.push(App.createTag({ id, label }));
    }

    return tags;
}

export function getAlbums ($: CheerioStatic): PartialSourceManga[] {
    const albums: PartialSourceManga[] = [];
    const albumGroups = $('article', 'main').toArray();
 
    for (const album of albumGroups) {
        const image = $('img', album).attr('src') ?? '';
        const id = $('a', album).attr('href') ?? '';
        const title = $('a', album).attr('title') ?? '';
        const artist = $('span', album).first().text() ?? '';

        if (!id || !title) {
            continue;
        }

        albums.push(App.createPartialSourceManga({
            mangaId: encodeURIComponent(id),
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
            subtitle: artist,
            title: entities.decodeHTML(title)
        }));
    }

    return albums;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGalleryData(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<any> {
    const request = App.createRequest({
        url: `${DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);

    const title = $('h2', 'section#metadata').first().text();
    const image = $('img').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
    const artistSection = $('strong:contains("Artist")').parent();
    const artist = $('span', artistSection).first().text();

    const tagsElement1 = $('strong:contains("Tag")').first().parent();
    const tagsElement2 = $('span', tagsElement1).toArray();

    const tagsToRender: Tag[] = [];
    for (const tag of tagsElement2) {
        const label = $(tag).text();
        if (label.match(/^\d/)) continue;
        
        if (!label) {
            continue;
        }
        tagsToRender.push({ id: `${DOMAIN}/tags/${label}`, label: label });
    }

    const tagSections: TagSection[] = [App.createTagSection({
        id: '0',
        label: 'Tags',
        tags: tagsToRender.map(x => App.createTag(x)) 
    })];

    return {
        id: id,
        titles: [entities.decodeHTML(title as string)],
        image: image,
        artist: artist,
        tags: tagSections
    };
}

export async function getPages(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const imageId = id.slice(10);
    
    const request = App.createRequest({
        url: `${DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const length = parseInt($('span:contains("Pages")').text().split(' ')[0] ?? '');

    const pages: string[] = [];
    for (let i = 1; i < length + 1; i++) {
        // Pages start from 01, 02, 03..09, 10, 11...
        const imageLink = i < 10 ? `${DOMAIN}/resampled/${imageId}/0${i}.png`: `${DOMAIN}/resampled/${imageId}/${i}.png`;
        pages.push(imageLink);
    }

    return pages;
}

export const isLastPage = (albums: PartialSourceManga[]): boolean => {
    // max albums displayed per page, need to find better way - last page will have 35 albums for popular sections
    return albums.length != 35; 
};
