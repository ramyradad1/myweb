import { Metadata } from 'next';
import styles from '../page.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for Technify. These terms govern your use of our website, content, and services.',
  alternates: {
    canonical: 'https://technify.space/terms',
  }
};

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.subtitle}>Last updated: March 24, 2026</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using Technify (the &quot;Site&quot;), you agree to be bound by these Terms of Service. 
            If you disagree with any part of these terms, you may not access the Site. These terms apply to all visitors, 
            users, and others who access or use the Site.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, Technify and/or its licensors own the intellectual property rights for all material on Technify. 
            All intellectual property rights are reserved. You may access this from Technify for your own personal use subjected 
            to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Technify</li>
            <li>Sell, rent, or sub-license material from Technify</li>
            <li>Reproduce, duplicate, or copy material from Technify</li>
            <li>Redistribute content from Technify</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Artificial Intelligence Disclaimer</h2>
          <p>
            Technify utilizes artificial intelligence (AI) systems to assist in the curation, summarization, and generation of 
            content. While we strive for accuracy, the information provided is for general informational purposes only. We make no 
            representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, 
            or availability with respect to the website or the information, products, services, or related graphics contained on the website.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. User Comments and Content</h2>
          <p>
            Parts of this website may offer an opportunity for users to post and exchange opinions and information. Technify does not 
            filter, edit, publish, or review Comments prior to their presence on the website. Comments do not reflect the views and opinions 
            of Technify, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Hyperlinking to our Content</h2>
          <p>The following organizations may link to our Website without prior written approval:</p>
          <ul>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses;</li>
            <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Content Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against 
            all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, 
            obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Reservation of Rights</h2>
          <p>
            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately 
            remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it&apos;s linking 
            policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Limitations of Liability</h2>
          <p>
            In no event shall Technify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any 
            indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, 
            goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Site; 
            (ii) any conduct or content of any third party on the Site; (iii) any content obtained from the Site; and (iv) unauthorized 
            access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) 
            or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict 
            of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@technify.space">legal@technify.space</a>.</p>
        </section>
      </div>
    </div>
  );
}
