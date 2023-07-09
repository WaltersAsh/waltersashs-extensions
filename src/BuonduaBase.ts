import {
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    SearchRequest,
    PagedResults,
    Request,
    Response,
    ChapterProviding,
    MangaProviding,
    SearchResultsProviding,
    HomePageSectionsProviding
} from '@paperback/types';

import { 
    getAlbums,
    getGalleryData,
    getPages,
    isLastPage
} from './BuonduaBaseParser';

export const SOURCE_VERSION = '1.1.0';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15';

export default abstract class Buondua implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding{

    constructor(private cheerio: CheerioAPI) { }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': USER_AGENT,
                        'referer': this.baseUrl
                    }
                };
                return request;
            },
            
            interceptResponse: async (response: Response): Promise<Response> => { 
                return response; 
            }
        }
    });

    abstract baseUrl: string;
    abstract hasEncodedUrls: boolean;
    abstract hasEncodedTags: boolean;
    abstract sourceName: string;

    getMangaShareUrl(mangaId: string): string {
        return `${this.baseUrl}/${mangaId}`;
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestForRecent = App.createRequest({
            url: `${this.baseUrl}`,
            method: 'GET'
        });
        const responseForRecent = await this.requestManager.schedule(requestForRecent, 1);
        const $recent = this.cheerio.load(responseForRecent.data as string);
        const recentAlbumsSection = App.createHomeSection({id: 'recent', title: 'Recently Uploaded', containsMoreItems: true, 
            type: HomeSectionType.singleRowNormal});
        const recentAlbums = getAlbums($recent, this.hasEncodedUrls);
        recentAlbumsSection.items = recentAlbums;
        sectionCallback(recentAlbumsSection);

        const requestForHot = App.createRequest({
            url: `${this.baseUrl}/hot`,
            method: 'GET'
        });
        const responseForHot = await this.requestManager.schedule(requestForHot, 1);
        const $hot = this.cheerio.load(responseForHot.data as string);
        const hotAlbumsSection = App.createHomeSection({id: 'hot', title: 'Hot', containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const hotAlbums = getAlbums($hot, this.hasEncodedUrls);
        hotAlbumsSection.items = hotAlbums;
        sectionCallback(hotAlbumsSection);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const albumNum: number = metadata?.page ?? 0;

        let param = '';
        switch (homepageSectionId) {
            case 'recent':
                param = `/?start=${albumNum}`;
                break;
            case 'hot':
                param = `/hot?start=${albumNum}`;
                break;
            default:
                throw new Error('Requested to getViewMoreItems for a section ID which doesn\'t exist');
        }

        const request = App.createRequest({
            url: `${this.baseUrl}`,
            method: 'GET',
            param
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        
        const albums = getAlbums($, this.hasEncodedUrls);
        metadata = !isLastPage($) ? {page: albumNum + albums.length} : undefined;
        return App.createPagedResults({
            results: albums,
            metadata
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio, this.baseUrl, this.hasEncodedUrls);

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: data.titles,
                image: data.image,
                status: 'Unknown',
                tags: data.tags,
                desc: data.desc,
            })
        });
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio, this.baseUrl, this.hasEncodedUrls);

        const chapters: Chapter[] = [];
        chapters.push(App.createChapter({
            id: data.id, // could be mangaId, idk
            chapNum: 1
        }));

        return chapters;
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: await getPages(mangaId, this.requestManager, this.cheerio, this.baseUrl, this.hasEncodedUrls)
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const albumNum: number = metadata?.page ?? 0;

        let request;
        if (query.title) {
            request = App.createRequest({
                url: `${this.baseUrl}/?search=${encodeURIComponent(query.title)}&start=${albumNum}`,
                method: 'GET'
            });
        } else {
            request = App.createRequest({
                url: this.hasEncodedTags ? `${this.baseUrl}/tag/${query.includedTags?.map((x) => encodeURIComponent(x.id.substring(4)))}?start=${albumNum})`
                    : `${this.baseUrl}/${query.includedTags?.map(x => x.id)}?start=${albumNum})`,
                method: 'GET'
            });
        }
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);

        const albums = getAlbums($, this.hasEncodedUrls);
        metadata = !isLastPage($) ? {page: albumNum + albums.length} : undefined;
        
        return App.createPagedResults({
            results: albums,
            metadata
        });
    }
}