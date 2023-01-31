import {
    MangaTile,
    RequestManager,
    Tag,
    TagSection
} from 'paperback-extensions-common';

import entities = require('entities');

export const REGEX_ASIAN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u3131-\uD79D]/;

export function getAlbums ($: CheerioStatic, hasEncodedUrls: boolean): MangaTile[] {
    const albums: MangaTile[] = [];
    const albumCoverGroups = $('div.blog').toArray();

    for (const albumCoverGroup of albumCoverGroups) {
        const albumCovers = $('div.items-row', albumCoverGroup).toArray();

        for (const albumCover of albumCovers) {
            let image = $('img', albumCover).first().attr('src') ?? '';
            const title = $('img', albumCover).first().attr('alt') ?? '';
            const id = $('a', albumCover).attr('href')?.replace(/\/$/, '')?.split('/').pop() ?? '';

            if (hasEncodedUrls) {
                const imageSplit: string[] = image.split('com');
                image = imageSplit[0] + 'com' + encodeURIComponent(imageSplit[1] ?? '').replaceAll('%2F', '/');
            }

            if (!id || !title) {
                continue;
            }
            albums.push(createMangaTile({
                id: id.match(REGEX_ASIAN) ? encodeURIComponent(id) : id,
                image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({text: entities.decodeHTML(title)})
            }));
        }
    }

    return albums;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGalleryData(id: string, requestManager: RequestManager, cheerio: CheerioAPI, domain: string, hasEncodedUrls: boolean): Promise<any> {
    const request = createRequestObject({
        url: `${domain}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    CloudFlareError(data.status);

    const $ = cheerio.load(data.data);
    
    const title = $('div.article-header').first().text();
    let image = $('img', 'div.article-fulltext').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
    let desc = $('small', 'div.article-info').last().text();

    if (hasEncodedUrls) {
        desc = $('div.article-info').first().text() + '\n' + $('div.article-info').last().text();
        const imageSplit: string[] = image.split('com');
        image = imageSplit[0] + 'com' + encodeURIComponent(imageSplit[1] ?? '').replaceAll('%2F', '/');
    }

    const tagHeader = $('div.article-tags').first();
    const tags = $('a.tag', tagHeader).toArray();
    const tagsToRender: Tag[] = [];
    for (const tag of tags) {
        const label = $('span', tag).text();
        const id = $(tag).attr('href');
        if (!id || !label) {
            continue;
        }
        hasEncodedUrls ? tagsToRender.push({ id: id.match(REGEX_ASIAN) ? encodeURIComponent(id) : id, label: label })
            : tagsToRender.push({ id: id, label: label });
    }

    const tagSections: TagSection[] = [createTagSection({
        id: '0',
        label: 'Tags',
        tags: tagsToRender.map(x => createTag(x)) 
    })];

    return {
        id: id.match(REGEX_ASIAN) ? encodeURIComponent(id) : id,
        titles: [title],
        image: image,
        tags: tagSections,
        desc: desc
    };
}

export async function getPages(id: string, requestManager: RequestManager, cheerio: CheerioAPI, domain: string, hasEncodedUrls: boolean): Promise<string[]> {
    const request = createRequestObject({
        url: `${domain}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    CloudFlareError(data.status);

    const $ = cheerio.load(data.data);
    
    const pages: string[] = [];
    const pageCount = parseInt($('a.pagination-link', 'nav.pagination').last().text());

    for (let i = 0; i < pageCount; i++) {
        const request = createRequestObject({
            url: `${domain}/${id}?page=${i + 1}`,
            method: 'GET'
        });
        const data = await requestManager.schedule(request, 1);
        CloudFlareError(data.status);

        const $ = cheerio.load(data.data);

        const images = $('p', 'div.article-fulltext').toArray();
        for (const img of images) {
            let imageString = $('img', img).attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';

            if (hasEncodedUrls) {
                const imageSplit: string[] = imageString.split('com');
                imageString = imageSplit[0] + 'com' + encodeURIComponent(imageSplit[1] ?? '').replaceAll('%2F', '/');
            }

            pages.push(imageString);
        }
    }

    return pages;
}

export const isLastPage = ($: CheerioStatic): boolean => {
    const nav = $('nav.pagination', 'div.is-full.main-container');
    const pageList = $('ul.pagination-list', nav);
    const lastPageNum = parseInt($('li', pageList).last().text());
    const currPageNum = parseInt($('a.is-current', pageList).text());

    return (isNaN(lastPageNum) || 
            isNaN(currPageNum) ||
            lastPageNum === -1 || 
            lastPageNum === currPageNum ? 
        true : false);
};

export function CloudFlareError(status: unknown): void {
    if (status == 403) {
        throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass');
    }
}