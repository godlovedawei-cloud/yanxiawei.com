# Change Log

## 2026-05-02

### Homepage Refinement

- Reworked the hero into a clearer academic positioning structure:
  - headline: `Data-Driven Epidemiology` and `& Public Health Research`
  - sub-headline focused on large-scale cohorts, genetic evidence, biomarker data, cardiovascular disease, and chronic disease etiology
  - status: `Actively seeking Postdoctoral Fellowship or related research scientist opportunities.`
  - added a warm contact sentence for interested PIs and collaborators
- Tuned the hero text to include professional personal traits without sounding informal:
  - warm and reliable collaborator
  - clear cross-disciplinary communicator
  - fast adoption of analytical and AI-assisted research workflows
- Reduced headline scale for both desktop and mobile so the first screen is strong but not oversized.
- Added LinkedIn and ORCID as button-style links only, removing duplicate contact text.
- Made both email addresses more visible and clickable through `mailto:` links:
  - `yanxiawei@zju.edu.cn`
  - `yanxiawei519@gmail.com`
- Updated the browser tab icon from the old `V` mark to a Yanxia-oriented favicon.

### Flagship Projects

- Added a new `Flagship Projects` section between Research Focus and Experience.
- Project 1: BMC Medicine / Valvular Heart Disease.
  - Shows UK Biobank sample size, incident VHD cases, post-VHD deaths, and life-year gain.
  - Uses a forest plot figure to avoid visual duplication with the EJPC project.
  - Methods now mention EHR-linked cohort design, five-factor lifestyle score, Townsend-based SES, Gompertz multistate models, transition-specific HRs, interaction testing, weighted life tables, and sensitivity analyses.
  - Added Key Findings and Why It Matters text for PI-facing scanning.
  - Later strengthened Why It Matters around the VHD prevention gap, aging-related disease burden, life-expectancy translation, and health equity.
- Project 2: European Journal of Preventive Cardiology / Type 2 Diabetes.
  - Shows UK Biobank sample size, T2DM sample size, incident ASCVD cases, and post-ASCVD deaths.
  - Uses the life expectancy figure from the paper.
  - Methods now mention T2DM ascertainment, Life's Essential 8 CVH score, three-state Gompertz multistate models, weighted transition rates, population-based life tables, MICE, Monte Carlo bootstrapping, and sex- and age-specific estimates.
  - Added Key Findings and Why It Matters text.
  - Later strengthened Why It Matters around disease-free lifespan, Life's Essential 8, and shifting diabetes management from risk-factor control toward closing survival-quality gaps.
- Checked desktop and 390px mobile layouts with Playwright. No horizontal overflow was detected.

### Publications and EndNote

- Removed database-style `PubMed 41277730` badges from publication entries.
- Kept PubMed as ordinary link buttons.
- Restored IF/Q/citation information as visible inline tags:
  - `IF: 7.5`, `Q1`
  - `IF: 8.3`, `Q1`
  - `IF: 6.0`, `Q2`, `Citations: 246`
  - `Chinese Core Journal`
- Kept DOI values in standard text format.
- Added submitted co-first-author paper:
  - Liu Q*, Wei Y*, Fan J, et al. Associations of Serum Testosterone and Sex Hormone-binding Globulin with the Risk of Degenerative Valvular Heart Diseases in Men and Women. Submitted. Co-first author.
- Added EndNote export:
  - source: `/Users/sun/Desktop/Yanxia/文章/enw.txt`
  - site file: `assets/Yanxia_Wei_publications.enw`
  - homepage button: `Download EndNote (.enw)` with the `download` attribute.

### Experience, Skills, and CV Alignment

- Strengthened the hero affiliation display for the Second Affiliated Hospital, Zhejiang University School of Medicine so it reads as a confident institutional anchor rather than muted secondary text.
- Added institution logos to the Experience and Education timeline:
  - Second Affiliated Hospital, Zhejiang University School of Medicine
  - Fudan University
  - University of Melbourne
  - Shanxi Medical University
- Refined the institution logos from separate timeline columns into larger heading-side marks, improving visual balance while preserving mobile readability.
- Expanded the Assistant Research Fellow entry to highlight the Department of Cardiology at SAHZU as a National Clinical Key Specialty, a nationally leading cardiovascular center, and a center with global top-three interventional cardiology procedure volume.
- Added clinician-facing responsibilities to the Assistant Research Fellow entry, including epidemiologic and biostatistical support, clinical research design consultation, statistical strategy advising, and statistics training for cardiology clinicians.
- Revised the University of Melbourne visiting Ph.D. entry to state mentorship by Professor Ron Borland and frame the work around behavior change theory, smoking cessation research, and intervention evaluation.
- Aligned project and publication language with `/Users/sun/Desktop/Yanxia/CV_yanxiawei new.pdf`.
- Updated smoking cessation project:
  - `Theory-Driven mHealth Intervention for Smoking Cessation`
  - role: `PhD candidate, 2016-2019`
  - removed `Investigator` and `National Natural Science Foundation of China` wording from the homepage.
- Updated smoke-free legislation project:
  - `Advocacy and Evaluation of Comprehensive Smoke-Free Legislation in Shanghai`
  - role: `PhD candidate, 2015-2019`
  - removed `Investigator` and `Bloomberg Initiative Grant` wording from the homepage.
- Reorganized skills under:
  - `Methods, data platforms, and research tooling.`
- Strengthened methods coverage:
  - survival analysis
  - multistate models
  - causal inference
  - Mendelian randomization
  - propensity score methods
  - longitudinal data analysis
  - biomarker integration
  - EHR phenotyping
  - exposure-wide association studies
  - systematic reviews and meta-analysis
- Updated software and tooling:
  - R, advanced
  - Python, advanced
  - SAS
  - NVivo
  - Git/GitHub
  - UK Biobank RAP
  - AI-assisted coding workflows
- Moved languages into a separate block:
  - Chinese, native
  - English, fluent
- Later simplified the skills section by removing the standalone AI Tooling column and keeping only `AI-assisted coding workflows` under Software.
- Removed the separate Teaching block because the current cardiology clinician training responsibilities are now integrated into the 2021-present appointment.

### Assets and Source Materials

- Added and linked:
  - `assets/Yanxia_Wei_publications.enw`
  - `assets/Projects/`
  - `assets/yanxiawei cv.md`
- Initially pushed only homepage-used project figures, then added the complete MinerU project outputs so future editors can pull the repository and continue improving the Projects section without rerunning extraction.
- `.DS_Store` files were not committed because they are ignored by `.gitignore`.

### Validation

- Ran static local link checks for homepage asset references.
- Ran `git diff --check` before the homepage commit.
- Noted that `git diff --check --cached` reports trailing whitespace inside MinerU-generated markdown and extracted CV markdown. These were intentionally preserved to keep generated source files close to their original extraction output.
- Previewed the site locally with:

  ```bash
  python3 -m http.server 4173
  ```

- Checked desktop and mobile rendering with Playwright:
  - desktop viewport: 1440px wide
  - mobile viewport: 390px wide
  - no horizontal overflow
  - EndNote link has `download`
  - project images render

### GitHub

- Commit `7c2f5ef`: `Refine homepage hero and projects`
  - pushed to `origin/main`
- Commit `074af77`: `Add MinerU project sources`
  - pushed to `origin/main`

## Initial Build and Migration Notes

- Retrieved the static site handover from the Tencent Cloud server path `/home/ubuntu/projects/yanxiawei.com/`.
- Rebuilt the homepage as an English academic profile with sections for research focus, experience, major projects, publications, skills, teaching, and honors.
- Added the supplied portrait and CV:
  - `assets/profile.jpg`
  - `assets/profile-original.png`
  - `assets/Yanxia_Wei_CV.pdf`
- Added selected article PDFs under `assets/articles/` and linked them from the publications section.
- Rebuilt the publications section from supplied publication materials and Google Scholar results.
- Ordered first-author papers first, followed by collaborative papers.
- Added PubMed links or PubMed search links where available.
- Added the 2024 Circulation conference abstract to a dedicated conference section.
- Added GitHub Pages files:
  - `CNAME`
  - `.nojekyll`
- Created the public GitHub repository `godlovedawei-cloud/yanxiawei.com`, then renamed it to `godlovedawei-cloud/yanxiawei-homepage`.
- Enabled GitHub Pages from the `main` branch root. Pages built successfully.
- Moved the complete project into `/Users/sun/Desktop/Codex/个人网页/Yanxiawei` so the parent directory can host a second webpage project later.

## DNS Notes

- Existing DNS before migration pointed the apex and `www` host at Porkbun parking.
- DNS was updated through the Porkbun API after enabling domain API access and receiving explicit confirmation.
- Deleted the apex parking `ALIAS` record for `uixie.porkbun.com`.
- Added GitHub Pages records:
  - apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - apex `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - `www` CNAME: `godlovedawei-cloud.github.io`
- MX, TXT, and NS records were preserved.
- Authoritative Porkbun nameservers returned the GitHub Pages records after update.
- HTTP served from GitHub Pages after deployment. HTTPS certificate provisioning depended on GitHub Pages DNS propagation timing.
