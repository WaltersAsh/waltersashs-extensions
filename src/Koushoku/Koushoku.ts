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
    CloudFlareError,
    getArtists
} from './KoushokuParser';

export const KoushokuInfo: SourceInfo = {
    version: '2.1.0',
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
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED 
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
        const artists = await getArtists(this.requestManager, this.cheerio);
       
        return [
            App.createTagSection({
                id: 'tags', label: 'Tags', tags: tags ?? []
            }),
            App.createTagSection({
                id: 'artists', label: 'Artists', tags: artists ?? []
            })
        ];
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const requestForRecentlyAdded = App.createRequest({
            url: `${DOMAIN}`,
            method: 'GET'
        });
        const responseForRecentlyAdded = await this.requestManager.schedule(requestForRecentlyAdded, 1);
        CloudFlareError(responseForRecentlyAdded.status);
        const $recentlyAdded = this.cheerio.load(responseForRecentlyAdded.data as string);
        const recentlyAddedAlbumsSection = App.createHomeSection({id: 'recent', title: 'Recent Updates', 
            containsMoreItems: true, type: HomeSectionType.singleRowNormal});
        const recentlyAddedAlbums = getAlbums($recentlyAdded);
        recentlyAddedAlbumsSection.items = recentlyAddedAlbums;
        sectionCallback(recentlyAddedAlbumsSection);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const albumNum: number = metadata?.page ?? 1;

        let param = '';
        switch (homepageSectionId) {
            case 'recent':
                param = `/?page=${albumNum}`;
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
        CloudFlareError(response.status);
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
                desc: data.desc
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
        const queryId = query.includedTags?.map((x) => encodeURIComponent(x.id)) ?? [];
        if (query.title) {
            request = App.createRequest({
                url: `${DOMAIN}/search?page=${searchPage}&q=${encodeURIComponent(query.title)}`,
                method: 'GET'
            });
        }
        else if (queryId[0]?.includes('artists')) {
            request = App.createRequest({
                url: `${DOMAIN}/artists/${query.includedTags?.map(x => x.id.slice(9))}?page=${searchPage}`,
                method: 'GET'
            });
        } else {
            request = App.createRequest({
                url: `${DOMAIN}/tags/${query.includedTags?.map(x => x.id.slice(6))}?page=${searchPage}`,
                method: 'GET'
            });
        }
        const response = await this.requestManager.schedule(request, 1);
        CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data as string);

        const albums = getAlbums($);
        metadata = !isLastPage(albums) ? {page: searchPage + albums.length} : undefined;
        
        return App.createPagedResults({
            results: albums,
            metadata
        });
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        return App.createRequest({
            url: DOMAIN,
            method: 'GET',
            headers: {
                'referer': `${DOMAIN}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        });
    }
}