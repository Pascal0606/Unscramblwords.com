import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`Privacy Policy - UnscramblWords`}</title>
        <meta name="description" content="Privacy Policy and terms of data usage for UnscramblWords" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link to="/" className="text-primary hover:underline mb-4 inline-block font-medium">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: June 24, 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-base leading-relaxed">
            Welcome to UnscramblWords. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Information Collection</h2>
          <p className="text-base leading-relaxed">
            We may collect information about you in a variety of ways. The information we may collect via the Site includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Cookies</h2>
          <p className="text-base leading-relaxed">
            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Google AdSense</h2>
          <p className="text-base leading-relaxed">
            We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Data Usage</h2>
          <p className="text-base leading-relaxed">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Information Sharing</h2>
          <p className="text-base leading-relaxed">
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Data Retention</h2>
          <p className="text-base leading-relaxed">
            We will only retain your personal information for as long as necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. GDPR Rights</h2>
          <p className="text-base leading-relaxed">
            If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Security</h2>
          <p className="text-base leading-relaxed">
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Policy Changes</h2>
          <p className="text-base leading-relaxed">
            We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
          </p>
        </section>

        <section className="space-y-4 bg-muted p-8 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">11. Contact Information</h2>
          <p className="text-base">
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-4">
            <a href="mailto:privacy@unscramblwords.com" className="text-primary font-medium hover:underline">
              privacy@unscramblwords.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;