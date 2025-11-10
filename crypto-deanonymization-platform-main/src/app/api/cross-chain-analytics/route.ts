import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

interface ChainActivity {
  blockchain: string;
  transactionCount: number;
  totalValue: number;
  firstSeen: number;
  lastSeen: number;
  riskScore: number;
}

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Fetch activity across multiple chains (mock data for demo)
    const chains = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'avalanche'];
    const chainActivities: ChainActivity[] = [];

    for (const chain of chains) {
      // In production, query actual blockchain APIs
      const hasActivity = Math.random() > 0.5;
      
      if (hasActivity) {
        chainActivities.push({
          blockchain: chain,
          transactionCount: Math.floor(Math.random() * 100) + 1,
          totalValue: parseFloat((Math.random() * 1000).toFixed(2)),
          firstSeen: Date.now() - Math.floor(Math.random() * 86400000 * 365),
          lastSeen: Date.now() - Math.floor(Math.random() * 86400000 * 30),
          riskScore: Math.floor(Math.random() * 100)
        });
      }
    }

    // Analyze cross-chain patterns with Gemini
    const crossChainAnalysis = await analyzeCrossChainPatterns(address, chainActivities);

    return NextResponse.json({
      address,
      chains: chainActivities,
      crossChainAnalysis,
      totalChains: chainActivities.length,
      totalTransactions: chainActivities.reduce((sum, c) => sum + c.transactionCount, 0),
      totalValue: chainActivities.reduce((sum, c) => sum + c.totalValue, 0),
      averageRiskScore: chainActivities.length > 0 
        ? Math.round(chainActivities.reduce((sum, c) => sum + c.riskScore, 0) / chainActivities.length)
        : 0
    });

  } catch (error) {
    console.error('Cross-chain analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch cross-chain analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function analyzeCrossChainPatterns(address: string, activities: ChainActivity[]) {
  if (!GEMINI_API_KEY || activities.length === 0) {
    return {
      pattern_type: "single_chain",
      risk_level: "medium",
      description: "No cross-chain analysis available",
      indicators: []
    };
  }

  const prompt = `You are a blockchain forensics expert specializing in cross-chain money laundering detection. Analyze this wallet's activity across multiple blockchains.

ADDRESS: ${address}

CROSS-CHAIN ACTIVITY:
${activities.map(a => `
• ${a.blockchain.toUpperCase()}:
  - Transactions: ${a.transactionCount}
  - Total Value: ${a.totalValue.toFixed(2)} units
  - Risk Score: ${a.riskScore}/100
  - First Seen: ${new Date(a.firstSeen).toISOString()}
  - Last Seen: ${new Date(a.lastSeen).toISOString()}
`).join('\n')}

CROSS-CHAIN MONEY LAUNDERING PATTERNS TO DETECT:
1. **Chain Hopping**: Rapidly moving funds between chains to obscure trail
2. **Bridge Abuse**: Using cross-chain bridges for layering
3. **Diversification**: Spreading funds across chains to avoid detection
4. **Synchronized Activity**: Coordinated transactions across multiple chains
5. **Value Disparity**: Different transaction patterns on different chains
6. **Time Correlation**: Suspicious timing of cross-chain transfers

Analyze for:
- Evidence of cross-chain money laundering schemes
- Coordination patterns across blockchains
- Risk of regulatory evasion through chain hopping
- Sophistication level of the operation

Respond ONLY with valid JSON:
{
  "pattern_type": "single_chain|chain_hopping|bridge_layering|diversification|synchronized",
  "risk_level": "low|medium|high|critical",
  "confidence": 0-100,
  "description": "Overall pattern assessment",
  "indicators": [
    {
      "indicator": "Description of suspicious pattern",
      "severity": "low|medium|high|critical",
      "evidence": "Specific data points",
      "chains_involved": ["ethereum", "polygon"]
    }
  ],
  "money_laundering_risk": "low|medium|high|critical",
  "sophistication_level": "low|medium|high|expert",
  "recommendation": "Action for investigators"
}`;

  try {
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
      throw new Error(`Gemini API error`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text);

  } catch (error) {
    return {
      pattern_type: "analysis_failed",
      risk_level: "medium",
      confidence: 0,
      description: "Cross-chain analysis unavailable",
      indicators: [],
      money_laundering_risk: "unknown",
      sophistication_level: "unknown",
      recommendation: "Manual review recommended"
    };
  }
}
