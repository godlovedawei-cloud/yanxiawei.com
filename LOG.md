# Change Log

## 2026-05-02

- Updated the hero copy to a more forward-looking profile, added LinkedIn entry points, and aligned the page title/metadata with the broader research profile.
- Rebuilt the publications section from the supplied `article list.txt` and Google Scholar results.
- Reordered the page so first-author papers appear first, followed by collaborative papers.
- Replaced `et al.` with full author lists for the listed articles and added PubMed links or PubMed search links where needed.
- Added the secondary email address `yanxiawei519@gmail.com` as plain text, without a mailto link.
- Added the 2024 Circulation conference abstract to a dedicated conference section.
- Uploaded the missing article PDFs and standardized the PDF links to open in a new window.
- Replaced the CV with the newer file `CV_yanxiawei new.pdf`.
- Added selected article PDFs from `Articles.zip` under `assets/articles/` and linked them from the publications section.
- Updated profile wording, position title, research experience, publication metadata, and skills to match the newer CV.
- Retrieved the static site handover from the Tencent Cloud server path `/home/ubuntu/projects/yanxiawei.com/`.
- Rebuilt the homepage as an English academic profile with updated sections for research focus, experience, major projects, publications, skills, teaching, and honors.
- Added the supplied portrait and CV:
  - `assets/profile.jpg`
  - `assets/profile-original.png`
  - `assets/Yanxia_Wei_CV.pdf`
- Added GitHub Pages files:
  - `CNAME`
  - `.nojekyll`
- Added project documentation:
  - `README.md`
  - `LOG.md`
- Created the public GitHub repository `godlovedawei-cloud/yanxiawei.com`, then renamed it to `godlovedawei-cloud/yanxiawei-homepage`.
- Enabled GitHub Pages from the `main` branch root. Latest Pages status: built.
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
- Authoritative Porkbun nameservers return the GitHub Pages records. Some recursive resolvers may continue to show old parking records until cache expiry.
- HTTP is serving from GitHub Pages. HTTPS certificate provisioning is pending on GitHub Pages and should be rechecked after propagation.
