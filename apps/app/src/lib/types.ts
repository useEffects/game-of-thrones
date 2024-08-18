// Character type
export interface Character {
    characterName: string;
    house?: string;
    characterImageThumb?: string;
    characterImageFull?: string;
    characterLink?: string;
    actorName?: string;
    actorLink?: string;
    royal?: boolean;
    gender?: string;
    born?: string;
    origin?: string;
    death?: string;
    status?: string;
    culture?: string;
    religion?: string;
    titles?: string[];
    seasons?: string[];
    killed?: string[];
    parents?: string[];
    serves?: string[];
    guardianOf?: string[];
    allies?: string[];
    siblings?: string[];
    lovers?: string[];
    marriedEngaged?: string[];
}

// House type
export interface House {
    name: string;
    sigil?: string;
    words?: string;
    seat?: string;
    region?: string;
    founder?: string;
    vassals?: string[];
}

// Place type
export interface Place {
    name: string;
    type?: string;
    location?: string;
    rulers?: string;
}
