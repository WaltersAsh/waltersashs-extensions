import {
    SourceInfo,
    ContentRating,
    SourceIntents,
    BadgeColor,
} from '@paperback/types';

import { SOURCE_VERSION } from '../BuonduaBase';

import BuonduaBase from '../BuonduaBase';

const DOMAIN = 'https://buondua.com';

export const BuonduaInfo: SourceInfo = {
    version: SOURCE_VERSION,
    name: 'Buondua',
    icon: 'icon.png',
    author: 'WaltersAsh',
    authorWebsite: 'https://github.com/WaltersAsh',
    description: 'Extension to grab albums from Buon Dua',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.RED
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
};

export class Buondua extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = false;
    hasEncodedTags = true;
    sourceName = 'Buondua';
}