import { Email, KeepTogether } from '../components/Text';

export default function Privacy() {
  return (
    <main id="main" className="privacy" tabIndex={-1}>
      <a className="back-link" href="/">
        ← Back to the company
      </a>
      <p className="kicker">Very Good Apps LLC</p>
      <h1>Privacy.</h1>
      <p className="privacy-lead">
        This notice describes information associated with the{' '}
        <KeepTogether>Very Good Apps LLC</KeepTogether> company website and information you
        voluntarily send to us. Individual products may have their own{' '}
        <KeepTogether>privacy notices.</KeepTogether>
      </p>
      <section>
        <h2>Visiting this website</h2>
        <p>
          This website does not include advertising or{' '}
          <KeepTogether>analytics tracking.</KeepTogether>
        </p>
        <p>
          The interactive office runs in your browser. We don’t receive your drawings or record your
          interactions <KeepTogether>with it.</KeepTogether>
        </p>
        <p>
          The website is hosted on <KeepTogether>GitHub Pages.</KeepTogether> GitHub logs visitors’
          IP addresses for <KeepTogether>security purposes.</KeepTogether> See the{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
            GitHub Privacy Statement
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Information you send us</h2>
        <p>
          If you contact us, we receive <KeepTogether>your email address</KeepTogether> and any
          other information you choose <KeepTogether>to provide.</KeepTogether>
        </p>
        <p>
          We use that information to respond to <KeepTogether>your message</KeepTogether> and handle
          the matter you contacted us about. Depending on the conversation, this may include
          answering product questions, considering feedback, or conducting product and{' '}
          <KeepTogether>customer research.</KeepTogether>
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          For questions about this notice or information you have shared with us, email <Email />.
        </p>
      </section>
    </main>
  );
}
