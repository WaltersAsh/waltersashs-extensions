import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    DUISection,
    HomeSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    TagSection,
    Request,
    RequestManager,
    ContentRating,
    Response,
    SearchResultsProviding,
    SourceIntents,
    SourceManga,
    MangaProviding,
    ChapterProviding,
    HomePageSectionsProviding,
    HomeSectionType
} from '@paperback/types';

import {
    getGalleryData,
    getSearchData
} from './eHentaiHelper';

import {
    parseArtist,
    //parseLanguage,
    parsePages,
    parseTags,
    parseTitle
} from './eHentaiParser';

import {
    modifySearch,
    resetSettings,
} from './eHentaiSettings';

export const eHentaiInfo: SourceInfo = {
    version: '1.0.2',
    name: 'E-Hentai',
    icon: 'icon.png',
    author: 'loik9081',
    description: 'Extension to grab galleries from E-Hentai',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: 'https://e-hentai.org',
    authorWebsite: 'https://github.com/loik9081',
    sourceTags: [{
        text: '18+',
        type: BadgeColor.RED
    }],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
};

export class eHentai implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    readonly requestManager: RequestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15',
                        'referer': 'https://e-hentai.org/'
                    }
                };
                request.cookies = [App.createCookie({ name: 'nw', value: '1', domain: 'https://e-hentai.org/' })];
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => { return response; },
        }
    })

    stateManager = App.createSourceStateManager();

    getMangaShareUrl(mangaId: string): string {
        return `https://e-hentai.org/g/${mangaId}`;
    }

    async getSearchTags(): Promise<TagSection[]> {
        return [App.createTagSection({
            id: 'categories', label: 'Categories', tags: [
                App.createTag({ id: 'category:2', label: 'Doujinshi' }),
                App.createTag({ id: 'category:4', label: 'Manga' }),
                App.createTag({ id: 'category:8', label: 'Artist CG' }),
                App.createTag({ id: 'category:16', label: 'Game CG' }),
                App.createTag({ id: 'category:256', label: 'Non-H' }),
                App.createTag({ id: 'category:32', label: 'Image Set' }),
                App.createTag({ id: 'category:512', label: 'Western' }),
                App.createTag({ id: 'category:64', label: 'Cosplay' }),
                App.createTag({ id: 'category:128', label: 'Asian Porn' }),
                App.createTag({ id: 'category:1', label: 'Misc' })
            ]
        })];
    }

    async supportsTagExclusion(): Promise<boolean> {
        return true;
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        for (const tag of (await this.getSearchTags())[0]?.tags ?? []) {
            const section = App.createHomeSection({
                id: tag.id,
                title: tag.label,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal
            });
            sectionCallback(section);
            getSearchData('', 0, 1023 - parseInt(tag.id.substring(9)), this.requestManager, this.cheerio, this.stateManager).then(manga => {
                section.items = manga;
                sectionCallback(section);
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 0;
        let stopSearch = metadata?.stopSearch ?? false;
        if(stopSearch) return App.createPagedResults({
            results: [],
            metadata: {
                stopSearch: true
            }
        });

        const results = await getSearchData('', page, 1023 - parseInt(homepageSectionId.substring(9)), this.requestManager, this.cheerio, this.stateManager);
        if (results[results.length - 1]?.mangaId == 'stopSearch') {
            results.pop();
            stopSearch = true;
        }

        return App.createPagedResults({
            results: results,
            metadata: {
                page: page + 1,
                stopSearch: stopSearch
            }
        });
    }

    async getSourceMenu(): Promise<DUISection> {
        return App.createDUISection({
            id: 'root',
            header: 'Settings',
            isHidden: false,
            rows: async () => {
                return [
                    modifySearch(this.stateManager),
                    resetSettings(this.stateManager)
                ];
            }
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const data = (await getGalleryData([mangaId], this.requestManager))[0];

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [parseTitle(data.title), parseTitle(data.title_jpn)],
                image: data.thumb,
                rating: data.rating,
                status: 'Completed',
                artist: parseArtist(data.tags),
                tags: parseTags([data.category, ...data.tags]),
                hentai: !(data.category == 'Non-H' || data.tags.includes('other:non-nude')),
                desc: 'Last Updated: ' + new Date(parseInt(data.posted) * 1000).toString()
            })
        });
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const data = (await getGalleryData([mangaId], this.requestManager))[0];

        return [App.createChapter({
            id: data.filecount,
            chapNum: 1,
            //langCode: parseLanguage(data.tags),
            name: parseTitle(data.title),
            time: new Date(parseInt(data.posted) * 1000)
        })];
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: await parsePages(mangaId, parseInt(chapterId), this.requestManager, this.cheerio)
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 0;
        let stopSearch = metadata?.stopSearch ?? false;
        if(stopSearch) return App.createPagedResults({
            results: [],
            metadata: {
                stopSearch: true
            }
        });

        const includedCategories = query.includedTags?.filter(tag => tag.id.startsWith('category:'));
        const excludedCategories = query.excludedTags?.filter(tag => tag.id.startsWith('category:'));
        let categories = 0;
        if (includedCategories != undefined && includedCategories.length != 0) {
            categories = includedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev - cur, 1023);
        }
        else if (excludedCategories != undefined && excludedCategories.length != 0) {
            categories = excludedCategories.map(tag => parseInt(tag.id.substring(9))).reduce((prev, cur) => prev + cur, 0);
        }

        const results = await getSearchData(query.title, page, categories, this.requestManager, this.cheerio, this.stateManager);
        if (results[results.length - 1]?.mangaId == 'stopSearch') {
            results.pop();
            stopSearch = true;
        }

        return App.createPagedResults({
            results: results,
            metadata: {
                page: page + 1,
                stopSearch: stopSearch
            }
        });
    }
}