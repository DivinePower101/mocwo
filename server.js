// server.js
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase initialization
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://foojbihdxdoflfjnhfjf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Termii API endpoint and headers
const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || "MOC";
const TERMII_API_URL = "https://api.termii.com/api";
const LEADER_PHONE = process.env.LEADER_PHONE_NUMBER;

// Send prayer request via SMS or WhatsApp using Termii
app.post("/api/sendPrayer", async (req, res) => {
  const { name, phone, location, prayer, method } = req.body;

  console.log("[PRAYER REQUEST] Received:", { name, phone, location, method });

  if (!name || !phone || !prayer) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Validate phone number format
  let formattedPhone = phone;
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+233" + formattedPhone.substring(1);
  } else if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+233" + formattedPhone;
  }

  const messageBody = `
🙏 New Prayer Request

Name: ${name}
Phone: ${formattedPhone}
Location: ${location || "Not provided"}
Prayer: ${prayer}
`;

  try {
    // Save prayer to Supabase
    console.log("[DB] Saving prayer to Supabase...");
    const { error: dbError } = await supabase
      .from("prayer_requests")
      .insert([
        {
          name,
          phone: formattedPhone,
          location: location || null,
          prayer_text: prayer,
          method,
          status: "received"
        }
      ]);

    if (dbError) {
      console.error("[DB ERROR]:", dbError);
      return res.status(500).json({ error: "Failed to save prayer", details: dbError.message });
    }
    console.log("[DB] ✅ Prayer saved to Supabase");

    // Check if required env vars are set
    if (!TERMII_API_KEY || !LEADER_PHONE) {
      console.warn("[WARNING] TERMII_API_KEY or LEADER_PHONE not configured");
      return res.status(200).json({
        message: "Prayer saved successfully (SMS/WhatsApp sending not configured)",
        success: true,
        recipientPhone: LEADER_PHONE || "Not configured",
      });
    }

    let response;
    const termiiPayload = {
      to: LEADER_PHONE,
      from: TERMII_SENDER_ID,
      sms: messageBody,
      type: method === "whatsapp" ? "whatsapp" : "plain",
      api_key: TERMII_API_KEY,
    };
    
    console.log("[TERMII] Sending via " + (method === "whatsapp" ? "WhatsApp" : "SMS"), { to: LEADER_PHONE });
    response = await axios.post(`${TERMII_API_URL}/sms/send`, termiiPayload);

    console.log(`[TERMII] ✅ Response:`, response.data);

    res.status(200).json({
      message: `Prayer request sent via ${method === "whatsapp" ? "WhatsApp" : "SMS"} successfully.`,
      messageId: response.data.message_id || response.data.data?.message_id,
      recipientPhone: LEADER_PHONE,
    });
  } catch (error) {
    console.error(`[ERROR] Failed:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    res.status(500).json({
      error: `Failed to send prayer request via ${method === "whatsapp" ? "WhatsApp" : "SMS"}.`,
      details: error.response?.data?.message || error.response?.data?.error || error.message,
    });
  }
});

app.post("/api/send-prayer-sms", async (req, res) => {
  const { name, phone, location, prayer } = req.body;

  if (!name || !phone || !prayer) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const messageBody = `
New Prayer Request 🙏

Name: ${name}
Phone: ${phone}
Location: ${location || "Not provided"}
Prayer: ${prayer}
`;

  try {
    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.LEADER_PHONE_NUMBER, // leader’s number
    });

    return res.status(200).json({ message: "SMS sent successfully." });
  } catch (err) {
    console.error("Twilio Error:", err);
    return res.status(500).json({ error: "Failed to send SMS." });
  }
});

// Secure admin creation endpoint
// Protect this endpoint by setting ADMIN_CREATION_KEY in your server env and
// passing it in the `x-admin-key` header when calling.
app.post('/api/create-admin', async (req, res) => {
  const ADMIN_CREATION_KEY = process.env.ADMIN_CREATION_KEY;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;

  if (!ADMIN_CREATION_KEY) return res.status(500).json({ error: 'Server not configured for admin creation.' });

  const providedKey = req.headers['x-admin-key'] || req.body?.adminKey;
  if (!providedKey || providedKey !== ADMIN_CREATION_KEY) return res.status(403).json({ error: 'Forbidden' });

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) return res.status(500).json({ error: 'Supabase not configured on server.' });

  const { email, password, full_name } = req.body;
  if (!email || !password || !full_name) return res.status(400).json({ error: 'Missing required fields: email, password, full_name' });

  try {
    // 0) Check if admin already exists in admin_users
    const checkRes = await axios.get(
      `${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (Array.isArray(checkRes.data) && checkRes.data.length > 0) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    // 1) Check if an Auth user already exists for this email
    const authUsersRes = await axios.get(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (Array.isArray(authUsersRes.data) && authUsersRes.data.some(u => u.email === email)) {
      return res.status(409).json({ error: 'Auth user already exists' });
    }

    // 2) Create Supabase Auth user (admin)
    const createUserRes = await axios.post(
      `${SUPABASE_URL}/auth/v1/admin/users`,
      { email, password, email_confirm: true },
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 2) Insert record into public.admin_users via Supabase REST
    const insertRes = await axios.post(
      `${SUPABASE_URL}/rest/v1/admin_users`,
      { email, password_hash: 'placeholder', full_name, role: 'admin', is_active: true },
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      }
    );

    return res.status(201).json({ message: 'Admin created', user: createUserRes.data, admin_row: insertRes.data });
  } catch (err) {
    console.error('Error creating admin:', err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'Failed to create admin', details: err?.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Prayer SMS server running on port ${PORT}`);
});
