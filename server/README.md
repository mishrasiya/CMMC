# server/ — automation backend (coming next)

This folder is a placeholder for the local automation service that will:

1. Hold API credentials securely (local `.env`, never committed).
2. Run **connector modules** per provider (Okta, AWS, Microsoft/Entra, GitHub, …).
3. Execute **checks** that emit `{ controlId, result, evidence, collectedAt }`.
4. Store results (SQLite) and expose a small REST API the UI calls.
5. Run on a schedule (continuous monitoring) so control status stays fresh.

## What maps to what (automatable controls)

| Source | Example controls |
| --- | --- |
| Identity (Okta / Entra / Google) | 3.5.3 MFA, 3.1.1/3.1.5-6 least privilege, 3.5.6 inactive disable, 3.5.7-10 passwords, 3.1.8/3.1.10-11 lockout/session |
| Cloud (AWS / Azure / GCP) | 3.3.1-2 logging, 3.13.8/11/16 encryption, 3.13.1/5/6 boundary, 3.4.1-2 baselines |
| Endpoint / MDM (Intune / Jamf / CrowdStrike) | 3.14.2/4-5 malware, 3.1.19 disk encryption, 3.14.1 patching, 3.8.7 removable media |
| Vuln scanner | 3.11.2-3 scanning & remediation |
| Source / CI (GitHub / GitLab) | 3.4.3-4 change control |
| HRIS / LMS | 3.9.1 screening, 3.9.2 termination/transfer, 3.2.2 training |

Documentation/process controls (physical protection, policies, IR narrative, etc.)
stay in the manual flow already built into the UI.

## Credentials you'll provide (read-only, least privilege)

Put these in `server/.env` (git-ignored). You never share them with anyone.

- **Okta**: `OKTA_ORG_URL`, `OKTA_API_TOKEN`
- **AWS**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (SecurityAudit/ViewOnly)
- **Microsoft/Entra**: `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` (Graph read scopes)
- **GitHub**: `GITHUB_TOKEN` (fine-grained read PAT), `GITHUB_ORG`

Tell Claude which stack (Node/Express or Python/FastAPI) and which connector to
build first, and this folder gets scaffolded with a working vertical slice:
connect → collect → map to controls → create evidence → update status.
