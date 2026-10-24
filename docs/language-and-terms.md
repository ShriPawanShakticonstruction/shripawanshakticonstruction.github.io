# Language and construction terms

## Scope and behavior

Every root HTML page includes the same language selector and `assets/i18n.js`.
A new browser session defaults to English. The selected language is retained in
sessionStorage while navigating and reloading; a `lang` URL parameter carries an
explicit choice between pages if storage is blocked. The old localStorage language
preference is no longer used. Language names remain in their native scripts;
contact numbers, email addresses, submitted form values and visitor input retain
their original values. Arabic and Urdu use right-to-left page direction.

Each advertised language has a complete, self-hosted JSON catalog under
`assets/locales/`. Translations were generated from the published English source
with Google Translate during development, then checked for structural coverage, isolated source boundaries and unchanged numeric statistics.
They are machine translations; professional review of legal translations remains
advisable. No runtime translation requests or visitor data are sent to Google.
Kashmiri was removed from the earlier incomplete selector because a complete
translation was unavailable; all 20 languages now offered have complete catalogs.
Manipuri uses Meitei script consistently. Russian is now available on every page.

To change copy, update the English HTML, every catalog and the catalog version in
`i18n.js`, and run `python3 scripts/check-localization.py`. With the local preview running at port 3000 and the shared browser registered, run `python3 scripts/browser-localization-check.py` for the full DOM matrix, then `python3 scripts/browser-language-behavior-check.py` for visitor defaults, failed downloads, storage restrictions, dynamic controls and layouts. Dynamic text must have a
catalog entry; use `window.SiteLanguage.t(source, parameters)` for alerts and
parameterized counters. Unknown text is preserved rather than sent to a service.
Language file failures keep the currently rendered language and show a retry message.

## Contract baseline and editorial decisions

The user requested approximately 2,000 words of professional construction terms
and explicitly clarified that "two years" meant 2,000 words, not a warranty period.
No automatic two-year warranty is created. The original conditions required a
written agreement and described nonrefundable advances after work starts and
external causes of delays. The expanded terms preserve those subjects, clarify
written variation approval and accounts on cancellation, and explicitly preserve
mandatory legal remedies. This is an authorised expansion of the short original
terms, not a claim that the old wording was legally invalid. The original highlighted
note also said all advances were nonrefundable, while its numbered clause tied
non-refundability to work having started. The new cancellation section resolves
that inconsistency by explaining the post-start policy, written settlement and
mandatory-law exceptions. This compatibility change was disclosed before publication.

The Privacy Policy's existing operating rules, introductory text and legal list
remain unchanged in the English source. It has complete translations, including its
20 rules, and retains its separate identity; it has not been silently replaced
with an unrelated data-protection policy.

## References consulted on 24 October 2026

- L&T, Copyright & Terms: https://www.larsentoubro.com/copyright-terms/
  Consulted for the organization of corporate website terms: information purpose,
  third-party links, intellectual property, contractual warranties and lawful
  remedies. No L&T text, business identity or Mumbai jurisdiction was copied.
- District Gwalior government, Municipalities:
  https://gwalior.nic.in/en/public-utility-category/municipality/
  Confirms Nagar Palika Dabra as a local municipal body. It does not establish
  specific permit fees, deadlines or approval guarantees. The terms therefore
  require the parties to identify the authority and permissions for their actual
  site; no unverified local regulation, fee or licence is asserted.

The resulting project terms cover estimates, written scope, access, municipal
permissions, materials, payments, advances, measurements, variations, monsoon and
heat conditions, labour, neighbouring property, drainage and waste, handover,
defects, termination and dispute handling. Individual contracts set commercial
amounts, dates, warranties and jurisdiction subject to applicable law.
