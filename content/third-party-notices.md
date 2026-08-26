# Third-Party Notices

Last updated: [YYYY-MM-DD]

Eduvia (the iOS app and its backend service) includes the open-source components listed below. We are grateful to their authors and maintainers.

Exact version numbers are pinned in the project lockfiles (Package.resolved for iOS, package-lock.json for the server) and are read from there at each release.

## Voice synthesis (server side)

| Component | License | Source |
| --- | --- | --- |
| Piper (piper1-gpl) | GPL-3.0 | <https://github.com/OHF-Voice/piper1-gpl> |
| eSpeak NG (used by Piper for phonemization) | GPL-3.0 | <https://github.com/espeak-ng/espeak-ng> |
| ONNX Runtime | MIT | <https://github.com/microsoft/onnxruntime> |
| Voice model de_DE-thorsten-medium | Training dataset released under CC0 by the Thorsten-Voice project; distributed via rhasspy/piper-voices; per its model card, finetuned from the U.S. English lessac voice | <https://github.com/rhasspy/piper-voices> and <https://www.thorsten-voice.de> |

## Server

| Component | License | Source |
| --- | --- | --- |
| Fastify | MIT | <https://github.com/fastify/fastify> |
| @fastify/cors | MIT | <https://github.com/fastify/fastify-cors> |
| ws | MIT | <https://github.com/websockets/ws> |
| @google/genai | Apache-2.0 | <https://github.com/googleapis/js-genai> |
| firebase-admin | Apache-2.0 | <https://github.com/firebase/firebase-admin-node> |
| dotenv | BSD-2-Clause | <https://github.com/motdotla/dotenv> |

## iOS app

| Component | License | Source |
| --- | --- | --- |
| FluidAudio | Apache-2.0 | <https://github.com/FluidInference/FluidAudio> |
| Silero VAD (voice activity detection model) | MIT | <https://github.com/snakers4/silero-vad> |
| Firebase Apple SDK (FirebaseAuth, FirebaseAnalytics, FirebaseCrashlytics) | Apache-2.0 | <https://github.com/firebase/firebase-ios-sdk> |
| RevenueCat (purchases-ios) | MIT | <https://github.com/RevenueCat/purchases-ios> |
| GoogleSignIn-iOS | Apache-2.0 | <https://github.com/google/GoogleSignIn-iOS> |

## Notes

- GPL-3.0 licensed components (Piper, eSpeak NG) run exclusively on the server side and are not distributed to end users as part of the App. GPL-3.0 source obligations attach to the distribution of binaries.
- The de_DE-thorsten-medium voice model card states that the training dataset is CC0 and that the model was finetuned from the U.S. English lessac voice.
- Full license texts are available at the linked repositories.
