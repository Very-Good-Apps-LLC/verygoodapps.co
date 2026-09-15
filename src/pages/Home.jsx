import InteractiveOffice from '../components/office/InteractiveOffice';
import { Email, KeepTogether, MemberNames } from '../components/Text';
import '../styles/office.css';

export default function Home() {
  return (
    <main id="main" className="home" tabIndex={-1}>
      <div className="office-intro">
        <p className="kicker">
          <KeepTogether>Very Good Apps LLC</KeepTogether> · Illinois
        </p>
        <h1>
          A <em>curious</em>, little, <KeepTogether>software company.</KeepTogether>
        </h1>
        <p>
          Apps, <KeepTogether>everyday tools</KeepTogether>, and ideas{' '}
          <KeepTogether>worth trying.</KeepTogether> This is our little corner of{' '}
          <KeepTogether>the internet.</KeepTogether>
        </p>
      </div>
      <div className="office-layout">
        <InteractiveOffice />
        <section className="office-about" aria-labelledby="about-title">
          <h2 id="about-title">A quick introduction.</h2>
          <p>
            We’re <MemberNames />. Together, we run <KeepTogether>Very Good Apps LLC,</KeepTogether>{' '}
            a small software company based <KeepTogether>in Illinois.</KeepTogether>
          </p>
          <p>
            We build our own software products and try out <KeepTogether>new ideas.</KeepTogether>{' '}
            That includes apps that simplify <KeepTogether>everyday tasks</KeepTogether> and
            experiments in how people interact <KeepTogether>with software.</KeepTogether>
          </p>
          <div className="office-contact">
            <p>
              Questions, thoughts, or a <KeepTogether>simple hello:</KeepTogether>
            </p>
            <Email />
          </div>
        </section>
      </div>
      <section className="office-notes" aria-labelledby="notes-title">
        <h2 id="notes-title">
          What we make <KeepTogether>room for.</KeepTogether>
        </h2>
        <dl>
          <div>
            <dt>
              Apps and <KeepTogether>everyday tools</KeepTogether>
            </dt>
            <dd>
              Software that helps people organize information, follow a process, or get an everyday
              task out of <KeepTogether>the way.</KeepTogether>
            </dd>
          </div>
          <div>
            <dt>Working ideas</dt>
            <dd>
              Prototypes we can test before deciding what <KeepTogether>to build.</KeepTogether>
            </dd>
          </div>
          <div>
            <dt>Interaction experiments</dt>
            <dd>
              Testing how software responds to clicks, taps,{' '}
              <KeepTogether>and movement.</KeepTogether>
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
