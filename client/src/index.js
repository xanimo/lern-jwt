import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './bin/bootstrap';

require('dotenv').config();
ReactDOM.render(
	<Router><Routes /></Router>,
	document.getElementById('root')
)

registerServiceWorker();
