import type { Metadata } from "next";
import type { JSX } from "react";
import { SiteNav } from "@/components/SiteNav";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description: "Relora terms of use. Read the terms and conditions for using Relora.",
  path: "/terms",
});

export default function TermsPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <SiteNav current="home" />
      <main className="mx-auto max-w-3xl break-words px-6 py-12 md:px-10">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Terms of Use</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Last updated March 13, 2026</p>

        <p className="mt-6 leading-7 text-[var(--color-ink)]">
          The Relora site and the mobile applications and services available in connection with this site and mobile
          application ("Relora" or the "App") are made available to you by <strong>immForm, Inc.</strong> ("immForm",
          "We", "Us", or "Our") subject to these Terms of Service, including those set forth in the Privacy Policy (the
          "Terms"). By accessing, using, or downloading any materials from the App, you agree to follow and be bound by
          the Terms, which may be updated by us from time to time without notice to you.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We and third-party providers may make improvements and/or changes in the products, services, mobile
          applications, features, programs, and prices described in this App at any time without notice. The App is not
          intended for and is not designed to attract children under 18 years of age. If you do not agree with the
          Terms, please do not use this App. <strong>BY CONTINUING TO USE THE APP, YOU ARE INDICATING YOUR AGREEMENT TO
          THE TERMS AND ALL REVISIONS THEREOF.</strong>
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently,
          the App or any portion thereof with or without notice. You agree that we shall not be liable to you or to any
          third party for any modification, suspension, or discontinuance of the App or any portion thereof.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Account Registration</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          Some functionality requires you to complete an account registration form. You agree that we may use your User
          Data to provide services on the App, and you represent that you are of legal age to form a binding contract
          and are not a person barred from receiving services under the laws of any applicable jurisdiction. We have the
          right to suspend or terminate your account and refuse any and all current or future use of the App at any
          time.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">User Conduct</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You are solely responsible for maintaining the confidentiality of the password associated with your account
          and for restricting access to your password and to your computer and/or mobile device while logged into the
          App. You accept responsibility for all activities that occur under your account or from your computer and/or
          mobile device.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You agree not to use the App to: (a) upload, post, or otherwise make available any Content that is unlawful,
          harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's
          privacy, hateful, or racially, ethnically, or otherwise objectionable; (b) harm minors in any way; (c)
          impersonate any person or entity; (d) make available any Content that infringes any patent, trademark, trade
          secret, copyright, or other proprietary rights of any party; (e) upload unsolicited or unauthorized
          advertising, promotional materials, "spam," or any other form of solicitation; (f) upload material that
          contains software viruses or any other computer code designed to interrupt, destroy, or limit the
          functionality of any computer software or hardware; (g) interfere with or disrupt the App or servers or
          networks connected to the App; and/or (h) intentionally or unintentionally violate any applicable local,
          state, national, or international law.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You specifically agree not to access the App or the Content through any automated means (including the use of
          any script, web crawler, robot, spider, or scraper), and that you will not forge or manipulate identifiers in
          order to disguise the origin of any access to the App.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          The App is for your personal and noncommercial use. You may not modify, copy, distribute, transmit, display,
          perform, reproduce, publish, license, create derivative works from, transfer, or sell for any commercial
          purposes any portion of the App, use of the App, or access to the App.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Electronic Communications</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          The App may provide you with the ability to send emails or other communications to third-party service
          providers, advertisers, other users, and/or us. You agree to use communication methods available on the App
          only to send communications and materials related to the subject matter for which we provided the
          communication method, and you further agree that all such communications by you shall be deemed your Content
          and shall be subject to and governed by the Terms.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You agree that all notices, disclosures, and other communications that we provide to you electronically shall
          satisfy any legal requirement that such communications be in writing.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Proprietary Rights</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You acknowledge and agree that the App and any necessary software used in connection with the App contain
          proprietary and confidential information that is protected by applicable intellectual property and other laws.
          Except as expressly permitted by applicable law or authorized by us, you agree not to modify, rent, lease,
          loan, sell, distribute, or create derivative works based on the App, the software, or Content available on
          the App.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We grant you a personal, non-transferable, and non-exclusive right and license to access and use the App,
          provided that you do not copy, modify, create a derivative work from, reverse engineer, reverse assemble, or
          otherwise attempt to discover any source code, sell, assign, sublicense, or otherwise transfer any right in
          the App.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          The term immForm; the immForm logo; and other immForm, Inc. logos and product and service names are the
          exclusive trademarks of immForm, Inc., and you may not use or display such trademarks in any manner without
          our prior written permission. We reserve all rights not expressly granted hereunder.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Disclaimer of Warranties and Liability</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES, AND CONTENT AVAILABLE IN THE APP ARE PROVIDED TO YOU "AS IS"
          AND WITHOUT WARRANTY. IMMFORM, INC. AND ITS SUBSIDIARIES, AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, PARTNERS,
          AND LICENSORS HEREBY DISCLAIM ALL WARRANTIES WITH REGARD TO SUCH INFORMATION, SOFTWARE, PRODUCTS, SERVICES,
          AND CONTENT, INCLUDING, WITHOUT LIMITATION, ALL IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          YOU EXPRESSLY AGREE TO RELEASE IMMFORM, INC., ITS SUBSIDIARIES, AFFILIATES, OFFICERS, AGENTS,
          REPRESENTATIVES, EMPLOYEES, PARTNERS, AND LICENSORS (THE "RELEASED PARTIES") FROM ANY AND ALL LIABILITY
          CONNECTED WITH YOUR ACTIVITIES, AND PROMISE NOT TO SUE THE RELEASED PARTIES FOR ANY CLAIMS, ACTIONS,
          INJURIES, DAMAGES, OR LOSSES ASSOCIATED WITH YOUR ACTIVITIES. IN NO EVENT SHALL THE RELEASED PARTIES BE
          LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL
          DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH YOUR USE OR MISUSE OF THE APP.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Indemnity</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You agree to indemnify and hold us and our subsidiaries, affiliates, officers, agents, representatives,
          employees, partners, and licensors harmless from any claim or demand, including reasonable attorneys' fees,
          made by any third party due to or arising out of Content you submit, post, transmit, or otherwise seek to
          make available through the App, your use of the App, your connection to the App, your violation of the Terms,
          or your violation of any rights of another person or entity.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Termination</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You agree that we may, under certain circumstances and without prior notice, immediately terminate your
          account and/or access to the App. Cause for such termination shall include, but not be limited to: (a)
          breaches or violations of the Terms; (b) requests by law enforcement or other government agencies; (c) a
          request by you (self-initiated account deletions); (d) discontinuance or material modification to the App;
          (e) unexpected technical or security issues or problems; (f) extended periods of inactivity; and/or (g)
          nonpayment of any fees owed by you. All terminations for cause shall be made in our sole discretion and we
          shall not be liable to you or any third party for any termination of your account or access to the App.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Applicable Laws</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          This App is controlled by immForm, Inc. from its offices within the United States of America. Any action
          related to the App, the Content, or the Terms shall be governed by Delaware law and controlling U.S. federal
          law, without regard to conflicts of laws thereof. You hereby consent and submit to the exclusive jurisdiction
          and venue in the state and federal courts sitting in Delaware for any legal proceedings related to the App or
          the Terms.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          Except to the extent prohibited by applicable law, the parties agree that any claim or cause of action
          arising out of or related to the use of the App or the Terms must be filed within one (1) year after such
          claim or cause of action arose or be forever barred.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Licensed Application End User License Agreement</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          Apps made available through the App Store are licensed, not sold, to you. Your license to each App is subject
          to your prior acceptance of either this Licensed Application End User License Agreement ("Standard EULA"), or
          a custom end user license agreement between you and the Application Provider ("Custom EULA"), if one is
          provided.
        </p>
        <div className="mt-4 space-y-4 leading-7 text-[var(--color-ink)]">
          <p><strong>a. Scope of License:</strong> Licensor grants to you a nontransferable license to use the Licensed Application on any Apple-branded products that you own or control and as permitted by the Usage Rules. You may not distribute or make the Licensed Application available over a network where it could be used by multiple devices at the same time.</p>
          <p><strong>b. Consent to Use of Data:</strong> You agree that Licensor may collect and use technical data and related information to facilitate the provision of software updates, product support, and other services related to the Licensed Application.</p>
          <p><strong>c. Termination.</strong> This Standard EULA is effective until terminated by you or Licensor. Your rights under this Standard EULA will terminate automatically if you fail to comply with any of its terms.</p>
          <p><strong>d. External Services.</strong> The Licensed Application may enable access to Licensor's and/or third-party services and websites. You agree to use the External Services at your sole risk. Licensor is not responsible for examining or evaluating the content or accuracy of any third-party External Services.</p>
          <p><strong>e. NO WARRANTY:</strong> YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSED APPLICATION IS AT YOUR SOLE RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND.</p>
          <p><strong>f. Limitation of Liability.</strong> TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR PERSONAL INJURY OR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES. In no event shall Licensor's total liability to you for all damages exceed the amount of fifty dollars ($50.00).</p>
          <p><strong>g.</strong> You may not use or otherwise export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained.</p>
        </div>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">Subscription Payments, Renewals, and Cancellations</h2>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Month to month</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          Your subscription begins as soon as you have signed up for the subscribed services and your initial payment
          is processed. Your subscription will automatically renew each month without notice until you cancel. We will
          automatically charge you the applicable rate for your plan, plus applicable taxes, every month upon renewal
          until you cancel. The payment method provided will automatically be charged unless you cancel 48 hours in
          advance.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          We may change the subscription price each monthly renewal term and will notify you in the event of an
          increase and give you the option to cancel. If your primary payment method fails, you authorize us to charge
          any other payment method in your account.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Free Trials</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          We reserve the right to modify or terminate free trial offers at any time and for any reason. At the
          conclusion of the free trial period, you will automatically be charged the then-current subscription price
          unless you cancel 48 hours in advance.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">For European Economic Area customers</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          Your bank may require you to authenticate your initial purchase using a password, a one-time code, or
          biometric recognition. European Economic Area customers have a right to a fourteen (14) day right of
          withdrawal or "cooling-off period" from the initial date when Subscription services have been delivered. This
          right may only be used once, at the first purchase engagement with immForm.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Cancellation Terms</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          You can cancel your Paid Subscription at any time and will continue to have access to the Service through the
          end of the billing period. To the extent permitted by applicable law, payments are non-refundable and we do
          not provide refunds or credits for any partial Paid Subscription periods or unused Services.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]"><strong>For Apple App Store Subscriptions:</strong></p>
        <ol className="mt-2 list-decimal space-y-1 pl-6 leading-7 text-[var(--color-ink)]">
          <li>Launch the Settings app on your iPhone or iPad</li>
          <li>Tap your name</li>
          <li>Tap on Subscriptions and choose the App</li>
          <li>Tap on "Cancel Subscription"</li>
        </ol>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          <strong>For purchases made via our web payment system:</strong> Contact our customer support at{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="mailto:contact@immform.com">contact@immform.com</a>.
          Please note that uninstalling the app does not automatically cancel your Subscription.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Refunds for Apple (App Store) Purchases</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          When you purchase an app from the App Store, only Apple has access to the purchase information associated
          with your Apple ID. As a result, we cannot issue refunds ourselves. You need to request a refund from Apple.
          Whether or not a refund will be given is entirely Apple's decision.
        </p>

        <h3 className="mt-6 text-base font-semibold text-[var(--color-ink)]">Refunds for purchases made via our web payment system</h3>
        <p className="mt-2 leading-7 text-[var(--color-ink)]">
          To request a refund, you must reach out to customer support at{" "}
          <a className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="mailto:contact@immform.com">contact@immform.com</a>.
          immForm does not provide any partial or full refunds once the Subscription period has started, except as
          otherwise specified in the Agreement or under special circumstances at immForm's sole discretion.
        </p>

        <h2 className="mt-10 font-serif text-2xl text-[var(--color-ink)]">General</h2>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          You agree that no joint venture, partnership, employment, or agency relationship exists between you and
          immForm, Inc. as a result of the Terms or your use of the App. The Terms constitute the entire agreement
          between you and immForm, Inc. with respect to your use of the App. The failure of us to exercise or enforce
          any right or provision of the Terms shall not constitute a waiver of such right or provision.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          If any provision of the Terms is found by a court of competent jurisdiction to be invalid, the parties
          nevertheless agree that the court should endeavor to give effect to the parties' intentions as reflected in
          the provision, and the other provisions of the Terms remain in full force and effect. You may not assign,
          delegate, or otherwise transfer your account or your obligations under these Terms without the prior written
          consent of us.
        </p>
        <p className="mt-4 leading-7 text-[var(--color-ink)]">
          Our notice to you via email, regular mail, or notices or links on the App shall constitute acceptable notice
          to you under the Terms. Any rights not expressly granted herein are reserved.
        </p>

        <div className="mt-16 border-t border-[var(--color-border-warm)] pt-8 text-sm text-[var(--color-muted)]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>&copy; {new Date().getFullYear()} immForm, Inc. All rights reserved.</span>
            <span aria-hidden="true">&middot;</span>
            <a className="inline-flex min-h-11 items-center text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]" href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </main>
    </div>
  );
}
