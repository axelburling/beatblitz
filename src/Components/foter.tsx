import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import type { Track } from '../lib/types.spotify';
import Typography from '@mui/material/Typography';
import { getImage } from './navbar';
import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify';

interface Props {
    playTrack: Track | null | string
    progress: number
}

const timeDiff = (time: number) => {
	const diff = Date.now() - time;
	const seconds = Math.floor(diff / 1000);

	if(seconds < 10) {
		return false;
	}

	return true;
}; 

const Footer = ({playTrack, progress}: Props) =>  {
	const [track, setTrack] = useState<{id: string, time: number} | null>(null);


	useEffect(() => {
		if(progress >= 98 && playTrack && typeof playTrack !== 'string' && timeDiff(track?.time || 0)) {
			setTrack({id: playTrack.id, time: Date.now()});
			toast.info((
				<Box display='flex' justifyContent='center' alignContent='center' >
					<img loading='eager' style={{marginRight: '2vw'}} src={getImage(playTrack.album.images)} width='50vw' height='50vw'  />
					<Typography>{playTrack.name}</Typography> 
				</Box>
			), {draggable: true, theme: 'colored', position: 'bottom-left', autoClose: 1000, closeOnClick: false, hideProgressBar: true});
		}
	}, [progress]);


	return (playTrack && typeof playTrack !== 'string') && ( 
		<footer
			style={{
				position: 'fixed',
				bottom: '3vh',
				left: 0,
				width: '90%',
			}}
		>
			<Box sx={{ width: '100%', marginLeft: '5vw' }}>
				<LinearProgress variant="determinate" color='warning' value={progress} />
			</Box>
		</footer>        
	);
};

export default Footer;