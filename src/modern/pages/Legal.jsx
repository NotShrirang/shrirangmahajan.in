import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Legal.module.css";
import { readConsent, resetConsent } from "../lib/consent";

/* Bump this whenever the substance of any policy below changes. */
export const LAST_UPDATED = "17 September 2026";

const OPERATOR = {
  name: "Shrirang Mahajan",
  role: "Individual (sole operator — this is a personal site, not a company)",
  place: "Pune, Maharashtra, India",
  email: "shrirangmahajan123@gmail.com",
  site: "https://www.shrirangmahajan.in",
  host: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
};

function Mail() {
  return (
    <a className={styles.link} href={`mailto:${OPERATOR.email}`}>
      {OPERATOR.email}
    </a>
  );
}

function CookieSettingsButton() {
  const decided = typeof window !== "undefined" ? readConsent() : null;
  return (
    <button
      type="button"
      className={styles.inlineBtn}
      onClick={() => {
        resetConsent();
        window.dispatchEvent(new CustomEvent("sm:consent-reopen"));
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }}
    >
      {decided?.analytics
        ? "Withdraw my analytics consent"
        : "Change my cookie choice"}
    </button>
  );
}

/* ─────────────────────────── shared blocks ─────────────────────────── */

function OperatorTable() {
  return (
    <dl className={styles.defs}>
      <div className={styles.defRow}>
        <dt>Site operator</dt>
        <dd>{OPERATOR.name}</dd>
      </div>
      <div className={styles.defRow}>
        <dt>Status</dt>
        <dd>{OPERATOR.role}</dd>
      </div>
      <div className={styles.defRow}>
        <dt>Location</dt>
        <dd>{OPERATOR.place}</dd>
      </div>
      <div className={styles.defRow}>
        <dt>Contact</dt>
        <dd>
          <Mail />
        </dd>
      </div>
      <div className={styles.defRow}>
        <dt>Website</dt>
        <dd>{OPERATOR.site}</dd>
      </div>
      <div className={styles.defRow}>
        <dt>Hosting</dt>
        <dd>{OPERATOR.host}</dd>
      </div>
    </dl>
  );
}

/* ─────────────────────────── privacy ─────────────────────────── */

function Privacy() {
  return (
    <>
      <p className={styles.lede}>
        This is a personal portfolio. It sells nothing, has no accounts, and
        runs no advertising. The short version: the only personal data I ever
        receive is what you deliberately type into the contact form or the
        site assistant. Everything else is anonymous, aggregate, or optional.
      </p>

      <h2>Who is responsible for your data</h2>
      <OperatorTable />
      <p>
        I am the data controller (under the UK/EU GDPR) and the data fiduciary
        (under India's Digital Personal Data Protection Act, 2023) for this
        site. There is no company behind it and no DPO — write to me directly
        at <Mail /> and I will answer personally.
      </p>

      <h2>What I collect, and why</h2>

      <h3>1. The contact form</h3>
      <p>
        If you send me a message, I receive your <strong>name</strong>,{" "}
        <strong>email address</strong> and the{" "}
        <strong>message you wrote</strong>. That is all three fields the form
        has — there are no hidden ones. I need the email to reply, and the
        name so I know who I am replying to.
      </p>
      <ul>
        <li>
          <strong>Legal basis:</strong> your consent, given by ticking the box
          on the form (GDPR Art. 6(1)(a)); consent under DPDP s. 6.
        </li>
        <li>
          <strong>Processor:</strong> the form is delivered by{" "}
          <a
            className={styles.link}
            href="https://formspree.io/legal/privacy-policy/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Formspree, Inc.
          </a>{" "}
          (United States), which forwards it to my email inbox (Google
          Workspace / Gmail).
        </li>
        <li>
          <strong>Retention:</strong> messages stay in my mailbox while the
          conversation is live and for up to <strong>24 months</strong> after
          the last reply, then they get deleted. Ask me sooner and I will
          delete immediately.
        </li>
      </ul>

      <h3>2. The site assistant (the "Ask" chat)</h3>
      <p>
        The chat on the home page sends{" "}
        <strong>whatever you type into it</strong>, plus a fixed description of
        my own projects and experience, to{" "}
        <a
          className={styles.link}
          href="https://groq.com/privacy-policy/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Groq, Inc.
        </a>{" "}
        (United States) for inference. Your conversation is also kept in your
        browser's <code>sessionStorage</code> so it survives page navigation;
        closing the tab erases it.
      </p>
      <ul>
        <li>
          <strong>Legal basis:</strong> your consent, given by choosing to type
          into an optional chat box.
        </li>
        <li>
          <strong>Please don't</strong> type anything sensitive, confidential
          or personal into it. I have no need for it, and I can neither see nor
          delete what a third-party model provider logs.
        </li>
        <li>
          <strong>Retention:</strong> I do not store or receive a copy of these
          conversations. Groq's retention is governed by its own policy.
        </li>
      </ul>

      <h3>3. Analytics</h3>
      <p>
        <strong>Google Analytics</strong> runs <em>only</em> if you accept it
        in the cookie banner. Nothing Google-owned is loaded before that. When
        enabled, it is configured with IP anonymisation on and Google Signals
        and ad-personalisation off, so it is used for audience measurement and
        nothing else. Legal basis: consent (GDPR Art. 6(1)(a); ePrivacy Art.
        5(3)). See the{" "}
        <Link className={styles.link} to="/cookies">
          cookie policy
        </Link>
        .
      </p>
      <p>
        <strong>Vercel Web Analytics and Speed Insights</strong> run on every
        visit. They are cookieless and store no identifier on your device: they
        record a page path, referrer, country, and coarse device/browser type,
        and derive a rotating, non-reversible hash for visit counting. I cannot
        identify you from them. Legal basis: my legitimate interest in knowing
        whether the site works and which pages are read (GDPR Art. 6(1)(f)).
        Object at any time by writing to me.
      </p>

      <h3>4. Server logs</h3>
      <p>
        My host, Vercel, records standard request logs (IP address, timestamp,
        URL, user agent) for security and abuse prevention. This is Vercel's
        processing under its{" "}
        <a
          className={styles.link}
          href="https://vercel.com/legal/privacy-policy"
          target="_blank"
          rel="noreferrer noopener"
        >
          privacy policy
        </a>
        ; I do not have access to raw logs and do not use them.
      </p>

      <h3>What I never collect</h3>
      <ul>
        <li>No accounts, passwords, or payment details — none exist here.</li>
        <li>No advertising or cross-site tracking pixels. No data is sold.</li>
        <li>
          No special-category data (health, religion, politics, biometrics) is
          asked for, and please don't volunteer any.
        </li>
        <li>
          The <strong>TinyGPT demo</strong> downloads a model file and runs it
          entirely in your browser. Your prompts and its outputs{" "}
          <strong>never leave your device</strong> and never reach me.
        </li>
      </ul>

      <h2>Third parties your browser contacts</h2>
      <p>
        Because this is a static site with embedded content, loading a page can
        cause your browser to connect to the services below — which means they
        receive your IP address and user agent as an unavoidable part of
        serving a request:
      </p>
      <ul>
        <li>
          <strong>Vercel</strong> — hosting, analytics, speed insights.
        </li>
        <li>
          <strong>Google Fonts</strong> (fonts.googleapis.com,
          fonts.gstatic.com) — web fonts.
        </li>
        <li>
          <strong>Google Analytics</strong> — only after you opt in.
        </li>
        <li>
          <strong>Hugging Face</strong> — serves the TinyGPT model weights, but
          only when you click to load the demo.
        </li>
        <li>
          <strong>GitHub</strong> (api.github.com, raw.githubusercontent.com) —
          repository data and some project images, plus an embedded GitHub
          Sponsors button in Jupyter mode.
        </li>
        <li>
          <strong>Groq</strong> — only when you use the site assistant.
        </li>
        <li>
          <strong>Formspree</strong> — only when you submit the contact form.
        </li>
        <li>
          <strong>Tenor</strong> (a Google service) and <strong>Icons8</strong>{" "}
          — animated images and icons embedded in some blog posts and in
          Jupyter mode.
        </li>
      </ul>

      <h2>International transfers</h2>
      <p>
        I am in India; several processors above are in the United States. Where
        GDPR applies, those transfers rely on the processors' Standard
        Contractual Clauses and, for US recipients that are certified, the EU–US
        Data Privacy Framework. Under the DPDP Act, transfers are permitted to
        any country not restricted by the Central Government.
      </p>

      <h2>Your rights</h2>
      <p>
        Wherever you are, you can ask me to show you what I hold, correct it,
        delete it, or stop using it — and I will, without making you justify
        it. Depending on where you live, these may be formal rights:
      </p>
      <ul>
        <li>
          <strong>EU/UK (GDPR):</strong> access, rectification, erasure,
          restriction, portability, objection, and withdrawal of consent at any
          time. You may complain to your national supervisory authority.
        </li>
        <li>
          <strong>India (DPDP Act, 2023):</strong> access, correction, erasure,
          grievance redressal, and nomination. If I do not resolve your
          grievance, you may approach the Data Protection Board of India.
        </li>
        <li>
          <strong>California (CCPA/CPRA):</strong> know, delete, correct, and
          opt out of sale or sharing. I do not sell or share personal
          information, and never have.
        </li>
      </ul>
      <p>
        To exercise any of these, email <Mail />. I will respond within{" "}
        <strong>30 days</strong>. For cookies specifically, the fastest route
        is right here: <CookieSettingsButton />.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS and holds no database of its own. That
        said, no method of transmission over the internet is perfectly secure,
        and I cannot guarantee absolute security of data in transit to the
        third-party processors listed above.
      </p>

      <h2>Children</h2>
      <p>
        This site is not directed at children. I do not knowingly collect
        personal data from anyone under 18 (the threshold under India's DPDP
        Act) or under 16 (GDPR). If you believe a child has sent me data
        through the form, email me and I will delete it.
      </p>

      <h2>Changes</h2>
      <p>
        If I change this policy materially I will update the date at the top,
        and — where the change affects cookies — ask for your choice again.
      </p>
    </>
  );
}

/* ─────────────────────────── terms ─────────────────────────── */

function Terms() {
  return (
    <>
      <p className={styles.lede}>
        Plain terms for a personal site. By browsing{" "}
        {OPERATOR.site.replace("https://", "")} you agree to what follows. If
        you disagree with any of it, the remedy is simple: stop using the site.
      </p>

      <h2>1. Who you are dealing with</h2>
      <OperatorTable />

      <h2>2. What this site is — and is not</h2>
      <p>
        This is a personal portfolio and technical blog. It exists to show my
        work and share what I have learned. It is{" "}
        <strong>not</strong> a commercial service, and using it creates no
        client, employment, consulting, or advisory relationship between us.
      </p>
      <p>
        Nothing here is professional advice. The blog posts are technical
        essays written to the best of my understanding at the time of writing;
        architectures, benchmarks and APIs move fast, and a post may be out of
        date. Do not rely on anything here as the sole basis for a production,
        financial, or otherwise consequential decision.
      </p>

      <h2>3. No sales, no payments — and therefore no refunds</h2>
      <p>
        <strong>
          This site sells nothing. There is no shop, no checkout, no
          subscription, and no paywall.
        </strong>{" "}
        I never collect, see, or store payment-card or banking details, and no
        money is ever taken by this website.
      </p>
      <p>
        The one exception is a <strong>GitHub Sponsors</strong> button in
        Jupyter mode. That is a link to GitHub, not a checkout: any sponsorship
        is a voluntary gift, is taken entirely by GitHub under{" "}
        <a
          className={styles.link}
          href="https://docs.github.com/en/site-policy/github-terms/github-sponsors-additional-terms"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub's Sponsors terms
        </a>
        , and buys no goods, services, support, or entitlement of any kind from
        me. Refunds and cancellation for sponsorships are handled by GitHub
        under those terms — write to me at <Mail /> and I will happily help you
        chase one.
      </p>
      <p>
        Beyond that there is no transaction, so there is nothing for me to
        refund and <strong>no refund policy applies</strong>. If a page
        anywhere asks you to pay for something in my name, it is not me —
        please tell me at <Mail />.
      </p>
      <p>
        Any paid work I do for clients or employers is agreed separately, in a
        written contract that is entirely independent of these terms.
      </p>

      <h2>4. Content and intellectual property</h2>
      <p>
        The writing, design, diagrams, and site code are © {OPERATOR.name},
        except where credited otherwise.
      </p>
      <ul>
        <li>
          <strong>You may</strong> read, link to, and quote short excerpts with
          attribution and a link back.
        </li>
        <li>
          <strong>Please don't</strong> republish whole posts, or pass my work
          off as your own.
        </li>
        <li>
          <strong>Source code</strong> for this site and for my projects is on{" "}
          <a
            className={styles.link}
            href="https://github.com/NotShrirang"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>{" "}
          and is governed by whatever licence each repository states — that
          licence wins over this section.
        </li>
        <li>
          <strong>Third-party material</strong> — some illustrations, icons,
          animated images, logos, and model or dataset names belong to their
          respective owners and appear here for identification and commentary
          only, which I believe is fair dealing / fair use. No endorsement is
          implied. If you own something here and want it credited differently
          or taken down, email <Mail /> and I will act promptly.
        </li>
      </ul>

      <h2>5. The AI features</h2>
      <p>
        Two separate things on this site generate text, and both can be wrong:
      </p>
      <ul>
        <li>
          <strong>The site assistant</strong> ("Ask") answers questions about my
          work using a third-party language model. It can misstate facts. Where
          accuracy matters, check the underlying project or email me.
        </li>
        <li>
          <strong>TinyGPT</strong> is a 95M-parameter model I trained myself,
          running locally in your browser as a demonstration. It is small, and{" "}
          <strong>its output is frequently factually wrong</strong>. It is a
          toy for showing what a model of that size does — nothing it says
          should be relied on for any purpose.
        </li>
      </ul>
      <p>
        Do not submit confidential, personal, or sensitive information to
        either. Neither is a substitute for professional advice of any kind,
        and I accept no liability for decisions taken on the basis of generated
        text.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          attempt to break, overload, scrape at damaging volume, or gain
          unauthorised access to the site or its underlying services;
        </li>
        <li>
          use the assistant or the contact form to send unlawful, abusive,
          harassing, or deliberately misleading content;
        </li>
        <li>
          use any part of this site in a way that breaks applicable law or a
          third party's rights.
        </li>
      </ul>

      <h2>7. External links</h2>
      <p>
        This site links out to GitHub, Hugging Face, PyPI, LinkedIn, employers'
        sites and others. I do not control them and am not responsible for
        their content, their availability, or their privacy practices.
      </p>

      <h2>8. Availability</h2>
      <p>
        The site is provided <strong>"as is" and "as available"</strong>, with
        no warranty of any kind, express or implied, including fitness for a
        particular purpose and non-infringement. It is a personal project —
        I may change, break, or take down any part of it at any time, without
        notice.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, I am not liable for any
        indirect, incidental, special, or consequential loss, or for any loss
        of profit, data, or goodwill, arising from your use of this site or
        anything generated by it. Nothing in these terms excludes liability
        that cannot lawfully be excluded — including for death or personal
        injury caused by negligence, or for fraud.
      </p>

      <h2>10. Privacy</h2>
      <p>
        How I handle data is set out in the{" "}
        <Link className={styles.link} to="/privacy">
          privacy policy
        </Link>{" "}
        and the{" "}
        <Link className={styles.link} to="/cookies">
          cookie policy
        </Link>
        , which form part of these terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts at{" "}
        <strong>Pune, Maharashtra</strong> have exclusive jurisdiction. If you
        are a consumer resident elsewhere, this does not deprive you of the
        protection of mandatory laws in your country of residence.
      </p>

      <h2>12. Changes</h2>
      <p>
        I may revise these terms; the version in force is the one on this page,
        dated at the top. Continued use after a change means you accept the
        revised terms.
      </p>
    </>
  );
}

/* ─────────────────────────── cookies ─────────────────────────── */

function Cookies() {
  return (
    <>
      <p className={styles.lede}>
        This site sets <strong>no cookies at all</strong> unless you accept
        analytics in the banner. Nothing tracks you by default — the banner is
        a genuine question, not a formality, and rejecting takes exactly as
        many clicks as accepting.
      </p>

      <h2>Your current choice</h2>
      <p>
        <CookieSettingsButton /> — this clears the stored decision and brings
        the banner back, so you can change your mind either way.
      </p>

      <h2>What a cookie is here</h2>
      <p>
        A cookie is a small file a site stores in your browser. Related
        technologies — <code>localStorage</code> and <code>sessionStorage</code>{" "}
        — do the same job without being sent with every request. Both are
        covered below, because the law (ePrivacy Art. 5(3)) treats them the
        same way.
      </p>

      <h2>Set only after you opt in</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Set by</th>
              <th scope="col">Purpose</th>
              <th scope="col">Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>_ga</code>
              </td>
              <td>Google Analytics</td>
              <td>Distinguishes one browser from another for visit counting</td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>
                <code>_ga_G-1VWQMVR61X</code>
              </td>
              <td>Google Analytics</td>
              <td>Keeps session state for the same property</td>
              <td>2 years</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        If you reject, or simply ignore the banner, the Google tag script is{" "}
        <strong>never loaded</strong> and neither cookie is created. Withdraw
        consent later and I delete both immediately.
      </p>

      <h2>Strictly necessary — no consent required</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Kind</th>
              <th scope="col">Purpose</th>
              <th scope="col">Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>sm-cookie-consent-v1</code>
              </td>
              <td>localStorage</td>
              <td>
                Remembers the choice you made here, so you aren't asked on
                every page
              </td>
              <td>Until you clear it or change your choice</td>
            </tr>
            <tr>
              <td>
                <code>sm-chat-history-v1</code>
              </td>
              <td>sessionStorage</td>
              <td>
                Keeps your site-assistant conversation while you move between
                pages
              </td>
              <td>When you close the tab</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Both stay on your device. Neither is sent to me, and neither is used to
        track you.
      </p>

      <h2>Measurement that uses no cookies</h2>
      <p>
        <strong>Vercel Web Analytics</strong> and{" "}
        <strong>Vercel Speed Insights</strong> run on every page and store
        nothing on your device — no cookie, no localStorage, no device
        identifier. They report aggregate page views and loading performance
        only. Because they set no storage, ePrivacy consent is not required;
        they are disclosed here anyway so the picture is complete, and you can
        object under GDPR Art. 21 by emailing me.
      </p>

      <h2>Embedded third parties</h2>
      <p>
        Some pages embed content from other services, which may set their own
        cookies once loaded. These are governed by the provider's own policy,
        not mine:
      </p>
      <ul>
        <li>
          <strong>Tenor</strong> (a Google service) — animated images inside
          some blog posts.
        </li>
        <li>
          <strong>Icons8</strong> — interface icons in Jupyter mode.
        </li>
        <li>
          <strong>Google Fonts</strong> — typefaces. Google states it sets no
          cookies for font requests, but it does receive your IP address.
        </li>
        <li>
          <strong>Hugging Face</strong> — serves the TinyGPT weights, only once
          you click to load the demo.
        </li>
        <li>
          <strong>GitHub</strong> — some project images and live repository
          data, plus the <strong>GitHub Sponsors</strong> button embedded as an
          iframe in Jupyter mode, which is GitHub's own page and may set
          GitHub's cookies.
        </li>
      </ul>

      <h2>Blocking cookies yourself</h2>
      <p>
        Every major browser lets you block or delete cookies for a site from
        its settings, and that overrides anything chosen here. Blocking them
        will not break this site — it needs none of them to work.
      </p>

      <h2>Questions</h2>
      <p>
        Email <Mail />, or read the{" "}
        <Link className={styles.link} to="/privacy">
          privacy policy
        </Link>{" "}
        for the wider picture.
      </p>
    </>
  );
}

/* ─────────────────────────── page shell ─────────────────────────── */

const DOCS = {
  privacy: {
    num: "A",
    kicker: "Privacy",
    title: (
      <>
        Privacy <em>policy.</em>
      </>
    ),
    docTitle: "Privacy Policy — Shrirang Mahajan",
    meta: "What this site collects, who receives it, and how to make me delete it.",
    Body: Privacy,
  },
  terms: {
    num: "B",
    kicker: "Terms",
    title: (
      <>
        Terms &amp; <em>conditions.</em>
      </>
    ),
    docTitle: "Terms & Conditions — Shrirang Mahajan",
    meta: "The rules for using this site. Short, because the site is simple.",
    Body: Terms,
  },
  cookies: {
    num: "C",
    kicker: "Cookies",
    title: (
      <>
        Cookie <em>policy.</em>
      </>
    ),
    docTitle: "Cookie Policy — Shrirang Mahajan",
    meta: "Every cookie and storage key this site can set, and how to refuse them.",
    Body: Cookies,
  },
};

export default function Legal({ doc }) {
  const entry = DOCS[doc] ?? DOCS.privacy;
  const { Body } = entry;

  useEffect(() => {
    document.title = entry.docTitle;
  }, [entry.docTitle]);

  return (
    <article className={styles.article}>
      <header className={styles.head}>
        <div className={styles.kicker}>
          <span>{entry.num}</span>
          <span className={styles.kickerRule} />
          <span>{entry.kicker}</span>
        </div>
        <h1 className={styles.title}>{entry.title}</h1>
        <p className={styles.metaLine}>{entry.meta}</p>
        <p className={styles.updated}>Last updated {LAST_UPDATED}</p>
      </header>

      <nav className={styles.docNav} aria-label="Legal documents">
        {Object.entries(DOCS).map(([key, d]) => (
          <Link
            key={key}
            to={`/${key}`}
            className={`${styles.docNavLink} ${
              key === doc ? styles.docNavLinkActive : ""
            }`}
            aria-current={key === doc ? "page" : undefined}
          >
            {d.kicker}
          </Link>
        ))}
      </nav>

      <div className={styles.prose}>
        <Body />

        <p className={styles.disclaimer}>
          <strong>Note.</strong> These policies were drafted for a personal,
          non-commercial portfolio and are written to be accurate about what
          this specific site actually does. They are not legal advice. If the
          site ever starts selling something, handling payments, or serving a
          regulated market, have a qualified lawyer review them first.
        </p>
      </div>
    </article>
  );
}
