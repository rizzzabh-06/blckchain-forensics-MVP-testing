# 🚀 Quick Reference Guide

## ✅ What's Already Working

### 1. Chainalysis Free Sanctions Screening API
**File:** `src/app/api/analyze-address/route.ts` (lines 4-53)

```typescript
const CHAINALYSIS_API_KEY = "3c9da534c328364cc2782089a9bb85230dd6e97903c003d5e81546dfe2334bd0";
const CHAINALYSIS_API_URL = "https://public.chainalysis.com/api/v1/address";

// Real API call:
const chainalysisResponse = await fetch(`${CHAINALYSIS_API_URL}/${address}`, {
  headers: { 'X-API-KEY': CHAINALYSIS_API_KEY }
});
```

**Status:** ✅ Live and operational  
**Contributes:** 40% of risk score

---

### 2. Discord Webhook Alerting
**File:** `src/app/api/discord-webhook/route.ts` (line 3)

```typescript
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1437119339567517748/G_BLi44xhjH6rSQgavZkuWxg8AfcCetE_ldlLFi1y3c2U19fT1CQQlW5ZvdjmDQHkhoc";
```

**Status:** ✅ Live and configured  
**Trigger:** Automatic when risk score ≥ 60  
**Alert Types:** Sanctioned | Money Laundering | Anomaly

---

### 3. Gemini AI Money Laundering Detection
**File:** `src/app/api/gemini-analysis/route.ts`

**Detected Schemes:**
- Layering
- Structuring  
- Mixing Services
- Peel Chains
- Velocity Anomalies
- Round Numbers
- Time Patterns
- Chain Hopping

**Status:** ✅ Implemented (needs API key)  
**Contributes:** 25% of risk score

---

### 4. Cross-Chain Analytics
**File:** `src/app/api/cross-chain-analytics/route.ts`

**Supported Chains:**
- Ethereum
- Polygon
- BSC
- Arbitrum
- Avalanche

**Status:** ✅ Implemented (needs API key)  
**Contributes:** 3% of risk score

---

## 🔑 Setup Instructions

### Add Gemini API Key

1. Get your key from: https://aistudio.google.com/app/apikey
2. Create `.env.local` in project root:

```bash
GEMINI_API_KEY=your_key_here
```

3. Restart the dev server:
```bash
bun dev
```

That's it! 🎉

---

## 🧪 Testing

### Test with a Real Sanctioned Address

```
0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a
```

**Expected Result:**
- ⚠️ Risk Score: 40-80
- 🔴 Sanctions Status: OFAC SDN
- 💬 Discord Alert: Yes (if risk ≥ 60)
- 📊 Breakdown: 40% from sanctions

---

## 📊 Understanding the Risk Score

```
TOTAL RISK SCORE = 100%

├─ 40% Chainalysis Sanctions (OFAC SDN list)
├─ 20% Scam Reports (Internal DB)
├─ 25% AI ML Detection (Gemini)
├─ 10% AI Anomalies (Gemini)
├─  3% Cross-Chain Risk (Gemini)
└─  2% Transaction Patterns
```

### Risk Categories

| Score | Category | Alert |
|-------|----------|-------|
| 80-100 | 🔴 Critical | Yes |
| 50-79 | 🟠 High | Yes |
| 30-49 | 🟡 Medium | No |
| 0-29 | 🔵 Low | No |

---

## 🎯 Where to See Each Feature

### In the UI:

1. **Main Analysis** → "Analysis" tab
   - Enter address
   - Select blockchain
   - Click "Analyze"

2. **Risk Breakdown** → After analysis:
   - **Overview tab:** Overall score, sanctions, scam reports
   - **Breakdown tab:** Visual bars for each component
   - **ML Indicators tab:** Gemini ML detections
   - **Cross-Chain tab:** Multi-chain activity

3. **Alerts** → "Alerts" tab
   - View alert history (currently mock data)

4. **Cases** → "Cases" tab
   - Investigation case management (currently mock data)

---

## 🔍 How AI Detects Money Laundering

### Input Data to Gemini:
```
✓ Address & blockchain
✓ Transaction count
✓ Total/avg/max/min values
✓ Unique counterparties
✓ Time span & late-night activity
✓ Recent 5 transactions
```

### AI Analysis:
```
1. Pattern Recognition → Compare to known ML schemes
2. Velocity Analysis → Detect rapid transfers
3. Amount Analysis → Identify structuring
4. Timing Analysis → Flag unusual hours
5. Mixer Detection → Recognize known mixers
6. Regulatory Mapping → AML/KYC/CTF flags
```

---

## 📧 Discord Alert Format

When risk ≥ 60, Discord receives rich embeds with:

- Alert type & severity emoji
- Address & blockchain
- Risk score
- Money laundering indicators (scheme type, severity, description)
- Regulatory flags (AML, CTF, etc.)
- Timestamp

---

## 🛠️ Files to Know

### API Routes (Backend):
- `src/app/api/analyze-address/route.ts` - Main orchestrator
- `src/app/api/gemini-analysis/route.ts` - ML detection
- `src/app/api/cross-chain-analytics/route.ts` - Multi-chain
- `src/app/api/discord-webhook/route.ts` - Alerts

### UI Components (Frontend):
- `src/components/AddressSearch.tsx` - Analysis UI
- `src/components/AlertFeed.tsx` - Alert history
- `src/components/CaseManagement.tsx` - Investigation cases
- `src/app/page.tsx` - Homepage with tabs

---

## ✅ Checklist

Before analyzing addresses:

- [x] Chainalysis API integrated (pre-configured)
- [x] Discord webhook configured (pre-configured)
- [ ] Gemini API key added to `.env.local` ← **YOU NEED TO DO THIS**
- [x] Dev server running (`bun dev`)

---

## 🆘 Troubleshooting

### "Analysis failed" error:
- Check if Gemini API key is in `.env.local`
- Restart dev server after adding key

### No Discord alerts:
- Check webhook URL is correct (already configured)
- Ensure risk score is ≥ 60
- Check Discord server permissions

### Sanctions showing "Clear" for known address:
- Chainalysis API might be rate-limited (5000 req/5min)
- Address might not be on OFAC SDN list
- Check console for API errors

---

## 📞 Resources

- **Chainalysis Docs:** https://docs.chainalysis.com/api/sanctions/
- **Gemini API:** https://ai.google.dev/gemini-api/docs
- **Get Gemini Key:** https://aistudio.google.com/app/apikey
- **Discord Webhooks:** https://discord.com/developers/docs/resources/webhook

---

**Last Updated:** November 9, 2025  
**Version:** 1.0.0
