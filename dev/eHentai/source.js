(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeColor = void 0;
var BadgeColor;
(function (BadgeColor) {
    BadgeColor["BLUE"] = "default";
    BadgeColor["GREEN"] = "success";
    BadgeColor["GREY"] = "info";
    BadgeColor["YELLOW"] = "warning";
    BadgeColor["RED"] = "danger";
})(BadgeColor = exports.BadgeColor || (exports.BadgeColor = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
/**
* @deprecated Use {@link PaperbackExtensionBase}
*/
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.SourceIntents = void 0;
var SourceIntents;
(function (SourceIntents) {
    SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
    SourceIntents[SourceIntents["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
    SourceIntents[SourceIntents["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
    SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
    SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
    SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
})(SourceIntents = exports.SourceIntents || (exports.SourceIntents = {}));
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./ByteArray"), exports);
__exportStar(require("./Badge"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./HomeSectionType"), exports);
__exportStar(require("./PaperbackExtensionBase"), exports);

},{"./Badge":1,"./ByteArray":2,"./HomeSectionType":3,"./PaperbackExtensionBase":4,"./Source":5,"./SourceInfo":6,"./interfaces":15}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],15:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ChapterProviding"), exports);
__exportStar(require("./CloudflareBypassRequestProviding"), exports);
__exportStar(require("./HomePageSectionsProviding"), exports);
__exportStar(require("./MangaProgressProviding"), exports);
__exportStar(require("./MangaProviding"), exports);
__exportStar(require("./RequestManagerProviding"), exports);
__exportStar(require("./SearchResultsProviding"), exports);

},{"./ChapterProviding":8,"./CloudflareBypassRequestProviding":9,"./HomePageSectionsProviding":10,"./MangaProgressProviding":11,"./MangaProviding":12,"./RequestManagerProviding":13,"./SearchResultsProviding":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DynamicUI/Exports/DUIBinding"), exports);
__exportStar(require("./DynamicUI/Exports/DUIForm"), exports);
__exportStar(require("./DynamicUI/Exports/DUIFormRow"), exports);
__exportStar(require("./DynamicUI/Exports/DUISection"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIHeader"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILink"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIMultilineLabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUINavigationButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIOAuthButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISecureInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISelect"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIStepper"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISwitch"), exports);
__exportStar(require("./Exports/ChapterDetails"), exports);
__exportStar(require("./Exports/Chapter"), exports);
__exportStar(require("./Exports/Cookie"), exports);
__exportStar(require("./Exports/HomeSection"), exports);
__exportStar(require("./Exports/IconText"), exports);
__exportStar(require("./Exports/MangaInfo"), exports);
__exportStar(require("./Exports/MangaProgress"), exports);
__exportStar(require("./Exports/PartialSourceManga"), exports);
__exportStar(require("./Exports/MangaUpdates"), exports);
__exportStar(require("./Exports/PBCanvas"), exports);
__exportStar(require("./Exports/PBImage"), exports);
__exportStar(require("./Exports/PagedResults"), exports);
__exportStar(require("./Exports/RawData"), exports);
__exportStar(require("./Exports/Request"), exports);
__exportStar(require("./Exports/SourceInterceptor"), exports);
__exportStar(require("./Exports/RequestManager"), exports);
__exportStar(require("./Exports/Response"), exports);
__exportStar(require("./Exports/SearchField"), exports);
__exportStar(require("./Exports/SearchRequest"), exports);
__exportStar(require("./Exports/SourceCookieStore"), exports);
__exportStar(require("./Exports/SourceManga"), exports);
__exportStar(require("./Exports/SecureStateManager"), exports);
__exportStar(require("./Exports/SourceStateManager"), exports);
__exportStar(require("./Exports/Tag"), exports);
__exportStar(require("./Exports/TagSection"), exports);
__exportStar(require("./Exports/TrackedMangaChapterReadAction"), exports);
__exportStar(require("./Exports/TrackerActionQueue"), exports);

},{"./DynamicUI/Exports/DUIBinding":17,"./DynamicUI/Exports/DUIForm":18,"./DynamicUI/Exports/DUIFormRow":19,"./DynamicUI/Exports/DUISection":20,"./DynamicUI/Rows/Exports/DUIButton":21,"./DynamicUI/Rows/Exports/DUIHeader":22,"./DynamicUI/Rows/Exports/DUIInputField":23,"./DynamicUI/Rows/Exports/DUILabel":24,"./DynamicUI/Rows/Exports/DUILink":25,"./DynamicUI/Rows/Exports/DUIMultilineLabel":26,"./DynamicUI/Rows/Exports/DUINavigationButton":27,"./DynamicUI/Rows/Exports/DUIOAuthButton":28,"./DynamicUI/Rows/Exports/DUISecureInputField":29,"./DynamicUI/Rows/Exports/DUISelect":30,"./DynamicUI/Rows/Exports/DUIStepper":31,"./DynamicUI/Rows/Exports/DUISwitch":32,"./Exports/Chapter":33,"./Exports/ChapterDetails":34,"./Exports/Cookie":35,"./Exports/HomeSection":36,"./Exports/IconText":37,"./Exports/MangaInfo":38,"./Exports/MangaProgress":39,"./Exports/MangaUpdates":40,"./Exports/PBCanvas":41,"./Exports/PBImage":42,"./Exports/PagedResults":43,"./Exports/PartialSourceManga":44,"./Exports/RawData":45,"./Exports/Request":46,"./Exports/RequestManager":47,"./Exports/Response":48,"./Exports/SearchField":49,"./Exports/SearchRequest":50,"./Exports/SecureStateManager":51,"./Exports/SourceCookieStore":52,"./Exports/SourceInterceptor":53,"./Exports/SourceManga":54,"./Exports/SourceStateManager":55,"./Exports/Tag":56,"./Exports/TagSection":57,"./Exports/TrackedMangaChapterReadAction":58,"./Exports/TrackerActionQueue":59}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./generated/_exports"), exports);
__exportStar(require("./base/index"), exports);
__exportStar(require("./compat/DyamicUI"), exports);

},{"./base/index":7,"./compat/DyamicUI":16,"./generated/_exports":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eHentai = exports.eHentaiInfo = void 0;
const types_1 = require("@paperback/types");
const eHentaiHelper_1 = require("./eHentaiHelper");
const eHentaiParser_1 = require("./eHentaiParser");
const eHentaiSettings_1 = require("./eHentaiSettings");
exports.eHentaiInfo = {
    version: '1.0.2',
    name: 'E-Hentai',
    icon: 'icon.png',
    author: 'loik9081',
    description: 'Extension to grab galleries from E-Hentai',
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: 'https://e-hentai.org',
    authorWebsite: 'https://github.com/loik9081',
    sourceTags: [{
            text: '18+',
            type: types_1.BadgeColor.RED
        }],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS
};
class eHentai {
    constructor(cheerio) {
        this.cheerio = cheerio;
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 15000,
            interceptor: {
                interceptRequest: async (request) => {
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
                interceptResponse: async (response) => { return response; },
            }
        });
        this.stateManager = App.createSourceStateManager();
    }
    getMangaShareUrl(mangaId) {
        return `https://e-hentai.org/g/${mangaId}`;
    }
    async getSearchTags() {
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
    async supportsTagExclusion() {
        return true;
    }
    async getHomePageSections(sectionCallback) {
        for (const tag of (await this.getSearchTags())[0]?.tags ?? []) {
            const section = App.createHomeSection({
                id: tag.id,
                title: tag.label,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal
            });
            sectionCallback(section);
            (0, eHentaiHelper_1.getSearchData)('', 0, 1023 - parseInt(tag.id.substring(9)), this.requestManager, this.cheerio, this.stateManager).then(manga => {
                section.items = manga;
                sectionCallback(section);
            });
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 0;
        let stopSearch = metadata?.stopSearch ?? false;
        if (stopSearch)
            return App.createPagedResults({
                results: [],
                metadata: {
                    stopSearch: true
                }
            });
        const results = await (0, eHentaiHelper_1.getSearchData)('', page, 1023 - parseInt(homepageSectionId.substring(9)), this.requestManager, this.cheerio, this.stateManager);
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
    async getSourceMenu() {
        return App.createDUISection({
            id: 'root',
            header: 'Settings',
            isHidden: false,
            rows: async () => {
                return [
                    (0, eHentaiSettings_1.modifySearch)(this.stateManager),
                    (0, eHentaiSettings_1.resetSettings)(this.stateManager)
                ];
            }
        });
    }
    async getMangaDetails(mangaId) {
        const data = (await (0, eHentaiHelper_1.getGalleryData)([mangaId], this.requestManager))[0];
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [(0, eHentaiParser_1.parseTitle)(data.title), (0, eHentaiParser_1.parseTitle)(data.title_jpn)],
                image: data.thumb,
                rating: data.rating,
                status: 'Completed',
                artist: (0, eHentaiParser_1.parseArtist)(data.tags),
                tags: (0, eHentaiParser_1.parseTags)([data.category, ...data.tags]),
                hentai: !(data.category == 'Non-H' || data.tags.includes('other:non-nude')),
                desc: 'Last Updated: ' + new Date(parseInt(data.posted) * 1000).toString()
            })
        });
    }
    async getChapters(mangaId) {
        const data = (await (0, eHentaiHelper_1.getGalleryData)([mangaId], this.requestManager))[0];
        return [App.createChapter({
                id: data.filecount,
                chapNum: 1,
                //langCode: parseLanguage(data.tags),
                name: (0, eHentaiParser_1.parseTitle)(data.title),
                time: new Date(parseInt(data.posted) * 1000)
            })];
    }
    async getChapterDetails(mangaId, chapterId) {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: await (0, eHentaiParser_1.parsePages)(mangaId, parseInt(chapterId), this.requestManager, this.cheerio)
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 0;
        let stopSearch = metadata?.stopSearch ?? false;
        if (stopSearch)
            return App.createPagedResults({
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
        const results = await (0, eHentaiHelper_1.getSearchData)(query.title, page, categories, this.requestManager, this.cheerio, this.stateManager);
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
exports.eHentai = eHentai;

},{"./eHentaiHelper":63,"./eHentaiParser":64,"./eHentaiSettings":65,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchData = exports.getGalleryData = void 0;
const eHentaiParser_1 = require("./eHentaiParser");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGalleryData(ids, requestManager) {
    const request = App.createRequest({
        url: 'https://api.e-hentai.org/api.php',
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        data: {
            'method': 'gdata',
            'gidlist': ids.map(id => id.split('/')),
            'namespace': 1
        }
    });
    const data = await requestManager.schedule(request, 1);
    const json = (typeof data.data == 'string') ? JSON.parse(data.data.replaceAll(/[\r\n]+/g, ' ')) : data.data;
    return json.gmetadata;
}
exports.getGalleryData = getGalleryData;
async function getSearchData(query, page, categories, requestManager, cheerio, stateManager) {
    if (query != undefined &&
        query.length != 0 &&
        query.split(' ').filter(q => !q.startsWith('-')).length != 0
        && await stateManager.retrieve('extraSearchArgs')) {
        query += ` ${await stateManager.retrieve('extraSearchArgs')}`;
    }
    const request = App.createRequest({
        url: `https://e-hentai.org/?page=${page}&f_cats=${categories}&f_search=${encodeURIComponent(query ?? '')}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    const searchResults = $('td.glname').toArray();
    const mangaIds = [];
    for (const manga of searchResults) {
        const splitURL = ($('a', manga).attr('href') ?? '/////').split('/');
        mangaIds.push(`${splitURL[4]}/${splitURL[5]}`);
    }
    const json = mangaIds.length != 0 ? await getGalleryData(mangaIds, requestManager) : [];
    const results = [];
    for (const entry of json) {
        results.push(App.createPartialSourceManga({
            mangaId: `${entry.gid}/${entry.token}`,
            title: (0, eHentaiParser_1.parseTitle)(entry.title),
            image: entry.thumb
        }));
    }
    if ($('div.ptt').last().hasClass('ptdd'))
        results.push(App.createPartialSourceManga({
            mangaId: 'stopSearch',
            title: '',
            image: ''
        }));
    return results;
}
exports.getSearchData = getSearchData;

},{"./eHentaiParser":64}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTitle = exports.parseTags = exports.parsePages = exports.parseArtist = void 0;
const parseArtist = (tags) => {
    const artist = tags.filter(tag => tag.startsWith('artist:')).map(tag => tag.substring(7));
    const cosplayer = tags.filter(tag => tag.startsWith('cosplayer:')).map(tag => tag.substring(10));
    if (artist.length != 0)
        return artist[0];
    else if (cosplayer.length != 0)
        return cosplayer[0];
    else
        return undefined;
};
exports.parseArtist = parseArtist;
// export const parseLanguage = (tags: string[]): LanguageCode => {
//     const languageTags = tags.filter(tag => tag.startsWith('language:') && tag != 'language:translated').map(tag => tag.substring(9));
//     if (languageTags.length == 0) return LanguageCode.JAPANESE;
//     switch (languageTags[0]) {
//         case 'bengali': return LanguageCode.BENGALI; break;
//         case 'bulgarian': return LanguageCode.BULGARIAN; break;
//         case 'chinese': return LanguageCode.CHINEESE; break;
//         case 'czech': return LanguageCode.CZECH; break;
//         case 'danish': return LanguageCode.DANISH; break;
//         case 'dutch': return LanguageCode.DUTCH; break;
//         case 'english': return LanguageCode.ENGLISH; break;
//         case 'finnish': return LanguageCode.FINNISH; break;
//         case 'french': return LanguageCode.FRENCH; break;
//         case 'german': return LanguageCode.GERMAN; break;
//         case 'greek': return LanguageCode.GREEK; break;
//         case 'hungarian': return LanguageCode.HUNGARIAN; break;
//         case 'gujarati': case 'nepali': case 'punjabi': case 'tamil': case 'telugu': case 'urdu': return LanguageCode.INDIAN; break;
//         case 'indonesian': return LanguageCode.INDONESIAN; break;
//         case 'persian': return LanguageCode.IRAN; break;
//         case 'italian': return LanguageCode.ITALIAN; break;
//         case 'korean': return LanguageCode.KOREAN; break;
//         case 'mongolian': return LanguageCode.MONGOLIAN; break;
//         case 'norwegian': return LanguageCode.NORWEGIAN; break;
//         case 'cebuano': case 'tagalog': return LanguageCode.PHILIPPINE; break;
//         case 'polish': return LanguageCode.POLISH; break;
//         case 'portuguese': return LanguageCode.PORTUGUESE; break;
//         case 'romanian': return LanguageCode.ROMANIAN; break;
//         case 'russian': return LanguageCode.RUSSIAN; break;
//         case 'sanskrit': return LanguageCode.SANSKRIT; break;
//         case 'spanish': return LanguageCode.SPANISH; break;
//         case 'thai': return LanguageCode.THAI; break;
//         case 'turkish': return LanguageCode.TURKISH; break;
//         case 'ukrainian': return LanguageCode.UKRAINIAN; break;
//         case 'vietnamese': return LanguageCode.VIETNAMESE; break;
//         case 'welsh': return LanguageCode.WELSH; break;
//     }
//     return LanguageCode.UNKNOWN;
// };
async function getImage(url, requestManager, cheerio) {
    const request = App.createRequest({
        url: url,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    return $('#img').attr('src') ?? '';
}
async function parsePage(id, page, requestManager, cheerio) {
    const request = App.createRequest({
        url: `https://e-hentai.org/g/${id}/?p=${page}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    const pageArr = [];
    const pageDivArr = $('div.gdtm').toArray();
    for (const page of pageDivArr) {
        pageArr.push(getImage($('a', page).attr('href') ?? '', requestManager, cheerio));
    }
    return Promise.all(pageArr);
}
async function parsePages(id, pageCount, requestManager, cheerio) {
    const pageArr = [];
    for (let i = 0; i <= pageCount / 40; i++) {
        pageArr.push(parsePage(id, i, requestManager, cheerio));
    }
    return Promise.all(pageArr).then(pages => pages.reduce((prev, cur) => [...prev, ...cur], []));
}
exports.parsePages = parsePages;
const namespaceHasTags = (namespace, tags) => { return tags.filter(tag => tag.startsWith(`${namespace}:`)).length != 0; };
const createTagSectionForNamespace = (namespace, tags) => {
    return App.createTagSection({ id: namespace, label: namespace, tags: tags.filter(tag => tag.startsWith(`${namespace}:`))
            .map(tag => App.createTag({ id: tag, label: tag.substring(namespace.length + 1) })) });
};
const parseTags = (tags) => {
    const tagSectionArr = [];
    switch (tags.shift()) {
        case 'Doujinshi':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:2', label: 'Doujinshi' })] }));
            break;
        case 'Manga':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:4', label: 'Manga' })] }));
            break;
        case 'Artist CG':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:8', label: 'Artist CG' })] }));
            break;
        case 'Game CG':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:16', label: 'Game CG' })] }));
            break;
        case 'Non-H':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:256', label: 'Non-H' })] }));
            break;
        case 'Image Set':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:32', label: 'Image Set' })] }));
            break;
        case 'Western':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:512', label: 'Western' })] }));
            break;
        case 'Cosplay':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:64', label: 'Cosplay' })] }));
            break;
        case 'Asian Porn':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:128', label: 'Asian Porn' })] }));
            break;
        case 'Misc':
            tagSectionArr.push(App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:1', label: 'Misc' })] }));
            break;
    }
    if (namespaceHasTags('character', tags))
        tagSectionArr.push(createTagSectionForNamespace('character', tags));
    if (namespaceHasTags('female', tags))
        tagSectionArr.push(createTagSectionForNamespace('female', tags));
    if (namespaceHasTags('male', tags))
        tagSectionArr.push(createTagSectionForNamespace('male', tags));
    if (namespaceHasTags('mixed', tags))
        tagSectionArr.push(createTagSectionForNamespace('mixed', tags));
    if (namespaceHasTags('other', tags))
        tagSectionArr.push(createTagSectionForNamespace('other', tags));
    if (namespaceHasTags('parody', tags))
        tagSectionArr.push(createTagSectionForNamespace('parody', tags));
    return tagSectionArr;
};
exports.parseTags = parseTags;
const parseTitle = (title) => {
    return title.replaceAll(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
};
exports.parseTitle = parseTitle;

},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.modifySearch = void 0;
const modifySearch = (stateManager) => {
    return App.createDUINavigationButton({
        id: 'modifySearch',
        label: 'Modify Search',
        form: App.createDUIForm({
            onSubmit: async (values) => {
                stateManager.store('extraSearchArgs', values.extraSearchArgs.replace(/[“”‘’]/g, '"'));
            },
            sections: async () => {
                return [App.createDUISection({
                        id: 'modifySearchSection',
                        isHidden: false,
                        footer: 'Note: searches with only exclusions do not work, including on the home page',
                        rows: async () => {
                            return [App.createDUIInputField({
                                    id: 'extraSearchArgs',
                                    value: App.createDUIBinding(await stateManager.retrieve('extraSearchArgs') ?? ''),
                                    label: 'Extra Args:'
                                })];
                        }
                    })];
            }
        })
    });
};
exports.modifySearch = modifySearch;
const resetSettings = (stateManager) => {
    return App.createDUIButton({
        id: 'resetSettings',
        label: 'Reset to Default',
        onTap: async () => {
            stateManager.store('extraSearchArgs', null);
        }
    });
};
exports.resetSettings = resetSettings;

},{}]},{},[62])(62)
});
