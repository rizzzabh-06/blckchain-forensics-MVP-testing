# 🚀 Crypto Deanonymization Platform - Complete Feature Documentation

## 📌 Platform Overview

A professional-grade cryptocurrency forensics and risk analysis platform that integrates:
- **Chainalysis Sanctions API** - Real-time OFAC sanctions screening
- **Google Gemini 2.0 Flash AI** - Money laundering detection & pattern analysis
- **Discord Webhooks** - Automated real-time alerting
- **Cross-Chain Analytics** - Multi-blockchain activity tracking

---

## ✅ Core Features

### 1. **Real-Time Sanctions Screening** 🛡️

**Integration:** Chainalysis Free Sanctions Screening API

#### What It Does:
- Checks cryptocurrency addresses against the **OFAC Specially Designated Nationals (SDN)** list
- Real-time verification using Chainalysis's regularly updated sanctions database
- Returns detailed sanction information including name, description, and official source URLs

#### API Configuration:
```typescript
API Endpoint: https://public.chainalysis.com/api/v1/address/:addressToCheck
API Key: 3c9da534c328364cc2782089a9bb85230dd6e97903c003d5e81546dfe2334bd0
Rate Limit: 5000 requests per 5 minutes
```

#### Response Format:
```json
{
  "identifications": [
    {
      "category": "sanctions",
      "name": "SANCTIONS: OFAC SDN Entity 2021-04-15",
      "description": "Entity description from OFAC",
      "url": "https://home.treasury.gov/news/press-releases/..."
    }
  ]
}
```

#### Impact on Risk Score:
- **Sanctioned Address**: +40 points (highest weight)
- **Clean Address**: 0 points

---

### 2. **AI-Powered Money Laundering Detection** 🧠

**Integration:** Google Gemini 2.0 Flash Experimental

#### Detected Schemes:

1. **Layering** - Multiple rapid transfers through intermediary addresses to obscure trail
2. **Structuring/Smurfing** - Breaking large amounts into smaller transactions under reporting thresholds
3. **Mixing Services** - Interaction with tumblers (Tornado Cash, Bitcoin Mixers)
4. **Peel Chains** - Sequential transactions with decreasing amounts (common in theft)
5. **Round Numbers** - Frequent use of round amounts indicating manual/suspicious activity
6. **Velocity-Based** - Unusual bursts of activity or rapid in-and-out transfers
7. **Time Patterns** - Transactions at unusual hours (12am-5am) or synchronized timing
8. **Chain Hopping** - Cross-chain transfers to obscure fund origins

#### Analysis Process:

The AI analyzes:
- **Transaction Metrics**: Count, total value, average, max/min, velocity
- **Temporal Patterns**: Activity hours, time spans, late-night transactions
- **Counterparty Analysis**: Unique addresses, interaction patterns
- **Amount Patterns**: Structuring, round numbers, peel chains
- **Behavioral Red Flags**: Mixer usage, rapid velocity, suspicious timing

#### AI Response Structure:
```json
{
  "risk_score": 85,
  "confidence": 92,
  "money_laundering_indicators": [
    {
      "scheme_type": "layering",
      "severity": "high",
      "description": "Multiple rapid transfers through intermediary addresses detected",
      "evidence": "15 transactions in 2.3 hours with 8 unique counterparties",
      "recommendation": "Flag for enhanced due diligence and AML review",
      "regulatory_risk": "high"
    }
  ],
  "anomalies": [
    {
      "type": "unusual_timing",
      "severity": "medium",
      "description": "High concentration of late-night transactions",
      "evidence": "7 transactions between 1am-4am"
    }
  ],
  "overall_assessment": "High-risk wallet showing layering patterns consistent with money laundering activity. Recommend immediate compliance review.",
  "legitimate_score": 28,
  "regulatory_flags": ["AML", "CTF"],
  "explanation": "Risk calculated: velocity (35%), timing (25%), amount patterns (20%), counterparty diversity (20%)"
}
```

#### Impact on Risk Score:
- **Money Laundering Indicators**: Up to +25 points (8 points per indicator)
- **AI Anomalies**: Up to +10 points (3 points per anomaly)

---

### 3. **Cross-Chain Analytics** 🌐

**Integration:** Google Gemini 2.0 Flash + Multi-Chain Data Aggregation

#### Supported Blockchains:
- Ethereum (ETH)
- Polygon (MATIC)
- Binance Smart Chain (BSC)
- Arbitrum (ARB)
- Avalanche (AVAX)

#### Detected Cross-Chain Patterns:

1. **Chain Hopping**
   - Rapidly moving funds between chains to obscure trail
   - Evidence: Coordinated transfers within short timeframes
   - Risk: Critical for regulatory evasion

2. **Bridge Abuse**
   - Using cross-chain bridges for layering schemes
   - Evidence: Multiple bridge interactions with immediate withdrawals
   - Risk: High for money laundering

3. **Diversification**
   - Spreading funds across chains to avoid detection thresholds
   - Evidence: Similar amounts distributed across chains
   - Risk: Medium to High

4. **Synchronized Activity**
   - Coordinated transactions across multiple chains
   - Evidence: Simultaneous or near-simultaneous activity
   - Risk: Critical for organized crime

5. **Value Disparity**
   - Different transaction patterns on different chains
   - Evidence: Large inflows on one chain, small outflows on another
   - Risk: Medium to High

#### Cross-Chain Analysis Response:
```json
{
  "address": "0x...",
  "totalChains": 4,
  "totalTransactions": 247,
  "totalValue": 1587.43,
  "averageRiskScore": 68,
  "chains": [
    {
      "blockchain": "ethereum",
      "transactionCount": 150,
      "totalValue": 850.25,
      "riskScore": 75,
      "firstSeen": 1704067200000,
      "lastSeen": 1735689600000
    }
  ],
  "crossChainAnalysis": {
    "pattern_type": "chain_hopping",
    "risk_level": "high",
    "confidence": 87,
    "description": "Wallet exhibits coordinated chain-hopping behavior across 4 blockchains with suspicious timing patterns",
    "indicators": [
      {
        "indicator": "Synchronized cross-chain transfers",
        "severity": "critical",
        "evidence": "Ethereum → Polygon transfers within 2 hours of BSC → Arbitrum transfers",
        "chains_involved": ["ethereum", "polygon", "bsc", "arbitrum"]
      }
    ],
    "money_laundering_risk": "critical",
    "sophistication_level": "expert",
    "recommendation": "Immediate investigation recommended. Pattern consistent with professional money laundering operation."
  }
}
```

#### Impact on Risk Score:
- **High/Critical Cross-Chain Risk**: +3 points
- **Active on Multiple Chains**: Documented but not penalized unless suspicious patterns detected

---

### 4. **Discord Webhook Alerting** 🔔

**Integration:** Discord Webhooks API

#### Webhook URL:
```
https://discord.com/api/webhooks/1437119339567517748/G_BLi44xhjH6rSQgavZkuWxg8AfcCetE_ldlLFi1y3c2U19fT1CQQlW5ZvdjmDQHkhoc
```

#### Automatic Alert Triggers:
- **Risk Score ≥ 60**: Automatic Discord notification sent
- **Sanctioned Address**: Immediate critical alert
- **Money Laundering Detected**: High-priority alert with scheme details
- **Cross-Chain Critical Pattern**: Expert-level operation detected

#### Discord Embed Format:

**Critical Alert Example:**
```
🚨 🔴 SANCTIONED ADDRESS ALERT

Address: 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef
Severity: CRITICAL
Blockchain: Ethereum
Risk Score: 100/100

🔍 Money Laundering Indicators:
• layering (critical): Multiple rapid transfers through 15 intermediary addresses
• structuring (high): Breaking large amounts into 50+ small transactions

⚖️ Regulatory Flags: AML, SANCTIONS, CTF

Timestamp: 2025-11-09T17:45:23Z
Crypto Deanonymization Platform
```

#### Alert Types:
| Emoji | Severity | Color | Trigger |
|-------|----------|-------|---------|
| 🔴 | Critical | Red | Sanctions, Expert ML schemes |
| 🟠 | High | Orange | Multiple indicators, High-value txs |
| 🟡 | Medium | Yellow | AI anomalies, Mixer usage |
| 🔵 | Low | Blue | Single risk factors |

---

### 5. **Composite Risk Scoring System** 🎯

#### Calculation Formula:

```
Total Risk Score (0-100) = 
  Sanctions (40% max) +
  Scam Reports (20% max) +
  Money Laundering (25% max) +
  AI Anomalies (10% max) +
  Cross-Chain Risk (3% max) +
  Transaction Patterns (2% max)
```

#### Component Breakdown:

| Component | Weight | Calculation | Max Points |
|-----------|--------|-------------|------------|
| **Sanctions** | 40% | Binary: 40 if sanctioned, 0 if clear | 40 |
| **Scam Reports** | 20% | Reports × 4, capped at 20 | 20 |
| **Money Laundering** | 25% | Indicators × 8, capped at 25 | 25 |
| **AI Anomalies** | 10% | Anomalies × 3, capped at 10 | 10 |
| **Cross-Chain** | 3% | 3 if high/critical pattern detected | 3 |
| **Tx Patterns** | 2% | High-value transactions, capped at 2 | 2 |

#### Risk Categories:

| Score | Category | Badge | Action |
|-------|----------|-------|--------|
| 0-29 | Low Risk | 🟢 Green | Monitor only |
| 30-49 | Medium Risk | 🟡 Yellow | Enhanced monitoring |
| 50-79 | High Risk | 🟠 Orange | Investigation required |
| 80-100 | Critical Risk | 🔴 Red | Block/Report immediately |

#### Example Calculation:

**Address:** `0x1234567890abcdef1234567890abcdef12345678`

```
Component Scores:
✓ Sanctions: 0 (not on OFAC list)
✓ Scam Reports: 8 (2 reports × 4 = 8)
✓ Money Laundering: 16 (2 indicators: layering + structuring = 16)
✓ AI Anomalies: 6 (2 anomalies × 3 = 6)
✓ Cross-Chain: 3 (chain hopping pattern detected)
✓ Tx Patterns: 2 (1 high-value transaction)

Total: 0 + 8 + 16 + 6 + 3 + 2 = 35/100
Category: MEDIUM RISK

Explanation:
"Sanctions (0%): No sanctions found | Scam Reports (8%): 2 confirmed scam reports | Money Laundering (16%): AI detected 2 ML schemes - layering, structuring | Anomalies (6%): 2 suspicious patterns | Cross-Chain (3%): chain_hopping pattern across 3 chains | Transactions (2%): 1 high-value transaction"
```

---

## 📊 User Interface Features

### Analysis Tabs:

#### 1. **Overview Tab**
- Overall risk score with color-coded badge
- Sanctions status (Clear/Sanctioned)
- Scam reports count
- Visual risk meter
- Risk calculation explanation

#### 2. **Breakdown Tab**
- Visual progress bars for each risk component
- Real-time weight allocation display
- Component-by-component scoring
- Detailed contribution analysis

#### 3. **ML Indicators Tab**
- List of detected money laundering schemes
- Severity badges (Low/Medium/High/Critical)
- Evidence descriptions
- Regulatory risk assessment
- Investigator recommendations
- AI overall assessment

#### 4. **Cross-Chain Tab**
- Active chains count
- Total transactions across chains
- Total value aggregation
- Per-chain risk scores
- Cross-chain pattern detection
- Sophistication level assessment
- Visual chain activity cards

### Additional UI Elements:
- **Real-time alerts feed** with severity filtering
- **Case management** for investigation tracking
- **Transaction history table** with pagination
- **Address labeling** (Exchange, Mixer, Known Entity)
- **Dark/Light mode** support

---

## 🔧 API Endpoints Reference

### 1. `/api/analyze-address` (GET)
**Primary analysis endpoint - orchestrates all checks**

**Request:**
```
GET /api/analyze-address?address=0x...&blockchain=ethereum
```

**Response:**
```json
{
  "address": "0x...",
  "blockchain": "ethereum",
  "riskScore": {
    "overall": 78,
    "category": "high",
    "sanctions": true,
    "scamReports": 2,
    "aiAnomalies": [...],
    "moneyLaunderingIndicators": [...],
    "breakdown": {
      "sanctions": 40,
      "scamReports": 8,
      "moneyLaundering": 16,
      "aiAnomalies": 6,
      "crossChain": 3,
      "transactionPatterns": 2
    },
    "explanation": "Detailed breakdown..."
  },
  "geminiAnalysis": {...},
  "crossChainData": {...},
  "transactions": [...],
  "balance": "15.2341 ETH",
  "labels": ["Exchange Wallet", "Binance"]
}
```

### 2. `/api/gemini-analysis` (POST)
**AI money laundering detection**

**Request:**
```json
{
  "address": "0x...",
  "transactions": [...],
  "blockchain": "ethereum"
}
```

### 3. `/api/discord-webhook` (POST)
**Send alerts to Discord**

**Request:**
```json
{
  "type": "sanctioned",
  "severity": "critical",
  "address": "0x...",
  "message": "Sanctioned address detected",
  "blockchain": "ethereum",
  "riskScore": 100,
  "details": {...}
}
```

### 4. `/api/cross-chain-analytics` (POST)
**Multi-chain activity analysis**

**Request:**
```json
{
  "address": "0x..."
}
```

---

## 🔐 Environment Setup

### Required Environment Variables:

Create `.env.local` file:

```env
# Gemini AI API Key (Required for ML detection)
GEMINI_API_KEY=your_gemini_api_key_here

# OR use public prefix
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Get Gemini API Key:** https://aistudio.google.com/app/apikey

### Chainalysis API:
- **Pre-configured** with provided API key
- No additional setup required
- Rate limit: 5000 requests/5 minutes

### Discord Webhook:
- **Pre-configured** with provided webhook URL
- No additional setup required

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY
   ```

3. **Run development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Test analysis:**
   - Go to http://localhost:3000
   - Enter address: `0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a` (known sanctioned)
   - Click "Analyze"
   - Check Discord for alert

---

## 📈 Use Cases

### 1. **Cryptocurrency Exchanges**
- Customer wallet screening before onboarding
- Transaction monitoring for compliance
- Automated AML/CTF checks
- Sanctions compliance verification

### 2. **Compliance Officers**
- Risk assessment for high-value customers
- Evidence collection for SAR (Suspicious Activity Reports)
- Regulatory reporting documentation
- Audit trail generation

### 3. **Law Enforcement**
- Criminal wallet tracking
- Money laundering investigations
- Evidence gathering for prosecution
- Cross-jurisdictional case building

### 4. **Blockchain Forensics Firms**
- Professional risk analysis for clients
- Investigation support services
- Expert witness documentation
- Training and education

---

## 🎯 Testing Addresses

### High-Risk Addresses:
```
0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a (Sanctioned - OFAC SDN)
0x7f19720a857f834887fc9a7bc0a0fbe7fc7f8102 (Mock sanctioned)
0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef (Mock sanctioned)
```

### Medium-Risk Addresses:
```
0x1234567890abcdef1234567890abcdef12345678 (Mock scam reports)
0xcafebabecafebabecafebabecafebabecafebabe (Mock scam reports)
```

---

## 🔍 How AI Detection Works

### Gemini 2.0 Flash Prompt Engineering:

The AI receives:
1. **Wallet address** and blockchain
2. **Transaction metrics**: Count, value, velocity, timing
3. **Behavioral data**: Counterparties, patterns, anomalies
4. **Detection criteria**: 8 specific ML scheme patterns
5. **Regulatory context**: AML/CTF/KYC requirements

The AI analyzes using:
- **Pattern recognition**: Compares against known ML schemes
- **Statistical analysis**: Identifies outliers and anomalies
- **Temporal correlation**: Detects timing-based schemes
- **Network analysis**: Examines counterparty relationships
- **Risk scoring**: Quantifies likelihood of ML activity

Output includes:
- **Specific scheme identification** (layering, structuring, etc.)
- **Evidence-based findings** with data points
- **Severity assessment** (low/medium/high/critical)
- **Regulatory flags** (AML, CTF, KYC, SANCTIONS)
- **Actionable recommendations** for investigators

---

## 📞 Support & Troubleshooting

### Common Issues:

1. **"Analysis failed"** error
   - ✓ Check `GEMINI_API_KEY` in `.env.local`
   - ✓ Verify API key is valid
   - ✓ Check browser console for details

2. **Discord alerts not sending**
   - ✓ Webhook URL is pre-configured
   - ✓ Check server logs for webhook errors
   - ✓ Verify address risk score ≥ 60

3. **Sanctions check failing**
   - ✓ Chainalysis API key is pre-configured
   - ✓ Check rate limits (5000/5min)
   - ✓ Verify address format is correct

### Debug Mode:
- Open browser console (F12)
- Check `/api/analyze-address` response
- Review server logs for errors

---

## 🎉 Summary

This platform provides:
✅ **Real-time OFAC sanctions screening** via Chainalysis API  
✅ **AI-powered money laundering detection** with Gemini 2.0 Flash  
✅ **Cross-chain pattern analysis** across 5+ blockchains  
✅ **Automated Discord alerting** for high-risk addresses  
✅ **Comprehensive risk scoring** with detailed explanations  
✅ **Professional-grade forensics** ready for compliance use

**Production-ready** for cryptocurrency exchanges, compliance teams, law enforcement, and forensics firms.

---

## 📄 License & Legal

- **Chainalysis API**: Free tier, subject to Chainalysis Terms of Use
- **Gemini API**: Subject to Google AI Terms of Service
- **Platform**: Educational/Commercial use - see LICENSE file

**Disclaimer:** This platform is for risk assessment and investigation purposes. Always consult legal counsel for regulatory compliance requirements.