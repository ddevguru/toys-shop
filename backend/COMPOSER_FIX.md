# Composer Dependency Fix

## Issue
FPDF package version constraint error - `setasign/fpdf ^2.6` not available

## Solution

### Option 1: Remove FPDF (Recommended for now)
FPDF is optional for invoice generation. We're using HTML invoices which work without it.

Already updated `composer.json` to remove FPDF requirement.

### Option 2: Install FPDF separately (if needed later)
```bash
composer require setasign/fpdf:^1.8
```

### Option 3: Use Alternative PDF Library
```bash
composer require dompdf/dompdf
```

## Current Setup
- ✅ PhpSpreadsheet for Excel import/export
- ✅ HTML invoices (no PDF library needed)
- ✅ Can add PDF later if required

## Install Dependencies Now

```bash
cd backend
composer install
```

Or install PhpSpreadsheet only:
```bash
composer require phpoffice/phpspreadsheet
```

## Note
Invoice generation currently uses HTML format which can be:
- Viewed in browser
- Printed to PDF using browser
- Converted to PDF using external service if needed

PDF library can be added later if specifically required.

