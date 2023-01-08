"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buondua = exports.BuonduaInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const BuonduaParser_1 = require("./BuonduaParser");
exports.BuonduaInfo = {
    version: '1.0.1',
    name: 'Buondua',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Buon Dua',
    contentRating: paperback_extensions_common_1.ContentRating.ADULT,
    websiteBaseURL: BuonduaParser_1.BD_DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: paperback_extensions_common_1.TagType.RED
        }
    ]
};
class Buondua extends paperback_extensions_common_1.Source {
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
                            'referer': BuonduaParser_1.BD_DOMAIN
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
        return `${BuonduaParser_1.BD_DOMAIN}/${mangaId}`;
    }
    async getHomePageSections(sectionCallback) {
        const requestForRecent = createRequestObject({
            url: `${BuonduaParser_1.BD_DOMAIN}`,
            method: 'GET'
        });
        const responseForRecent = await this.requestManager.schedule(requestForRecent, 1);
        const $recent = this.cheerio.load(responseForRecent.data);
        const recentAlbumsSection = createHomeSection({ id: 'recent', title: 'Recently Uploaded', view_more: true, type: paperback_extensions_common_1.HomeSectionType.singleRowNormal });
        const recentAlbums = (0, BuonduaParser_1.getAlbums)($recent);
        recentAlbumsSection.items = recentAlbums;
        sectionCallback(recentAlbumsSection);
        const requestForHot = createRequestObject({
            url: `${BuonduaParser_1.BD_DOMAIN}/hot`,
            method: 'GET'
        });
        const responseForHot = await this.requestManager.schedule(requestForHot, 1);
        const $hot = this.cheerio.load(responseForHot.data);
        const hotAlbumsSection = createHomeSection({ id: 'hot', title: 'Hot', view_more: true, type: paperback_extensions_common_1.HomeSectionType.singleRowNormal });
        const hotAlbums = (0, BuonduaParser_1.getAlbums)($hot);
        hotAlbumsSection.items = hotAlbums;
        sectionCallback(hotAlbumsSection);
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const albumNum = metadata?.page ?? 0;
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
            url: `${BuonduaParser_1.BD_DOMAIN}`,
            method: 'GET',
            param
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const albums = (0, BuonduaParser_1.getAlbums)($);
        metadata = !(0, BuonduaParser_1.isLastPage)($) ? { page: albumNum + albums.length } : undefined;
        return createPagedResults({
            results: albums,
            metadata
        });
    }
    async getMangaDetails(mangaId) {
        const data = await (0, BuonduaParser_1.getGalleryData)(mangaId, this.requestManager, this.cheerio);
        return createManga({
            id: mangaId,
            titles: data.titles,
            image: data.image,
            status: paperback_extensions_common_1.MangaStatus.UNKNOWN,
            langFlag: paperback_extensions_common_1.LanguageCode.UNKNOWN,
            author: 'Buondua',
            artist: 'Buondua',
            tags: data.tags,
            desc: data.desc
        });
    }
    async getChapters(mangaId) {
        const data = await (0, BuonduaParser_1.getGalleryData)(mangaId, this.requestManager, this.cheerio);
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
            pages: await (0, BuonduaParser_1.getPages)(mangaId, this.requestManager, this.cheerio)
        });
    }
    async getSearchResults(query, metadata) {
        const albumNum = metadata?.page ?? 0;
        let request;
        if (query.title) {
            request = createRequestObject({
                url: `${BuonduaParser_1.BD_DOMAIN}/?search=${query.title?.match(BuonduaParser_1.REGEX_ASIAN) ? encodeURIComponent(query.title) : query.title}&start=${albumNum}`,
                method: 'GET'
            });
        }
        else {
            request = createRequestObject({
                url: `${BuonduaParser_1.BD_DOMAIN}/tag/${query.includedTags?.map((x) => encodeURIComponent(x.id.substring(4)))}?start=${albumNum})`,
                method: 'GET'
            });
        }
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const albums = (0, BuonduaParser_1.getAlbums)($);
        metadata = !(0, BuonduaParser_1.isLastPage)($) ? { page: albumNum + albums.length } : undefined;
        return createPagedResults({
            results: albums,
            metadata
        });
    }
}
exports.Buondua = Buondua;
