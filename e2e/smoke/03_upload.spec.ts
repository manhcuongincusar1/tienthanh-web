// S5/07 — Presigned upload flow (FE-03 + FE-04).
import path from 'path';
import { test, expect } from './_setup';

test.skip('upload public image (presign → S3 PUT → ack)', async ({ authedPage }) => {
  // SKIP: cần BE deployed presigned route + S3 bucket CORS.
  // Bật khi cutover S3/05 BE deploy + bucket policy ready.
  await authedPage.goto('/cms/real-estate-sell/new');

  const fixture = path.join(__dirname, '../fixtures/sample.jpg');

  // Wait cho MediaUpload component render.
  const fileInput = authedPage.locator('input[type="file"]').first();
  await expect(fileInput).toBeAttached({ timeout: 10_000 });

  // Capture network: presign + S3 PUT.
  const presignResp = authedPage.waitForResponse((r) =>
    r.url().includes('/upload/presign') && r.request().method() === 'POST',
  );
  const s3Resp = authedPage.waitForResponse((r) =>
    r.request().method() === 'PUT' && /\.s3[.-]/.test(r.url()),
  );

  await fileInput.setInputFiles(fixture);
  await presignResp;
  await s3Resp;

  // Progress reach 100 (Ant Progress percent attr).
  await expect(authedPage.locator('text=/100%|hoàn tất/i')).toBeVisible({ timeout: 30_000 });
});

test.skip('upload private file → visibility=private', async ({ authedPage }) => {
  // SKIP: needs ConfidentialUpload mounted in form. Verify request body has isConfidential:true.
});
