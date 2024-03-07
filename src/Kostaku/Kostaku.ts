import {
    SourceInfo,
    ContentRating,
    SourceIntents,
    BadgeColor,
} from '@paperback/types';

import { SOURCE_VERSION } from '../BuonduaBase';

import BuonduaBase from '../BuonduaBase';

const DOMAIN = 'https://kiutaku.com/';

export const KostakuInfo: SourceInfo = {
    version: SOURCE_VERSION,
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
            type: BadgeColor.RED
        }
    ],

    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS
};

export class Kostaku extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = true;
    hasEncodedTags = false;
    sourceName = 'Kostaku';
}