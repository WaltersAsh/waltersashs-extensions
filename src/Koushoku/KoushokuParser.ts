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
    CloudFlareError(data.status);
    const $ = cheerio.load(data.data as string);
    const tagElements = $('div.entry').toArray();
    const tags: Tag[] = [];

    for (const element of tagElements) {
        const id = $('a', element).attr('href')?.slice(6) ?? '';
        const label = $('strong', element).first().text() ?? '';
        console.log(id);
        console.log(label);
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
        const artist = $('span', album).last().text() ?? '';

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
    CloudFlareError(data.status);
    const $ = cheerio.load(data.data as string);

    const title = $('h1.title').first().text();
    const image = $('img').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
    const artist = $('a', 'tr.artists').text();
    const magazine = $('a', 'tr.magazines').text();
    const pages = $('td', 'tr.pages').last().text();
    const created = $('td', 'tr.created').last().text();
    const published = $('td', 'tr.published').last().text();
    const desc = 'Magazine: ' + magazine + '\n'
        + 'Pages: ' + pages + '\n'
        + 'Created: ' + created + '\n'
        + 'Published: ' + published + '\n';


    return {
        id: id,
        titles: [entities.decodeHTML(title as string)],
        image: image,
        artist: artist,
        desc: desc
    };
}

export async function getPages(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const pages: string[] = [];
    
    let request = App.createRequest({
        url: `${DOMAIN}/${id}/1`,
        method: 'GET'
    });
    let data = await requestManager.schedule(request, 1);
    CloudFlareError(data.status);
    let $ = cheerio.load(data.data as string);
    const lengthText = $('span.total').text();
    const length = parseInt(lengthText.substring(0, lengthText.length / 2));
    let imageLink = $('img', 'main.page').attr('src') ?? '';
    pages.push(imageLink);
    
    for (let i = 2; i < length + 1; i++) {
        request = App.createRequest({
            url: `${DOMAIN}/${id}/${i}`,
            method: 'GET'
        });
        data = await requestManager.schedule(request, 1);
        CloudFlareError(data.status);
        $ = cheerio.load(data.data as string);
        imageLink = $('img', 'main.page').attr('src') ?? '';
        pages.push(imageLink);
    }

    return pages;
}

export const isLastPage = (albums: PartialSourceManga[]): boolean => {
    return albums.length != 25; 
};  

export function CloudFlareError(status: number): void {
    if (status == 503 || status == 403) {
        throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to the homepage of <${DOMAIN}> and press the cloud icon.`);
    }
}