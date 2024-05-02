import './PrivacyPolicy.css'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  return (
    <div className='text-container'>
      <div className='inner-text-container'>
        <h1>Privacy Policy</h1>

        <button>
          <Link to='/'>Go Back</Link>
        </button>

        <p>Last Updated: 2024-04-30</p>

        <h2>1. Data Collection</h2>
        <p>StorySprout collects anonymous data to measure the app’s performance and improve user experience. This data helps us understand how our app is used and how we can enhance it for our users. We collect this data through Google Analytics without creating or using user accounts.</p>

        <h2>2. Data Usage</h2>
        <p>The anonymous data collected is used solely for performance metrics and analysis. This information helps us determine user engagement and the overall functionality of the app.</p>

        <h2>3. Data Sharing</h2>
        <p>We do not share the data we collect with any third parties except for Google Analytics, as this is the platform we use to gather and analyze the collected data.</p>

        <h2>4. Consent</h2>
        <p>By using StorySprout, you consent to the collection and use of your data as described in this policy. You may withdraw consent and request that we cease using your data for tracking at any time through the mechanisms provided on your device.</p>

        <h2>5. Data Security</h2>
        <p>StorySprout employs the recommended data collection and security measures provided by Google to ensure the safety and confidentiality of your data.</p>

        <h2>6. User Rights</h2>
        <p>You may request the deletion of any data we collect at any time. If you wish to exercise this right, please use the mechanisms provided on your device or contact us directly.</p>

        <h2>7. Children’s Privacy</h2>
        <p>StorySprout does not knowingly collect or solicit data from children under the age of 13. If you believe we have inadvertently collected such information, please contact us so we can promptly obtain parental consent or remove the information.</p>

        <h2>8. International Use</h2>
        <p>Currently, StorySprout is available exclusively within the United States. We comply with all applicable laws and regulations regarding user data protection within the U.S.</p>

        <h2>9. Contact Information</h2>
        <p>For any questions or concerns regarding your privacy, please contact us via our contact form at <a href="http://verygoodapps.co">verygoodapps.co</a>.</p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We encourage you to review it regularly to stay informed about how we are protecting your data.</p>
      </div>
    </div>
  )
}

export default PrivacyPolicy