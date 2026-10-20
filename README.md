# Udbhav Varma — Technical Product Manager & Builder

A static portfolio built for GitHub Pages. The opening introduces product ownership and leads into Times Internet outcomes. Independent project stories, interactive previews, and the terminal provide deeper routes through the work.

## Local preview

From this directory:

```sh
python3 -m http.server 3105 --bind 127.0.0.1
```

Open `http://127.0.0.1:3105/`. No dependency installation or build step is required.

## Source map

- `index.html`: content, existing visual system, terminal, and original product interactions.
- `portfolio.css`: responsive presentation, mobile navigation, and product refinements and typography. Monospace is reserved for the terminal and command palette.
- `portfolio.js`: the four-product card stack, 16 workbench chapters, direct demo links, chapter navigation, email copy, mobile menu, and OTP-availability preview.
- `motion.js`: the shared event-driven reveal, tilt, and transition system. Respects reduced motion and cancels transient effects when the tab is hidden.
- `icon.svg`: vector browser icon.

Keep product links and professional claims aligned with the underlying projects. Demo panels illustrate behavior using fixed sample data; they do not contact those products, verify an identity, or create delivery permissions. The page uses existing Google Fonts and Microsoft Clarity integrations.

## Verification

Check the desktop and phone layouts, mobile menu, direct product anchors, command palette focus/closing, and the OTP-unavailable and advance-planning scenarios. Parse `portfolio.js` with `node --check portfolio.js`; the inline script in `index.html` should also pass Node's syntax check when extracted.

Source changes remain local until committed and published through the repository's existing GitHub Pages setup.

On 20 October 2026 all four public product URLs returned HTTP 200, including Delivery Delegate at `https://delivery-delegate.vercel.app/`. This verifies link availability, not full product functionality. Only Auxiliaire’s source repository was publicly reachable; the other three returned HTTP 404, so their source links are omitted. Delivery Delegate’s walkthrough remains a prototype with courier integration pending.

Copy follows problem → approach → result. Public summaries explain where language models, speech-to-text, or vision fit in a user workflow; provider names and implementation details belong in the optional product notes. Skills describe methods, while project outcomes must be supported by the implementation or existing evidence.

The introduction tells a personal story: notice friction or a possibility, make it tangible, and learn from actual use. Keep the opening broad enough to cover the full range of products. Technical methods and tools support the individual project stories rather than defining the person.

## Story and interaction design

The page follows introduction → professional evidence → independent projects → skills → principles → contact. The hero offers a product-card stack and the original terminal. Each card opens the matching workbench story. Product articles and open-question cards return to the relevant chapter.

The workbench uses illustrative artifacts, not customer data. Its final chapters describe proposed validation and dependencies, not measured results. The result ledger uses the owner-supplied Times Internet metrics: 1M+ users, 2.5× ROAS improvement in three months, 85% lower LLM costs, and 90% less workflow turnaround time for 500+ internal users. The monthly revenue amount is intentionally omitted until an approved figure is provided. Avoid converting plans into achievement claims.

Interaction checks: browse each hero card, use the terminal, step through all four chapters of each story, follow product links, expand result and career rows, and use the open-question links. Verify keyboard focus moves to the selected chapter. Check layouts at desktop and 390px width; reduced-motion preferences suppress transitions. Without JavaScript, the first story and complete product articles remain available. The copy-email action reports success only after the clipboard write succeeds; the email link remains available if it fails.

Presentation guidance: keep the contact section neutral and professional, with direct email and LinkedIn links. Avoid freelance service pitches, project-intake language, repeated taglines, or decorative technology chips. Preserve navigational controls and prototype/validation context that affect how the work is understood.

The workbench is the only project catalogue. Its four project summaries have direct demo entry points and accessible story-selection controls. Its Build step contains the selected interactive preview and product/source links; legacy product hashes select that preview. Skills and all six original principles have their own sections. Career controls use plain “View details” labels. Do not duplicate the name-and-title strapline around the page.

The responsive hero pairs the personal introduction with the product specimen. Glass surfaces use readable fallback backgrounds; motion is finite and event-driven. Skills distinguish product prototyping from production engineering: the portfolio claims ownership of problem framing, tangible experiments, evaluation, and iteration. Principles retain their original meaning but are introduced through the moments that made each belief useful.


## October 2026 refresh validation

JavaScript syntax and internal anchors were checked. Browser checks covered desktop (1440px), phone (390px and 320px), all 16 story chapters, direct demo entry with focus management, keyboard disclosures, command-palette focus trapping, and responsive overflow. Four public product URLs and Auxiliaire’s public source link returned HTTP 200. Reduced-motion CSS and JavaScript follow the operating-system preference; there is no typewriter or pixel-mask animation.
