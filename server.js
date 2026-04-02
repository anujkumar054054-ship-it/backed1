import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fetch from "node-fetch";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

const MONGO_URI = "mongodb+srv://jaxilo2383_db_user:f1HJjbrHFUX5H5dj@cluster0.f0zj6v5.mongodb.net/?appName=Cluster0";
await mongoose.connect(MONGO_URI, {});
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_USERNAME = process.env.BOT_USERNAME;
const VERIFIX_URL = "https://super-duper-journey-rho.vercel.app";

export const REQUIRED_CHANNELS = [
  { type: "telegram", name: "𝗥𝗰𝗯 𝗟𝗼𝗼𝘁𝘀 [ 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 ]",   link: "https://t.me/+wGIC2gDn5_44NDg1",  chatId:"-1002370709036" },
  { type: "telegram", name: "𝗚𝗜𝗙𝗧𝗦 𝗔𝗥𝗘𝗔",     link: "https://t.me/+XdZuJwc9_4Q2Yjk1",  chatId: "-1002047501605" },
  { type: "telegram", name: "⏤‌‌‌‌𝗧𝗘𝗔𝗠 > 𝗧𝗗𝗫 ™(🇮🇳)",    link: "https://t.me/+JsisAx6p0RoyYWE9",  chatId: "-1002132029651" },
  { type: "telegram", name: "𝗦𝗶𝗻𝗴𝗵 𝗟𝗼𝗼𝘁𝘀 ( 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 )",   link: "https://t.me/+EtUY2BhMaic0OThl",  chatId: "-1002011746823" },
  { type: "telegram", name: "𝗢𝗣 𝗟𝗼𝗼𝘁𝗲𝗿𝘀 ( 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 )",    link: "https://t.me/+HqXsPCqDf90yN2U1",chatId:"-1002066749099" },
  { type: "telegram", name: "𝗙𝗿𝗲𝗲 𝗘𝗮𝗿𝗻𝗶𝗻𝗴 𝗟𝗼𝗼𝘁𝘀🤑🇮🇳",   link: "https://t.me/+f_FWvnGidyA2YzI1",  chatId:"-1002027308729" },
  { type: "telegram", name: "🥇𝙎𝙐𝘿𝙄𝙋-𝙀𝘼𝙍𝙉-𝙒𝙄𝙏𝙃🥇",     link: "https://t.me/+ZRv5S1XJKj5iNGVl",  chatId: "-1002220786748" },
  { type: "telegram", name: "🎁 𝟗𝟏 𝐂𝐋𝐔𝐁 𝐆𝐈𝐅𝐓",    link: "https://t.me/+md4XtB48aSgzMjg1",  chatId: "-1002064086589" },
  { type: "telegram", name: "𝗔𝗹𝗹 𝗟𝗼𝗼𝘁 𝗘𝗮𝗿𝗻𝗶𝗻𝗴 ✌️",   link: "https://t.me/+pRLeyuZM2cE2YmU9",  chatId:"-1002338277890" },
  { type: "telegram", name: "𝗦𝗞 𝗖𝗢𝗟𝗢𝗨𝗥 𝗧𝗥𝗜𝗖𝗞 🎁",     link: "https://t.me/+vwkRgM-QcrJjNTdl",  chatId: "-1002109462741" },
  { type: "telegram", name: "𝗥𝗮𝗺 𝗘𝗮𝗿𝗻𝗶𝗻𝗴 𝗧𝗿𝗶𝗰𝗸𝘀 💪",    link: "https://t.me/+VX-21wU69Po2OTA9",  chatId: "-1002778585437" },
  { type: "youtube",  name: "𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗯𝗲 𝗡𝗼𝘄", link: "https://www.youtube.com/@hidden_gamerx" },
];
const User = mongoose.model("User", new mongoose.Schema({
  chatId:               { type: String, unique: true },
  username:             String,
  avatar:               String,
  status:               { type: String, default: "active" },
  referral_code:        String,
  referred_by:          String,
  channels_verified:    { type: Boolean, default: false },
  channels_verified_at: Date,
  is_duplicate_device:  { type: Boolean, default: false },
  created_at:           { type: Date, default: Date.now }
}));

const Wallet = mongoose.model("Wallet", new mongoose.Schema({
  chatId:          { type: String, unique: true },
  balance:         { type: Number, default: 0 },
  pending_balance: { type: Number, default: 0 },
  currency:        { type: String, default: "INR" }
}));

const Txn = mongoose.model("Txn", new mongoose.Schema({
  chatId: String, type: String, amount: Number,
  description: String, status: String,
  timestamp: { type: Date, default: Date.now }, metadata: {}
}));

const UPI = mongoose.model("UPI", new mongoose.Schema({
  chatId: { type: String, unique: true }, vpa: String,
  bank_name: String, is_verified: Boolean, linked_at: Date
}));

const Referral = mongoose.model("Referral", new mongoose.Schema({
  chatId: String, referral_code: String,
  referred_users: [{
    user_id: String, username: String, joined_at: Date,
    earned_amount: Number, is_active: Boolean
  }],
  total_earned:   { type: Number, default: 0 },
  pending_earned: { type: Number, default: 0 }
}));

const Withdraw = mongoose.model("Withdraw", new mongoose.Schema({
  chatId: String, amount: Number, vpa: String, fee: Number,
  net_amount: Number, status: String, initiated_at: Date,
  completed_at: Date, transaction_id: String,
  failure_reason: String
}));

const JoinRequest = mongoose.model("JoinRequest", new mongoose.Schema({
  userId: String,
  chatId: String
}));

const YoutubeVisit = mongoose.model("YoutubeVisit", new mongoose.Schema({
  userId: { type: String, unique: true },
  visitedAt: { type: Date, default: Date.now }
}));

async function ensureWallet(chatId) {
  let w = await Wallet.findOne({ chatId });
  if (!w) w = await Wallet.create({ chatId });
  return w;
}

async function sendUPIPayout(amount, vpa) {
  const txn_id = "TXN" + Date.now() + Math.floor(Math.random() * 1000);
  const url = `https://full2sms.in/api/v2/payout`
    + `?mid=arHWAdR9X8PmgEGz0sqfjcvpS`
    + `&mkey=0scTS7GqxrUzlJwP2tjpLhovg`
    + `&guid=207ElWeBFwMiGJZ3HaSypcrTV`
    + `&type=upi`
    + `&amount=15`
    + `&upi=${encodeURIComponent(vpa)}`
    + `&info=payout`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "success" && data.code === "PPT_200") {
      return { success: true, txn_id: data.txn_id || txn_id, message: data.message, raw: data };
    }
    return { success: false, raw: data, txn_id: txn_id, message: data.message || "Payout failed" };
  } catch (err) {
    return { success: false, error: err.message, txn_id: txn_id };
  }
}

async function notifyUser(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" })
  });
}

async function checkChannelMembership(userChatId, channelChatId) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: channelChatId, user_id: Number(userChatId) })
    });
    const data = await res.json();
    if (!data.ok) return false;
    const status = data.result?.status;
    return ["member", "administrator", "creator", "restricted"].includes(status);
  } catch (e) {
    return false;
  }
}

app.get("/api/user/info", async (req, res) => {
  const { chatId, username, avatar } = req.query;
  if (!chatId) return res.status(400).json({ error: "chatId required" });
  let user = await User.findOne({ chatId });
  if (!user) {
    const referralCode = Math.floor(100000 + Math.random() * 900000).toString();
    user = await User.create({ chatId, username, avatar, referral_code: referralCode });
    await ensureWallet(chatId);
  } else {
    user.username = username || user.username;
    user.avatar   = avatar   || user.avatar;
    await user.save();
  }
  res.json(user);
});

app.get("/api/wallet/balance", async (req, res) => {
  const { chatId } = req.query;
  if (!chatId) return res.status(400).json({ error: "chatId required" });
  const wallet = await ensureWallet(chatId);
  res.json({
    balance: wallet.balance.toFixed(2),
    available_balance: wallet.balance.toFixed(2),
    pending_balance: wallet.pending_balance.toFixed(2),
    currency: wallet.currency
  });
});

app.get("/api/wallet/transactions", async (req, res) => {
  const { chatId, limit = 20, offset = 0 } = req.query;
  const tx    = await Txn.find({ chatId }).sort({ timestamp: -1 }).skip(+offset).limit(+limit);
  const total = await Txn.countDocuments({ chatId });
  res.json({ transactions: tx, total });
});

app.get("/api/upi", async (req, res) => {
  const { chatId, vpa, bank_name } = req.query;
  let upi = await UPI.findOne({ chatId });
  if (!upi) {
    upi = await UPI.create({ chatId, vpa, bank_name, is_verified: !!vpa, linked_at: vpa ? new Date() : null });
  } else {
    if (vpa) { upi.vpa = vpa; upi.is_verified = true; upi.linked_at = new Date(); }
    if (bank_name) upi.bank_name = bank_name;
    await upi.save();
  }
  res.json(upi);
});

app.post("/api/withdraw/initiate", async (req, res) => {
  const { chatId, amount, vpa } = req.body;
  const withdrawAmount = Number(amount);
  if (!chatId || !withdrawAmount || !vpa) return res.status(400).json({ error: "Invalid request" });
  const wallet = await ensureWallet(chatId);
  if (wallet.balance < withdrawAmount) return res.json({ error: "Insufficient balance" });
  wallet.balance -= withdrawAmount;
  await wallet.save();
  const wd = await Withdraw.create({
    chatId, amount: withdrawAmount, fee: 5, net_amount: Math.max(withdrawAmount - 5, 0),
    vpa, status: "processing", initiated_at: new Date()
  });
  await Txn.create({ chatId, type: "debit", amount: withdrawAmount,
    description: "Withdrawal", status: "processing", metadata: { withdrawal_id: wd._id } });
  try {
    const payout = await sendUPIPayout(withdrawAmount, vpa);
    if (!payout?.success) throw new Error("Payout failed");
    wd.status = "completed"; wd.completed_at = new Date(); wd.transaction_id = payout.txn_id;
    await wd.save();
    await Txn.updateOne({ "metadata.withdrawal_id": wd._id }, { status: "success" });
    await notifyUser(chatId, `✅ Withdrawal Successful\n\n₹${withdrawAmount} sent to ${vpa}\nTxn ID: ${payout.txn_id}`);
    return res.json({ success: true, txn_id: payout.txn_id, amount: withdrawAmount });
  } catch (err) {
    wallet.balance += withdrawAmount; await wallet.save();
    wd.status = "failed"; wd.failure_reason = "Payout failed"; await wd.save();
    await Txn.updateOne({ "metadata.withdrawal_id": wd._id }, { status: "failed" });
    await notifyUser(chatId, `❌ Withdrawal Failed\n\n₹${withdrawAmount} refunded to wallet`);
    return res.json({ error: "Payout failed, amount refunded" });
  }
});

app.get("/api/referral", async (req, res) => {
  const { chatId } = req.query;
  const user = await User.findOne({ chatId });
  const ref  = await Referral.findOne({ chatId });
  res.json({
    code: user?.referral_code || "",
    link: `https://t.me/${BOT_USERNAME}?start=${user?.referral_code || ""}`,
    total_referrals:         ref?.referred_users.length || 0,
    successful_referrals:    ref?.referred_users.filter(x => x.is_active).length || 0,
    total_earned:            (ref?.total_earned || 0).toFixed(2),
    pending_earned:          (ref?.pending_earned || 0).toFixed(2),
    commission_per_referral: "5.00",
    is_duplicate_device:     user?.is_duplicate_device || false
  });
});

app.get("/api/referral/users", async (req, res) => {
  const { chatId } = req.query;
  const ref = await Referral.findOne({ chatId });
  res.json({ referrals: ref?.referred_users || [], total: ref?.referred_users.length || 0 });
});

app.all("/api/bot/refer", async (req, res) => {
  try {
    const data = req.method === "GET" ? req.query : req.body;
    const { chatId, username, avatar, ref } = data;
    if (!chatId) return res.status(400).json({ success: false, error: "chatId required" });
    let user = await User.findOne({ chatId });
    if (!user) {
      const referralCode = Math.floor(100000 + Math.random() * 900000).toString();
      user = await User.create({
        chatId, username, avatar, referral_code: referralCode,
        referred_by: ref || null,
        is_duplicate_device: false
      });
      await ensureWallet(chatId);
    }
    res.json({ success: true, referral_code: user.referral_code, referred_by: user.referred_by, is_duplicate_device: user.is_duplicate_device || false });
  } catch (err) {
    res.json({ success: false });
  }
});

app.all("/api/bot/refer-reward", async (req, res) => {
  try {
    const data = req.method === "GET" ? req.query : req.body;
    const { chatId } = data;
    if (!chatId) return res.status(400).json({ success: false, error: "chatId required" });
    const user = await User.findOne({ chatId });
    if (!user) return res.json({ success: false, error: "User not found" });
    const ref = user.referred_by;
    if (!ref) return res.json({ success: true, message: "No referrer" });
    if (user.is_duplicate_device) {
      const inviter = await User.findOne({ referral_code: ref });
      if (inviter) {
        await notifyUser(inviter.chatId, `⚠️ A user joined via your link but was detected as a duplicate device. No reward added.`);
      }
      return res.json({ success: false, message: "Duplicate device — reward blocked" });
    }
    const inviter = await User.findOne({ referral_code: ref });
    if (!inviter) return res.json({ success: false, error: "Inviter not found" });
    let refDoc = await Referral.findOne({ chatId: inviter.chatId });
    if (!refDoc) {
      refDoc = await Referral.create({
        chatId: inviter.chatId,
        referral_code: inviter.referral_code,
        referred_users: []
      });
    }
    const alreadyRewarded = refDoc.referred_users.some(u => u.user_id === chatId);
    if (alreadyRewarded) return res.json({ success: true, message: "Already rewarded" });
    const rewardAmount = 5;
    refDoc.referred_users.push({
      user_id: chatId,
      username: user.username || "",
      joined_at: new Date(),
      earned_amount: rewardAmount,
      is_active: true
    });
    refDoc.total_earned += rewardAmount;
    await refDoc.save();
    const inviterWallet = await ensureWallet(inviter.chatId);
    inviterWallet.balance += rewardAmount;
    await inviterWallet.save();
    await Txn.create({
      chatId: inviter.chatId,
      type: "credit",
      amount: rewardAmount,
      description: "Referral Reward",
      status: "success",
      metadata: { referred_user: chatId }
    });
    await notifyUser(inviter.chatId, `🎉 You earned ₹${rewardAmount} invite bonus! A new user verified all channels via your link.`);
    return res.json({ success: true, rewarded: true, amount: rewardAmount });
  } catch (err) {
    return res.json({ success: false });
  }
});

app.get("/api/withdraw/history", async (req, res) => {
  const { chatId } = req.query;
  if (!chatId) return res.status(400).json({ error: "chatId required" });
  const withdrawals = await Withdraw.find({ chatId }).sort({ initiated_at: -1 });
  res.json({
    total: withdrawals.length,
    withdrawals: withdrawals.map(w => ({
      id: w._id, amount: w.amount, fee: w.fee, net_amount: w.net_amount,
      status: w.status, vpa: w.vpa, initiated_at: w.initiated_at,
      completed_at: w.completed_at, transaction_id: w.transaction_id, failure_reason: w.failure_reason
    }))
  });
});

app.get("/api/channels/list", (req, res) => {
  try {
    res.json({ channels: REQUIRED_CHANNELS.map(ch => ({ name: ch.name, link: ch.link, type: ch.type || "telegram" })) });
  } catch (e) {
    res.status(500).json({ error: "Failed to load channel list", channels: [] });
  }
});

app.post("/api/channels/check", async (req, res) => {
  const { chatId } = req.body;
  if (!chatId) return res.status(400).json({ error: "chatId required" });
  try {
    const results = await Promise.all(
      REQUIRED_CHANNELS.map(async (ch) => {
        try {
          if (ch.type === "youtube") {
            const visited = await YoutubeVisit.findOne({ userId: String(chatId) });
            return { ...ch, joined: !!visited };
          }
          const realJoined = await checkChannelMembership(chatId, ch.chatId);
          if (realJoined) return { ...ch, joined: true };
          const exists = await JoinRequest.findOne({ userId: String(chatId), chatId: String(ch.chatId) });
          if (exists) return { ...ch, joined: true };
          return { ...ch, joined: false };
        } catch (err) {
          return { ...ch, joined: false };
        }
      })
    );
    const safeResults = Array.isArray(results) ? results : [];
    const pending = safeResults.filter(ch => !ch?.joined);
    return res.json({
      allJoined: pending.length === 0,
      total: REQUIRED_CHANNELS.length,
      joined: REQUIRED_CHANNELS.length - pending.length,
      pending,
      channels: safeResults
    });
  } catch (e) {
    return res.status(500).json({ error: "Channel check failed", details: e.message });
  }
});

app.get("/api/channels/status", async (req, res) => {
  const { chatId } = req.query;
  if (!chatId) return res.status(400).json({ error: "chatId required" });
  const user = await User.findOne({ chatId });
  if (!user) return res.json({ verified: false });
  res.json({ verified: user.channels_verified || false, verified_at: user.channels_verified_at || null });
});

app.post("/api/session/create", async (req, res) => {
  try {
    const { telegram_id } = req.body;
    if (!telegram_id) return res.status(400).json({ success: false, error: "telegram_id required" });
    const verifixRes = await fetch(`${VERIFIX_URL}/api/session/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-id": BOT_USERNAME,
        "x-bot-token": BOT_TOKEN
      },
      body: JSON.stringify({ telegram_id: String(telegram_id) })
    });
    const verifixData = await verifixRes.json();
    if (!verifixData.success) return res.json({ success: false, error: verifixData.error || "Session creation failed" });
    return res.json({ success: true, token: verifixData.token, expires_in: verifixData.expires_in });
  } catch (e) {
    return res.status(500).json({ success: false, error: "Internal error" });
  }
});

app.post("/api/device/mark-duplicate", async (req, res) => {
  const { chatId } = req.body;
  if (!chatId) return res.status(400).json({ error: "chatId required" });
  try {
    await User.findOneAndUpdate(
      { chatId: String(chatId) },
      { is_duplicate_device: true },
      { upsert: false }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/channels/save-request", async (req, res) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) return res.status(400).json({ error: "Missing params" });
  try {
    await JoinRequest.updateOne(
      { userId, chatId },
      { $set: { userId, chatId } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to save" });
  }
});

app.post("/api/channels/youtube-visited", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  try {
    await YoutubeVisit.updateOne(
      { userId: String(userId) },
      { $set: { userId: String(userId), visitedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to save" });
  }
});

app.post("/api/channels/delete-request", async (req, res) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) return res.status(400).json({ error: "Missing params" });
  try {
    const result = await JoinRequest.deleteOne({ userId, chatId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Request not found" });
    res.json({ success: true, message: "Request deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default app;
