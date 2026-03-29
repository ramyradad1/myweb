import { Metadata } from 'next';
import styles from '../page.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Technify collects, uses, and protects your data. Read our privacy policy to understand your rights and our commitments.',
  alternates: {
    canonical: 'https://technify.space/privacy',
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Last updated: March 24, 2026</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Technify. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. The Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul>
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Cookies and Web Beacons</h2>
          <p>
            Like any other website, Technify uses &apos;cookies&apos;. These cookies are used to store information including 
            visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information 
            is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. 
            Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>
          <ul>
            <li><strong>Google AdSense:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Third Party Privacy Policies</h2>
          <p>
            Technify&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult 
            the respective Privacy Policies of these third-party ad servers for more detailed information. It may include 
            their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. To know more detailed information 
            about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. GDPR Data Protection Rights</h2>
          <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul>
            <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Children&apos;s Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. 
            We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            Technify does not knowingly collect any Personal Identifiable Information from children under the age of 13. 
            If you think that your child provided this kind of information on our website, we strongly encourage you to 
            contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Contact Us</h2>
          <p>If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:privacy@technify.space">privacy@technify.space</a>.</p>
        </section>
      </div>
    </div>
  );
}
