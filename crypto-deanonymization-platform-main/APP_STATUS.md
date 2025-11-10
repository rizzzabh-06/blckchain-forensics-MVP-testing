# 🚀 Crypto Deanonymization Platform - Ready to Use

## ✅ Current Status: **FULLY OPERATIONAL**

Your platform is now running with all integrations active!

---

## 🔑 API Keys Configured

### ✅ Gemini AI API Key
- **Status**: ✅ Active
- **Key**: `AIzaSyCMUUuEjdnCLjg-OCMaYvliyoERghaLFRg`
- **Purpose**: 
  - AI Money Laundering Detection (analyzes 6+ schemes: layering, structuring, mixing, etc.)
  - Cross-Chain Analytics (tracks activity across multiple blockchains)
  - Anomaly Detection (identifies unusual transaction patterns)

### ✅ Chainalysis Sanctions API
- **Status**: ✅ Active
- **Key**: `3c9da534c328364cc2782089a9bb85230dd6e97903c003d5e81546dfe2334bd0`
- **Purpose**: OFAC SDN sanctions screening
- **Rate Limit**: 5,000 requests per 5 minutes

### ✅ Discord Webhook
- **Status**: ✅ Active
- **URL**: `https://discord.com/api/webhooks/1437119339567517748/G_BLi44xhjH6rSQgavZkuWxg8AfcCetE_ldlLFi1y3c2U19fT1CQQlW5ZvdjmDQHkhoc`
- **Purpose**: Real-time alerts for high-risk addresses (Risk Score ≥ 60)

---

## 🎯 How the Platform Works

### 1. **Address Analysis** (Main Tab)
When you search for a crypto address, the system:

1. **Fetches Blockchain Data** from Etherscan/BlockCypher
2. **Screens for Sanctions** using Chainalysis API (checks OFAC SDN list)
3. **Checks Scam Reports** in database
4. **AI Analysis** - Gemini 2.0 Flash analyzes transactions for:
   - 💰 **Layering**: Multiple rapid transfers through intermediaries
   - 🔢 **Structuring**: Breaking large amounts into smaller transactions
   - 🌀 **Mixing Services**: Tornado Cash, other mixers
   - 🔗 **Peel Chains**: Sequential transactions with decreasing amounts
   - ⚡ **Velocity Anomalies**: Unusual transaction speeds
   - 🌐 **Cross-Chain Bridges**: Movement across blockchains
5. **Cross-Chain Analytics** - Tracks activity across Ethereum, Polygon, BSC, Arbitrum, etc.
6. **Calculates Overall Risk Score**

### 2. **Risk Score Calculation Formula**

```
OVERALL RISK = 
  40% Sanctions (Chainalysis OFAC check)
+ 20% Scam Reports (Database)
+ 25% AI ML Detection (Gemini analyzing 6+ schemes)
+ 10% AI Anomalies (Unusual patterns)
+  3% Cross-Chain Risk (Multi-blockchain activity)
+  2% Transaction Patterns (High-value detection)
─────────────────────────────────────────────
= 100% Total Risk Score (0-100)
```

### 3. **Discord Webhook Alerts**

Automatically triggers when an address has **Risk Score ≥ 60**:

```
🚨 HIGH RISK ADDRESS DETECTED 🚨

Address: 0x1234...5678
Risk Score: 85/100

⚠️ Risk Factors:
• Sanctions: OFAC SDN List Match (40 points)
• AI ML Detection: Layering detected (25 points)
• Scam Reports: 5 reports (20 points)

🔍 View Full Report: [Link]
```

---

## 🧪 Test the Platform

### Test Address #1: Known Sanctioned Address
```
0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a
```
- **Expected**: High risk (40+ points from sanctions)
- **Should trigger**: Discord webhook alert

### Test Address #2: High Transaction Volume
```
0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```
- **Expected**: AI analyzes transaction patterns
- **Shows**: Cross-chain analytics

### Test Address #3: Clean Address
```
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```
- **Expected**: Low risk score
- **No alerts** sent

---

## 📊 Platform Features

### ✅ Completed Features

1. **🔍 Address Analysis**
   - Multi-blockchain support
   - Real-time risk assessment
   - Transaction history display

2. **🤖 AI-Powered Detection**
   - Gemini 2.0 Flash integration
   - 6+ money laundering scheme detection
   - Anomaly pattern recognition

3. **⚖️ Sanctions Screening**
   - Chainalysis Free API
   - OFAC SDN list checking
   - 5,000 requests/5min rate limit

4. **🌐 Cross-Chain Analytics**
   - Ethereum, Polygon, BSC, Arbitrum
   - Bridge transaction tracking
   - Multi-chain risk aggregation

5. **🔔 Discord Webhook Alerts**
   - Automatic high-risk notifications
   - Rich embed formatting
   - Real-time delivery

6. **📋 Alert Feed**
   - Historical alert viewing
   - Severity filtering
   - Address investigation links

7. **📁 Case Management**
   - Investigation case creation
   - Evidence tracking
   - Notes and documentation

---

## 🗂️ File Structure

```
src/
├── app/
│   ├── page.tsx                        # Main dashboard (3 tabs: Analysis, Alerts, Cases)
│   └── api/
│       ├── analyze-address/route.ts    # Core risk analysis + Chainalysis + Gemini
│       ├── discord-webhook/route.ts    # Discord alert sender
│       ├── gemini-analysis/route.ts    # AI ML detection endpoint
│       └── cross-chain-analytics/route.ts  # Multi-chain tracking
├── components/
│   ├── AddressSearch.tsx               # Search + results display
│   ├── AlertFeed.tsx                   # Alert history viewer
│   ├── CaseManagement.tsx              # Investigation cases
│   └── RiskBreakdown.tsx               # Detailed risk visualization
└── lib/
    └── gemini.ts                       # Gemini AI client
```

---

## 🔒 Security Notes

1. **API Keys**: Stored in `.env.local` (never commit to Git)
2. **Rate Limiting**: Chainalysis limits 5,000 requests per 5 minutes
3. **Discord Webhook**: Only triggers for risk ≥ 60 to prevent spam
4. **CORS**: Backend-only API calls (secure)

---

## 🚀 Next Steps

### To Use the Platform:
1. Navigate to the **Analysis** tab
2. Enter a crypto address (Ethereum format: `0x...`)
3. Click "Analyze Address"
4. View comprehensive risk report with:
   - Overall risk score
   - Sanctions status
   - AI ML detection results
   - Cross-chain analytics
   - Transaction history

### High-Risk Alerts:
- If risk ≥ 60, Discord webhook automatically sends alert
- Check your Discord channel for notifications

---

## 📞 Support

- **Chainalysis Support**: sanctions-api-support@chainalysis.com
- **Rate Limit Issues**: Current limit is 5,000 requests/5min
- **Discord Webhook**: Test with high-risk address to verify delivery

---

## 🎉 Platform Ready!

Your crypto deanonymization platform is fully operational with:
- ✅ AI-powered money laundering detection
- ✅ OFAC sanctions screening
- ✅ Cross-chain analytics
- ✅ Discord webhook alerts
- ✅ Comprehensive risk scoring

**Start analyzing addresses now!** 🚀
