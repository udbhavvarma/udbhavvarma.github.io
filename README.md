# Udbhav Varma — Technical Product Manager & Builder

A static portfolio built for GitHub Pages. The opening introduces the work directly; the terminal, product previews, and command palette provide a more interactive route through it.

## Local preview

From this directory:

```sh
python3 -m http.server 3105 --bind 127.0.0.1
```

Open `http://127.0.0.1:3105/`. No dependency installation or build step is required.

## Source map

- `index.html`: content, existing visual system, terminal, and original product interactions.
- `portfolio.css`: responsive presentation, mobile navigation, and product refinements and typography. Monospace is reserved for the terminal and command palette.
- `portfolio.js`: the four-product card stack, 16 workbench chapters, chapter navigation, email copy, mobile menu, and OTP-availability preview.
- `icon.svg`: vector browser icon.

Keep product links and professional claims aligned with the underlying projects. Demo panels illustrate behavior using fixed sample data; they do not contact those products, verify an identity, or create delivery permissions. The page uses existing Google Fonts and Microsoft Clarity integrations.

## Verification

Check the desktop and phone layouts, mobile menu, direct product anchors, command palette focus/closing, and the OTP-unavailable and advance-planning scenarios. Parse `portfolio.js` with `node --check portfolio.js`; the inline script in `index.html` should also pass Node's syntax check when extracted.

Source changes remain local until committed and published through the repository's existing GitHub Pages setup.

Delivery Delegate’s provided live URL is `https://delivery-delegate.vercel.app/`. On 6 September 2026 it returned Vercel `DEPLOYMENT_NOT_FOUND`; the portfolio labels it unavailable and retains the GitHub source link. Remove that label after verifying a working deployment.

Copy follows problem → approach → result. Public summaries explain where language models, speech-to-text, or vision fit in a user workflow; provider names and implementation details belong in the optional product notes. Skills describe methods, while project outcomes must be supported by the implementation or existing evidence.

The introduction tells a personal story: notice friction or a possibility, make it tangible, and learn from actual use. Keep the opening broad enough to cover the full range of products. Technical methods and tools support the individual project stories rather than defining the person.

## Story and interaction design

The page follows curiosity → decisions → working products → evidence → open questions → contact. The hero offers a product-card stack and the original terminal. Each card opens the matching workbench story. Product articles and open-question cards return to the relevant chapter.

The workbench uses illustrative artifacts, not customer data. Its final chapters describe proposed validation and dependencies, not measured results. The result ledger uses the existing portfolio’s professional metrics. Avoid converting plans into achievement claims.

Interaction checks: browse each hero card, use the terminal, step through all four chapters of each story, follow product links, expand result and career rows, and use the open-question links. Verify keyboard focus moves to the selected chapter. Check layouts at desktop and 390px width; reduced-motion preferences suppress transitions. Without JavaScript, the first story and complete product articles remain available. The copy-email action reports success only after the clipboard write succeeds; the email link remains available if it fails.

Presentation guidance: keep the contact section neutral and professional, with direct email and LinkedIn links. Avoid freelance service pitches, project-intake language, repeated taglines, or decorative technology chips. Preserve navigational controls and prototype/validation context that affect how the work is understood.

The workbench is the only project catalogue. Its Build step contains the selected interactive preview and product/source links; legacy product hashes select that preview. Skills and all six original principles have their own sections. Career controls use plain “View details” labels. Do not duplicate the name-and-title strapline around the page.

The hero is centered around the personal story and the rotating product specimen. Skills distinguish product prototyping from production engineering: the portfolio claims ownership of problem framing, tangible experiments, evaluation, and iteration. Principles retain their original meaning but are introduced through the moments that made each belief useful.
