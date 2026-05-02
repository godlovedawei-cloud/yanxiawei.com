# Change Log

## 2026-05-02

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
- Created the public GitHub repository `godlovedawei-cloud/yanxiawei.com`.
- Enabled GitHub Pages from the `main` branch root. Latest Pages status: built.

## DNS Notes

- Existing DNS before migration pointed the apex and `www` host at Porkbun parking.
- Planned target is GitHub Pages:
  - apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - apex `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - `www` CNAME: `godlovedawei-cloud.github.io`
- DNS changes require a dry-run review and explicit confirmation before replacing existing records.
- Porkbun API dry-run was attempted, but Porkbun returned `DOMAIN_IS_NOT_OPTED_IN_TO_API_ACCESS`. Enable API access for the domain in Porkbun account settings before applying DNS changes through the API.
