# Smoke suite (S5/07)

Run cutover gate trước S1 + S4 deploy.

## Tiền điều kiện

- BE chạy `localhost:3002` (hoặc `PW_BASE_URL` trỏ đúng).
- FE serve `dist/` qua `npm run serve` hoặc UMI dev (`npm run start`).
- Seed `01_admin` đã chạy → tài khoản `admin@local.test / Admin123` (default).
- Override env nếu khác:
  ```bash
  export PW_USER=...
  export PW_PASS=...
  export PW_BASE_URL=http://localhost:8000
  ```

## Run local

```bash
# Build + serve trên cùng port test
npm run build-prod
npm run serve -- -p 8000 dist/ &

# Run smoke
npx playwright install chromium
npx playwright test --project=smoke

# Xem report
npx playwright show-report
```

## Spec status

| File | Test | Status |
|---|---|---|
| 01_login | login → dashboard, logout → login | active |
| 02_real_estate | list page loads | active; detail SKIP |
| 03_upload | presign + S3 PUT | SKIP (cần BE deploy) |
| 04_customer_crud | list page loads | active; create SKIP |
| 05_import_csv | import via Multer | SKIP (cần fixture + seed) |
| 06_permission | 403 banner + cross-tab logout | active (banner mount TBD) |

SKIP có lý do trong file. Bật khi BE / data sẵn sàng.

## CI

Workflow `.github/workflows/playwright.yml` (chưa tạo — backlog) — workflow_dispatch + daily.
DECISIONS F1: KHÔNG block deploy. Failure → Telegram alert group `-5226544067`.
