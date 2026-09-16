import AnalyticsConsent from './AnalyticsConsent';
import { companyName } from '../site';
import { KeepTogether } from './Text';

export default function Footer({ home }) {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <span>
          © {new Date().getFullYear()} <KeepTogether>{companyName}</KeepTogether>
        </span>
        <span>{home ? 'Come back anytime.' : 'Illinois, USA'}</span>
      </div>
      <div className="footer-right">
        {' '}
        <a href="/privacy/">Privacy</a>
        <AnalyticsConsent />
      </div>
    </footer>
  );
}
