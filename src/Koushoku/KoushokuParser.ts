import {
    PartialSourceManga,
    RequestManager,
    Tag,
    TagSection
} from '@paperback/types';

import entities = require('entities');

export const DOMAIN = 'https://fakku.cc';

export async function getTags(requestManager: RequestManager, cheerio: CheerioAPI): Promise<Tag[]> {
    const request = App.createRequest({
        url: `${DOMAIN}/tags`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const tagElements = $('main', 'main').children().toArray();
    
    const tags: Tag[] = [];

    for (const element of tagElements) {
        const id = $('a', element).attr('href') ?? '';
        const label = $('span', element).first().text() ?? '';
        tags.push(App.createTag({ id, label }));
    }

    return tags;
}

export function getAlbums ($: CheerioStatic): PartialSourceManga[] {
    const albums: PartialSourceManga[] = [];
    const albumGroups = $('article.entry').toArray();

    for (const album of albumGroups) {
        const image = $('img', album).attr('src') ?? '';
        const id = $('a', album).attr('href') ?? '';
        const title = $('a', album).attr('title') ?? '';
        const artist = $('span', album).first().text() ?? '';

        console.log('ID ' + id);
        console.log('Image ' + image);
        console.log('Title ' + title);
        console.log('Artist ' + artist);

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
        tagsToRender.push({ id: `/tags/${encodeURIComponent(label)}`, label: label });
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
    const pages: string[] = [];
    
    let request = App.createRequest({
        url: `${DOMAIN}/${id}/1`,
        method: 'GET'
    });
    let data = await requestManager.schedule(request, 1);
    let $ = cheerio.load(data.data as string);
    const lengthText = $('span.total').text();
    const length = parseInt(lengthText.substring(0, lengthText.length / 2));
    let imageLink = $('img', 'main.page').attr('src') ?? '';
    pages.push(imageLink);
    
    for (let i = 1; i < length + 1; i++) {
        request = App.createRequest({
            url: `${DOMAIN}/${id}/${i}`,
            method: 'GET'
        });
        data = await requestManager.schedule(request, 1);
        $ = cheerio.load(data.data as string);
        imageLink = $('img', 'main.page').attr('src') ?? '';
        pages.push(imageLink);
    }

    return pages;
}

export const isLastPage = (albums: PartialSourceManga[]): boolean => {
    return albums.length != 25; 
};  