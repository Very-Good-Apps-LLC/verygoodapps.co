import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

export default function App({ pathname }) {
  const isHome = pathname === '/' || pathname === '/index.html';
  const isPrivacy = ['/privacy', '/privacy/', '/privacy/index.html'].includes(pathname);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header privacy={isPrivacy} />
      {isHome ? <Home /> : isPrivacy ? <Privacy /> : <NotFound />}
      <Footer home={isHome} />
    </>
  );
}
