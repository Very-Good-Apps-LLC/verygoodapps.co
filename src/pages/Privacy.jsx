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
        <p>This website does not display advertising.</p>
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
        <h2>Optional analytics</h2>
        <p>
          If you accept analytics, we use Google Analytics to understand how many people visit,
          which pages they view, and which sites bring them here. Google processes information such
          as page visits, time spent on the site, browser and device details, approximate location,
          and cookie identifiers.
        </p>
        <p>
          Google Analytics loads only after you accept. Declining does not affect the site. We do
          not use this data for personalized advertising or send your drawings, office interactions,
          name, or email address to Google Analytics.
        </p>
        <p>
          We remember your choice in this browser for up to 180 days. Analytics cookies also expire
          after up to 180 days. You can change your choice using the Analytics settings button at
          the bottom of any page. Declining stops further analytics collection and removes this
          site’s analytics cookies; it does not delete data already received by Google.
        </p>
        <p>
          Learn more about{' '}
          <a href="https://policies.google.com/technologies/partner-sites">
            how Google uses information from sites that use its services
          </a>{' '}
          and read <a href="https://policies.google.com/privacy">Google’s Privacy Policy</a>.
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
