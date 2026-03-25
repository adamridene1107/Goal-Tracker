const codes = {};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { action, email, code } = req.body || {};

  // Action: send code
  if (action === "send") {
    if (!email) return res.status(400).json({ error: "Email requis" });
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    codes[email] = { code: c, expires: Date.now() + 15 * 60 * 1000 };
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Trakova <onboarding@resend.dev>",
          to: email,
          subject: "Code de réinitialisation Trakova",
          html: `<div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#0A0A0F;color:#fff;border-radius:16px;border:1px solid #6366f133">
            <h2 style="color:#a78bfa;margin:0 0 8px">Trakova</h2>
            <p style="color:#ffffff80;margin:0 0 24px;font-size:14px">Voici ton code de réinitialisation :</p>
            <div style="background:#1a1a2e;border:1px solid #6366f133;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
              <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:#a78bfa">${c}</span>
            </div>
            <p style="color:#ffffff50;font-size:13px;margin:0">Expire dans <strong style="color:#fff">15 minutes</strong>.</p>
            <p style="color:#ffffff30;font-size:12px;margin-top:12px">Si tu n'as pas demandé ça, ignore cet email.</p>
          </div>`
        })
      });
      if (!r.ok) { const e = await r.json(); return res.status(500).json({ error: e.message || "Erreur envoi" }); }
      return res.status(200).json({ success: true });
    } catch(e) { return res.status(500).json({ error: e.message }); }
  }

  // Action: verify code
  if (action === "verify") {
    if (!email || !code) return res.status(400).json({ error: "Données manquantes" });
    const entry = codes[email];
    if (!entry) return res.status(400).json({ error: "Aucun code pour cet email" });
    if (Date.now() > entry.expires) { delete codes[email]; return res.status(400).json({ error: "Code expiré" }); }
    if (entry.code !== code) return res.status(400).json({ error: "Code incorrect" });
    delete codes[email];
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: "Action invalide" });
}
