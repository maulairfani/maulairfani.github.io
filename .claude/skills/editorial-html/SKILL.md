---
name: editorial-html
description: create standalone, printable html documents in a restrained monochrome editorial style with serif prose, sans-serif headings, strong rules, worked examples, compact tables, and explanatory figures. use when the user requests a document, guide, report, explainer, proposal, or study notes in this style, asks for tensorfold-study-guide styling, or explicitly invokes editorial-html. do not apply to casual chat, short messages, slides, or app interfaces. output html by default, not pdf.
---
# Monochrome Document

## Output contract
- Produce a complete UTF-8 `.html` file, not a Markdown answer or screenshot.
- Read `assets/document.css` and `assets/template.html` before authoring. Inline the CSS in the final HTML. Treat the template as a component specimen, not mandatory content.
- Keep the result standalone: no CDN, remote fonts, frameworks, external stylesheet, or required JavaScript. Embed any necessary visual assets or deliver them explicitly if embedding is impractical.
- Use the user's language and preserve their scope, facts, code, and requested depth. Default to a practical technical-reader audience only when unspecified.
- If only a topic is supplied, write a useful document with explicit scope. If notes are supplied, organize and develop them without silently inventing facts. Use authorized sources when research is requested or required.
- Return the downloadable HTML and a brief handoff. Create PDF only when requested, retaining HTML as the source of truth.

## Visual identity: fixed, not discretionary
Reconstruct the visual language of a printed technical study guide. The supplied PDF is a visual reference, not original HTML/CSS; do not claim pixel-identical reconstruction.
- White paper, black text, restrained light-grey panels and medium-grey rules.
- Serif body (Georgia/Times); Arial/Helvetica bold headings; Courier labels, code, and source references.
- One centered reading column. Use the supplied 960px maximum screen width and A4 print settings as defaults, not recovered source measurements.
- Thick black top rule for the document and parts; thinner strong rules for chapter headers; fine rules for metadata, recap, and tables.
- Compact uppercase, letter-spaced eyebrow labels. Clear title, descriptive lead, and aligned metadata.
- Flat rectangular worked-example panels with a white bordered code/formula block inside.
- White callouts with a heavy left black border; dashed-border cautions.
- Minimal tables: horizontal rules, no full cell grid, no zebra stripes, no colored headers. Right-align quantitative columns.
- Small figure captions beginning with a bold numbered label. Figures must teach something, not decorate.
- No gradients, shadows, glass effects, hero photography, emoji, colorful badges, rounded-card grids, dashboard layout, or oversized empty cover page.
- Do not switch to dark mode automatically: the document is white-paper editorial content.

## Authoring workflow
1. Identify the document type, reader, goal, scope, and supplied evidence. Ask only for information that materially blocks writing.
2. Outline before formatting. Adapt the structure to the task; never force every document into a course.
3. Write the narrative. Explain mechanisms, consequences, trade-offs, and limitations; avoid generic filler and excessive bullets.
4. Copy the template, inline the supplied CSS, replace all specimen text, and include only useful components.
5. Add accurate tables and figures where they improve understanding. Use the environment's appropriate visual tools. Prefer crisp, accessible, monochrome vector diagrams when supported; use actual data for charts. Never invent benchmark data. Do not rasterize the entire document.
6. Check screen and print rendering with available browser tools. Fix overflow, clipping, awkward breaks, tiny labels, and excessive blank space. If no renderer is available, perform structural checks and disclose that visual rendering was not tested.
7. Save and return the final HTML. Do not claim export or visual validation without performing it.

## Structure by document type
- Study guide: introduction, prerequisites, contents, foundations -> mechanisms -> synthesis, worked examples, recap, optional self-check questions and answer key.
- Technical explainer: problem, mental model, mechanism, example, trade-offs, takeaway.
- Report or decision memo: summary, context, findings, options, recommendation, limitations/sources.
- Proposal: problem, objectives, approach, scope, deliverables, dependencies, risks, next steps.
- Short document: title and a few sections; omit parts, contents, glossary, and quizzes.
For long documents use linked contents and stable section IDs. Add part dividers only when they clarify a real grouping. Keep one h1 and a logical heading hierarchy; change template heading levels as needed.

## Evidence and examples
- Attach readable source links to claims requiring attribution; preserve supplied URLs exactly. Never invent citations, pinned commits, validation passes, or measurements.
- Use evidence badges only for evidence-heavy documents. Adapt labels to the topic. For code analysis: CODE = inspected implementation, REPO CLAIM = project documentation, INDEPENDENT = outside report, INFERENCE = reasoned interpretation. A badge is not a citation.
- Use `.badge.code`, `.badge`, `.badge.inference`, and `.source` for this optional system.
- Clearly label hypothetical examples and distinguish them from measured results.
- Explain units, assumptions, and formulas. State what comparisons do not establish.

## Component mapping
Use the CSS classes directly:
`document-header`, `label`, `lead`, `metadata`, `front-section`, `toc`, `part`, `chapter`, `chapter-header`, `chapter-meta`, `thesis`, `example`, `box-title`, `callout`, `caution`, `recap`, `questions`, `equation`, `table-wrap`, `numeric`, `badge`, `source`.
Use semantic HTML: header, nav, section, aside, figure/figcaption, dl, table/thead/tbody. Give images useful alt text and SVGs accessible names. Keep text selectable. Escape code correctly.

## Print and QA gate
- Retain `@page` and print CSS. Do not simulate fixed-height pages in HTML.
- Keep headings with following content and captions with figures. Avoid splitting short examples/callouts; allow oversized blocks to split rather than overflow a page.
- Repeat table headers across pages. Never apply break-inside:avoid to entire chapters or long tables.
- Check at 375px and desktop width, and inspect print output when available.
- Check every internal anchor, table header, source link, and figure number. Remove placeholders and unused components.
- Do not recreate the browser-generated date, local file URL, or page footer visible in the reference PDF. Those are print-dialog artifacts. For clean PDF printing, disable browser headers/footers and enable background graphics when needed.
- Preserve readable font sizes; fix layout rather than shrinking everything to fit.

## Example invocation
"Use editorial-html to turn these notes into a standalone HTML technical explainer. Keep the monochrome study-guide style, include worked examples where useful, and make it printable."
