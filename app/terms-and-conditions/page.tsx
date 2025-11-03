'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import './terms.css';

export default function TermsAndConditionsPage() {

  return (
    <div className="page-background" style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Back Button */}
      <Link 
        href="/" 
        style={{
          position: 'absolute',
          top: '90px',
          left: '45px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333333',
          fontFamily: "'Madimi One', cursive",
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          zIndex: 20
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      {/* Main Content */}
      <div className="main-content">
        <div className="terms-container">
          <h1 className="terms-title">Terms and Conditions</h1>
          <p className="last-updated">Last updated: 31st October 2025</p>

          <div className="terms-content">
            <section className="terms-section">
              <h2>1. Introduction</h2>
              <p><strong>1.1</strong> These terms and conditions ("Terms") apply to the subscription taken and purchases made by an educational establishment or parents/legal guardians on behalf of student(s) ("student") (together "Subscriber/you") for access to learning materials on a subscription or one-time purchase basis ("Services") provided by Stream Learning Limited (company no: 15453227) trading as "Examrizz" or "Examrizzsearch") registered in England and Wales with registered address at 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ ("Supplier/we/us/our").</p>
              <p><strong>1.2</strong> By signing up to access the Services, you agree to be bound by these Terms.</p>
            </section>

            <section className="terms-section">
              <h2>2. Responsibility for Students</h2>
              <p><strong>2.1</strong> Subscriptions and one-off purchases should only be purchased by persons agreed 18 years old and over and the Services are intended for use by students under the supervision and account of their educational establishment or parents/legal guardians.</p>
              <p><strong>2.2</strong> Whilst the Supplier shall make reasonable efforts to provide guidance on the age appropriateness of the content and Services and to issue relevant warnings regarding any potentially sensitive themes or content, it remains the sole responsibility of the educational establishment or parents/legal guardian to determine the suitability of such content for students. Educational establishments and parents/legal guardians should review all content and Services provided to ensure they are suitable for the specific needs, age and sensitivities of their students and to guide and monitor students accordingly.</p>
              <p><strong>2.3</strong> By subscribing or purchasing on behalf of its students, educational establishments are responsible for ensuring that its students comply with these Terms at all times and shall be liable for any breaches of these Terms by its students.</p>
              <p><strong>2.4</strong> By subscribing or purchasing on behalf of a student, parents/legal guardians confirm that they are over 18 years old, hold parental responsibility for or are the legal guardians of the student and shall be responsible for ensuring the student complies with these Terms at all times. Parents/legal guardians are liable for any breaches of these Terms by the student.</p>
            </section>

            <section className="terms-section">
              <h2>3. Subscription / Purchase and Payment</h2>
              <p><strong>3.1</strong> The Services provide access to the Supplier's non-live learning materials on an annual subscription, monthly subscription, or one-time payment basis (or as otherwise agreed with you) either via the Supplier's website or via another agreed digital method.</p>
              <p><strong>3.2</strong> The Subscription or purchase fee is as confirmed by the Supplier to the Subscriber and payable annually, monthly, or one time in advance by card payment, direct debit or such other payment method agreed between the parties. The Supplier reserves the right to amend the fee payable for the Subscription on not less than 2 weeks' notice to the Subscriber.</p>
              <p><strong>3.3</strong> In the case of multiple students (such as within an educational establishment), you must notify us promptly of any increase or decrease in the amount of students utilising the Services, so that we can accurately invoice you. Failure to notify us of changes in student numbers, resulting in unreported increases, will constitute misuse of your group subscription. In which case, we reserve the right to retrospectively charge for additional students, adjust future invoices, or terminate the Services for breach of these Terms.</p>
              <p><strong>3.4</strong> If we're unable to collect any payment you owe us, we may charge interest on the overdue amount at the rate of 4% a year above the Bank of England base rate from time to time. This interest accrues on a daily basis from the due date until the date of actual payment of the overdue amount, whether before or after judgment. You pay us the interest together with any overdue amount.</p>
            </section>

            <section className="terms-section">
              <h2>4. Cancellation of Subscription</h2>
              <p><strong>4.1</strong> Unless otherwise agreed with you, the Subscription shall automatically renew each year or month unless the Subscriber provides not less than 10 days' notice by contacting the Supplier using the details set out in clause 14 in order to cancel the Subscription at the end of the current subscription year or month.</p>
              <p><strong>4.2</strong> No refunds will be provided for partial years or months of service. No refunds will be provided for one-time purchases.</p>
            </section>

            <section className="terms-section">
              <h2>5. Access and Use of the Services</h2>
              <p><strong>5.1</strong> We will provide the Services with reasonable skill and care and make the Services available to the Subscriber subject to these Terms.</p>
              <p><strong>5.2</strong> Access to the Services is granted exclusively for the use of the Subscriber and its authorised users as agreed with the Supplier. Subscribers agree not to share login details with any third party (who is not a student or an authorised user) or otherwise allow access to the Services by persons other than the Subscriber (and its authorised users).</p>
              <p><strong>5.3</strong> It is the Subscriber's sole responsibility to ensure that any IT set up, including but not limited to a stable internet connection and any necessary specification of hardware and/or software is fit for purpose and allows you to access and use the Services. If you are in any doubt about the IT set up required, please contact us. The Supplier shall have no liability in the event a Subscriber is unable to access the Services due to IT or other technical problems or any internet downtime experienced by the Subscriber.</p>
              <p><strong>5.4</strong> We can suspend supply of the Services to:</p>
              <ul>
                <li>(a) deal with technical problems or make minor technical changes;</li>
                <li>(b) update the Services to reflect changes in relevant laws and regulatory requirements; or</li>
                <li>(c) to make changes to the Services.</li>
              </ul>
              <p>We will provide you with reasonable notice that the Services will be unavailable and for how long, where reasonably practicable.</p>
              <p><strong>5.5</strong> We have the right to stop providing the Services and in the unlikely event that we do so, we may refund you any sums you have paid in advance for Services which won't be provided (applies to monthly and annual subscriptions).</p>
            </section>

            <section className="terms-section">
              <h2>6. Intellectual Property</h2>
              <p><strong>6.1</strong> All intellectual property rights in the Services and its content, including but not limited to learning materials, videos, software, text and graphics are owned by or licensed to the Supplier. You have no intellectual property rights in, or to, the Services other than the right to use them in accordance with these Terms.</p>
              <p><strong>6.2</strong> Subscribers are granted a non-exclusive, non-transferable, revocable licence to access and use the Services' content for personal, educational purposes only. Reproduction, distribution or use of the Services and its content by the Subscriber (for any commercial or non-commercial purposes) is strictly prohibited without the express prior written consent of the Supplier. Your attention is particularly drawn here to clauses 2.3 and 2.4 (as applicable).</p>
            </section>

            <section className="terms-section">
              <h2>7. Use Restrictions</h2>
              <p><strong>7.1</strong> Subscribers must not:</p>
              <ul>
                <li>(a) except as set out in these Terms, rent, lease, sub-license, loan, provide, or otherwise make available, the Services in any form, in whole or in part to any person (who is not an authorised user) without prior written consent from us;</li>
                <li>(b) use the Services for any unlawful purpose or in any way that breaches applicable laws and regulations;</li>
                <li>(c) copy, distribute, modify, or create derivative works of any content on the Services without our prior written consent;</li>
                <li>(d) transmit any material that is defamatory, offensive or otherwise objectionable in relation to your use of the Services; or</li>
                <li>(e) engage in any activity that interferes with or disrupts the Services.</li>
              </ul>
              <p>Your attention is particularly drawn to clauses 2.3 and 2.4 (as applicable).</p>
              <p><strong>7.2</strong> So far as is permissible by applicable law, the Subscriber shall defend, indemnify and hold harmless the Supplier against claims, actions, proceedings, losses, damages, expenses and costs (including without limitation court costs and reasonable legal fees) arising out of or in connection with the Subscriber's use of the Services.</p>
            </section>

            <section className="terms-section">
              <h2>8. Disclaimer of Warranties and Limitation of Liability</h2>
              <p><strong>8.1</strong> Nothing in these Terms limits any liability which cannot be legally limited.</p>
              <p><strong>8.2</strong> The Supplier provides the Services and its content on an "as is" and "as available" basis without any warranties of any kind, either express or implied.</p>
              <p><strong>8.3</strong> The Supplier does not warrant that:</p>
              <ul>
                <li>(a) the Subscriber's use of the Services will be uninterrupted or error-free; or</li>
                <li>(b) the Services will be free from vulnerabilities or viruses.</li>
              </ul>
              <p><strong>8.4</strong> The Supplier is not responsible for any delays, delivery failures, or any other loss or damage resulting from the transfer of data over communications networks and facilities, including the internet, and the Subscriber acknowledges that the Services may be subject to limitations, delays and other problems inherent in the use of such communications facilities.</p>
              <p><strong>8.5</strong> The Supplier reserves the right to make changes to the Services from time to time in its sole discretion. The Supplier makes no guarantees, representations or warranties that any particular content or training material will be included in the Services. The Supplier expressly disclaims any warranties or representations, express or implied, regarding the accuracy, completeness, reliability, suitability, or availability of any content or training materials in the Services.</p>
              <p><strong>8.6</strong> The learning materials and content provided in the Services are for general informational and educational purposes only. The Supplier does not guarantee that such materials will meet the specific needs or expectations of the Subscriber. It is the sole responsibility of the Subscriber to determine whether the content and materials available in the Services are appropriate and fit for their intended purposes. The Subscriber assumes sole responsibility for results obtained from the use of the Services and for conclusions drawn from such use.</p>
              <p><strong>8.7</strong> Subject to clause 8.1:</p>
              <ul>
                <li>(a) the Supplier's total liability to Subscribers arising in connection with the provision of the Services shall not exceed the amount of Subscription fees or one-time purchases paid by the Subscriber in the 3 months prior to the liability arising; and</li>
                <li>(b) the Supplier shall not be liable for any indirect or consequential losses suffered by the Subscriber in connection with their use of, or inability to use, the Services.</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>9. Data Protection</h2>
              <p><strong>9.1</strong> The Supplier is committed to protecting the privacy of Subscribers. Personal data will be processed in accordance with the Supplier's Privacy Policy.</p>
              <p><strong>9.2</strong> We utilise services from third-party companies, including generative artificial intelligence providers, to enhance your experience in some of the Services provided. You understand and agree that any information submitted through these features may be processed and stored by these external entities, and we cannot guarantee the security or future use of this information, nor are we liable for the actions or policies of these third parties.</p>
            </section>

            <section className="terms-section">
              <h2>10. Our rights to end the Subscription</h2>
              <p><strong>10.1</strong> We may end your rights (or suspend your rights) to use the Services if you have broken any of these Terms or if you fail to pay the Subscription fees by the due date and still fail to pay us within 14 days of us reminding you that payment is due.</p>
            </section>

            <section className="terms-section">
              <h2>11. Amendments to the Terms</h2>
              <p><strong>11.1</strong> The Supplier reserves the right to amend these Terms from time to time. Subscribers will be notified of any material changes. Continued use of the Services following such notification constitutes acceptance of the revised Terms.</p>
            </section>

            <section className="terms-section">
              <h2>12. Governing Law and Jurisdiction</h2>
              <p><strong>12.1</strong> These Terms shall be governed by and construed in accordance with the laws of England and Wales.</p>
              <p><strong>12.2</strong> Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
            </section>

            <section className="terms-section">
              <h2>13. Other Important Terms</h2>
              <p><strong>13.1</strong> We can transfer our contract with you, so that a different organisation is responsible for supplying your product. You can only transfer your contract with us to someone else if we agree to this.</p>
              <p><strong>13.2</strong> This contract is between you and us. Nobody else can enforce it and neither of us will need to ask anybody else to sign-off on ending or changing it.</p>
              <p><strong>13.3</strong> If a court or other authority decides that some of these terms are unlawful, the rest will continue to apply.</p>
              <p><strong>13.4</strong> Even if we delay in enforcing this contract, we can still enforce it later. We might not immediately chase you for not doing something (like paying) or for doing something you're not allowed to, but that doesn't mean we can't do it later.</p>
              <p><strong>13.5</strong> We're not responsible for events or delays outside of our reasonable control.</p>
            </section>

            <section className="terms-section">
              <h2>14. Contact Information</h2>
              <p>For any queries or concerns regarding the Services or these Terms, please contact us at team@examrizz.com.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}