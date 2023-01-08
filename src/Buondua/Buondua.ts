import {
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    TagType,
    Request,
    RequestManager,
    ContentRating,
    Response,
    MangaStatus,
    LanguageCode,
    HomeSectionType
} from 'paperback-extensions-common';

import { 
    BD_DOMAIN,
    getAlbums,
    getGalleryData,
    getPages,
    isLastPage
} from './BuonduaParser';

export const BuonduaInfo: SourceInfo = {
    version: '1.0.3',
    name: 'Buondua',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Buon Dua',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: BD_DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: TagType.RED
        }
    ]
}

export class Buondua extends Source {
     readonly requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': BD_DOMAIN
                    }
                }
                return request;
            },
            
            interceptResponse: async (response: Response): Promise<Response> => { 
                return response; 
            }
        }
    });

    override getMangaShareUrl(mangaId: string): string {
        return `${BD_DOMAIN}/${mangaId}`;
    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestForRecent = createRequestObject({
            url: `${BD_DOMAIN}`,
            method: 'GET'
        });
        const responseForRecent = await this.requestManager.schedule(requestForRecent, 1);
        const $recent = this.cheerio.load(responseForRecent.data);
        const recentAlbumsSection = createHomeSection({id: 'recent', title: 'Recently Uploaded', view_more: true, type: HomeSectionType.singleRowNormal});
        const recentAlbums = getAlbums($recent);
        recentAlbumsSection.items = recentAlbums;
        sectionCallback(recentAlbumsSection);

        const requestForHot = createRequestObject({
            url: `${BD_DOMAIN}/hot`,
            method: 'GET'
        });
        const responseForHot = await this.requestManager.schedule(requestForHot, 1);
        const $hot = this.cheerio.load(responseForHot.data);
        const hotAlbumsSection = createHomeSection({id: 'hot', title: 'Hot', view_more: true, type: HomeSectionType.singleRowNormal});
        const hotAlbums = getAlbums($hot);
        hotAlbumsSection.items = hotAlbums;
        sectionCallback(hotAlbumsSection);
    }

    override async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
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

        const request = createRequestObject({
            url: `${BD_DOMAIN}`,
            method: 'GET',
            param
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        const albums = getAlbums($);
        metadata = !isLastPage($) ? {page: albumNum + albums.length} : undefined;
        return createPagedResults({
            results: albums,
            metadata
        });
    }

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio);

        return createManga({
            id: mangaId,
            titles: data.titles,
            image: data.image,
            status: MangaStatus.UNKNOWN,
            langFlag: LanguageCode.UNKNOWN,
            author: 'Buondua',
            artist: 'Buondua',
            tags: data.tags,
            desc: data.desc
        });
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio);
        const chapters: Chapter[] = [];
        chapters.push(createChapter({
            id: data.id,
            mangaId,
            name: 'Album',
            langCode: LanguageCode.UNKNOWN,
            chapNum: 1,
            time: new Date(),
        }));

        return chapters;
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            longStrip: false,
            pages: await getPages(mangaId, this.requestManager, this.cheerio)
        });
    }

    override async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const albumNum: number = metadata?.page ?? 0;

        let request;
        if (query.title) {
            request = createRequestObject({
                url: `${BD_DOMAIN}/?search=${encodeURIComponent(query.title)}&start=${albumNum}`,
                method: 'GET'
            });
        } else {
            request = createRequestObject({
                url: `${BD_DOMAIN}/tag/${query.includedTags?.map((x) => encodeURIComponent(x.id.substring(4)))}?start=${albumNum})`,
                method: 'GET'
            });
        }
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        const albums = getAlbums($);
        metadata = !isLastPage($) ? {page: albumNum + albums.length} : undefined;
        
        return createPagedResults({
            results: albums,
            metadata
        });
    }
}