import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).end();

  const { email, months } = req.body || {};
  if (!email || !months) return res.status(400).json({ error: "Email et mois requis" });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    // 1. Chercher le customer Stripe par email
    const customers = await stripe.customers.list({ email, limit: 1 });
    
    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      
      // 2. Chercher l abonnement actif
      const subs = await stripe.subscriptions.list({ customer: customerId, limit: 1 });
      
      if (subs.data.length > 0) {
        const sub = subs.data[0];
        // 3. Prolonger la periode d essai de X mois
        const trialEnd = new Date()
        trialEnd.setMonth(trialEnd.getMonth() + parseInt(months))
        await stripe.subscriptions.update(sub.id, {
          trial_end: Math.floor(trialEnd.getTime() / 1000),
        });
      } else {
        // Pas d abonnement - creer un coupon de reduction
        const coupon = await stripe.coupons.create({
          duration: "repeating",
          duration_in_months: parseInt(months),
          percent_off: 100,
          name: `${months} mois gratuits - Trakova`,
        });
        // Appliquer le coupon au customer
        await stripe.customers.update(customerId, {
          coupon: coupon.id,
        });
      }
    }

    // 4. Mettre a jour Supabase aussi
    const { data: profiles } = await supabase.from("profiles").select("id").eq("email", email);
    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + parseInt(months));
      const { data: goalData } = await supabase.from("goal_data").select("id, settings").eq("user_id", userId).single();
      if (goalData) {
        await supabase.from("goal_data").update({
          settings: { ...(goalData.settings || {}), freeUntil: expiry.toISOString(), giftedMonths: months }
        }).eq("id", goalData.id);
      } else {
        await supabase.from("goal_data").insert({
          user_id: userId,
          settings: { freeUntil: expiry.toISOString(), giftedMonths: months }
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
