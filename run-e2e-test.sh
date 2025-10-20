#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  Pintu Kerja - E2E Test Runner"
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ -z "$BASE_URL" ]; then
  export BASE_URL="http://localhost:5000"
fi

echo "Base URL: $BASE_URL"
echo ""

if ! curl -s "$BASE_URL/api/auth/me" > /dev/null 2>&1; then
  echo "⚠  Warning: Server tidak terdeteksi di $BASE_URL"
  echo "   Pastikan server berjalan dengan: npm run dev"
  echo ""
  read -p "Lanjutkan test? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "Menjalankan E2E tests..."
echo ""

npx tsx tests/e2e-lifecycle.test.ts

exit_code=$?

echo ""
if [ $exit_code -eq 0 ]; then
  echo "✅ Semua test berhasil!"
else
  echo "❌ Ada test yang gagal. Lihat output di atas untuk detail."
fi

exit $exit_code
