import {
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    TagSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    ContentRating,
    BadgeColor,
    Request,
    Response,
    SourceIntents,
    ChapterProviding,
    MangaProviding,
    SearchResultsProviding,
    HomePageSectionsProviding
} from '@paperback/types';

import { 
    DOMAIN,
    getAlbums,
    getGalleryData,
    getPages,
    getTags,
    isLastPage,
} from './AsianToLickParser';

export const AsianToLickInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Asian to lick',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Asian to lick',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.RED
        },
        {
            text: 'In Dev',
            type: BadgeColor.GREY
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
};

export class AsianToLick implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {
    
    constructor(private cheerio: CheerioAPI) { }
    
    readonly requestManager = App.createRequestManager({
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

    getMangaShareUrl(mangaId: string): string {
        return `${DOMAIN}/${mangaId}`;
    }

    async getSearchTags(): Promise<TagSection[]> {
        const genres = await getTags(this.requestManager, this.cheerio);
       
        return [
            App.createTagSection({
                id: 'cats', label: 'Categories', tags: genres[0] ?? []
            }),
            App.createTagSection({
                id: 'tags', label: 'Tags', tags: genres[1] ?? []
            }),
        ];
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestForRecent = App.createRequest({
            url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=&search=&page=news&index=&ver=43`,
            method: 'GET'
        });
        const responseForRecent = await this.requestManager.schedule(requestForRecent, 1);
        const $recent = this.cheerio.load(responseForRecent.data as string);
        const recentAlbumsSection = App.createHomeSection({id: 'recent', title: 'Recent', containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const recentAlbums = getAlbums($recent);
        recentAlbumsSection.items = recentAlbums;
        sectionCallback(recentAlbumsSection);

        const requestForHot = App.createRequest({
            url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=&search=&page=&index=&ver=22`,
            method: 'GET'
        });
        const responseForHot = await this.requestManager.schedule(requestForHot, 1);
        const $hot = this.cheerio.load(responseForHot.data as string);
        const hotAlbumsSection = App.createHomeSection({id: 'hot', title: 'Top Rated', containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const hotAlbums = getAlbums($hot);
        hotAlbumsSection.items = hotAlbums;
        sectionCallback(hotAlbumsSection);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
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

        const request = App.createRequest({
            url: `${DOMAIN}`,
            method: 'GET',
            param
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);
        
        const albums = getAlbums($);
        metadata = !isLastPage($) ? {page: results + 1} : undefined;
        return App.createPagedResults({
            results: albums,
            metadata
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio);

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
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio);
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
            pages: await getPages(mangaId, this.requestManager, this.cheerio)
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const results: number = metadata?.page ?? 0;

        let request;
        if (query.title) {
            request = App.createRequest({
                url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=&search=${encodeURIComponent(query.title)}&page=&index=${results}&ver=74`,
                method: 'GET'
            });
        } else {      
            let isCat = false;
            let id;
            const queryId = query.includedTags?.map((x) => encodeURIComponent(x.id)) ?? [];
            const idSplit = queryId[0]?.split('-');

            if (idSplit) {
                isCat = idSplit[0]?.toString() === 'category';
                id = idSplit[1]?.split('/')[0]?.toString();
            }
            if (isCat) {
                request = App.createRequest({
                    url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=${id}&tag=&search=&page=&index=${results}&ver=79)`,
                    method: 'GET'
                });
            } else {
                request = App.createRequest({
                    url: `${DOMAIN}/ajax/buscar_posts.php?post=&cat=&tag=${id}&search=&page=&index=${results}&ver=79)`,
                    method: 'GET'
                });
            }
        }
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);

        const albums = getAlbums($);
        metadata = !isLastPage($) ? {page: results + 1} : undefined;
        
        return App.createPagedResults({
            results: albums,
            metadata
        });
    }
}