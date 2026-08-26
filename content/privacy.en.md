# Privacy Policy

Effective Date: [YYYY-MM-DD] · Version 1.0

This Privacy Policy ("Policy") explains how Oleh Herasymenko ("we", "us", "our") collects, uses and protects your personal information when you use the mobile application Eduvia (the "App").

We wrote this Policy in plain language on purpose. Many of our users read it through a translator, and a privacy policy is only useful if you can understand it.

This Policy complies with the EU General Data Protection Regulation (GDPR).

**Data Controller**

Oleh Herasymenko
Röntgenstraße 5
88048 Friedrichshafen
Deutschland
Email: <thevaltorna@gmail.com>
Website: <https://geteduvia.com>

## The short version

- Eduvia is a speaking practice app with an AI voice tutor. To work, it must process your voice and remember what you talk about.
- **Your voice is never stored.** Audio goes to Google's Gemini AI so the tutor can understand you, and it disappears after processing. Only text transcripts are saved.
- **Conversations are saved as text** for as long as your account exists. You cannot delete a single conversation, but you can delete your whole account in the App at any time, and everything is erased with it.
- **The tutor remembers you.** After each free conversation, the AI saves short personal facts you shared (for example, about your job or family) so the next conversation can continue naturally.
- **Your data lives in Frankfurt, Germany (EU).** Understanding your speech with Google's Gemini model may currently happen outside the EU, because Google does not yet offer this model in an EU region. We will switch as soon as it does.
- **Analytics are off** until you switch them on. **Crash reports are on** by default, and you can switch them off.
- **Reminders are local.** They are scheduled on your phone. Nothing is sent from our servers, and there are no push tokens.
- We **never sell** your data, and we **never share it** with examination organizations, language schools or authorities.
- You can **export everything** as a JSON file and **delete your account** directly in the App.

## 1. The words we use

- **Personal Data**: any information relating to an identified or identifiable person.
- **Processing**: anything done with personal data: collecting, storing, using, disclosing or deleting it.
- **Controller**: Oleh Herasymenko, who decides why and how personal data is processed.
- **You, User**: any person who uses the App.
- **App**: the mobile application Eduvia, available on the App Store.
- **AI Tutor ("Torsten")**: the automated voice tutor in the App. It runs conversation practice in German and generates feedback using Google's Gemini models. Torsten is software, not a human.
- **Practice Session**: a spoken exercise with the AI Tutor: a free conversation or one of the role-play scenarios.
- **Voice Data**: the audio of your speech captured during a Practice Session.
- **Transcript**: the text record of a Practice Session: your utterances as recognized by the AI, the tutor's replies, and the corrections, hints and translations shown to you.
- **Tutor Memory**: short personal facts that the AI automatically extracts from your conversations so the tutor can remember you between sessions.
- **Learning Profile**: your native language, interface language, self-assessed level, interests and learning goal.

## 2. What Eduvia is

Eduvia is an app for practicing spoken German with an AI voice tutor. It offers free conversation, 204 role-play scenarios from A1 to C1, live corrections, an analysis after each session in your own language, a long-term tutor memory, a vocabulary trainer with spaced repetition, progress statistics, short reading texts, and translation of any tutor phrase. The interface and content are available in ten languages.

Eduvia is an independent practice tool. It contains no exam simulations and is not connected to any examination provider. Details are in the [Terms of Use](https://geteduvia.com/terms).

## 3. What data we collect

### 3.1 Account, profile and settings

- Your Firebase user ID, your email address, your display name from your Apple or Google profile, and your profile photo URL.
- A "pronounceable name": a simplified version of your name that the German voice can pronounce, for example transliterated from Cyrillic to Latin letters.
- Your interface language, time zone, tutor voice, daily learning goal in minutes, and the adaptive learning pause setting.
- Your reminder settings: whether reminders are on, the daily reminder with its hour and minute, streak reminders, weekly progress, words due for review, and quiet hours.
- Your tutor settings: speech speed, automatic audio for word cards, and microphone mode (hands-free or push-to-talk).
- Your two privacy decisions with their dates: analytics on or off, and crash reports on or off (Section 7).
- Your interests (at least three). They shape the topics of your conversations.
- Your learning goal: a type (everyday life, work, exam, or maintaining the language), an optional free-text description, and an optional exam name. The exam name only guides conversation topics; the App contains no exam simulations.
- An internal customer identifier for RevenueCat (rcAppUserId) that we create. It is not your name or email.

### 3.2 Tutor Memory: what the tutor remembers about you

After each free-conversation session, the AI automatically extracts stable personal facts from what you said and saves them. This is what lets the tutor ask next time "How did the move go?" or "How is your daughter doing at school?".

Each memory entry contains:

- a topic, such as home, work, family, hobby or plans (the model may choose other topics),
- a short phrase in your native language, up to 160 characters,
- a note whether the tutor should ask about it next time.

The AI also keeps "open topics": things worth asking about in the next conversation.

These facts are sent back to Google Gemini at the start of each following session, so the conversation can continue where it left off.

Important things to know:

- Tutor Memory is created **automatically from your conversation**, not from a form you fill in.
- It is deleted **together with your account**. There is currently no way to delete an individual memory entry or an individual conversation. If you want the tutor to forget something, the available control is deleting your account; you can export your data first.
- Practical advice: **do not tell the tutor things you do not want stored.**

### 3.3 Practice sessions and learning data

- The full text Transcript of every conversation: each utterance with its time, plus hints, translations, corrections, rewritten phrases and the rating of each utterance.
- Session details: mode, scenario, duration, when it happened, and the number of utterances.
- The post-session analysis: a summary in your native language, mistakes grouped by category, an accuracy percentage, how much you and the tutor each spoke, new words, a CEFR level estimate, and which scenario goals you completed.
- The "frozen" session prompt: the exact context that was sent to the AI model for that session.
- Your recurring weak spots: mistake categories, how often they occur, in which sessions, the trend, and how many times we showed them to you.
- Your vocabulary: each saved word with its translation, status, part of speech, gender and article, pronunciation, the first sentence you met it in with its translation, the session it came from, and the spaced repetition data (repetitions, ease, interval, lapses, and the next review date).
- Your progress: CEFR level and its history, session counters, streaks, statistics per scenario, and an estimate of the time to your next level.

### 3.4 Technical and service data

- AI usage records: the number of AI calls, tokens, and the estimated cost per session, per month and in total. We use them only to protect the service from abuse and to control our own costs. They are internal service records and are not part of your data export.
- Subscription records: your subscription state, the start of the current usage window, the time of the last check with RevenueCat, and the usage counter for the window.
- Server logs: see Section 3.6.
- Push tokens: none. Eduvia sends no push notifications from servers (Section 6).

### 3.5 Sensitive information in free conversation (Art. 9 GDPR)

We do not ask you for sensitive data, and the App has no fields for it. But Eduvia is free conversation: **you decide what to talk about**. If you tell the tutor about your health, your origin, your religion, your residence status or other sensitive matters, that information becomes part of the text Transcript and may become part of Tutor Memory.

We process such information **only to hold the conversation and teach you the language**. Never for profiling. Never for advertising. Never to pass on to anyone.

The legal basis is your explicit consent under Art. 9(2)(a) GDPR, which you give by choosing to share this information in the conversation.

You can get a copy of all your data at any time, and you can delete your account, which erases all conversations with it. A single conversation cannot be deleted separately: transcripts are stored for as long as your account exists. If you want to remove something you said, the available option is deleting your account, which erases all conversations together with it.

Practical advice: do not say things you do not want stored.

### 3.6 Server logs and IP addresses

Our servers keep technical logs so we can find errors and protect the service. Besides the time of a request, the type of operation and error codes, the logs may contain **short excerpts of your conversation with the tutor**. We do not use logs to study you or build a profile of you: they exist only for diagnostics. Logs are deleted automatically within 7 days, including after account deletion.

The logs of our load balancer and API contain IP addresses. Legal basis: our legitimate interest in security and diagnostics (Art. 6(1)(f) GDPR).

### 3.7 Processing on your device

- Voice activity detection runs entirely on your phone. A small neural model (Silero VAD, via the FluidAudio library) only decides when you start and stop speaking. It does not recognize words and sends nothing anywhere.
- Reminders are scheduled locally on your phone (Section 6).

### 3.8 Children

Eduvia is intended for users aged 16 and older. We do not knowingly collect data from children under 16. If we learn that we have, we will delete it promptly.

## 4. What we send to Google Gemini

The AI Tutor is powered by Google's Gemini models. For each Practice Session, the request to Gemini contains:

- your name, so the tutor can address you,
- your CEFR level and your native language,
- your interests and your learning goal, including its free-text part and the exam name if you set one,
- recent context: how many days since your last conversation, what you talked about, and the personal facts from Tutor Memory,
- open topics to ask about,
- your recurring grammar weak spots, so the tutor can weave practice into the conversation,
- the scenario context: the tutor's role, the situation, and your goals,
- **the audio of each utterance you speak**,
- your recent utterances in the session,
- your time zone and locale.

Outside of sessions, we send to Gemini:

- text you ask the App to translate,
- text for the Reader feature,
- the full session Transcript, to produce the post-session analysis.

**What we do NOT send to Gemini:** your email address, your Firebase user ID, device identifiers, payment information, or subscription data.

### Where this processing happens

Your account data is stored in Google Cloud Firestore in the Frankfurt region (Germany, EU). Our API and voice synthesis run on Hetzner servers in Germany. For understanding speech and generating the tutor's replies we use Google's Gemini model via Vertex AI: this model is not yet available in any EU region, so the request during a conversation may be processed on Google's infrastructure outside the EU. This processing is covered by the Google Cloud Data Processing Addendum, the EU Standard Contractual Clauses (SCCs), and Google's certification under the EU-US Data Privacy Framework. Google does not use your data to train its models and does not keep it after processing. As soon as the model becomes available in a European region, we will switch the processing to the EU.

### What happens to your voice

Your audio travels to Gemini as part of the request and disappears after processing. It is never written to files, never stored in the database, and not kept by Google after the reply is generated. Only the text Transcript is saved.

We do not create voiceprints, and we do not use your voice to identify you. Your voice is processed only to understand what you said.

## 5. Who else receives data

We use the following providers to run the App.

| Provider | Role | What it receives | Location and safeguards |
| --- | --- | --- | --- |
| Google: Firebase Authentication | Sign-in | User ID, email, sign-in method and time | Google Cloud DPA, SCCs, EU-US Data Privacy Framework |
| Google: Cloud Firestore | Main database | All account and learning data | Frankfurt (europe-west3), EU |
| Google: Vertex AI (Gemini) | Speech understanding, tutor replies, session analysis | Audio of your utterances plus the context listed in Section 4 | Global endpoint: processing may occur outside the EU; DPA, SCCs, DPF; no model training |
| Google: Firebase Analytics | Product analytics | App events, only if you consent (Section 7) | DPA, SCCs, DPF |
| Google: Firebase Crashlytics | Crash reports | Crash stack traces, device model, OS and App version, breadcrumb events | DPA, SCCs, DPF |
| Hetzner Online GmbH | Hosting of our API and voice synthesis | Traffic in transit, plus the technical logs of Section 3.6 (IP addresses and possibly short conversation excerpts), kept 7 days; no database of your data | Germany, EU; data processing agreement (AV-Vertrag) |
| RevenueCat, Inc. | Subscription management | The internal customer ID we create (rcAppUserId) and the purchase and renewal history reported by Apple | USA; SCCs |
| Apple Inc. | App Store and In-App Purchase | Payment data (we never see it) | Under Apple's own terms |

We do not sell your personal data. We never share your data with examination organizations, language schools, or government authorities.

## 6. Notifications: local, not push

All reminders (the daily reminder, streaks, weekly progress, words due for review) are scheduled **on your phone** by the App, using the iOS notification system. There is no push infrastructure behind them: no device token is sent to our servers, and no notification arrives from outside. Reminders work even offline. You control the iOS notification permission at any time in iOS Settings.

## 7. Analytics and crash reports

These are two different things with two different rules.

### Firebase Analytics: off until you say yes

- **Off by default.** Nothing is collected until you actively agree.
- You decide during onboarding, and you can change your mind at any time with the switch in your Profile.
- Legal basis: your consent (Art. 6(1)(a) GDPR and §25(1) TDDDG).
- If you agree, analytics covers exactly what the consent screen says:
  - which screens you open and how often,
  - when a session starts and finishes,
  - what you do in the App, for example starting a session, saving a word or opening the subscription page,
  - never your conversations, voice or name.
- Your decision is stored with its date and synced to your account, so it survives reinstalling the App.
- Advertising signals are disabled: no advertising identifiers (IDFA), no ad personalization, no cross-app tracking, and no tracking prompts. We do not track you.
- Analytics retention at Google is set to 2 months.

### Firebase Crashlytics: on by default, and you can turn it off

- Purpose: keeping the service working. A crash report tells us what broke.
- **On by default.** Legal basis: our legitimate interest in a stable and secure service (Art. 6(1)(f) GDPR).
- **You can object at any time**: switch crash reports off under Profile → Privacy.
- A report contains the crash stack trace, your device model, the OS and App versions, and breadcrumb events. Reports are linked to your user ID so we can investigate problems you tell us about.
- Your decision is stored with its date and synced to your account.
- Crash reports are kept by Google for 90 days (the standard Firebase retention).

## 8. Legal bases at a glance

- **Contract (Art. 6(1)(b) GDPR)**: everything needed to provide the service you asked for: Practice Sessions including the processing of your Voice Data, Transcripts, Tutor Memory, feedback and analysis, vocabulary and progress, personalization, subscription management, and the in-app export and deletion. Voice processing is technically necessary for a voice tutor, and every recording happens inside a session you started.
- **Consent (Art. 6(1)(a) GDPR, §25(1) TDDDG)**: Firebase Analytics. **Explicit consent (Art. 9(2)(a) GDPR)**: sensitive information you choose to share in conversation (Section 3.5).
- **Legitimate interests (Art. 6(1)(f) GDPR)**: crash reports (with your right to object), security and abuse protection, server logs, and internal AI usage records for cost control.
- **Legal obligation (Art. 6(1)(c) GDPR)**: where the law requires processing.

How to withdraw or object: analytics with the switch in your Profile; crash reports under Profile → Privacy; notifications and the microphone in iOS Settings (without the microphone, voice features stop working and everything else keeps working); sensitive topics by not raising them, or by deleting your account.

## 9. Where your data lives and for how long

Your account data is stored in Google Cloud Firestore in Frankfurt, Germany (EU). Our own servers hold no database of your data. The only personal data resting on them is the technical logs described in Section 3.6, which delete themselves within 7 days.

| Data | How long |
| --- | --- |
| Account, profile, Transcripts, Tutor Memory, vocabulary, progress | While your account exists; deleted immediately when you delete the account |
| Database backups (point-in-time recovery and daily snapshots) | Up to 7 days; we do not restore deleted accounts from backups |
| Server logs (IP addresses, technical events, possibly short conversation excerpts) | 7 days, including after account deletion |
| Technical deletion marker after account deletion | 48 hours |
| AI usage records (internal cost control) | While your account exists; deleted with the account |
| Subscription records | While your account exists; your RevenueCat record is deleted when you delete the account |
| Analytics data (only if you consented) | 2 months at Google |
| Crash reports | 90 days at Google |

## 10. Deleting your account and taking your data with you

### Deleting your account

You can delete your account directly in the App: open your **Profile** and scroll to the **Danger Zone** section at the bottom.

What happens, in this order:

1. Your sign-in record is deleted first. Access to the account stops immediately.
2. All your data is deleted from the database.
3. We ask RevenueCat to delete your customer record there.

If a step fails, the App shows an error and asks you to try again. Partial deletion is never shown as success. Your data with us is deleted first in any case: even if RevenueCat is temporarily unreachable, your data on our side is already gone when you see the error.

Honest details you should know:

- **Your subscription is not cancelled automatically.** Cancel it separately in iOS Settings → Subscriptions; otherwise Apple keeps billing you.
- **A technical marker remains for 48 hours** after deletion. It contains your user ID, your RevenueCat customer ID, and a flag whether the RevenueCat deletion still has to complete. It exists so that a request still in flight cannot recreate data of a deleted account, and so a retry can finish the RevenueCat deletion. After 48 hours it stops working.
- **Backups clear within 7 days.** When you delete your account, your data disappears from the live systems immediately. Copies in technical database backups disappear automatically within 7 days. We do not restore deleted accounts from backups.
- **Log excerpts clear within 7 days** too (Section 3.6).

After deletion you can create a new account, and an active subscription can be restored with Restore Purchases. Deleted learning data cannot be recovered.

### Exporting your data

You can download everything we store about you directly in the App, from your Profile. The export is a JSON file: a structured copy of your stored data, plus your sign-in record (email, name, avatar, sign-in providers, and the dates your account was created and last signed in).

The export does not include, and the App tells you this when you export:

- audio: it is never stored, so there is nothing to export,
- copies being processed by Google as our processor,
- server logs,
- notification tokens (Eduvia stores none: reminders are local),
- copies held by RevenueCat,
- internal service records about usage costs.

## 11. Your rights

- **Access**: use the in-app export, or write to us.
- **Rectification**: change your profile and settings in the App; for anything else, write to us.
- **Erasure**: delete your account in the App (Section 10). A single conversation cannot be deleted separately (Section 3.5).
- **Data portability**: the in-app export gives you a machine-readable JSON copy.
- **Restriction of processing**: write to us.
- **Objection**: to crash reports, use the switch under Profile → Privacy; to other processing based on legitimate interests, write to us.
- **Withdrawing consent**: analytics with the switch in your Profile; for sensitive topics, by not raising them further and, if you wish, deleting your account.
- **Complaint**: you can complain to a data protection supervisory authority, in particular in the country where you live. The authority responsible for us is Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Heilbronner Straße 35, 70191 Stuttgart, Germany, <https://www.baden-wuerttemberg.datenschutz.de>.

We reply within one month. Contact: <thevaltorna@gmail.com>.

## 12. Automated processing and AI transparency

You are talking to an artificial intelligence system (transparency under Article 50 of the EU AI Act). Torsten is software, not a human, and the App presents it as such.

The App uses AI to recognize your speech, correct you, analyze sessions and estimate your CEFR level. These estimates are approximate study aids. No decision with legal or similarly significant effects is made about you by automated means (Art. 22 GDPR): your estimates are never sent to any examination body, have no effect on any official result, and you can ignore or repeat them at any time.

## 13. Security

- All traffic between the App and our servers is encrypted (TLS).
- The App has no direct access to the database. The database rejects all client requests; everything goes through our API, and every request is checked against your Firebase sign-in token.
- Data access is isolated per user.
- Our servers run in ISO 27001 certified Hetzner data centers in Germany; the database runs in Google Cloud's Frankfurt region.
- Access to production systems is restricted.
- Server logs are kept minimal and delete themselves after 7 days.

## 14. Data breaches

If a personal data breach is likely to put your rights and freedoms at risk, we will notify the supervisory authority within 72 hours of becoming aware of it. If the risk to you is high, we will also inform you directly and without undue delay: by email to your account address or with a clear notice in the App.

## 15. Language versions

This Policy is available in English and German. For consumers residing in Germany, the German version prevails; otherwise the English version prevails. The App interface exists in ten languages for convenience; the binding versions of this Policy are the English and the German one.

## 16. Changes to this Policy

We may update this Policy. For material changes, for example a new category of data or a new legal basis, we will tell you in the App in advance, so you can review the changes before they take effect; if you do not agree, you can export your data and delete your account. For minor changes, such as clarifications and editorial fixes, we publish the updated version with a new Effective Date.

## 17. Contact

Oleh Herasymenko
Röntgenstraße 5
88048 Friedrichshafen
Deutschland
Email: <thevaltorna@gmail.com>
Website: <https://geteduvia.com>

## 18. Changelog

**Version 1.0 ([YYYY-MM-DD])**: Initial release.

© 2026 Eduvia. All rights reserved.
