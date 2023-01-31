import {
    SourceInfo,
    TagType,
    ContentRating,
} from 'paperback-extensions-common';

import { SOURCE_VERSION } from '../BuonduaBase';

import BuonduaBase from '../BuonduaBase';

const DOMAIN = 'https://xiutaku.com';

export const XiutakuInfo: SourceInfo = {
    version: SOURCE_VERSION,
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
        }
    ]
};

export class Xiutaku extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = false;
    sourceName = 'Xiutaku';
    hasEncodedTags = false;
}