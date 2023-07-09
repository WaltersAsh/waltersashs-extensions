import {
    PartialSourceManga,
    RequestManager,
    Tag,
    TagSection
} from '@paperback/types';

import entities = require('entities');

export const DOMAIN = 'https://asiantolick.com';
export const REGEX_ASIAN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u3131-\uD79D]/;
export const REGEX_PATH_NAME = /^(?:(?:\w{3,5}:)?\/\/[^/]+)?(?:\/|^)((?:[^#./:?\n\r]+\/?)+(?=\?|#|$|\.|\/))/;
export const REGEX_EMOJIS = /\p{Extended_Pictographic}/u;

export async function getTags(requestManager: RequestManager, cheerio: CheerioAPI): Promise<Tag[][]> {
    const request = App.createRequest({
        url: `${DOMAIN}/page/categories`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const cats = [];
    const tags = [];
    const genres = $('a', 'div#wrap').toArray();
    for (let i = 0; i < genres.length; i++) {
        const id = REGEX_PATH_NAME.exec($(genres[i]).attr('href') ?? '')?.toString().split(',')[1]?.split('/')[0] ?? '';
        const label = $('img', $(genres[i])).attr('alt') ?? '';
        const isCat = id.split('-')[0]?.toString() === 'category';
        if (id) {
            if (isCat) {
                cats.push(App.createTag({ id, label }));
            }
            else {
                tags.push(App.createTag({ id, label }));
            }
        }
    }
    return [cats, tags];
}

export function getAlbums($: CheerioStatic): PartialSourceManga[] {
    const albums: PartialSourceManga[] = [];
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
        albums.push(App.createPartialSourceManga({
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: entities.decodeHTML(title),
            mangaId: id
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
    const title = decodeURIComponent($('h1').first().text());
    const image = $('img.miniaturaImg').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
    const descInfo = $('b').first().parent().parent().children().toArray();
    descInfo.pop();
    let desc = '';
    descInfo.forEach(x => desc += $(x).text() + '\n');
    // Need to detect and encode emoji from unicode
    // descInfo.forEach(x => {
    //     const text = $(x).text();
    //     const split = text.split(' ');
    //     if (split[0]?.match(REGEX_EMOJIS)) {
    //         split[0] = (String.fromCodePoint(parseInt(split[0].slice(2,-1))));
    //     }
    //     desc = split.toString();
    //     desc += $(x).text() + '\n';
    // });
    const tagHeader = $('div#categoria_tags_post').first();
    const tags = $('a', tagHeader).toArray();
    const tagsToRender: Tag[] = [];
    for (const tag of tags) {
        const label = $(tag).text().trim();
        const id = REGEX_PATH_NAME.exec($(tag).attr('href') ?? '')?.toString().split(',')[1]?.split('/')[0] ?? '';
        if (!id || !label) {
            continue;
        }
        tagsToRender.push({ id: id.match(REGEX_ASIAN) ? encodeURIComponent(id) : id, label: label });
    }
    const tagSections: TagSection[] = [App.createTagSection({
        id: '0',
        label: 'Tags',
        tags: tagsToRender.map(x => App.createTag(x))
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
    const request = App.createRequest({
        url: `${DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const pages: string[] = [];
    const pageItems = $('div.spotlight', 'article').toArray();
    pageItems.forEach(x => pages.push($(x).attr('data-src') ?? 'https://i.imgur.com/GYUxEX8.png'));
    return pages;
}
export const isLastPage = ($: CheerioStatic): boolean => {
    return $('body').text() === 'fim';
};
