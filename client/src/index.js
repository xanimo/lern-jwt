import React from 'react';
import { createRoot } from 'react-dom/client';
import BrowserRoutes from './routes';
import registerServiceWorker from './service-worker';
import './index.css';
import './bin/bootstrap';

require('dotenv').config();
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
      <BrowserRoutes />
  </React.StrictMode>
);
registerServiceWorker();
