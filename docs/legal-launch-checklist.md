# VENSO legal launch checklist (local draft, 2026-11-13)

The public/legal/*.html pages are drafts marked noindex,nofollow. They are not approved legal contracts.
Do not remove noindex or publish as binding terms before review by counsel.

## Legal approval needed
- [ ] Service provider: registered legal name, BIN/registration number, address, contact and applicable law.
- [ ] Effective date and revision ID for Terms, Public Offer, Privacy, Data Consent, Cookies.
- [ ] Subscription offer: taxes, plan limits, payment/renewal, cancellation, refunds; match checkout.
- [ ] Technical audit: cloud hosting, AI processors, integrated channels, payment providers, deletion, retention, backups and cross-border transfers.
- [ ] Confirm privacy contact, personal data categories, and translations RU/KK/EN.
- [ ] Verify cookie and analytics use. Introduce optional consent settings before non-essential tracking is added.
- [ ] Ensure appropriate safeguards for client conversations, audio and sensitive data.

## Current implementation
- Landing: 5 legal pages, footer links, and a required data-consent checkbox on lead requests.
- Web registration: 2 independent mandatory unchecked consents, linked to Terms + Offer and Data Consent + Privacy.
- Existing registration API receives consentAccepted=true only; separate terms acceptance is not logged by backend.
- Existing lead API currently ignores the added personalDataConsent field; that is NOT legal proof of consent.
- No compulsory marketing opt-in was added.
- Mobile native registration remains a separate future UI surface.

## Backend tasks required before production
- [ ] Create durable versioned consent records: account/user, timestamp, document IDs and versions, choices, source.
- [ ] Record separate terms and personal-data consents server-side while maintaining API compatibility.
- [ ] Persist lead consent timestamp / version alongside leads.
- [ ] Document lawful withdrawal, retention, processor responsibilities and cross-border transfers.
- [ ] Validate production landing URL variables and remove noindex only when approved.

Official Kazakhstan law reference: https://adilet.zan.kz/rus/docs/Z1300000094 (personal data law Articles 7 and 8).
