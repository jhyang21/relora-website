import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Privacy Policy — Relora",
  description: "Relora privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteNav current="home" />
      <main className="mx-auto max-w-3xl break-words px-6 py-12 md:px-10">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Last updated March 13, 2026</p>

        <p className="mt-6 leading-7 text-[var(--color-ink)]">
          This Privacy Notice for <strong>immForm, Inc.</strong> ("we," "us," or "our") describes how and why we might
          access, collect, store, use, and/or share ("process") your personal information when you use our services
          ("Services"), including when you:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          <li>Download and use our mobile application (<strong>Relora</strong>), or any other application of ours that links to this Privacy Notice</li>
          <li>Use <strong>Relora</strong>, a mobile application that helps users capture and organize details about people, including contacts, memories, and reminders, using voice notes</li>
          <li>Engage with us in other related ways, including any marketing or events</li>
        </ul>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights
          and choices. If you do not agree with our policies and practices, please do not use our Services. If you still
          have any questions or concerns, please contact us at{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="mailto:contact@immform.com">contact@immform.com</a>.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Summary of Key Points</h2>
        <p className="mt-4 leading-7 text-[var(--color-muted)]">
          <em>This summary provides key points from our Privacy Notice. You can find more details by using the table of contents below.</em>
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-[var(--color-ink)]">
          <li><strong>What personal information do we process?</strong> We may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</li>
          <li><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</li>
          <li><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</li>
          <li><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</li>
          <li><strong>How do we keep your information safe?</strong> We have organizational and technical processes in place to protect your personal information. However, no electronic transmission over the internet can be guaranteed 100% secure.</li>
          <li><strong>What are your rights?</strong> Depending on where you are located, applicable privacy law may give you certain rights regarding your personal information.</li>
          <li><strong>How do you exercise your rights?</strong> Visit <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="http://www.reloraapp.com/request-data">reloraapp.com/request-data</a> or contact us directly.</li>
        </ul>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Table of Contents</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          {[
            ["#infocollect", "What Information Do We Collect?"],
            ["#infouse", "How Do We Process Your Information?"],
            ["#legalbases", "What Legal Bases Do We Rely On To Process Your Personal Information?"],
            ["#whoshare", "When And With Whom Do We Share Your Personal Information?"],
            ["#ai", "Do We Offer Artificial Intelligence-Based Products?"],
            ["#inforetain", "How Long Do We Keep Your Information?"],
            ["#infosafe", "How Do We Keep Your Information Safe?"],
            ["#infominors", "Do We Collect Information From Minors?"],
            ["#privacyrights", "What Are Your Privacy Rights?"],
            ["#dnt", "Controls For Do-Not-Track Features"],
            ["#uslaws", "Do United States Residents Have Specific Privacy Rights?"],
            ["#policyupdates", "Do We Make Updates To This Notice?"],
            ["#contact", "How Can You Contact Us About This Notice?"],
            ["#request", "How Can You Review, Update, Or Delete The Data We Collect From You?"],
          ].map(([href, label]) => (
            <li key={href}>
              <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href={href}>
                {label}
              </a>
            </li>
          ))}
        </ol>

        {/* Section 1 */}
        <h2 id="infocollect" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">1. What Information Do We Collect?</h2>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Personal information you disclose to us</h3>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We collect personal information that you provide to us.</em></p>
        <p className="mt-3 leading-7 text-[var(--color-ink)]">
          We collect personal information that you voluntarily provide to us when you register on the Services, express an
          interest in obtaining information about us or our products and Services, when you participate in activities on
          the Services, or otherwise when you contact us. The personal information we collect may include:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          <li>Email addresses</li>
          <li>Names</li>
          <li>Phone numbers</li>
          <li>Contact preferences</li>
          <li>Contact or authentication data</li>
          <li>Audio recordings</li>
          <li>Photos</li>
          <li>Passwords</li>
          <li>User-generated content</li>
        </ul>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>Sensitive Information.</strong> We do not process sensitive information.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>Payment Data.</strong> We may collect data necessary to process your payment, such as your payment
          instrument number and the security code associated with your payment instrument. All payment data is handled
          and stored by RevenueCat, Google, and Apple. You may find their privacy notice links here:{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="https://www.revenuecat.com/privacy/" target="_blank" rel="noreferrer">RevenueCat</a>,{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google</a>,{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="https://www.apple.com/legal/privacy/" target="_blank" rel="noreferrer">Apple</a>.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>Application Data.</strong> If you use our application(s), we also may collect the following information
          if you choose to provide us with access or permission:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-[var(--color-ink)]">
          <li><em>Mobile Device Access.</em> We may request access to certain features from your mobile device, including your device's contacts, microphone, and other features. You can change our access or permissions in your device's settings.</li>
          <li><em>Mobile Device Data.</em> We automatically collect device information (such as your mobile device ID, model, and manufacturer), operating system, version information, browser type, hardware model, Internet service provider and/or mobile carrier, and Internet Protocol (IP) address.</li>
          <li><em>Push Notifications.</em> We may request to send you push notifications regarding your account or certain features of the application(s). You may turn them off in your device's settings.</li>
        </ul>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Information automatically collected</h3>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: Some information — such as your IP address and browser and device characteristics — is collected automatically when you visit our Services.</em></p>
        <p className="mt-3 leading-7 text-[var(--color-ink)]">
          We automatically collect certain information when you visit, use, or navigate the Services. This information
          does not reveal your specific identity but may include device and usage information. The information we collect
          includes:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-[var(--color-ink)]">
          <li><em>Log and Usage Data.</em> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services.</li>
          <li><em>Device Data.</em> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services.</li>
          <li><em>Location Data.</em> We collect location data such as information about your device's location, which can be either precise or imprecise. You can opt out by refusing access or disabling Location settings on your device.</li>
        </ul>

        {/* Section 2 */}
        <h2 id="infouse" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">2. How Do We Process Your Information?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</em></p>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-[var(--color-ink)]">
          <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong></li>
          <li><strong>To deliver and facilitate delivery of services to the user.</strong></li>
          <li><strong>To respond to user inquiries/offer support to users.</strong></li>
          <li><strong>To send administrative information to you.</strong> We may send you details about our products and services, changes to our terms and policies, and other similar information.</li>
          <li><strong>To fulfill and manage your orders.</strong> We may process your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</li>
          <li><strong>To request feedback.</strong></li>
          <li><strong>To send you marketing and promotional communications</strong>, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time.</li>
          <li><strong>To protect our Services.</strong> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</li>
          <li><strong>To evaluate and improve our Services, products, marketing, and your experience.</strong></li>
          <li><strong>To identify usage trends</strong> and determine the effectiveness of our promotional campaigns.</li>
        </ul>

        {/* Section 3 */}
        <h2 id="legalbases" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">3. What Legal Bases Do We Rely On To Process Your Personal Information?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason to do so under applicable law.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>If you are located in Canada, this section applies to you.</strong>
        </p>
        <p className="mt-3 leading-7 text-[var(--color-ink)]">
          We may process your information if you have given us specific permission (express consent) to use your personal
          information for a specific purpose, or in situations where your permission can be inferred (implied consent).
          You can withdraw your consent at any time.
        </p>
        <p className="mt-3 leading-7 text-[var(--color-ink)]">
          In some exceptional cases, we may be legally permitted under applicable law to process your information without
          your consent, including for investigations and fraud detection, business transactions, legal proceedings,
          compliance with a subpoena or court order, or when information is publicly available.
        </p>

        {/* Section 4 */}
        <h2 id="whoshare" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">4. When And With Whom Do We Share Your Personal Information?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We may share information in specific situations described in this section and/or with the following categories of third parties.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>Vendors, Consultants, and Other Third-Party Service Providers.</strong> We may share your data with
          third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.
          We have contracts in place with our third parties designed to safeguard your personal information. The
          categories of third parties we may share personal information with include:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          <li>AI Platforms</li>
          <li>Data Storage Service Providers</li>
          <li>Cloud Computing Services</li>
          <li>Data Analytics Services</li>
          <li>Payment Processors</li>
          <li>User Account Registration &amp; Authentication Services</li>
          <li>Website Hosting Service Providers</li>
          <li>Performance Monitoring Tools</li>
        </ul>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during
          negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our
          business to another company.
        </p>

        {/* Section 5 */}
        <h2 id="ai" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">5. Do We Offer Artificial Intelligence-Based Products?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine
          learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your
          experience and provide innovative solutions.
        </p>
        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Use of AI Technologies</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          We provide the AI Products through third-party service providers ("AI Service Providers"), including OpenAI.
          Your input, output, and personal information will be shared with and processed by these AI Service Providers
          to enable your use of our AI Products. You must not use the AI Products in any way that violates the terms or
          policies of any AI Service Provider.
        </p>
        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Our AI Products</h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          <li>Text analysis</li>
          <li>Speech-to-text</li>
          <li>AI insights</li>
        </ul>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          All personal information processed using our AI Products is handled in line with our Privacy Notice and our
          agreement with third parties. This ensures high security and safeguards your personal information throughout
          the process.
        </p>

        {/* Section 6 */}
        <h2 id="inforetain" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">6. How Long Do We Keep Your Information?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We will only keep your personal information for as long as it is necessary for the purposes set out in this
          Privacy Notice, unless a longer retention period is required or permitted by law. No purpose in this notice
          will require us keeping your personal information for longer than the period of time in which users have an
          account with us.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          When we have no ongoing legitimate business need to process your personal information, we will either delete
          or anonymize such information, or, if not possible, securely store your personal information and isolate it
          from any further processing until deletion is possible.
        </p>

        {/* Section 7 */}
        <h2 id="infosafe" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">7. How Do We Keep Your Information Safe?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We aim to protect your personal information through a system of organizational and technical security measures.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We have implemented appropriate and reasonable technical and organizational security measures designed to
          protect the security of any personal information we process. However, despite our safeguards, no electronic
          transmission over the Internet or information storage technology can be guaranteed to be 100% secure. You
          should only access the Services within a secure environment.
        </p>

        {/* Section 8 */}
        <h2 id="infominors" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">8. Do We Collect Information From Minors?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: We do not knowingly collect data from or market to children under 18 years of age.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we
          knowingly sell such personal information. By using the Services, you represent that you are at least 18 or
          the parent or guardian of such a minor consenting to the minor's use of the Services. If we learn that
          personal information from users less than 18 years of age has been collected, we will deactivate the account
          and take reasonable measures to promptly delete such data. If you become aware of any data we may have
          collected from children under age 18, please contact us at{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="mailto:contact@immform.com">contact@immform.com</a>.
        </p>

        {/* Section 9 */}
        <h2 id="privacyrights" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">9. What Are Your Privacy Rights?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: Depending on your state of residence in the US or in some regions such as Canada, you have rights that allow you greater access to and control over your personal information.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          In some regions (like Canada), you have certain rights under applicable data protection laws, including the
          right to:
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          <li>Request access and obtain a copy of your personal information</li>
          <li>Request rectification or erasure</li>
          <li>Restrict the processing of your personal information</li>
          <li>Data portability, if applicable</li>
          <li>Not be subject to automated decision-making</li>
        </ol>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You can make such a request by contacting us using the contact details provided in the section "How Can You
          Contact Us About This Notice?" below.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Withdrawing your consent</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          If we are relying on your consent to process your personal information, you have the right to withdraw your
          consent at any time by contacting us using the contact details provided below. This will not affect the
          lawfulness of the processing before its withdrawal.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Opting out of marketing and promotional communications</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          You can unsubscribe from our marketing and promotional communications at any time by clicking on the
          unsubscribe link in the emails that we send, or by contacting us. We may still communicate with you for
          service-related purposes necessary for the administration and use of your account.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Account Information</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          If you would at any time like to review or change the information in your account or terminate your account,
          you can log in to your account settings or contact us. Upon your request to terminate your account, we will
          deactivate or delete your account and information from our active databases. We may retain some information in
          our files to prevent fraud, troubleshoot problems, enforce our legal terms, and/or comply with applicable
          legal requirements.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          If you have questions or comments about your privacy rights, you may email us at{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="mailto:contact@immform.com">contact@immform.com</a>.
        </p>

        {/* Section 10 */}
        <h2 id="dnt" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">10. Controls For Do-Not-Track Features</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can
          activate to signal your privacy preference not to have data about your online browsing activities monitored
          and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has
          been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that
          automatically communicates your choice not to be tracked online.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          California law requires us to let you know how we respond to web browser DNT signals. Because there currently
          is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at
          this time.
        </p>

        {/* Section 11 */}
        <h2 id="uslaws" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">11. Do United States Residents Have Specific Privacy Rights?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: If you are a resident of certain US states, you may have the right to request access to and receive details about the personal information we maintain about you.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky,
          Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas,
          Utah, or Virginia, you may have rights including the right to request access to, correct inaccuracies in,
          obtain a copy of, or delete your personal information.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Categories of Personal Information We Collect</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm text-[var(--color-ink)]">
            <thead>
              <tr className="border-b border-[var(--color-border-warm)] text-left">
                <th className="py-2 pr-4 font-semibold">Category</th>
                <th className="py-2 pr-4 font-semibold">Examples</th>
                <th className="py-2 font-semibold">Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-warm)]">
              {[
                ["A. Identifiers", "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name", "YES"],
                ["B. Personal information as defined in the California Customer Records statute", "Name, contact information, education, employment, employment history, and financial information", "YES"],
                ["C. Protected classification characteristics under state or federal law", "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data", "NO"],
                ["D. Commercial information", "Transaction information, purchase history, financial details, and payment information", "YES"],
                ["E. Biometric information", "Fingerprints and voiceprints", "NO"],
                ["F. Internet or other similar network activity", "Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements", "NO"],
                ["G. Geolocation data", "Device location", "YES"],
                ["H. Audio, electronic, sensory, or similar information", "Images and audio, video or call recordings created in connection with our business activities", "YES"],
                ["I. Professional or employment-related information", "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us", "NO"],
                ["J. Education Information", "Student records and directory information", "NO"],
                ["K. Inferences drawn from collected personal information", "Inferences drawn from any of the collected personal information listed above to create a profile or summary about an individual's preferences and characteristics", "YES"],
                ["L. Sensitive personal information", "", "NO"],
              ].map(([cat, ex, col]) => (
                <tr key={cat}>
                  <td className="py-2 pr-4 align-top font-medium">{cat}</td>
                  <td className="py-2 pr-4 align-top text-[var(--color-muted)]">{ex}</td>
                  <td className="py-2 align-top font-semibold">{col}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Your Rights</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-[var(--color-ink)]">
          <li><strong>Right to know</strong> whether or not we are processing your personal data</li>
          <li><strong>Right to access</strong> your personal data</li>
          <li><strong>Right to correct</strong> inaccuracies in your personal data</li>
          <li><strong>Right to request</strong> the deletion of your personal data</li>
          <li><strong>Right to obtain a copy</strong> of the personal data you previously shared with us</li>
          <li><strong>Right to non-discrimination</strong> for exercising your rights</li>
          <li><strong>Right to opt out</strong> of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling</li>
        </ul>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">How to Exercise Your Rights</h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          <li>By visiting <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="http://www.reloraapp.com/request-data">reloraapp.com/request-data</a></li>
          <li>By emailing us at <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="mailto:contact@immform.com">contact@immform.com</a></li>
          <li>By mailing to <strong>1111B S Governors Ave # 3511, Dover, DE 19904</strong></li>
        </ul>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">California "Shine The Light" Law</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          California Civil Code Section 1798.83 permits our users who are California residents to request and obtain
          from us, once a year and free of charge, information about categories of personal information we disclosed to
          third parties for direct marketing purposes. To make such a request, please submit it in writing using the
          contact details below.
        </p>

        {/* Section 12 */}
        <h2 id="policyupdates" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">12. Do We Make Updates To This Notice?</h2>
        <p className="mt-2 leading-7 text-[var(--color-muted)]"><em>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em></p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We may update this Privacy Notice from time to time. The updated version will be indicated by an updated
          "Revised" date at the top of this Privacy Notice. If we make material changes, we may notify you either by
          prominently posting a notice of such changes or by directly sending you a notification. We encourage you to
          review this Privacy Notice frequently.
        </p>

        {/* Section 13 */}
        <h2 id="contact" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">13. How Can You Contact Us About This Notice?</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          If you have questions or comments about this notice, you may email us at{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="mailto:contact@immform.com">contact@immform.com</a>{" "}
          or contact us by post at:
        </p>
        <address className="mt-3 not-italic leading-7 text-[var(--color-ink)]">
          <strong>immForm, Inc.</strong><br />
          1111B South Governors Ave.<br />
          STE 3511<br />
          Dover, DE 19904<br />
          United States
        </address>

        {/* Section 14 */}
        <h2 id="request" className="mt-10 font-serif text-2xl text-[var(--color-ink)]">14. How Can You Review, Update, Or Delete The Data We Collect From You?</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You have the right to request access to the personal information we collect from you, details about how we
          have processed it, correct inaccuracies, or delete your personal information. To request to review, update,
          or delete your personal information, please visit:{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="http://www.reloraapp.com/request-data">reloraapp.com/request-data</a>.
        </p>

        <div className="mt-16 border-t border-[var(--color-border-warm)] pt-8 text-sm text-[var(--color-muted)]">
          &copy; {new Date().getFullYear()} immForm, Inc. All rights reserved.
        </div>
      </main>
    </div>
  );
}
