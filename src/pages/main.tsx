import {Autocomplete, Box, TextField} from '@mui/material';
import {useState, useEffect, useRef} from 'react';
import React from 'react';
import {useDebounce} from 'usehooks-ts';
import type {Artist, Track} from '../lib/types.spotify';
import {getTopTracks, searchTracks, getNext} from '../lib/spotify';
import { toast } from 'react-toastify';
import { pickRandomTrack } from '../util/pickNew';
import NavBar from '../Components/navbar';
import Footer from '../Components/foter';
import LostScreen from '../Components/lost';


const getImage = (images: Artist['images']) => {
	if (images.length) {
		return images[0].url;
	}
	return 'https://picsum.photos/640/640';
};

interface Props {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const Main = ({setLoggedIn}: Props) => {
	const [trackSearch, setTrackSearch] = useState<string | null>(null);
	const [artist, setArtist] = useState<Artist | null>(null); 
	const [trackSearchResults, setTrackSearchResults] = useState<Track[]>([]);
	const [playTrack, setPlayTrack] = useState<Track | null | string>('');
	const [progress, setProgress] = useState<number>(0);
	const [score, setScore] = useState<number>(1500);
	const [guessedTrack, setGuessedTrack] = useState<Track | null>(null);
	const [tracks, setTracks] = useState<Track[]>([]);
	const [next, setNext] = useState<string>('');
	const [canPause, setCanPause] = useState<boolean>(false);
	const [playing, setPlaying] = useState<boolean>(true);
	const [state, setState] = useState<'going' | 'lost'>('lost');

	const audioRef = useRef<HTMLAudioElement>(null);

	const debouncedTrackSearch = useDebounce(trackSearch, 150);

	const handleTrackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTrackSearch(event.target.value);
	};

	useEffect(() => {
		if (debouncedTrackSearch && artist) {
			searchTracks(debouncedTrackSearch, setLoggedIn).then((data) => {
				setTrackSearchResults(data);
			});
		}

	}, [trackSearch]);

	useEffect(() => {
		if (artist) {
			getTopTracks(artist.name, setLoggedIn).then(({tracks}) => {
				setNext(tracks.next);
				setTracks(tracks.items);
			});
		}
	}, [artist]);


	useEffect(() => {
		if(artist && tracks) {
			const track = pickRandomTrack(tracks, artist.id, true);
  
			setPlayTrack(track);
		}

	}, [tracks]);

	useEffect(() => {
		if(playTrack === null && next) {
			getNext(next, setLoggedIn).then(({tracks}) => {
				setNext(tracks.next);
				setTracks(tracks.items);
			});
		}


		if(playTrack && artist && typeof playTrack !== 'string') {
			try {
				if(!playTrack.preview_url) {
					throw new Error('no preview');
				}

				const audio = audioRef.current!;

				audio.src = playTrack.preview_url;

				audio.volume = 0.6;
				audio.play();

				audio.addEventListener('pause', () => {
					if(!canPause) {
						audio.play();
					}
				});

				audio.addEventListener('timeupdate', () => {   
					setProgress((audio.currentTime / 15) * 100);
            
          
					if(audio.currentTime > 10) {
						audio.volume = 0;
					}
					if (audio.currentTime > 15) {
						console.log('here');
						setCanPause(true);
						audio.pause();
						setCanPause(false);
						const newScore = score - 100;
    
						setScore(newScore);
    
						const track = pickRandomTrack(tracks, artist!.id);
    
						setPlayTrack(track);
					}
          
				});
			} catch (e) {
				console.log(e);
				toast(`The artist ${artist?.name} does not support preview, Please choose another artist`, {
					position: 'bottom-right',
					type: 'error',
					autoClose: 2000,
					hideProgressBar: false,
				});
        

				setPlayTrack(null);
				setArtist(null);
			}
		}
	}, [playTrack]);

	useEffect(() => {
		if(score === 0) {
			toast('You lost! ;(', {
				position: 'bottom-right',
				type: 'error',
				autoClose: 2000,
				hideProgressBar: false,
			});
			setArtist(null);
			setPlayTrack(null);
			setState('lost');
		}
	}, [score]);

	useEffect(() => {
		if(!playing) {
			setArtist(null);
			setPlayTrack(null);
			setScore(1500);
		}
	}, [playing]);


	return (
		<Box sx={{opacity: 2}}>
			{(state !== 'lost' ) ? (
				<>
					<NavBar setArtist={setArtist} playing={playing} setPlaying={setPlaying} score={score} setLoggedIn={setLoggedIn} />
					{artist && <Box
						sx={{
							height: '85vh',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexShrink: 0,
							backgroundColor: 'transparent',
							opacity: 1
						}}
					>
						<Autocomplete
							options={trackSearchResults}
							sx={{
								flexGrow: 1
							}}
							value={guessedTrack}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => <TextField {...params} sx={{
								width: '80%',
								marginLeft: 'calc(10% - 12px)'
							}}
							inputProps={{
								...params.inputProps,
								autoComplete: 'new-password',
								placeholder: 'Search for an track'
							}} onChange={handleTrackChange}  />}
							placeholder='Search for a track'
          
							clearOnEscape
							renderOption={(props, option) => (
								<Box component="li" key={option.id} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
									<img loading="lazy" width="30" src={getImage(option.album.images)} alt="" />
									{option.name}
								</Box>
							)}
							onChange={(_, newValue) => {
								if(newValue && playTrack && typeof playTrack !== 'string') {
									if(newValue.id === playTrack.id) {
										const audio = audioRef.current!;

										audio.pause();

										const newScore = score + 100;

										setScore(newScore);

										setGuessedTrack(null);

										setPlayTrack(pickRandomTrack(tracks, artist.id));
									} else {
										const newScore = score - 100;

										setScore(newScore);

										setGuessedTrack(null);

									}
								}
							}}
						/>
					</Box>}
					<Footer playTrack={playTrack} progress={progress} />
					<audio ref={audioRef} hidden controls={false} />
				</>
			) : (
				<LostScreen setState={setState}/>
			)}
		</Box>
	);
};


export default Main;
