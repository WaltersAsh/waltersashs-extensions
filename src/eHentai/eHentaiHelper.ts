import {
    PartialSourceManga,
    RequestManager,
    SourceStateManager
} from '@paperback/types';

import { parseTitle } from './eHentaiParser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGalleryData(ids: string[], requestManager: RequestManager): Promise<any> {
    const request = App.createRequest({
        url: 'https://api.e-hentai.org/api.php',
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        data: {
            'method': 'gdata',
            'gidlist': ids.map(id => id.split('/')),
            'namespace': 1
        }
    });

    const data = await requestManager.schedule(request, 1);
    const json = (typeof data.data == 'string') ? JSON.parse(data.data.replaceAll(/[\r\n]+/g, ' ')) : data.data;
    return json.gmetadata;
}

export async function getSearchData(query: string | undefined, 
    page: number, 
    categories: number, 
    requestManager: RequestManager, 
    cheerio: CheerioAPI, 
    stateManager: SourceStateManager): Promise<PartialSourceManga[]> {
    if (query != undefined && 
        query.length != 0 && 
        query.split(' ').filter(q => !q.startsWith('-')).length != 0 
        && await stateManager.retrieve('extraSearchArgs')) {
        query += ` ${await stateManager.retrieve('extraSearchArgs')}`;
    }
    const request = App.createRequest({
        url: `https://e-hentai.org/?page=${page}&f_cats=${categories}&f_search=${encodeURIComponent(query ?? '')}`,
        method: 'GET'
    });

    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);

    const searchResults = $('td.glname').toArray();
    const mangaIds = [];
    for (const manga of searchResults) {
        const splitURL = ($('a', manga).attr('href') ?? '/////').split('/');
        mangaIds.push(`${splitURL[4]}/${splitURL[5]}`);
    }

    const json = mangaIds.length != 0 ? await getGalleryData(mangaIds, requestManager) : [];
    const results = [];

    for (const entry of json) {
        results.push(App.createPartialSourceManga({
            mangaId: `${entry.gid}/${entry.token}`,
            title: parseTitle(entry.title),
            image: entry.thumb
        }));
    }

    if ($('div.ptt').last().hasClass('ptdd')) results.push(App.createPartialSourceManga({
        mangaId: 'stopSearch',
        title: '' ,
        image: ''
    }));

    return results;
}