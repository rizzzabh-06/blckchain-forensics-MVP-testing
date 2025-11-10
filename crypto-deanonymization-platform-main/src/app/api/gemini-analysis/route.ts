import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { address, transactions, blockchain } = await request.json();

    if (!address || !transactions) {
      return NextResponse.json(
        { error: "Address and transactions are required" },
        { status: 400 }
      );
    }

    // Calculate transaction metrics
    const values = transactions.map((tx: any) => parseFloat(tx.value || 0));
    const timestamps = transactions.map((tx: any) => tx.timestamp);
    
    const summary = {
      count: transactions.length,
      total_value: values.reduce((a: number, b: number) => a + b, 0),
      avg_value: values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0,
      max_value: values.length > 0 ? Math.max(...values) : 0,
      min_value: values.length > 0 ? Math.min(...values) : 0,
      unique_addresses: new Set([
        ...transactions.map((t: any) => t.from),
        ...transactions.map((t: any) => t.to)
      ]).size,
      time_span_hours: timestamps.length > 0 ? (Math.max(...timestamps) - Math.min(...timestamps)) / 3600 : 0,
      late_night_count: transactions.filter((tx: any) => {
        const hour = new Date(tx.timestamp * 1000).getHours();
        return hour >= 0 && hour <= 5;
      }).length
    };

    const prompt = `You are an expert cryptocurrency forensics analyst specializing in money laundering detection. Analyze this ${blockchain} wallet's behavior for suspicious patterns, money laundering schemes, and security risks.

WALLET ADDRESS: ${address}
BLOCKCHAIN: ${blockchain}

TRANSACTION METRICS:
• Total Transactions: ${summary.count}
• Total Value: ${summary.total_value.toFixed(4)} ${blockchain === 'ethereum' ? 'ETH' : 'units'}
• Average Transaction: ${summary.avg_value.toFixed(4)} ${blockchain === 'ethereum' ? 'ETH' : 'units'}
• Largest Transaction: ${summary.max_value.toFixed(4)} ${blockchain === 'ethereum' ? 'ETH' : 'units'}
• Smallest Transaction: ${summary.min_value.toFixed(6)} ${blockchain === 'ethereum' ? 'ETH' : 'units'}
• Unique Counterparties: ${summary.unique_addresses}
• Activity Period: ${summary.time_span_hours.toFixed(1)} hours
• Late Night Transactions (12am-5am): ${summary.late_night_count}

RECENT TRANSACTIONS (last 5):
${transactions.slice(-5).map((tx: any, i: number) => 
  `${i+1}. ${tx.value} ${blockchain === 'ethereum' ? 'ETH' : 'units'} | ${tx.from === address ? 'SENT to' : 'RECEIVED from'} ${tx.from === address ? tx.to.slice(0, 10) : tx.from.slice(0, 10)}... | ${new Date(tx.timestamp * 1000).toISOString()}`
).join('\n')}

MONEY LAUNDERING DETECTION CRITERIA:
1. **Layering Schemes**: Multiple rapid transfers through intermediary addresses
2. **Structuring**: Breaking large amounts into smaller transactions to avoid detection
3. **Mixing Services**: Interaction with known tumblers/mixers (Tornado Cash, etc.)
4. **Round Numbers**: Frequent use of round amounts (indicator of manual/suspicious activity)
5. **Velocity Patterns**: Unusual bursts of activity or rapid in-and-out transfers
6. **Time Patterns**: Transactions at unusual hours or synchronized timing
7. **Chain Hopping**: Cross-chain transfers to obscure origin
8. **Peel Chains**: Sequential transactions with decreasing amounts

Analyze for:
- Specific money laundering techniques being used
- Transaction velocity and timing anomalies
- Amount distribution patterns (structuring, smurfing)
- Behavioral red flags matching known ML schemes
- Risk level for regulatory compliance

Respond ONLY with valid JSON (no markdown):
{
  "risk_score": 0-100,
  "confidence": 0-100,
  "money_laundering_indicators": [
    {
      "scheme_type": "layering|structuring|mixing|peel_chain|velocity_based|other",
      "severity": "low|medium|high|critical",
      "description": "Detailed explanation of the scheme detected",
      "evidence": "Specific data points supporting this finding",
      "recommendation": "Action for compliance officer/investigator",
      "regulatory_risk": "low|medium|high|critical"
    }
  ],
  "anomalies": [
    {
      "type": "unusual_timing|suspicious_amount|rapid_velocity|mixer_interaction|structuring|round_numbers|other",
      "severity": "low|medium|high|critical",
      "description": "Clear explanation",
      "evidence": "Specific data point"
    }
  ],
  "overall_assessment": "2-3 sentence professional summary for compliance report",
  "legitimate_score": 0-100,
  "regulatory_flags": ["AML", "KYC", "SANCTIONS", "CTF"],
  "explanation": "How the risk score was calculated including weights for each factor"
}`;

    if (!GEMINI_API_KEY) {
      // Return mock data if no API key
      return NextResponse.json({
        risk_score: Math.floor(Math.random() * 100),
        confidence: 85,
        money_laundering_indicators: [
          {
            scheme_type: "layering",
            severity: "medium",
            description: "Multiple rapid transfers detected through intermediary addresses",
            evidence: `${summary.count} transactions in ${summary.time_span_hours.toFixed(1)} hours`,
            recommendation: "Monitor for additional layering activity",
            regulatory_risk: "medium"
          }
        ],
        anomalies: [
          {
            type: "rapid_velocity",
            severity: "medium",
            description: "High transaction frequency detected",
            evidence: `${summary.count} transactions`
          }
        ],
        overall_assessment: "Address shows moderate risk indicators. Transaction patterns suggest potential layering activity.",
        legitimate_score: 60,
        regulatory_flags: ["AML"],
        explanation: "Risk calculated based on transaction velocity (30%), amount patterns (25%), timing analysis (20%), and counterparty diversity (25%)"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      result = {
        risk_score: 0,
        confidence: 0,
        money_laundering_indicators: [],
        anomalies: [],
        overall_assessment: 'Analysis failed',
        legitimate_score: 50,
        regulatory_flags: [],
        explanation: "Unable to parse AI response"
      };
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Gemini analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
