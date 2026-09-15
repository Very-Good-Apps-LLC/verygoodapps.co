import { companyName } from '../site';
import { Email } from './Text';

export default function Header({ privacy }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label={`${companyName}, home`}>
        <img src="/brand/wordmark.png" alt={companyName} width="132" height="132" />
      </a>
      <span className="header-tag">
        {privacy ? 'Company privacy' : 'Independent software company · Illinois'}
      </span>
      <Email>Contact</Email>
    </header>
  );
}
