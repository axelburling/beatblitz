import React, { useState } from 'react';

import Main from './pages/main';
import Intro from './pages/intro';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {

	const [loggedIn, setLoggedIn] = useState<boolean>(false);
  
	return (
		<>
			{loggedIn ? <Main setLoggedIn={setLoggedIn} /> : <Intro setLoggedIn={setLoggedIn} />}
			<ToastContainer limit={1}  />
		</>
	);
};


export default App;
