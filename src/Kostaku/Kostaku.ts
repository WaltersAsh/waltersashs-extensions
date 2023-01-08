import {
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
import { Buondua } from '../Buondua/Buondua';

import { 
    K_DOMAIN,
    REGEX_ASIAN,
    getAlbums,
    getGalleryData,
    getPages
} from './KostakuParser';

import { 
    isLastPage 
} from '../Buondua/BuonduaParser';

export const KostakuInfo: SourceInfo = {
    version: '1.0.1',
    name: 'Kostaku',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Kostaku',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: K_DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: TagType.RED
        }
    ]
}

export class Kostaku extends Buondua {
     override readonly requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': K_DOMAIN
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
        return `${K_DOMAIN}/${mangaId}`;
    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestForRecent = createRequestObject({
            url: `${K_DOMAIN}`,
            method: 'GET'
        });
        const responseForRecent = await this.requestManager.schedule(requestForRecent, 1);
        const $recent = this.cheerio.load(responseForRecent.data);
        const recentAlbumsSection = createHomeSection({id: 'recent', title: 'Recently Uploaded', view_more: true, type: HomeSectionType.singleRowNormal});
        const recentAlbums = getAlbums($recent);
        recentAlbumsSection.items = recentAlbums;
        sectionCallback(recentAlbumsSection);

        const requestForHot = createRequestObject({
            url: `${K_DOMAIN}/hot`,
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

        let param = `/?start=${albumNum}`;
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
            url: `${K_DOMAIN}`,
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
            author: 'Kostaku',
            artist: 'Kostaku',
            tags: data.tags,
            desc: data.desc
        });
    }

    override async getChapters(mangaId: string): Promise<Chapter[]> {
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

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
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
                url: `${K_DOMAIN}/?search=${query.title?.match(REGEX_ASIAN) ? encodeURIComponent(query.title) : query.title}&start=${albumNum}`,
                method: 'GET'
            });
        } else {
            request = createRequestObject({
                url: `${K_DOMAIN}/${query.includedTags?.map(x => x.id)}?start=${albumNum})`,
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