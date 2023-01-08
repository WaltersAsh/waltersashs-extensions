"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = exports.getGalleryData = exports.getAlbums = exports.REGEX_ASIAN = exports.K_DOMAIN = void 0;
const entities = require("entities");
exports.K_DOMAIN = 'https://kostaku.art';
exports.REGEX_ASIAN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u3131-\uD79D]/;
function getAlbums($) {
    const albums = [];
    const albumCoverGroups = $('div.blog').toArray();
    for (const albumCoverGroup of albumCoverGroups) {
        const albumCovers = $('div.items-row', albumCoverGroup).toArray();
        for (const albumCover of albumCovers) {
            const image = $('img', albumCover).first().attr('src') ?? '';
            const title = $('img', albumCover).first().attr('alt') ?? '';
            const id = $('a', albumCover).attr('href')?.replace(/\/$/, '')?.split('/').pop() ?? '';
            const imageSplit = image.split('com');
            const imageEncoded = imageSplit[0] + 'com' + encodeURIComponent(imageSplit[1] ?? '').replaceAll('%2F', '/');
            if (!id || !title) {
                continue;
            }
            albums.push(createMangaTile({
                id: id.match(exports.REGEX_ASIAN) ? encodeURIComponent(id) : id,
                image: imageEncoded ? imageEncoded : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({ text: entities.decodeHTML(title) })
            }));
        }
    }
    return albums;
}
exports.getAlbums = getAlbums;
async function getGalleryData(id, requestManager, cheerio) {
    const request = createRequestObject({
        url: `${exports.K_DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    const title = $('div.article-header').first().text();
    const image = $('img', 'div.article-fulltext').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
    const desc = $('div.article-info').first().text() + '\n' + $('div.article-info').last().text();
    const imageSplit = image.split('com');
    const imageEncoded = imageSplit[0] + 'com' + encodeURIComponent(imageSplit[1] ?? '').replaceAll('%2F', '/');
    const tagHeader = $('div.article-tags').first();
    const tags = $('a.tag', tagHeader).toArray();
    const tagsToRender = [];
    for (const tag of tags) {
        const label = $('span', tag).text();
        const id = $(tag).attr('href');
        if (!id || !label) {
            continue;
        }
        tagsToRender.push({ id: id, label: label });
    }
    const tagSections = [createTagSection({
            id: '0',
            label: 'Tags',
            tags: tagsToRender.map(x => createTag(x))
        })];
    return {
        id: id.match(exports.REGEX_ASIAN) ? encodeURIComponent(id) : id,
        titles: [title],
        image: imageEncoded,
        tags: tagSections,
        desc: desc
    };
}
exports.getGalleryData = getGalleryData;
async function getPages(id, requestManager, cheerio) {
    const request = createRequestObject({
        url: `${exports.K_DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    let $ = cheerio.load(data.data);
    const pages = [];
    const pageCount = parseInt($('a.pagination-link', 'nav.pagination').last().text());
    for (let i = 0; i < pageCount; i++) {
        const request = createRequestObject({
            url: `${exports.K_DOMAIN}/${id}?page=${i + 1}`,
            method: 'GET'
        });
        const data = await requestManager.schedule(request, 1);
        const $ = cheerio.load(data.data);
        const images = $('p', 'div.article-fulltext').toArray();
        for (const img of images) {
            const imageString = $('img', img).attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
            const imageSplit = imageString.split('com');
            const imageEncoded = imageSplit[0] + 'com' + encodeURIComponent(imageSplit[1] ?? '').replaceAll('%2F', '/');
            pages.push(imageEncoded);
        }
    }
    return pages;
}
exports.getPages = getPages;
