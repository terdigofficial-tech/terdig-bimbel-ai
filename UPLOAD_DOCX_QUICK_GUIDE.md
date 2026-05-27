# 📄 Upload DOCX Soal & Kunci Jawaban - QUICK GUIDE

## 🎯 What's New

Admin can now upload a DOCX file with questions and answers. AI automatically parses it into structured JSON for the answer key form.

---

## 🚀 How to Use

### Step 1: Open Material Editor
```
Go to: /admin/materials/[material-id]
```

### Step 2: Find Answer Key Section
```
Scroll down to: "🔑 Kunci Jawaban"
```

### Step 3: Upload DOCX
```
Click button: "📄 Upload Soal & Jawaban (DOCX)"
   ↓
Select your .docx file
   ↓
Wait for processing...
   ↓
See: "✅ X soal berhasil diparsing dari DOCX"
```

### Step 4: Review & Save
```
Check the auto-filled JSON
(Edit if needed)
   ↓
Click: "💾 Simpan Kunci Jawaban"
   ↓
Done! ✅
```

---

## 📝 DOCX Format

The DOCX file should contain questions and answers. Any format works:

**Simple:**
```
1. Question here?
   Answer: A

2. Another question?
   Answer: Jawaban panjang...
```

**Multiple Choice:**
```
1. What is X?
   A) Option A
   B) Option B
   Answer: A
```

**Mixed:**
```
PG QUESTIONS:
1. Question?
   A) A  B) B  C) C
   Ans: A

ESSAY QUESTIONS:
1. Explain something
   Ans: Detailed answer here...
```

---

## 🔧 What Happens Behind the Scenes

```
DOCX File
   ↓ (Mammoth)
Extract Text
   ↓ (Groq AI)
Parse Questions
   ↓
Return JSON
[
  {"question_number":1,"type":"pg","correct_answer":"A","max_score":10},
  {"question_number":2,"type":"esai","correct_answer":"...","max_score":15}
]
   ↓
Auto-fill Form
   ↓
User can edit
   ↓
Save to Database
```

---

## ✅ Features

- ✅ Automatic DOCX parsing
- ✅ AI-powered question detection
- ✅ Question type identification (PG vs Essay)
- ✅ Auto-scoring inference
- ✅ Visual preview of detected questions
- ✅ Manual editing support
- ✅ JSON validation
- ✅ Toast notifications

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| File won't upload | Make sure it's a .docx file (not .doc or .txt) |
| No questions detected | Check DOCX format - ensure questions are clear |
| JSON shows errors | Edit manually or re-upload formatted DOCX |
| Form won't save | Verify JSON syntax is valid |

---

## 📊 Supported Question Types

- ✅ **PG (Pilihan Ganda):** A, B, C, D, E or 1, 2, 3, 4, 5
- ✅ **Essay/Uraian:** Full text answers
- ✅ **Mixed:** PG and essay in same document

---

## 🎓 Example DOCX Content

**Indonesian Math Test:**
```
KUNCI JAWABAN MATEMATIKA KELAS 5

PILIHAN GANDA (Skor: 10 per soal)
1. Berapa hasil 2 + 2?
   A) 3  B) 4  C) 5  D) 6
   Jawab: B

2. Apa arti dari 5 × 3?
   A) 5 + 3  B) 5 + 5 + 5  C) 3 + 3 + 3  D) Tidak tahu
   Jawab: B

ESSAY (Skor: 20 per soal)
1. Jelaskan apa itu pecahan?
   Jawab: Pecahan adalah bagian dari suatu kesatuan. 
   Ditulis dengan a/b, di mana a adalah pembilang 
   dan b adalah penyebut.

2. Bagaimana cara menjumlahkan pecahan berbeda penyebut?
   Jawab: Pertama, samakan penyebutnya dengan KPK.
   Kemudian, tambahkan pembilangnya.
```

---

## 📞 Support

For issues, check:
- `/api/admin/materials/parse-answer-key` logs
- Browser console for errors
- Supabase dashboard for saved data

---

**Last Updated:** 2025-01-23  
**Status:** ✅ Ready to Use
