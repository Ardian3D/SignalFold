import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
