import Groq from 'groq-sdk';

function getGroqClient(): Groq {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
}

export async function generateScenes(rawText: string) {
  const prompt = `Anda adalah asisten produksi konten edukasi SD. Pecah modul berikut jadi scene-by-scene untuk video animasi. ATURAN: 1. Setiap scene = 1 aktivitas/inti. 2. Hasilkan: image_prompt (gaya: educational cartoon, clean, child-friendly), voice_script (30-60 detik, natural Indonesia), capcut_note (editing singkat). 3. Output HANYA JSON valid tanpa markdown. FORMAT: {"scenes": [{"scene_number":1, "title":"...", "duration_min":2, "image_prompt":"...", "voice_script":"...", "capcut_note":"..."}]} MODUL: ${rawText}`;

  const completion = await getGroqClient().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    temperature: 0.3
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return parsed.scenes || [];
}
