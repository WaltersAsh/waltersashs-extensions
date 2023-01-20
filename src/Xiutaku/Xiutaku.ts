import {
    SourceInfo,
    TagType,
    ContentRating,
} from 'paperback-extensions-common';

import BuonduaBase from '../BuonduaBase';

const DOMAIN = 'https://xiutaku.com';
const VERSION = '1.0.0';

export const XiutakuInfo: SourceInfo = {
    version: VERSION,
    name: 'Xiutaku',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Xiutaku',
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

export class Xiutaku extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = false;
    sourceName = 'Xiutaku';
    hasEncodedTags = false;
}