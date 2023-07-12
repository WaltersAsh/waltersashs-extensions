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
    getCategoryData,
    getGalleryData,
    getPages,
    getSearchData
} from './xsnvshenHelper';

export const xsnvshenInfo: SourceInfo = {
    version: '1.0.1',
    name: 'xsnvshen',
    icon: 'icon.png',
    author: 'loik9081',
    description: 'Extension to grab galleries from xsnvshen',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: 'https://www.xsnvshen.com/',
    authorWebsite: 'https://github.com/loik9081',
    sourceTags: [{
        text: '18+',
        type: BadgeColor.RED
    }],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
};

export class xsnvshen implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

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
                        'referer': 'https://www.xsnvshen.com/album/'
                    }
                };
                return request;
            },
            interceptResponse: async (response: Response): Promise<Response> => { return response; }
        }
    })

    stateManager = App.createSourceStateManager();

    getMangaShareUrl(mangaId: string): string {
        return `https://www.xsnvshen.com/album/${mangaId}`;
    }

    async getSearchTags(): Promise<TagSection[]> {
        return [
            App.createTagSection({
                id: 'note',
                label: 'Note: Selecting a tag ignores search',
                tags: []
            }),
            App.createTagSection({
                id: 'note',
                label: 'Note: Can only select one tag at a time',
                tags: []
            }),
            App.createTagSection({
                id: 'clothing', // 着装
                label: 'Clothing',
                tags: [
                    App.createTag({ id: '167', label: 'Thong' }), // 丁字裤
                    App.createTag({ id: '138', label: 'Bikini' }), // 比基尼
                    App.createTag({ id: '183', label: 'Stockings' }), // 黑丝
                    App.createTag({ id: '175', label: 'Lingerie' }), // 内衣
                    App.createTag({ id: '189', label: 'Wet' }), // t湿身
                    App.createTag({ id: '140', label: 'Cheongsam' }), // 旗袍
                    App.createTag({ id: '146', label: 'Dudou' }), // 肚兜
                    App.createTag({ id: '151', label: 'Flight Attendant' }), // 空姐
                    App.createTag({ id: '168', label: 'Nurse' }), // 护士
                    App.createTag({ id: '173', label: 'Kimono' }), // 和服
                    App.createTag({ id: '93', label: 'Uniform' }), // 制服
                    App.createTag({ id: '97', label: 'School Uniform' }), // 校服
                    App.createTag({ id: '115', label: 'Maid' }), // 女仆
                    App.createTag({ id: '112', label: 'Soccer Babe' }), // 足球宝贝
                    App.createTag({ id: '186', label: 'Basketball Babe ' }), // 篮球宝贝
                    App.createTag({ id: '184', label: 'Boxing Babe' }), // 拳击宝贝
                    App.createTag({ id: '187', label: 'Cosplay' }) // 角色扮演
                ]
            }),
            App.createTagSection({
                id: 'sensation', // 风格
                label: 'Sensation',
                tags: [
                    App.createTag({ id: '2', label: 'Sexy' }), // 性感
                    App.createTag({ id: '96', label: 'Alluring' }), // 诱惑
                    App.createTag({ id: '104', label: 'Mature' }), // 气质
                    App.createTag({ id: '107', label: 'Pure' }), // 清纯
                    App.createTag({ id: '123', label: 'Cool' }), // 冷艳
                    App.createTag({ id: '141', label: 'Wild' }), // 野性
                    App.createTag({ id: '114', label: 'Cute' }), // 萌系
                    App.createTag({ id: '128', label: 'Excellent' }), // 极品
                    App.createTag({ id: '171', label: 'Petite' }), // 萝莉
                    App.createTag({ id: '100', label: 'Busty Baby Face' }), // 童颜巨乳
                    App.createTag({ id: '178', label: 'Well Endowed' }) // 大尺度
                ]
            }),
            App.createTagSection({
                id: 'features', // 体征
                label: 'Features',
                tags: [
                    App.createTag({ id: '88', label: 'Skinny' }), // 骨感
                    App.createTag({ id: '95', label: 'Beautiful Butt' }), // 美臀
                    App.createTag({ id: '185', label: 'Curvy' }), // 肉感
                    App.createTag({ id: '166', label: 'Beautiful Legs' }), // 美腿
                    App.createTag({ id: '137', label: 'Natural' }), // 清新
                    App.createTag({ id: '130', label: 'Fair Skin' }), // 白嫩
                    App.createTag({ id: '149', label: 'Stunning' }), // 尤物
                    App.createTag({ id: '101', label: 'Tan' }), // 小麦色
                    App.createTag({ id: '131', label: 'Big Boobs' }), // 波涛胸涌
                    App.createTag({ id: '143', label: 'Massive Boobs' }) // 人间胸器
                ]
            }),
            App.createTagSection({
                id: 'scene', // 场景
                label: 'Scene',
                tags: [
                    App.createTag({ id: '160', label: 'Street' }), // 街拍
                    App.createTag({ id: '116', label: 'Bathroom' }), // 浴室
                    App.createTag({ id: '126', label: 'Outdoors' }), // 户外
                    App.createTag({ id: '169', label: 'Beach' }), // 沙滩
                    App.createTag({ id: '190', label: 'Pool' }), // 泳池
                    App.createTag({ id: '161', label: 'Home' }), // 家居
                    App.createTag({ id: '176', label: 'Private Photoshoot' }) // 私房照
                ]
            }),
            App.createTagSection({
                id: 'region', // 地域
                label: 'Region',
                tags: [
                    App.createTag({ id: '79', label: 'China' }), // 中国内地
                    App.createTag({ id: '155', label: 'Hong Kong' }), // 香港
                    App.createTag({ id: '152', label: 'Macau' }), // 澳门
                    App.createTag({ id: '165', label: 'Taiwan' }), // 台湾
                    App.createTag({ id: '108', label: 'Japan' }), // 日本
                    App.createTag({ id: '180', label: 'Korea' }), // 韩国
                    App.createTag({ id: '90', label: 'Malaysia' }), // 马来西亚
                    App.createTag({ id: '156', label: 'Thailand' }), // 泰国
                    App.createTag({ id: '150', label: 'Western' }), // 欧美
                    App.createTag({ id: '191', label: 'Mixed' }) // 混血
                ]
            })/*,
            createTagSection({
                id: 'company', // 机构
                label: 'Company',
                tags: [
                    createTag({ id: '', label: '' }),
                ]
            })*/
        ];
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const chosenTags = [];
        for (const section of await this.getSearchTags()) {
            if (section.id == 'note' || !await this.stateManager.retrieve(section.id)) continue;
            for(const tag of await this.stateManager.retrieve(section.id) as string[]) chosenTags.push({
                id: section.tags.find(el => el.label == tag)?.id,
                label: tag
            });
        }

        for (const tag of chosenTags) {
            const section = App.createHomeSection({
                id: tag.id as string,
                title: tag.label,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal
            });
            sectionCallback(section);
            getCategoryData(tag.id as string, 0, this.requestManager, this.cheerio).then(manga => {
                section.items = manga[0];
                sectionCallback(section);
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 0;
        if (metadata?.stopSearch ?? false) return App.createPagedResults({
            results: [],
            metadata: {
                stopSearch: true
            }
        });

        const results = await getCategoryData(homepageSectionId, page, this.requestManager, this.cheerio);

        return App.createPagedResults({
            results: results[0],
            metadata: {
                page: page + 1,
                stopSearch: results[1]
            }
        });
    }

    async getSourceMenu(): Promise<DUISection> {
        const tagList = await this.getSearchTags();
        return App.createDUISection({
            id: 'root',
            header: 'Settings',
            isHidden: false,
            rows: async () => {
                return [
                    App.createDUINavigationButton({
                        id: 'homePageCategoriesButton',
                        label: 'Home Page Categories',
                        form: App.createDUIForm({
                            onSubmit: async values => {
                                for (const section of tagList) {
                                    if (section.id != 'note') this.stateManager.store(section.id, values[section.id]);
                                }
                            },
                            sections: async () => {
                                return [App.createDUISection({
                                    id: 'categoriesSection',
                                    isHidden: false,
                                    rows: async () => {
                                        const tagRows = [];
                                        for (const section of tagList) {
                                            if (section.id != 'note') tagRows.push(App.createDUISelect({
                                                id: section.id,
                                                value: App.createDUIBinding(await this.stateManager.retrieve(section.id) ?? []),
                                                label: section.label,
                                                options: section.tags.map(tag => tag.label),
                                                allowsMultiselect: true,
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                labelResolver: (option: any) => option
                                            }));
                                        }
                                        return tagRows;
                                    }
                                })];
                            }
                        })
                    })
                ];
            }
        });
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio);

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [data.title],
                image: data.image,
                status: 'Completed',
                desc: 'Langugage: Chinese, Views: ' + data.views + ' Last Updated: ' + data.lastUpdate,
                artist: data.artist,
                tags: (await this.getSearchTags()).map(section => 
                    App.createTagSection({ id: section.id, label: section.label, tags: section.tags
                        .filter(tag => data.tags.includes(tag.id)) })).filter(section => section.tags.length != 0),
                hentai: false,
                // relatedIds: [], // possibly parent_gid and/or first_gid
            })
        });
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const data = await getGalleryData(mangaId, this.requestManager, this.cheerio);

        return [App.createChapter({
            id: data.girlId,
            chapNum: 1,
            langCode: 'Chinese',
            name: data.title,
            time: data.lastUpdate
        })];
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
        const page = metadata?.page ?? 0;
        if (metadata?.stopSearch ?? false) return App.createPagedResults({
            results: [],
            metadata: {
                stopSearch: true
            }
        });

        const results = query.includedTags?.length == 0 ? await getSearchData(query.title, page, this.requestManager, this.cheerio) :
            await getCategoryData(query.includedTags?.[0]?.id as string, page, this.requestManager, this.cheerio);

        return App.createPagedResults({
            results: results[0],
            metadata: {
                page: page + 1,
                stopSearch: results[1]
            }
        });
    }
}