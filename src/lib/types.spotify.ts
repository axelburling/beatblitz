export type Track = {
    album: {
        album_type: string
        artists: Artist[]
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        images: {
            height: number
            url: string
            width: number
        }[]
        is_playable: boolean
        name: string
        release_date: string
        release_date_precision: string
        total_tracks: number
        type: string
        uri: string
    }
    artists: Artist[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: {
        isrc: string
    }
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    is_local: boolean
    // is_playable: boolean
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
}


export type TracksRes = {
    tracks: {
        href: string
        items: Track[]
        limit: number
        next: string
        offset: number
        previous: string
        total: number
    }
}

export type Res = {
    access_token: string
    token_type: string
    expires_in: number
}


export type ArtistSearch = {
    artists: {
        href: string
        items: Artist[]
        limit: number
        offset: number
        previous: string
        total: number
    }
}

export type Artist = {
    external_urls: {
        spotify: string
    }
    followers: {
        href: string | null
        total: number
    }
    genres: string[]
    href: string
    id: string
    images: {
        height: number
        url: string
        width: number
    }[]
    name: string
    popularity: number
    type: string
    uri: string
}


export type SearchTracksRes = {
    tracks: {
        href: string
        items: Track[]
        limit: number
        next: string
        offset: number
        previous: string
        total: number
    }
}