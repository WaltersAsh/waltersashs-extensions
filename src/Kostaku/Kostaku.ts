import {
    SourceInfo,
    TagType,
    ContentRating,
} from 'paperback-extensions-common';

import { SOURCE_VERSION } from '../BuonduaBase';

import BuonduaBase from '../BuonduaBase';

const DOMAIN = 'https://kostaku.art';

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
            type: TagType.RED
        }
    ]
};

export class Kostaku extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = true;
    hasEncodedTags = false;
    sourceName = 'Kostaku';
}