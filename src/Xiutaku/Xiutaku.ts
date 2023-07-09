import {
    SourceInfo,
    ContentRating,
    SourceIntents,
    BadgeColor,
} from '@paperback/types';

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
            type: BadgeColor.RED
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
};

export class Xiutaku extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = false;
    sourceName = 'Xiutaku';
    hasEncodedTags = false;
}