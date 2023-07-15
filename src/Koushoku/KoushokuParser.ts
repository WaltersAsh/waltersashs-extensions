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

export async function getTags(requestManager: RequestManager, cheerio: CheerioAPI): Promise<Tag[][]> {
    throw new Error('Not implemented!');
}

export function getAlbums ($: CheerioStatic): PartialSourceManga[] {
    const albums: PartialSourceManga[] = [];
    const albumGroups = $('article', 'main').toArray();
 
    for (const album of albumGroups) {
        const image = $('img', album).attr('src') ?? '';
        const titleDetails = $('h3', album);
        const creator = $('a', titleDetails).first().text() ?? '';
        const name = $('a', titleDetails).last().text() ?? '';
        const title = `${creator} - ${name}`;
        const id = $('a', album).attr('href') ?? '';

        if (!id || !title) {
            continue;
        }

        albums.push(App.createPartialSourceManga({
            mangaId: encodeURIComponent(id),
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
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

    const title = $('h1', 'section').first().text();
    const image = $('img', 'div.wrapper').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';

    // const descInfo
    // const tags

    // const tagsToRender: Tag[] = [];
    // for (const tag of tags) {
    //     const label
    //     const id
        
    //     if (!id || !label) {
    //         continue;
    //     }
    //     tagsToRender.push({ id: id.match(REGEX_ASIAN) ? encodeURIComponent(id) : id, label: label });
    // }

    // const tagSections: TagSection[] = [createTagSection({
    //     id: '0',
    //     label: 'Tags',
    //     tags: tagsToRender.map(x => createTag(x)) 
    // })];

    // return {
    //     id: id,
    //     titles: [title],
    //     image: image,
    //     tags: tagSections,
    //     desc: desc
    // };

    return {
        id: id,
        titles: [title],
        image: image
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
    console.log('Length: ' + length);

    const pages: string[] = [];
    for (let i = 1; i < length + 1; i++) {
        const imageLink = i < 10 ? `${DOMAIN}/resampled/${imageId}/0${i}.png`: `${DOMAIN}/resampled/${imageId}/${i}.png`;
        console.log('Rendering: ' + imageLink);
        pages.push(imageLink);
    }

    return pages;
}

export const isLastPage = ($: CheerioStatic): boolean => {
    throw new Error('Not implemented!');
};
