import { version } from 'chai';
import {
    SourceInfo,
    TagType,
    ContentRating,
} from 'paperback-extensions-common';

import BuonduaBase from '../BuonduaBase';

const DOMAIN = 'https://buondua.com';
const VERSION = '1.0.4';

export const BuonduaInfo: SourceInfo = {
    version: VERSION,
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

export class Buondua extends BuonduaBase {
    baseUrl = DOMAIN;
    hasEncodedUrls = false;
    hasEncodedTags = true;
    sourceName = 'Buondua';
}