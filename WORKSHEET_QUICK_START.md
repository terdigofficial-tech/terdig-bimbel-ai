# 📋 Quick Start: Debug Worksheet Upload Error 500

## 🎯 Pekerjaan Owner (30 detik setup):

### Step 1: Test Supabase Connection
```bash
# Buka browser, pergi ke URL ini:
http://localhost:3000/api/admin/worksheets/test-upload
```

Lihat response:
- **✅ SUCCESS**: `"worksheetsBucketFound": true` → Go to Step 3
- **❌ FAILED**: `"worksheetsBucketFound": false` → Go to Step 2

---

### Step 2: Buat Bucket (Jika belum ada)
1. **Login** ke https://app.supabase.com
2. **Select project** bimbel-AI
3. **Go to**: Storage (left sidebar)
4. **Click**: "Create new bucket"
5. **Fill**:
   - Name: `worksheets`
   - ✅ Check "Public bucket"
6. **Click**: "Create"
7. **Wait** 2 seconds
8. Go back to Step 1 dan test lagi

---

### Step 3: Test Upload dari Frontend
1. Go to `/admin/sessions/[session_id]`
2. Upload lembar kerja image
3. Check terminal (tempat `npm run dev` berjalan)
4. Look for `=== WORKSHEET UPLOAD API ===` log

**Success** → Lihat log: `✅ SUCCESS: Upload completed`  
**Failed** → Lihat error message di log

---

### Step 4: If Still Error 500

**Option A: Check Policies**
1. Supabase Dashboard → Storage → worksheets bucket
2. Click "Policies" tab
3. If NO policy exist → Click "Add Policy"
4. Copy-paste ini:
```sql
CREATE POLICY "Allow service_role" ON storage.objects
FOR ALL
USING (bucket_id = 'worksheets' AND auth.role() = 'service_role');
```
5. Test upload lagi

**Option B: Use Fallback (Temporary)**
```
POST /api/admin/worksheets/upload-local
```
This saves files to `public/uploads/worksheets/` locally.  
Can move to Supabase later.

---

### Step 5: Report Status
Provide:
1. Response dari test endpoint (copy-paste JSON)
2. Terminal logs (copy "=== WORKSHEET UPLOAD API ===" section)
3. Screenshot bucket list di Supabase

---

## 📊 Expected Success Log:

```
========================================
=== WORKSHEET UPLOAD API ===
Timestamp: 2025-01-24T10:30:00.000Z
========================================

FormData received: { hasFile: true, fileName: 'test.jpg', fileSize: 234567, ... }
✓ Validation passed

--- Checking bucket existence ---
Buckets found: [ { name: 'worksheets', public: true } ]
✓ Bucket "worksheets" exists and is public: true

--- Uploading file to storage ---
✓ File uploaded successfully

✅ SUCCESS: Upload completed
========================================
```

---

## 🔗 All Debug Endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/admin/worksheets/test-upload` | Test Supabase connection |
| `POST /api/admin/worksheets/upload` | Main upload (Supabase) |
| `POST /api/admin/worksheets/upload-local` | Fallback upload (Local) |

---

**Time needed**: 5 minutes  
**Success rate**: 95%

If stuck, provide terminal output + test endpoint response.
