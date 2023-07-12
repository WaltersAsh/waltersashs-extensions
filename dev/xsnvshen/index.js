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
exports.xsnvshen = exports.xsnvshenInfo = void 0;
const types_1 = require("@paperback/types");
const xsnvshenHelper_1 = require("./xsnvshenHelper");
exports.xsnvshenInfo = {
    version: '1.0.1',
    name: 'xsnvshen',
    icon: 'icon.png',
    author: 'loik9081',
    description: 'Extension to grab galleries from xsnvshen',
    contentRating: types_1.ContentRating.MATURE,
    websiteBaseURL: 'https://www.xsnvshen.com/',
    authorWebsite: 'https://github.com/loik9081',
    sourceTags: [{
            text: '18+',
            type: types_1.BadgeColor.RED
        }],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS
};
class xsnvshen {
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
                            'referer': 'https://www.xsnvshen.com/album/'
                        }
                    };
                    return request;
                },
                interceptResponse: async (response) => { return response; }
            }
        });
        this.stateManager = App.createSourceStateManager();
    }
    getMangaShareUrl(mangaId) {
        return `https://www.xsnvshen.com/album/${mangaId}`;
    }
    async getSearchTags() {
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
                id: 'clothing',
                label: 'Clothing',
                tags: [
                    App.createTag({ id: '167', label: 'Thong' }),
                    App.createTag({ id: '138', label: 'Bikini' }),
                    App.createTag({ id: '183', label: 'Stockings' }),
                    App.createTag({ id: '175', label: 'Lingerie' }),
                    App.createTag({ id: '189', label: 'Wet' }),
                    App.createTag({ id: '140', label: 'Cheongsam' }),
                    App.createTag({ id: '146', label: 'Dudou' }),
                    App.createTag({ id: '151', label: 'Flight Attendant' }),
                    App.createTag({ id: '168', label: 'Nurse' }),
                    App.createTag({ id: '173', label: 'Kimono' }),
                    App.createTag({ id: '93', label: 'Uniform' }),
                    App.createTag({ id: '97', label: 'School Uniform' }),
                    App.createTag({ id: '115', label: 'Maid' }),
                    App.createTag({ id: '112', label: 'Soccer Babe' }),
                    App.createTag({ id: '186', label: 'Basketball Babe ' }),
                    App.createTag({ id: '184', label: 'Boxing Babe' }),
                    App.createTag({ id: '187', label: 'Cosplay' }) // 角色扮演
                ]
            }),
            App.createTagSection({
                id: 'sensation',
                label: 'Sensation',
                tags: [
                    App.createTag({ id: '2', label: 'Sexy' }),
                    App.createTag({ id: '96', label: 'Alluring' }),
                    App.createTag({ id: '104', label: 'Mature' }),
                    App.createTag({ id: '107', label: 'Pure' }),
                    App.createTag({ id: '123', label: 'Cool' }),
                    App.createTag({ id: '141', label: 'Wild' }),
                    App.createTag({ id: '114', label: 'Cute' }),
                    App.createTag({ id: '128', label: 'Excellent' }),
                    App.createTag({ id: '171', label: 'Petite' }),
                    App.createTag({ id: '100', label: 'Busty Baby Face' }),
                    App.createTag({ id: '178', label: 'Well Endowed' }) // 大尺度
                ]
            }),
            App.createTagSection({
                id: 'features',
                label: 'Features',
                tags: [
                    App.createTag({ id: '88', label: 'Skinny' }),
                    App.createTag({ id: '95', label: 'Beautiful Butt' }),
                    App.createTag({ id: '185', label: 'Curvy' }),
                    App.createTag({ id: '166', label: 'Beautiful Legs' }),
                    App.createTag({ id: '137', label: 'Natural' }),
                    App.createTag({ id: '130', label: 'Fair Skin' }),
                    App.createTag({ id: '149', label: 'Stunning' }),
                    App.createTag({ id: '101', label: 'Tan' }),
                    App.createTag({ id: '131', label: 'Big Boobs' }),
                    App.createTag({ id: '143', label: 'Massive Boobs' }) // 人间胸器
                ]
            }),
            App.createTagSection({
                id: 'scene',
                label: 'Scene',
                tags: [
                    App.createTag({ id: '160', label: 'Street' }),
                    App.createTag({ id: '116', label: 'Bathroom' }),
                    App.createTag({ id: '126', label: 'Outdoors' }),
                    App.createTag({ id: '169', label: 'Beach' }),
                    App.createTag({ id: '190', label: 'Pool' }),
                    App.createTag({ id: '161', label: 'Home' }),
                    App.createTag({ id: '176', label: 'Private Photoshoot' }) // 私房照
                ]
            }),
            App.createTagSection({
                id: 'region',
                label: 'Region',
                tags: [
                    App.createTag({ id: '79', label: 'China' }),
                    App.createTag({ id: '155', label: 'Hong Kong' }),
                    App.createTag({ id: '152', label: 'Macau' }),
                    App.createTag({ id: '165', label: 'Taiwan' }),
                    App.createTag({ id: '108', label: 'Japan' }),
                    App.createTag({ id: '180', label: 'Korea' }),
                    App.createTag({ id: '90', label: 'Malaysia' }),
                    App.createTag({ id: '156', label: 'Thailand' }),
                    App.createTag({ id: '150', label: 'Western' }),
                    App.createTag({ id: '191', label: 'Mixed' }) // 混血
                ]
            }) /*,
            createTagSection({
                id: 'company', // 机构
                label: 'Company',
                tags: [
                    createTag({ id: '', label: '' }),
                ]
            })*/
        ];
    }
    async getHomePageSections(sectionCallback) {
        const chosenTags = [];
        for (const section of await this.getSearchTags()) {
            if (section.id == 'note' || !await this.stateManager.retrieve(section.id))
                continue;
            for (const tag of await this.stateManager.retrieve(section.id))
                chosenTags.push({
                    id: section.tags.find(el => el.label == tag)?.id,
                    label: tag
                });
        }
        for (const tag of chosenTags) {
            const section = App.createHomeSection({
                id: tag.id,
                title: tag.label,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal
            });
            sectionCallback(section);
            (0, xsnvshenHelper_1.getCategoryData)(tag.id, 0, this.requestManager, this.cheerio).then(manga => {
                section.items = manga[0];
                sectionCallback(section);
            });
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 0;
        if (metadata?.stopSearch ?? false)
            return App.createPagedResults({
                results: [],
                metadata: {
                    stopSearch: true
                }
            });
        const results = await (0, xsnvshenHelper_1.getCategoryData)(homepageSectionId, page, this.requestManager, this.cheerio);
        return App.createPagedResults({
            results: results[0],
            metadata: {
                page: page + 1,
                stopSearch: results[1]
            }
        });
    }
    async getSourceMenu() {
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
                            onSubmit: async (values) => {
                                for (const section of tagList) {
                                    if (section.id != 'note')
                                        this.stateManager.store(section.id, values[section.id]);
                                }
                            },
                            sections: async () => {
                                return [App.createDUISection({
                                        id: 'categoriesSection',
                                        isHidden: false,
                                        rows: async () => {
                                            const tagRows = [];
                                            for (const section of tagList) {
                                                if (section.id != 'note')
                                                    tagRows.push(App.createDUISelect({
                                                        id: section.id,
                                                        value: App.createDUIBinding(await this.stateManager.retrieve(section.id) ?? []),
                                                        label: section.label,
                                                        options: section.tags.map(tag => tag.label),
                                                        allowsMultiselect: true,
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        labelResolver: (option) => option
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
    async getMangaDetails(mangaId) {
        const data = await (0, xsnvshenHelper_1.getGalleryData)(mangaId, this.requestManager, this.cheerio);
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [data.title],
                image: data.image,
                status: 'Completed',
                desc: 'Langugage: Chinese, Views: ' + data.views + ' Last Updated: ' + data.lastUpdate,
                artist: data.artist,
                tags: (await this.getSearchTags()).map(section => App.createTagSection({ id: section.id, label: section.label, tags: section.tags
                        .filter(tag => data.tags.includes(tag.id)) })).filter(section => section.tags.length != 0),
                hentai: false,
                // relatedIds: [], // possibly parent_gid and/or first_gid
            })
        });
    }
    async getChapters(mangaId) {
        const data = await (0, xsnvshenHelper_1.getGalleryData)(mangaId, this.requestManager, this.cheerio);
        return [App.createChapter({
                id: data.girlId,
                chapNum: 1,
                langCode: 'Chinese',
                name: data.title,
                time: data.lastUpdate
            })];
    }
    async getChapterDetails(mangaId, chapterId) {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: await (0, xsnvshenHelper_1.getPages)(mangaId, this.requestManager, this.cheerio)
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 0;
        if (metadata?.stopSearch ?? false)
            return App.createPagedResults({
                results: [],
                metadata: {
                    stopSearch: true
                }
            });
        const results = query.includedTags?.length == 0 ? await (0, xsnvshenHelper_1.getSearchData)(query.title, page, this.requestManager, this.cheerio) :
            await (0, xsnvshenHelper_1.getCategoryData)(query.includedTags?.[0]?.id, page, this.requestManager, this.cheerio);
        return App.createPagedResults({
            results: results[0],
            metadata: {
                page: page + 1,
                stopSearch: results[1]
            }
        });
    }
}
exports.xsnvshen = xsnvshen;

},{"./xsnvshenHelper":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchData = exports.getPages = exports.getGalleryData = exports.getCategoryData = void 0;
async function getCategoryData(categoryId, page, requestManager, cheerio) {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/album/t${categoryId}/?p=${page + 1}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    const results = [];
    const searchResults = $('li', 'ul.layout').toArray();
    for (const manga of searchResults)
        results.push(App.createPartialSourceManga({
            mangaId: $('a', manga).attr('href')?.substring(7),
            title: $('div.camLiTitleC>p>a', manga).text(),
            image: `https:${$('img', manga).attr('src')}`,
        }));
    return [results, !$('a', 'div#pageNum').last().hasClass('a1')];
}
exports.getCategoryData = getCategoryData;
async function getGalleryData(id, requestManager, cheerio) {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/album/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    const girlId = $('img#bigImg').attr('src')?.split('/')[4];
    return {
        title: $('div.swp-tit>h1>a').text(),
        image: `https://img.xsnvshen.com/thumb_205x308/album/${girlId}/${id}/cover.jpg`,
        artist: $('a', 'span.f20')?.text(),
        tags: $('a[href^="/album"]', 'div.poster-nav>p').toArray().map(tag => $(tag).attr('href').slice(8, -1)),
        views: parseInt($('span#hits').text()),
        // relatedIds: [] // Include all suggested galleries
        lastUpdate: new Date($('em#time').text().substring(3, 13)),
        girlId: girlId
    };
}
exports.getGalleryData = getGalleryData;
async function getPages(id, requestManager, cheerio) {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/album/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    const pages = [];
    const pageCount = parseInt($('span', 'em#time').text().slice(2, -2));
    const girlId = $('img#bigImg').attr('src')?.split('/')[4];
    for (let i = 0; i < pageCount; i++)
        pages.push(`https://img.xsnvshen.com/album/${girlId}/${id}/${i >= 100 ? i : i >= 10 ? `0${i}` : `00${i}`}.jpg`);
    return pages;
}
exports.getPages = getPages;
async function getSearchData(query, page, requestManager, cheerio) {
    const request = App.createRequest({
        url: `https://www.xsnvshen.com/search?w=${encodeURIComponent(query ?? '')}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data);
    const results = [];
    const searchResults = $('li', 'ul#newspiclist').toArray();
    for (const manga of searchResults)
        results.push(App.createPartialSourceManga({
            mangaId: $('a', manga).attr('href')?.substring(7),
            title: $('div.titlebox>a', manga).text(),
            image: `https:${$('img', manga).attr('src')}`,
        }));
    return [results, true];
}
exports.getSearchData = getSearchData;

},{}]},{},[62])(62)
});
