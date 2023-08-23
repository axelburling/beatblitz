import React from 'react';
import {Box, Button, Container, Typography} from '@mui/material';

interface Props {
    setState: React.Dispatch<React.SetStateAction<'going' | 'lost'>>
}

const LostScreen = ({setState}: Props) => {
	return (
		<Box sx={{height: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<Container component="main" maxWidth="xs">
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography component="h1" variant="h5">
						{'You lost! ;('}
					</Typography>
					<Box sx={{ mt: 1 }}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							onClick={() => setState('going')}
							sx={{ mt: 3, mb: 2 }}
						>
                            Restart
						</Button>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default LostScreen;