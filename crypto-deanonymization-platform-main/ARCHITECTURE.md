# 🏗️ Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Browser)                  │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │ Analysis   │  │  Alerts    │  │  Case Management   │   │
│  │    Tab     │  │   Tab      │  │       Tab          │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    [User enters address]
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Server-Side)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         /api/analyze-address (Orchestrator)          │  │
│  │                                                       │  │
│  │  Step 1: Chainalysis Sanctions Check ────────────┐  │  │
│  │  Step 2: Scam Database Lookup                    │  │  │
│  │  Step 3: Fetch Transactions (Mock/Real)          │  │  │
│  │  Step 4: Call Gemini Analysis API ──────────┐    │  │  │
│  │  Step 5: Call Cross-Chain Analytics API ────│──┐ │  │  │
│  │  Step 6: Calculate Composite Risk Score     │  │ │  │  │
│  │  Step 7: Send Discord Alert (if risk ≥ 60)  │  │ │  │  │
│  │  Step 8: Return Result to UI                │  │ │  │  │
│  └──────────────────────────────────────────────│──│─│──┘  │
│                                                 │  │ │     │
│  ┌──────────────────────────────────────────┐  │  │ │     │
│  │    /api/gemini-analysis                  │◄─┘  │ │     │
│  │                                           │     │ │     │
│  │  • Analyzes transactions for ML schemes  │     │ │     │
│  │  • Detects 8+ money laundering patterns  │     │ │     │
│  │  • Returns risk score & indicators       │     │ │     │
│  └──────────────────────────────────────────┘     │ │     │
│                                                    │ │     │
│  ┌──────────────────────────────────────────┐     │ │     │
│  │    /api/cross-chain-analytics            │◄────┘ │     │
│  │                                           │       │     │
│  │  • Fetches multi-chain activity          │       │     │
│  │  • Detects chain hopping patterns        │       │     │
│  │  • Returns cross-chain analysis          │       │     │
│  └──────────────────────────────────────────┘       │     │
│                                                      │     │
│  ┌──────────────────────────────────────────┐       │     │
│  │    /api/discord-webhook                  │◄──────┘     │
│  │                                           │             │
│  │  • Sends rich embeds to Discord          │             │
│  │  • Includes ML indicators & risk score   │             │
│  │  • Triggers on high-risk addresses       │             │
│  └──────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            ↓
         ┌──────────────────┴──────────────────┐
         ↓                                      ↓
┌─────────────────────┐              ┌──────────────────────┐
│  External Services  │              │  External Services   │
│                     │              │                      │
│  Chainalysis API    │              │  Google Gemini API   │
│  ✅ Pre-configured  │              │  ⚠️ Needs API key    │
│                     │              │                      │
│  • OFAC SDN list    │              │  • ML detection      │
│  • 5000 req/5min    │              │  • Pattern analysis  │
│  • Returns name,    │              │  • Cross-chain AI    │
│    description, URL │              │  • JSON responses    │
└─────────────────────┘              └──────────────────────┘
                            ↓
                  ┌─────────────────────┐
                  │  Discord Webhook    │
                  │  ✅ Pre-configured  │
                  │                     │
                  │  • Rich embeds      │
                  │  • Severity colors  │
                  │  • ML indicators    │
                  └─────────────────────┘
```

---

## Data Flow Sequence

### 1. User Initiates Analysis

```
User → AddressSearch Component
  ↓
  Enter: 0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a
  Select: Ethereum
  Click: Analyze
```

### 2. Frontend Request

```javascript
fetch('/api/analyze-address?address=0x1da...&blockchain=ethereum')
```

### 3. Backend Processing

```
analyze-address/route.ts:
  ├─ Call Chainalysis API
  │   └─ GET https://public.chainalysis.com/api/v1/address/0x1da...
  │       Headers: { X-API-KEY: "3c9da534c328364cc2782089a9bb85230dd6e97903c003d5e81546dfe2334bd0" }
  │       Returns: { identifications: [{ category: "sanctions", name: "...", ... }] }
  │
  ├─ Check Scam Database (mock)
  │   └─ Returns: scamReports = 0
  │
  ├─ Fetch Transactions (mock)
  │   └─ Returns: [ { hash, from, to, value, timestamp }, ... ]
  │
  ├─ Call /api/gemini-analysis
  │   └─ POST with { address, transactions, blockchain }
  │       └─ Gemini analyzes for ML schemes
  │           Returns: { risk_score, money_laundering_indicators, anomalies, ... }
  │
  ├─ Call /api/cross-chain-analytics
  │   └─ POST with { address }
  │       └─ Fetch multi-chain activity
  │       └─ Gemini analyzes cross-chain patterns
  │           Returns: { chains, crossChainAnalysis, totalChains, ... }
  │
  ├─ Calculate Risk Score
  │   ├─ Sanctions: 40 (address is sanctioned)
  │   ├─ Scam Reports: 0
  │   ├─ Money Laundering: 16 (2 ML indicators)
  │   ├─ Anomalies: 6 (2 anomalies)
  │   ├─ Cross-Chain: 0
  │   └─ Tx Patterns: 0
  │   TOTAL: 62/100 → HIGH RISK
  │
  ├─ IF risk ≥ 60: Call /api/discord-webhook
  │   └─ POST with { type, severity, address, riskScore, details }
  │       └─ Discord receives rich embed alert
  │
  └─ Return Result to Frontend
      └─ { address, blockchain, riskScore, geminiAnalysis, crossChainData, ... }
```

### 4. Frontend Displays Results

```
AddressSearch Component:
  ├─ Overview Tab
  │   ├─ Risk Score: 62/100 (HIGH)
  │   ├─ Sanctions: OFAC Sanctioned
  │   └─ Scam Reports: None
  │
  ├─ Breakdown Tab
  │   ├─ Sanctions: 40/40 ████████████████████
  │   ├─ Scam Reports: 0/20 ░░░░░░░░░░░░░░░░░░░░
  │   ├─ Money Laundering: 16/25 ████████████░░░░░░░
  │   ├─ Anomalies: 6/10 ████████░░
  │   ├─ Cross-Chain: 0/3 ░░░░░░
  │   └─ Tx Patterns: 0/2 ░░
  │
  ├─ ML Indicators Tab
  │   ├─ 🔴 Layering (high)
  │   │   Description: Multiple rapid transfers...
  │   │   Evidence: 8 intermediary addresses
  │   │   Recommendation: Enhanced monitoring
  │   └─ 🟡 Structuring (medium)
  │       Description: Breaking large amounts...
  │       Evidence: 15 transactions < $10k
  │       Recommendation: File SAR
  │
  └─ Cross-Chain Tab
      ├─ Active Chains: 3
      ├─ Total Transactions: 245
      ├─ Total Value: $1.2M
      └─ Pattern: Chain Hopping (high risk)
```

### 5. Discord Alert Sent

```
Discord Channel receives:

╔═══════════════════════════════════════════════════════╗
║ 🚨 🔴 SANCTIONED ALERT                                ║
║                                                       ║
║ High-risk address detected: Address is on OFAC       ║
║ sanctions list                                        ║
║                                                       ║
║ Address: 0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a  ║
║ Severity: HIGH                                        ║
║ Blockchain: Ethereum                                  ║
║ Risk Score: 62/100                                    ║
║                                                       ║
║ 🔍 Money Laundering Indicators:                      ║
║ • layering (high): Multiple rapid transfers...       ║
║ • structuring (medium): Breaking amounts...          ║
║                                                       ║
║ ⚖️ Regulatory Flags: AML, CTF, SANCTIONS             ║
║                                                       ║
║ Timestamp: 2025-11-09T12:00:00Z                      ║
║ Platform: Crypto Deanonymization Platform            ║
╚═══════════════════════════════════════════════════════╝
```

---

## Risk Score Calculation

```python
def calculateRiskScore(data):
    score = 0
    breakdown = {}
    
    # 1. Chainalysis Sanctions (40%)
    if is_sanctioned:
        score += 40
        breakdown['sanctions'] = 40
    
    # 2. Scam Reports (20%)
    if scam_reports > 0:
        scam_score = min(scam_reports * 4, 20)
        score += scam_score
        breakdown['scamReports'] = scam_score
    
    # 3. Gemini ML Detection (25%)
    if ml_indicators:
        ml_score = min(len(ml_indicators) * 8, 25)
        score += ml_score
        breakdown['moneyLaundering'] = ml_score
    
    # 4. Gemini Anomalies (10%)
    if anomalies:
        anomaly_score = min(len(anomalies) * 3, 10)
        score += anomaly_score
        breakdown['aiAnomalies'] = anomaly_score
    
    # 5. Cross-Chain Risk (3%)
    if cross_chain_risk in ['high', 'critical']:
        score += 3
        breakdown['crossChain'] = 3
    
    # 6. Transaction Patterns (2%)
    if high_value_txs > 0:
        tx_score = min(high_value_txs, 2)
        score += tx_score
        breakdown['transactionPatterns'] = tx_score
    
    total = min(score, 100)
    category = categorize(total)
    
    return { total, category, breakdown }
```

---

## Integration Status

| Component | Status | Configuration |
|-----------|--------|---------------|
| Chainalysis API | ✅ Live | API key hardcoded |
| Discord Webhook | ✅ Live | URL hardcoded |
| Gemini AI | ⚠️ Needs Key | Add to `.env.local` |
| UI Components | ✅ Complete | All tabs functional |
| Risk Calculation | ✅ Complete | 6-factor scoring |
| Alert System | ✅ Complete | Auto-triggers at 60+ |

---

## File Dependencies

```
src/app/page.tsx
  └─ Imports: AddressSearch, AlertFeed, CaseManagement

src/components/AddressSearch.tsx
  └─ Calls: /api/analyze-address

src/app/api/analyze-address/route.ts
  ├─ External: Chainalysis API
  ├─ Internal: /api/gemini-analysis
  ├─ Internal: /api/cross-chain-analytics
  └─ Internal: /api/discord-webhook

src/app/api/gemini-analysis/route.ts
  └─ External: Google Gemini API

src/app/api/cross-chain-analytics/route.ts
  └─ External: Google Gemini API

src/app/api/discord-webhook/route.ts
  └─ External: Discord Webhook
```

---

## Environment Variables

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (already hardcoded)
# CHAINALYSIS_API_KEY=3c9da534c328364cc2782089a9bb85230dd6e97903c003d5e81546dfe2334bd0
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

---

**Platform Version:** 1.0.0  
**Last Updated:** November 9, 2025
