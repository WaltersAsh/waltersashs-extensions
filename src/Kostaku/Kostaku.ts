import {
    SourceInfo,
    TagType,
    ContentRating,
} from 'paperback-extensions-common';

import BuonduaBase from '../BuonduaBase';

const DOMAIN = 'https://kostaku.art';
const VERSION = '1.0.3';

export const KostakuInfo: SourceInfo = {
    version: VERSION,
    name: 'Kostaku',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Kostaku',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: TagType.RED
        },
        {
            text: 'Unstable',
            type: TagType.BLUE
        },
        {
            text: VERSION,
            type: TagType.GREEN
        }
    ]
}

export class Kostaku extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = true;
    hasEncodedTags = false;
    sourceName = 'Kostaku';
}