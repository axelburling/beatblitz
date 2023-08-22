import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react';
import type { Artist } from '../lib/types.spotify';
import { searchArtist } from '../lib/spotify';
import { useDebounce } from 'usehooks-ts';

const StyledTextField = styled(TextField)(({ theme }) => ({
    color: 'inherit',
    width: '25ch',
    transition: theme.transitions.create('width'),
    '&:focus-within': {
        width: '30ch',
    },
    
    [theme.breakpoints.down('sm')]: {
        width: '20ch',
        '&:focus-within': {
            width: '25ch',
        },
    }
}));

export const getImage = (images: Artist['images']) => {
    if (images.length) {
      return images[0].url
    }
    return 'https://picsum.photos/640/640'
  }
  

interface Props {
    setArtist: React.Dispatch<React.SetStateAction<Artist | null>>
    playing: boolean
    score: number
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NavBar({setArtist, playing, score, setPlaying, setLoggedIn}: Props) {
    const [value, setValue] = useState('')
    const [artists, setArtists] = useState<Artist[]>([]); 

    const debouncedValue = useDebounce(value, 150);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }

      useEffect(() => {
        if (debouncedValue) {
          searchArtist(debouncedValue, setLoggedIn).then((data) => {
            setArtists(data)
          })
        }
      }, [debouncedValue])

    return (
    <Box >
          <AppBar position="sticky" sx={{height: '7ch'}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                marginTop: '1vh'
            }}>
            <Typography variant='h5' fontFamily='monospace' fontWeight='bold'  fontSize='1000000' sx={{marginRight: '90vw', position: 'absolute'}}>Score: {score}</Typography>

            {playing ? (<Autocomplete
                options={artists}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <StyledTextField {...params} size='small' inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                    placeholder: 'Search for an artist'
                }} onChange={handleChange} />}
                placeholder='Search for an artist'
                renderOption={(props, option) => {
                    return (
                    <Box component="li" key={`${option.id}-${option.name}`} sx={{ '& > img': { mr: 2, flexShrink: 0, zIndex: 10 } }} {...props}>
                        <img loading="lazy" width="30" src={getImage(option.images)} alt="" />
                        {option.name}
                    </Box>
                    )
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) => {
                    setArtist(newValue)
                }}
                /> ): (
                  <Box></Box>
                )}
                <Button variant='contained' color='secondary' onClick={() => {
                  setPlaying(p => !p)
                }} sx={{marginLeft: '85vw', position: 'absolute'}}>{playing ? 'Restart' : 'Start'}</Button>
                </Box> 
          </AppBar>
     </Box>
  );
}