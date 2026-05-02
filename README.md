# yanxiawei.com

Static academic homepage for Yanxia Wei, Ph.D.

## Site

- Canonical domain: `https://yanxiawei.com`
- Hosting: GitHub Pages
- Repository: `godlovedawei-cloud/yanxiawei-homepage`
- Publishing source: `main` branch, repository root
- Main file: `index.html`

## Project Structure

- `index.html`: the complete one-page homepage, including layout, styles, and content.
- `assets/profile.jpg`: optimized portrait used on the homepage.
- `assets/profile-original.png`: original portrait copy kept for future edits.
- `assets/favicon.svg`: browser tab icon.
- `assets/logo/`: institution logos used in the Experience and Education section.
- `assets/Yanxia_Wei_CV.pdf`: downloadable CV linked from the hero.
- `assets/Yanxia_Wei_publications.enw`: EndNote export file linked from the publications section.
- `assets/articles/`: article PDFs linked from publications and conference entries.
- `assets/Projects/`: MinerU outputs for the two flagship papers, including source PDFs, extracted markdown, JSON layout files, and extracted figures.
- `assets/yanxiawei cv.md`: markdown extraction of the newer CV, kept as a convenient editing reference.
- `CNAME`: custom domain for GitHub Pages.
- `.nojekyll`: disables Jekyll processing so static assets are served directly.
- `LOG.md`: project change log and deployment notes.

## Homepage Sections

- Hero: identity, research positioning, active opportunity status, contact links, emails, and quick stats.
- Research Focus: three compact research themes.
- Flagship Projects: two PI-facing project cards:
  - BMC Medicine valvular heart disease project.
  - EJPC type 2 diabetes and ASCVD-free life expectancy project.
- Experience and Major Research Experience: appointments, training, and selected research projects.
- Publications: selected first-author work, submitted co-first paper, and collaborative papers.
- Conference Abstracts: CV-aligned conference abstracts and oral presentations.
- Skills: methods, platforms, software, AI-assisted research tooling, and languages.

## Editing Workflow

1. Pull latest changes:

   ```bash
   git pull origin main
   ```

2. Edit `index.html` for page text, layout, links, and styling.

3. Add or replace assets under `assets/`.

4. Run a local preview:

   ```bash
   python3 -m http.server 4173
   ```

   Open `http://127.0.0.1:4173/`.

5. Before committing, run:

   ```bash
   git diff --check
   git status --short
   ```

6. Commit and push:

   ```bash
   git add index.html assets README.md LOG.md
   git commit -m "Update homepage content"
   git push origin main
   ```

GitHub Pages deploys from `main` automatically after push.

## Content Guidelines

- Keep the homepage concise and PI-facing. The first screen should show research identity, strongest methods, current opportunity status, and clear contact paths.
- Avoid dense resume paragraphs in the hero.
- Keep institution logos transparent and integrated with the Experience and Education headings; avoid boxed logo containers.
- Use `Postdoctoral Fellowship or related research scientist opportunities` rather than only `postdoc`, so the page does not overconstrain possible opportunities.
- Keep personal traits professional and concrete. Current tone: warm, reliable collaborator; clear cross-disciplinary communication; fast adoption of new analytical and AI-assisted workflows.
- For publications, keep journal metadata readable:
  - DOI in plain text.
  - IF, Q ranking, and citation count as visible tags where available from the CV.
  - PubMed and PDF as link buttons, not database-style badges.
- Do not invent IF/Q values. Use the CV or a verified source.
- For conference outputs, use `assets/yanxiawei cv.md` as the local source of truth and add PDF links only when matching files exist under `assets/articles/`.

## Flagship Project Sources

The homepage currently uses two project images:

- `assets/Projects/BMC Medicine_article.pdf-c90b859b-a960-40c1-8ae3-efd3bb16797a/images/77ed4c37093cbc88a39f3f9ff9a888106c440e8e134f3bbd75f3c56d669cda5d.jpg`
- `assets/Projects/EJPC_article.pdf-9b13d7e7-5682-4683-8415-42f9acb3e8aa/images/836873b4b252a6546b1f1d21a458bd152f4fb3e2efa3084f16d395d9bd5d0fdd.jpg`

The remaining MinerU files are intentionally kept in the repository so future edits can choose different figures or extract more paper details without rerunning the conversion.

## Deployment

GitHub Pages serves this repository directly from the root of `main`.

Expected DNS:

- Apex `A` records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Apex `AAAA` records:
  - `2606:50c0:8000::153`
  - `2606:50c0:8001::153`
  - `2606:50c0:8002::153`
  - `2606:50c0:8003::153`
- `www` CNAME:
  - `godlovedawei-cloud.github.io`

## Security

- Do not commit API keys, DNS provider credentials, local environment files, or browser session files.
- Porkbun credentials, if needed, must be supplied through local environment variables only.
- `.DS_Store`, `.env`, `.playwright-mcp/`, and common dependency/cache directories are ignored by `.gitignore`.
