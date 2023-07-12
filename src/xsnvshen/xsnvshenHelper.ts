import {
    PartialSourceManga,
    RequestManager
} from '@paperback/types';

export async function getCategoryData(
    categoryId: string, page: number, requestManager: RequestManager, cheerio: CheerioAPI): Promise<[PartialSourceManga[], boolean]> {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/album/t${categoryId}/?p=${page + 1}`, // Possibly force query to be defined
        method: 'GET'
    });

    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);

    const results = [];
    const searchResults = $('li', 'ul.layout').toArray();
    for (const manga of searchResults) results.push(App.createPartialSourceManga({
        mangaId: $('a', manga).attr('href')?.substring(7) as string,
        title: $('div.camLiTitleC>p>a', manga).text(),
        image: `https:${$('img', manga).attr('src')}`,
    }));

    return [results, !$('a', 'div#pageNum').last().hasClass('a1')];
}

export async function getGalleryData(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<any> {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/album/${id}`,
        method: 'GET'
    });

    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const girlId = $('img#bigImg').attr('src')?.split('/')[4];

    return {
        title: $('div.swp-tit>h1>a').text(),
        image: `https://img.xsnvshen.com/thumb_205x308/album/${girlId}/${id}/cover.jpg`,
        artist: $('a', 'span.f20')?.text(),
        tags: $('a[href^="/album"]', 'div.poster-nav>p').toArray().map(tag => $(tag).attr('href')!.slice(8, -1)),
        views: parseInt($('span#hits').text()),
        // relatedIds: [] // Include all suggested galleries
        lastUpdate: new Date($('em#time').text().substring(3, 13)),
        girlId: girlId
    };
}

export async function getPages(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/album/${id}`,
        method: 'GET'
    });

    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);

    const pages = [];    
    const pageCount = parseInt($('span', 'em#time').text().slice(2, -2));
    const girlId = $('img#bigImg').attr('src')?.split('/')[4];

    for (let i = 0; i < pageCount; i++) pages.push(`https://img.xsnvshen.com/album/${girlId}/${id}/${i >= 100 ? i : i >= 10 ? `0${i}` : `00${i}`}.jpg`);

    return pages;
}

export async function getSearchData(
    query: string | undefined, page: number, requestManager: RequestManager, cheerio: CheerioAPI): Promise<[PartialSourceManga[], boolean]> {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/search?w=${encodeURIComponent(query ?? '')}`, // Possibly force query to be defined
        method: 'GET'
    });

    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);

    const results = [];
    const searchResults = $('li', 'ul#newspiclist').toArray();
    for (const manga of searchResults) results.push(App.createPartialSourceManga({
        mangaId: $('a', manga).attr('href')?.substring(7) as string,
        title: $('div.titlebox>a', manga).text(),
        image: `https:${$('img', manga).attr('src')}`,
    }));

    return [results, true];
}