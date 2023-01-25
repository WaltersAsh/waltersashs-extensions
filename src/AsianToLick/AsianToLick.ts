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
    DOMAIN,
    getAlbums,
    getGalleryData,
    getPages,
    isLastPage
} from './AsianToLickParser';

export const AsianToLickInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Asian To Lick',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Asian To Lick',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: TagType.RED
        },
        {
            text: 'In Dev',
            type: TagType.GREY
        },
        {
            text: 'Broken',
            type: TagType.YELLOW
        },
    ]
};

export class AsianToLick extends Source {
    readonly requestManager: RequestManager = createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': DOMAIN
                    }
                };
                return request;
            },
            
            interceptResponse: async (response: Response): Promise<Response> => { 
                return response; 
            }
        }
    });

    override getMangaShareUrl(mangaId: string): string {
        return `${DOMAIN}/${mangaId}`;
    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestForRecent = createRequestObject({
            url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=&search=&page=news&index=&ver=43`,
            method: 'GET'
        });
        const responseForRecent = await this.requestManager.schedule(requestForRecent, 1);
        const $recent = this.cheerio.load(responseForRecent.data);
        const recentAlbumsSection = createHomeSection({id: 'recent', title: 'Recent', view_more: true, type: HomeSectionType.singleRowNormal});
        const recentAlbums = getAlbums($recent);
        recentAlbumsSection.items = recentAlbums;
        sectionCallback(recentAlbumsSection);

        const requestForHot = createRequestObject({
            url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=&search=&page=&index=&ver=22`,
            method: 'GET'
        });
        const responseForHot = await this.requestManager.schedule(requestForHot, 1);
        const $hot = this.cheerio.load(responseForHot.data);
        const hotAlbumsSection = createHomeSection({id: 'hot', title: 'Top Rated', view_more: true, type: HomeSectionType.singleRowNormal});
        const hotAlbums = getAlbums($hot);
        hotAlbumsSection.items = hotAlbums;
        sectionCallback(hotAlbumsSection);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    override async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const results: number = metadata?.page ?? 0;

        let param = '';
        switch (homepageSectionId) {
            case 'recent':
                param = `/ajax/buscar_posts.php?post=&cat=&tag=&search=&page=news&index=${results}&ver=43`;
                break;
            case 'hot':
                param = `/ajax/buscar_posts.php?post=&cat=&tag=&search=&page=&index=${results}&ver=22`;
                break;
            default:
                throw new Error('Requested to getViewMoreItems for a section ID which doesn\'t exist');
        }

        const request = createRequestObject({
            url: `${DOMAIN}`,
            method: 'GET',
            param
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        
        const albums = getAlbums($);
        metadata = !isLastPage($) ? {page: results + 1} : undefined;
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
            author: 'ATL',
            artist: 'ATL',
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    override async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const results: number = metadata?.page ?? 0;

        let request;
        if (query.title) {
            request = createRequestObject({
                url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=&search=${encodeURIComponent(query.title)}&page=&index=${results}&ver=74`,
                method: 'GET'
            });
        } else {
            request = createRequestObject({
                url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=${query.includedTags?.map((x) => 
                    encodeURIComponent(x.id))}&search=&page=&index=${results}&ver=79)`,
                method: 'GET'
            });
        }
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        const albums = getAlbums($);
        metadata = !isLastPage($) ? {page: results + 1} : undefined;
        
        return createPagedResults({
            results: albums,
            metadata
        });
    }
}