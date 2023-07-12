import {
    RequestManager,
    TagSection
} from '@paperback/types';

export const parseArtist = (tags: string[]): string | undefined => {
    const artist = tags.filter(tag => tag.startsWith('artist:')).map(tag => tag.substring(7));
    const cosplayer = tags.filter(tag => tag.startsWith('cosplayer:')).map(tag => tag.substring(10));
    if (artist.length != 0) return artist[0];
    else if (cosplayer.length != 0) return cosplayer[0];
    else return undefined;
};

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

async function getImage(url: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string> {
    const request = App.createRequest({
        url: url,
        method: 'GET'
    });

    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    return $('#img').attr('src') ?? '';
}

async function parsePage(id: string, page: number, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const request = App.createRequest({
        url: `https://e-hentai.org/g/${id}/?p=${page}`,
        method: 'GET'
    });

    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);

    const pageArr = [];
    const pageDivArr = $('div.gdtm').toArray();

    for (const page of pageDivArr) {
        pageArr.push(getImage($('a', page).attr('href') ?? '', requestManager, cheerio));
    }

    return Promise.all(pageArr);
}

export async function parsePages(id: string, pageCount: number, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const pageArr = [];

    for (let i = 0; i <= pageCount / 40; i++) {
        pageArr.push(parsePage(id, i, requestManager, cheerio));
    }

    return Promise.all(pageArr).then(pages => pages.reduce((prev, cur) => [...prev, ...cur], []));
}

const namespaceHasTags = (namespace: string, tags: string[]): boolean => { return tags.filter(tag => tag.startsWith(`${namespace}:`)).length != 0; };

const createTagSectionForNamespace = (namespace: string, tags: string[]): TagSection => { 
    return App.createTagSection({ id: namespace, label: namespace, tags: tags.filter(tag => tag.startsWith(`${namespace}:`))
        .map(tag => App.createTag({ id: tag, label: tag.substring(namespace.length + 1) })) }); 
};

export const parseTags = (tags: string[]): TagSection[] => {
    const tagSectionArr = [];

    switch (tags.shift()) {
        case 'Doujinshi': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:2', label: 'Doujinshi' })] })); 
            break;
        case 'Manga': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:4', label: 'Manga' })] })); 
            break;
        case 'Artist CG': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:8', label: 'Artist CG' })] })); 
            break;
        case 'Game CG': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:16', label: 'Game CG' })] })); 
            break;
        case 'Non-H': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:256', label: 'Non-H' })] })); 
            break;
        case 'Image Set': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:32', label: 'Image Set' })] })); 
            break;
        case 'Western': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:512', label: 'Western' })] })); 
            break;
        case 'Cosplay': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:64', label: 'Cosplay' })] })); 
            break;
        case 'Asian Porn': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:128', label: 'Asian Porn' })] })); 
            break;
        case 'Misc': tagSectionArr.push(
            App.createTagSection({ id: 'categories', label: 'categories', tags: [App.createTag({ id: 'category:1', label: 'Misc' })] })); 
            break;
    }

    if (namespaceHasTags('character', tags)) tagSectionArr.push(createTagSectionForNamespace('character', tags));
    if (namespaceHasTags('female', tags)) tagSectionArr.push(createTagSectionForNamespace('female', tags));
    if (namespaceHasTags('male', tags)) tagSectionArr.push(createTagSectionForNamespace('male', tags));
    if (namespaceHasTags('mixed', tags)) tagSectionArr.push(createTagSectionForNamespace('mixed', tags));
    if (namespaceHasTags('other', tags)) tagSectionArr.push(createTagSectionForNamespace('other', tags));
    if (namespaceHasTags('parody', tags)) tagSectionArr.push(createTagSectionForNamespace('parody', tags));

    return tagSectionArr;
};

export const parseTitle = (title: string): string => {
    return title.replaceAll(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
};