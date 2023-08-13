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
} from './KoushokuParser';

export const KoushokuInfo: SourceInfo = {
    version: '1.0.4',
    name: 'Koushoku',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Koushoku',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.RED
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
};

export class Koushoku implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15',
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
        const tags = await getTags(this.requestManager, this.cheerio);
       
        return [
            App.createTagSection({
                id: 'tags', label: 'Tags', tags: tags ?? []
            })
        ];
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestForRecentlyAdded = App.createRequest({
            url: `${DOMAIN}/browse`,
            method: 'GET'
        });
        const responseForRecentlyAdded = await this.requestManager.schedule(requestForRecentlyAdded, 1);
        const $recentlyAdded = this.cheerio.load(responseForRecentlyAdded.data as string);
        const recentlyAddedAlbumsSection = App.createHomeSection({id: 'recent', title: 'Recent Updates', 
            containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const recentlyAddedAlbums = getAlbums($recentlyAdded);
        recentlyAddedAlbumsSection.items = recentlyAddedAlbums;
        sectionCallback(recentlyAddedAlbumsSection);

        const requestForPopularWeekly = App.createRequest({
            url: `${DOMAIN}/popular/weekly`,
            method: 'GET'
        });
        const responseForPopularWeekly = await this.requestManager.schedule(requestForPopularWeekly, 1);
        const $popularWeekly = this.cheerio.load(responseForPopularWeekly.data as string);
        const popularWeeklySection = App.createHomeSection({id: 'popular weekly', title: 'Popular This Week', 
            containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const popularWeeklyAlbums = getAlbums($popularWeekly);
        popularWeeklySection.items = popularWeeklyAlbums;
        sectionCallback(popularWeeklySection);

        const requestForPopularMonthly = App.createRequest({
            url: `${DOMAIN}/popular/monthly`,
            method: 'GET'
        });
        const responseForPopularMonthly = await this.requestManager.schedule(requestForPopularMonthly, 1);
        const $popularMonthly = this.cheerio.load(responseForPopularMonthly.data as string);
        const popularMonthlySection = App.createHomeSection({id: 'popular monthly', title: 'Popular This Month', 
            containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const popularMonthlyAlbums = getAlbums($popularMonthly);
        popularMonthlySection.items = popularMonthlyAlbums;
        sectionCallback(popularMonthlySection);

        const requestForRecentDoujin = App.createRequest({
            url: `${DOMAIN}/browse?cat=2&sort=16`,
            method: 'GET'
        });
        const responseForRecentDoujin = await this.requestManager.schedule(requestForRecentDoujin, 1);
        const $recentDoujin = this.cheerio.load(responseForRecentDoujin.data as string);
        const recentDoujinSection = App.createHomeSection({id: 'recent doujins', title: 'Recent Doujins', 
            containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const recentDoujinAlbums = getAlbums($recentDoujin);
        recentDoujinSection.items = recentDoujinAlbums;
        sectionCallback(recentDoujinSection);

        const requestForRecentManga = App.createRequest({
            url: `${DOMAIN}/browse?cat=1`,
            method: 'GET'
        });
        const responseForRecentManga = await this.requestManager.schedule(requestForRecentManga, 1);
        const $recentManga = this.cheerio.load(responseForRecentManga.data as string);
        const recentMangaSection = App.createHomeSection({id: 'recent manga', title: 'Recent Manga', 
            containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const recentMangaAlbums = getAlbums($recentManga);
        recentMangaSection.items = recentMangaAlbums;
        sectionCallback(recentMangaSection);

        const requestForRecentIllustrations = App.createRequest({
            url: `${DOMAIN}/browse?cat=4`,
            method: 'GET'
        });
        const responseForRecentIllustrations = await this.requestManager.schedule(requestForRecentIllustrations, 1);
        const $recentIllustrations = this.cheerio.load(responseForRecentIllustrations.data as string);
        const recentIllustrationsSection = App.createHomeSection({id: 'recent illustrations', title: 'Recent Illustrations', 
            containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const recentIllustrationsAlbums = getAlbums($recentIllustrations);
        recentIllustrationsSection.items = recentIllustrationsAlbums;
        sectionCallback(recentIllustrationsSection);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const albumNum: number = metadata?.page ?? 1;

        let param = '';
        switch (homepageSectionId) {
            case 'recent':
                param = `/browse/page/${albumNum}`;
                break;
            case 'popular weekly':
                param = `/popular/weekly/page/${albumNum}`;
                break;
            case 'popular monthly':
                param = `/popular/monthly/page/${albumNum}`;
                break;
            case 'recent doujins':
                param = `/browse/page/${albumNum}?cat=2&sort=16`;
                break;
            case 'recent manga':
                param = `/browse/page/${albumNum}?cat=1`;
                break;
            case 'recent illustrations':
                param = `/browse/page/${albumNum}?cat=4`;
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
        metadata = !isLastPage(albums) ? {page: albumNum + 1} : undefined;
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
                status: 'Complete',
                hentai: true,
                tags: data.tags,
                author: data.artist,
                artist: data.artist,
                desc: ''
            })
        });
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio);
        const chapters: Chapter[] = [];
        chapters.push(App.createChapter({
            id: data.id,
            name: 'Album',
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
        const searchPage: number = metadata?.page ?? 1;

        let request;
        if (query.title) {
            request = App.createRequest({
                url: `${DOMAIN}/browse/page/${searchPage}?s=${encodeURIComponent(query.title)}`,
                method: 'GET'
            });
        } else {
            request = App.createRequest({
                url: `${DOMAIN}${query.includedTags?.map(x => x.id)}/page/${searchPage}`,
                method: 'GET'
            });
        }
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data as string);

        const albums = getAlbums($);
        metadata = !isLastPage(albums) ? {page: searchPage + albums.length} : undefined;
        
        return App.createPagedResults({
            results: albums,
            metadata
        });
    }
}