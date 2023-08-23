import { Track } from '../lib/types.spotify';

const played = new Map<string, Set<string>>();

export const pickRandomTrack = (tracks: Track[], artistId: string, clear?: boolean): Track | null => {
	const index = Math.floor(Math.random() * tracks.length);
	const track = tracks[index];


	if (clear) {
		if(played.has(artistId)) {
			const tracksPlayed = played.get(artistId);
			tracksPlayed?.clear(); 
		}
	}

	if (played.has(artistId)) {
		const tracksPlayed = played.get(artistId);

		if(tracksPlayed?.size === tracks.length) {
			return null;
		}

		if (tracksPlayed?.has(track.id)) {
			return pickRandomTrack(tracks, artistId);
		} else {
			const newTracksPlayed = new Set(tracksPlayed);
			newTracksPlayed.add(track.id);
			played.set(artistId, newTracksPlayed);
		}
	} else {
		played.set(artistId, new Set([track.id]));
	}

	return track;
};
