import { Metadata } from 'next';
import styles from '../page.module.css';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Technify team for inquiries, partnerships, or feedback.',
  alternates: {
    canonical: 'https://technify.space/contact',
  }
};

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>We&apos;d love to hear from you</p>
      </header>

      <div className={styles.content}>
        <div className={styles.contactContainer}>
          
          <section className={`${styles.section} ${styles.contactSection}`}>
            <h2>General Inquiries</h2>
            <p>For general questions, feedback, or comments about our articles, please email:</p>
            <a href="mailto:info@technify.space" className={styles.contactEmail}>info@technify.space</a>
          </section>

          <section className={`${styles.section} ${styles.contactSection}`}>
            <h2>Editorial Team</h2>
            <p>Have a tip, pitch, or correction? Reach out to our editorial desk:</p>
            <a href="mailto:tips@technify.space" className={styles.contactEmail}>tips@technify.space</a>
          </section>

          <section className={`${styles.section} ${styles.contactSection}`}>
            <h2>Partnerships & Advertising</h2>
            <p>Interested in partnering with Technify or advertising on our platform?</p>
            <a href="mailto:partners@technify.space" className={styles.contactEmail}>partners@technify.space</a>
          </section>
          
          <section className={`${styles.section} ${styles.contactOffice}`}>
            <h3>Office Location</h3>
            <p>Technify Media</p>
            <p>123 Tech Boulevard, Suite 400</p>
            <p>San Francisco, CA 94105</p>
            <p>United States</p>
          </section>

        </div>
      </div>
    </div>
  );
}
