import {
    MangaTile,
    RequestManager,
    Tag,
    TagSection
} from 'paperback-extensions-common';

import entities = require('entities');

export const DOMAIN = 'https://asiantolick.com';
export const REGEX_ASIAN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u3131-\uD79D]/;
export const REGEX_PATH_NAME = /^(?:(?:\w{3,5}:)?\/\/[^/]+)?(?:\/|^)((?:[^#./:?\n\r]+\/?)+(?=\?|#|$|\.|\/))/;

export function getAlbums ($: CheerioStatic): MangaTile[] {
    const albums: MangaTile[] = [];
    const albumGroups = $('a.miniatura').toArray();
 
    for (const album of albumGroups) {
        const imgInfo = $('div.background_miniatura', album);

        const image = $('div.background_miniatura img', imgInfo).attr('src') ?? '';
        const title = $('div.background_miniatura img', imgInfo).attr('alt') ?? '';

        const path = REGEX_PATH_NAME.exec($(album).attr('href') ?? '')?.toString().split(',')[1] ?? '';
        const pathSplit = path.split('/');
        let id = '';
        pathSplit.forEach(x => id += x.match(REGEX_ASIAN) ? encodeURIComponent(x) + '/' : x + '/');

        if (!id || !title) {
            continue;
        }

        albums.push(createMangaTile({
            id: id,
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({text: entities.decodeHTML(title)})
        }));
    }

    return albums;
}

export async function getGalleryData(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<any> {
    const request = createRequestObject({
        url: `${DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);

    const title = $('h1').first().text();
    const image = $('img.miniaturaImg').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';

    const descInfo = $('b').first().parent().parent().children().toArray();
    descInfo.pop();
    let desc = '';
    descInfo.forEach(x => desc += $(x).text() + '\n');

    const tagHeader = $('div#categoria_tags_post').first();
    const cat = $('span', tagHeader).first();
    const tags = $('span', tagHeader).last().toArray();

    const tagsToRender: Tag[] = [];
    for (const tag of tags) {
        const label = $('a', tag).text();
        const id = $(tag).attr('href');
        if (!id || !label) {
            continue;
        }
        tagsToRender.push({ id: id.match(REGEX_ASIAN) ? encodeURIComponent(id) : id, label: label });
    }

    const tagSections: TagSection[] = [createTagSection({
        id: '0',
        label: 'Tags',
        tags: tagsToRender.map(x => createTag(x)) 
    })];

    return {
        id: id,
        titles: [title],
        image: image,
        tags: tagSections,
        desc: desc
    };
}

export async function getPages(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    // const request = createRequestObject({
    //     url: `${DOMAIN}/${id}`,
    //     method: 'GET'
    // });
    // const data = await requestManager.schedule(request, 1);
    // const $ = cheerio.load(data.data);
    
    // const pages: string[] = [];
    // const pageCount = parseInt($('a.pagination-link', 'nav.pagination').last().text());

    // for (let i = 0; i < pageCount; i++) {
    //     const request = createRequestObject({
    //         url: `${DOMAIN}/${id}?page=${i + 1}`,
    //         method: 'GET'
    //     });
    //     const data = await requestManager.schedule(request, 1);
    //     const $ = cheerio.load(data.data);

    //     const images = $('p', 'div.article-fulltext').toArray();
    //     for (const img of images) {
    //         const imageString = $('img', img).attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
    //         pages.push(imageString);
    //     }
    // }

    // return pages;

    throw new Error('Not implemented!');
}

export const isLastPage = ($: CheerioStatic): boolean => {
    // const nav = $('nav.pagination', 'div.is-full.main-container');
    // const pageList = $('ul.pagination-list', nav);
    // const lastPageNum = parseInt($('li', pageList).last().text());
    // const currPageNum = parseInt($('a.is-current', pageList).text());

    // return (isNaN(lastPageNum) || 
    //         isNaN(currPageNum) ||
    //         lastPageNum === -1 || 
    //         lastPageNum === currPageNum ? 
    //     true : false);

    throw new Error('Not implemented!');
};