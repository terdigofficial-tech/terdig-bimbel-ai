# 🔍 Debug Lanjutan Error 500 Upload Lembar Kerja

## ✅ STATUS: Enhanced Debug Framework Ready

---

## 📋 PERBAIKAN YANG DILAKUKAN:

### 1. **Aggressive Console Logging** ✅
- Comprehensive logging di setiap step
- Full JSON output untuk response objects
- Bucket listing untuk verify keberadaan
- Buffer details logging

### 2. **Bucket Existence Check** ✅
- Sebelum upload, list semua buckets dengan `supabase.storage.listBuckets()`
- Check apakah bucket 'worksheets' ada dalam daftar
- If not found → Return error dengan available buckets list
- If found → Log bucket public status

### 3. **Test Endpoint** ✅
- **Path**: `POST /api/admin/worksheets/test-upload`
- Creates buffer dari teks (tanpa FormData)
- Test upload → cleanup
- Untuk verify Supabase connection tanpa frontend dependency

### 4. **Fallback Local Storage** ✅
- **Path**: `POST /api/admin/worksheets/upload-local`
- Saves files ke `public/uploads/worksheets/sessionId/studentId/`
- Temporary solution while Supabase issue resolves
- Marked with warning logs

---

## 🚀 DEBUGGING WORKFLOW:

### STEP 1: Test Supabase Connection
```bash
# Use Postman/Insomnia or curl:
curl -X POST http://localhost:3000/api/admin/worksheets/test-upload
```

**Expected response (success):**
```json
{
  "success": true,
  "message": "Supabase storage is working correctly",
  "testResults": {
    "bucketsListed": 1,
    "worksheetsBucketFound": true,
    "worksheetsBucketPublic": true,
    "uploadSuccessful": true,
    "publicUrl": "https://...",
    "fileName": "test/..."
  }
}
```

**If bucket not found (ERROR):**
```json
{
  "success": false,
  "error": "Bucket \"worksheets\" tidak ditemukan",
  "availableBuckets": ["existing-bucket-1", "existing-bucket-2"],
  "solution": "Buat bucket di Supabase Dashboard"
}
```

### STEP 2: Check Terminal Logs
When test endpoint runs, check terminal where `npm run dev` is running:

```
========================================
=== TEST WORKSHEET UPLOAD (Server-side) ===
Timestamp: 2025-01-24T10:30:00.000Z
========================================

--- Initializing Supabase client ---
✓ Supabase client initialized

--- Listing buckets ---
Available buckets: [
  { name: 'worksheets', public: true }
]
✓ Bucket "worksheets" found and public: true

--- Creating test file ---
Test buffer created: { size: 65, content: 'Test worksheet image content - ...' }

--- Uploading test file ---
Target path: test/1705994000000_test.txt
✓ Upload successful
Upload response: {
  "id": "uuid...",
  "name": "test/1705994000000_test.txt",
  "owner": "...",
  "owner_id": "...",
  "created_at": "2025-01-24T10:30:00.000Z",
  "updated_at": "2025-01-24T10:30:00.000Z",
  "last_accessed_at": "2025-01-24T10:30:00.000Z",
  "metadata": {...},
  "buckets": {...}
}

--- Getting public URL ---
Public URL: https://dgvuinrhxsitsxkarrku.supabase.co/storage/v1/object/public/worksheets/test/1705994000000_test.txt

--- Cleaning up test file ---
✓ Test file deleted

✅ TEST SUCCESS: Supabase storage is working!
========================================
```

### STEP 3: If Test Passes but Frontend Still Fails
1. Check frontend FormData generation
2. Verify student_id and session_id are valid UUIDs
3. Monitor browser console (F12) during upload
4. Check network tab for request/response details

### STEP 4: If Test Fails - Check Bucket in Supabase

1. **Login to Supabase Dashboard**
2. **Go to Storage section**
3. **Check if 'worksheets' bucket exists**
   - If NO → Create new bucket:
     - Name: `worksheets`
     - ✓ Public bucket (important!)
     - Click Create
   - If YES → Check policies (next step)

4. **Check Bucket Policies**
   - Click on 'worksheets' bucket
   - Go to "Policies" tab
   - Look for INSERT/WRITE policy
   - If none exist → Add policy:
     ```sql
     CREATE POLICY "Allow service_role upload" ON storage.objects
     FOR INSERT
     WITH CHECK (bucket_id = 'worksheets' AND auth.role() = 'service_role');
     ```
   - Or use simpler ALL policy:
     ```sql
     CREATE POLICY "Allow all for service_role" ON storage.objects
     FOR ALL
     USING (bucket_id = 'worksheets' AND auth.role() = 'service_role');
     ```

### STEP 5: Actual Upload Testing

1. **Restart dev server**
   - Stop: Ctrl+C in terminal
   - Start: `npm run dev`

2. **Upload worksheet from frontend**
   - Go to session page
   - Upload worksheet image

3. **Monitor Server Logs**
   - Look for `=== WORKSHEET UPLOAD API ===` section
   - Check all progress indicators
   - Read error messages carefully

4. **Log Output Examples**

**Success:**
```
========================================
=== WORKSHEET UPLOAD API ===
Timestamp: 2025-01-24T10:35:00.000Z
========================================

FormData received: {
  hasFile: true,
  fileName: 'worksheet.jpg',
  fileSize: 234567,
  fileType: 'image/jpeg',
  studentId: 'student-123',
  sessionId: 'session-456'
}
✓ Validation passed

--- Initializing Supabase client ---
✓ Supabase client initialized

--- Checking bucket existence ---
Buckets found: [ { name: 'worksheets', public: true } ]
✓ Bucket "worksheets" exists and is public: true

--- Uploading file to storage ---
Target path: session-456/student-123/1705994100000_worksheet.jpg
Buffer details: { size: 234567, type: 'Buffer', encoding: 'binary' }
Calling supabase.storage.from("worksheets").upload()...
✓ File uploaded successfully
Upload response: {...full json...}

--- Getting public URL ---
✓ Public URL obtained: https://dgvuinrhxsitsxkarrku.supabase.co/storage/v1/object/public/worksheets/...

--- Saving submission to database ---
✓ Submission saved to database
Submission: {...full json...}

✅ SUCCESS: Upload completed
========================================
```

**Failure - Bucket Not Found:**
```
--- Checking bucket existence ---
Buckets found: []
❌ ERROR: Bucket "worksheets" not found in Supabase
Available buckets: none
```

**Failure - Upload Error:**
```
--- Uploading file to storage ---
Target path: session-456/student-123/1705994100000_worksheet.jpg
Buffer details: { size: 234567, type: 'Buffer', encoding: 'binary' }
Calling supabase.storage.from("worksheets").upload()...
❌ Storage upload FAILED
Full error object: {
  "message": "Permission denied",
  "status": 403,
  "statusCode": 403
}
Error details: {
  message: 'Permission denied',
  status: 403,
  statusCode: 403,
  details: '...',
  hint: '...'
}
```

---

## 🛠️ TROUBLESHOOTING GUIDE:

### Error: "Bucket 'worksheets' tidak ditemukan"
**Solution:**
1. Go to Supabase Dashboard → Storage
2. Create new bucket: name `worksheets`
3. ✓ Check "Public bucket"
4. Create
5. Retry upload

### Error: "Permission denied (403)"
**Solution:**
1. Check bucket policies
2. Add INSERT policy for service_role
3. Or add ALL policy for service_role
4. Retry upload

### Error: "File terlalu besar"
**Solution:**
1. Use file < 10MB
2. Compress image before upload
3. Retry

### Error: "Supabase connection failed"
**Solution:**
1. Check internet connection
2. Verify NEXT_PUBLIC_SUPABASE_URL in .env.local
3. Verify SUPABASE_SERVICE_ROLE_KEY in .env.local
4. Restart dev server
5. Retry

### Upload appears to work but file not in Supabase
**Solution:**
1. Check public/uploads/ folder (local fallback might be used)
2. If using fallback → Fix Supabase issues
3. Manually move files to Supabase when ready

---

## 📊 API ENDPOINTS SUMMARY:

| Endpoint | Purpose | Input | Output |
|----------|---------|-------|--------|
| POST `/api/admin/worksheets/upload` | Main upload | FormData: file, student_id, session_id | Success: submission object, Error: detailed error |
| POST `/api/admin/worksheets/test-upload` | Test Supabase | None | Bucket list, upload test result |
| POST `/api/admin/worksheets/upload-local` | Fallback upload | FormData: file, student_id, session_id | Success: local file path, Error: error message |

---

## ✅ QUICK CHECKLIST:

- [ ] Run test endpoint: `/api/admin/worksheets/test-upload`
- [ ] Check terminal logs for "Bucket found" message
- [ ] If bucket not found → Create in Supabase Dashboard
- [ ] If bucket found but upload fails → Check policies
- [ ] If policies need adding → Add via SQL editor
- [ ] Restart dev server: Ctrl+C then `npm run dev`
- [ ] Try frontend upload again
- [ ] Monitor server logs for `=== WORKSHEET UPLOAD API ===`
- [ ] Verify submission in database: worksheet_submissions table
- [ ] Verify image in Supabase Storage: worksheets bucket
- [ ] Test fallback: `POST /api/admin/worksheets/upload-local`
- [ ] Check public/uploads/ folder for local files

---

## 🎯 EXPECTED SUCCESS STATE:

✅ Test endpoint returns success  
✅ Terminal shows "Bucket found"  
✅ Frontend upload completes  
✅ Terminal shows "SUCCESS: Upload completed"  
✅ Image URL returned  
✅ Submission saved to database  
✅ File visible in Supabase Storage (if using Supabase)  
✅ Or file visible in public/uploads/ (if using fallback)  

---

## 🔧 BUILD STATUS:

```
✓ Build: Success (3.7s)
✓ TypeScript: 0 errors (2.6s)
✓ Routes: 26/26 compiled (added test and local endpoints)
✓ Endpoints:
  - /api/admin/worksheets/upload (main)
  - /api/admin/worksheets/test-upload (test)
  - /api/admin/worksheets/upload-local (fallback)
```

---

## 📝 WHAT TO REPORT:

If issue persists, provide:

1. **Test Endpoint Response** (from `/api/admin/worksheets/test-upload`)
   - Full response JSON
   - Available buckets list

2. **Server Terminal Output**
   - From `=== WORKSHEET UPLOAD API ===` to end of error
   - Include all log lines

3. **Supabase Dashboard Info**
   - List of buckets
   - Screenshot of worksheets bucket policies (if exists)

4. **File Details**
   - File size (KB/MB)
   - File format (.jpg, .png, .pdf, etc)
   - File can be opened locally

5. **Browser Console** (F12)
   - Request/response from network tab
   - Any error messages

---

## 🚀 NEXT STEPS:

1. **Immediate**: Test with `/api/admin/worksheets/test-upload`
2. **Based on test result**:
   - If PASS → Issue is frontend FormData, check browser console
   - If FAIL with "bucket not found" → Create bucket
   - If FAIL with "permission denied" → Add policies
   - If FAIL with other error → Share full terminal output
3. **If Supabase issues persist** → Use local fallback temporarily
4. **Once working** → Test with various file formats and sizes

---

Generated: 2025-01-24  
Status: ✅ Ready for aggressive debugging
