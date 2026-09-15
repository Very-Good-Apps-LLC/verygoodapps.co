import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { legacyDestination } from './legacyLinks';
import './styles/site.css';

function redirectLegacyLink() {
  const destination = legacyDestination(window.location.hash);
  if (destination) window.location.replace(destination);
  return Boolean(destination);
}

// Also handle an old bookmark opened in an already-loaded homepage tab.
window.addEventListener('hashchange', redirectLegacyLink);
if (!redirectLegacyLink()) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App pathname={window.location.pathname} />
    </StrictMode>,
  );
}
