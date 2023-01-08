"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kostaku = exports.KostakuInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const Buondua_1 = require("../Buondua/Buondua");
const KostakuParser_1 = require("./KostakuParser");
const BuonduaParser_1 = require("../Buondua/BuonduaParser");
exports.KostakuInfo = {
    version: '1.0.1',
    name: 'Kostaku',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Kostaku',
    contentRating: paperback_extensions_common_1.ContentRating.ADULT,
    websiteBaseURL: KostakuParser_1.K_DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: paperback_extensions_common_1.TagType.RED
        }
    ]
};
class Kostaku extends Buondua_1.Buondua {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 4,
            requestTimeout: 15000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        ...{
                            'referer': KostakuParser_1.K_DOMAIN
                        }
                    };
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                }
            }
        });
    }
    getMangaShareUrl(mangaId) {
        return `${KostakuParser_1.K_DOMAIN}/${mangaId}`;
    }
    async getHomePageSections(sectionCallback) {
        const requestForRecent = createRequestObject({
            url: `${KostakuParser_1.K_DOMAIN}`,
            method: 'GET'
        });
        const responseForRecent = await this.requestManager.schedule(requestForRecent, 1);
        const $recent = this.cheerio.load(responseForRecent.data);
        const recentAlbumsSection = createHomeSection({ id: 'recent', title: 'Recently Uploaded', view_more: true, type: paperback_extensions_common_1.HomeSectionType.singleRowNormal });
        const recentAlbums = (0, KostakuParser_1.getAlbums)($recent);
        recentAlbumsSection.items = recentAlbums;
        sectionCallback(recentAlbumsSection);
        const requestForHot = createRequestObject({
            url: `${KostakuParser_1.K_DOMAIN}/hot`,
            method: 'GET'
        });
        const responseForHot = await this.requestManager.schedule(requestForHot, 1);
        const $hot = this.cheerio.load(responseForHot.data);
        const hotAlbumsSection = createHomeSection({ id: 'hot', title: 'Hot', view_more: true, type: paperback_extensions_common_1.HomeSectionType.singleRowNormal });
        const hotAlbums = (0, KostakuParser_1.getAlbums)($hot);
        hotAlbumsSection.items = hotAlbums;
        sectionCallback(hotAlbumsSection);
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const albumNum = metadata?.page ?? 0;
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
            url: `${KostakuParser_1.K_DOMAIN}`,
            method: 'GET',
            param
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const albums = (0, KostakuParser_1.getAlbums)($);
        metadata = !(0, BuonduaParser_1.isLastPage)($) ? { page: albumNum + albums.length } : undefined;
        return createPagedResults({
            results: albums,
            metadata
        });
    }
    async getMangaDetails(mangaId) {
        const data = await (0, KostakuParser_1.getGalleryData)(mangaId, this.requestManager, this.cheerio);
        return createManga({
            id: mangaId,
            titles: data.titles,
            image: data.image,
            status: paperback_extensions_common_1.MangaStatus.UNKNOWN,
            langFlag: paperback_extensions_common_1.LanguageCode.UNKNOWN,
            author: 'Kostaku',
            artist: 'Kostaku',
            tags: data.tags,
            desc: data.desc
        });
    }
    async getChapters(mangaId) {
        const data = await (0, KostakuParser_1.getGalleryData)(mangaId, this.requestManager, this.cheerio);
        const chapters = [];
        chapters.push(createChapter({
            id: data.id,
            mangaId,
            name: 'Album',
            langCode: paperback_extensions_common_1.LanguageCode.UNKNOWN,
            chapNum: 1,
            time: new Date(),
        }));
        return chapters;
    }
    async getChapterDetails(mangaId, chapterId) {
        return createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            longStrip: false,
            pages: await (0, KostakuParser_1.getPages)(mangaId, this.requestManager, this.cheerio)
        });
    }
    async getSearchResults(query, metadata) {
        const albumNum = metadata?.page ?? 0;
        let request;
        if (query.title) {
            request = createRequestObject({
                url: `${KostakuParser_1.K_DOMAIN}/?search=${query.title?.match(KostakuParser_1.REGEX_ASIAN) ? encodeURIComponent(query.title) : query.title}&start=${albumNum}`,
                method: 'GET'
            });
        }
        else {
            request = createRequestObject({
                url: `${KostakuParser_1.K_DOMAIN}/${query.includedTags?.map(x => x.id)}?start=${albumNum})`,
                method: 'GET'
            });
        }
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const albums = (0, KostakuParser_1.getAlbums)($);
        metadata = !(0, BuonduaParser_1.isLastPage)($) ? { page: albumNum + albums.length } : undefined;
        return createPagedResults({
            results: albums,
            metadata
        });
    }
}
exports.Kostaku = Kostaku;
