import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {shell} from '@tauri-apps/api';
import { login } from '../lib/spotify';
import { toast } from 'react-toastify';
import type {TypographyProps} from '@mui/material';
import { getCreds, setToLocal } from '../lib/storage';
import { useEffect } from 'react';
import {Buffer} from 'buffer';

function Copyright(props: TypographyProps) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
        To get your client id and secret, go to{' '}
			<Link component='button' onClick={() => {
				shell.open('https://developer.spotify.com/dashboard');
			}} color="inherit" >
        Spotify for Developers
			</Link>{' '}
		</Typography>
	);
}

interface Props {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Intro({setLoggedIn}: Props) {
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		try {
			event.preventDefault();
			const id = event.currentTarget.client_id.value;
			const secret = event.currentTarget.client_secret.value;

			setToLocal('clientId', id);
			setToLocal('clientSecret', Buffer.from(Buffer.from(secret).toString('base64')).toString('hex'));
        
			await login(id, secret);

			setLoggedIn(true);
		} catch (error) {
			console.error(error);

			if(error instanceof Error) {
				toast.error(error.message);
				return;
			}
			toast.error('Something went wrong');
		}
	};


	useEffect(() => {

		const creds = getCreds();

		if(creds) {
			setLoggedIn(true);
		}
	}, []);

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Typography component="h1" variant="h5">
            Sign in With Spotify
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="client_id"
						label="Client ID"
						name="client_id"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="client_secret"
						label="Client Secret"
						type="password"
						id="client_secret"
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
              Sign In
					</Button>
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}