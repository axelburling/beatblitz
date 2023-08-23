import { Buffer } from 'buffer';
import { getToken, setToLocal } from './storage';
import type { ArtistSearch, Res, TracksRes, SearchTracksRes } from './types.spotify';

export const login = async (id: string, secret: string) => {
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(id + ':' + secret).toString('base64')
		},
		body: 'grant_type=client_credentials'
	});

	if(!res.ok) {
		throw new Error('Could not login to spotify');
	}

	const data = await res.json() as Res;

	data.expires_in = Date.now() + data.expires_in * 1000;

	setToLocal('token', JSON.stringify(data));

	return data.access_token;
};

export const searchArtist = async (query: string, s: React.Dispatch<React.SetStateAction<boolean>>) => {
	const token = await getToken(s);

	const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	});

	const data = await res.json() as ArtistSearch;

	return data.artists.items;
};


export const getTopTracks = async (name: string, s: React.Dispatch<React.SetStateAction<boolean>>) => {
	const token = await getToken(s);

	const res =  await fetch(`https://api.spotify.com/v1/search?type=track&q=artist:${name}`, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	});

	const data = await res.json() as TracksRes;


	return data;
};


export const searchTracks = async (query: string, s: React.Dispatch<React.SetStateAction<boolean>>) => {
	const token = await getToken(s);

	const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	});

	const data = await res.json() as SearchTracksRes;

	return data.tracks.items;
};


export const getNext = async (url: string, s: React.Dispatch<React.SetStateAction<boolean>>) => {
	const token = await getToken(s);
	const res = await fetch(url, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	});

	const data = await res.json() as TracksRes;

	return data;
};