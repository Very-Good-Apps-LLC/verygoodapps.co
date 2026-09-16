import { companyName, companyAbbrev } from '../site';
import { Email } from './Text';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function Header({ privacy }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label={`${companyName}, home`}>
        {/* <img src="/brand/wordmark.png" alt={companyName} width="132" height="132" /> */}
        <h3 className="brand-name">{companyAbbrev}</h3>
      </a>
      <span className="header-tag">{privacy ? 'Company privacy' : ''}</span>
      <Email alt="Contact link" aria-label="Contact">
        <PaperAirplaneIcon
          className="header-send-icon"
          alt="Contact link"
          stroke-width="2"
          color="#ab3f29"
        />
      </Email>
    </header>
  );
}
