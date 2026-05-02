# yanxiawei.com

Academic homepage for Yanxia Wei, Ph.D.

## Site

- Canonical domain: `https://yanxiawei.com`
- Hosting: GitHub Pages
- Repository: `godlovedawei-cloud/yanxiawei.com`
- Publishing source: `main` branch, repository root

## Contents

- `index.html`: single-page academic homepage
- `assets/profile.jpg`: optimized web portrait
- `assets/profile-original.png`: source portrait copy
- `assets/Yanxia_Wei_CV.pdf`: downloadable CV
- `CNAME`: GitHub Pages custom domain
- `.nojekyll`: disables Jekyll processing

## Deployment

GitHub Pages serves this repository directly from the root of `main`.

Expected DNS:

- Apex `A` records point to GitHub Pages:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Apex `AAAA` records point to GitHub Pages:
  - `2606:50c0:8000::153`
  - `2606:50c0:8001::153`
  - `2606:50c0:8002::153`
  - `2606:50c0:8003::153`
- `www` CNAME points to `godlovedawei-cloud.github.io`

## Security

Do not commit API keys, DNS provider credentials, or local environment files. Porkbun credentials must be supplied through local environment variables only.
