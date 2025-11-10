import { NextRequest, NextResponse } from "next/server";

// Chainalysis Sanctions API Configuration
const CHAINALYSIS_API_KEY = "3c9da534c328364cc2782089a9bb85230dd6e97903c003d5e81546dfe2334bd0";
const CHAINALYSIS_API_URL = "https://public.chainalysis.com/api/v1/address";

// Mock scam database (in production, integrate with Chainabuse or similar)
const SCAM_REPORTS = {
  "0xcafebabecafebabecafebabecafebabecafebabe": 5,
  "0x1234567890abcdef1234567890abcdef12345678": 2,
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");
    const blockchain = searchParams.get("blockchain") || "ethereum";

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }

    // Check sanctions using real Chainalysis API
    let isSanctioned = false;
    let sanctionDetails = null;
    
    try {
      const chainalysisResponse = await fetch(`${CHAINALYSIS_API_URL}/${address}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': CHAINALYSIS_API_KEY,
          'Accept': 'application/json'
        }
      });

      if (chainalysisResponse.ok) {
        const chainalysisData = await chainalysisResponse.json();
        
        // Check if address has sanctions identifications
        if (chainalysisData.identifications && chainalysisData.identifications.length > 0) {
          const sanctionsIdent = chainalysisData.identifications.find(
            (ident: any) => ident.category === 'sanctions'
          );
          
          if (sanctionsIdent) {
            isSanctioned = true;
            sanctionDetails = sanctionsIdent;
          }
        }
      }
    } catch (chainalysisError) {
      console.error('Chainalysis API error:', chainalysisError);
      // Continue with mock data if API fails
    }
    
    // Check scam reports
    const scamReports = SCAM_REPORTS[address.toLowerCase() as keyof typeof SCAM_REPORTS] || 0;

    // Fetch transactions
    const transactions = await fetchTransactions(address, blockchain);

    // Gemini AI analysis for money laundering detection
    let geminiAnalysis = null;
    try {
      const geminiResponse = await fetch(`${request.nextUrl.origin}/api/gemini-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, transactions, blockchain })
      });
      
      if (geminiResponse.ok) {
        geminiAnalysis = await geminiResponse.json();
      }
    } catch (error) {
      console.error('Gemini analysis failed:', error);
    }

    // Fetch cross-chain analytics
    let crossChainData = null;
    try {
      const crossChainResponse = await fetch(`${request.nextUrl.origin}/api/cross-chain-analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      
      if (crossChainResponse.ok) {
        crossChainData = await crossChainResponse.json();
      }
    } catch (error) {
      console.error('Cross-chain analytics failed:', error);
    }

    // Calculate composite risk score with detailed breakdown
    const riskCalculation = calculateRiskScore(
      isSanctioned, 
      scamReports, 
      geminiAnalysis,
      transactions,
      crossChainData
    );

    // Get address labels
    const labels = getAddressLabels(address, isSanctioned, sanctionDetails);

    const result = {
      address,
      blockchain,
      riskScore: {
        overall: riskCalculation.totalScore,
        sanctions: isSanctioned,
        sanctionDetails,
        scamReports,
        aiAnomalies: geminiAnalysis?.anomalies || [],
        moneyLaunderingIndicators: geminiAnalysis?.money_laundering_indicators || [],
        category: riskCalculation.category,
        breakdown: riskCalculation.breakdown,
        explanation: riskCalculation.explanation,
      },
      geminiAnalysis,
      crossChainData,
      transactions,
      balance: `${(Math.random() * 100).toFixed(4)} ${blockchain === 'ethereum' ? 'ETH' : 'units'}`,
      labels,
    };

    // Send Discord alert for high-risk addresses
    if (riskCalculation.totalScore >= 60) {
      try {
        await fetch(`${request.nextUrl.origin}/api/discord-webhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: isSanctioned ? 'sanctioned' : geminiAnalysis?.money_laundering_indicators?.length > 0 ? 'money_laundering' : 'anomaly',
            severity: riskCalculation.category,
            address,
            blockchain,
            message: `High-risk address detected: ${riskCalculation.explanation.slice(0, 100)}...`,
            riskScore: riskCalculation.totalScore,
            details: geminiAnalysis
          })
        });
      } catch (error) {
        console.error('Discord webhook failed:', error);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error analyzing address:", error);
    return NextResponse.json(
      { error: "Failed to analyze address" },
      { status: 500 }
    );
  }
}

async function fetchTransactions(address: string, blockchain: string) {
  // Mock transaction data
  const txCount = Math.floor(Math.random() * 10) + 1;
  const transactions = [];

  for (let i = 0; i < txCount; i++) {
    transactions.push({
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      from: Math.random() > 0.5 ? address : `0x${Math.random().toString(16).slice(2, 42)}`,
      to: Math.random() > 0.5 ? address : `0x${Math.random().toString(16).slice(2, 42)}`,
      value: (Math.random() * 10).toFixed(4),
      timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30),
      blockNumber: 18000000 + Math.floor(Math.random() * 100000),
    });
  }

  return transactions;
}

function calculateRiskScore(
  isSanctioned: boolean,
  scamReports: number,
  geminiAnalysis: any,
  transactions: any[],
  crossChainData: any
) {
  const breakdown = {
    sanctions: 0,
    scamReports: 0,
    aiAnomalies: 0,
    moneyLaundering: 0,
    transactionPatterns: 0,
    crossChain: 0
  };

  let totalScore = 0;
  const explanationParts: string[] = [];

  // 1. Sanctions Check (40% weight) - CRITICAL
  if (isSanctioned) {
    breakdown.sanctions = 40;
    totalScore += 40;
    explanationParts.push("Sanctions (40%): Address is on OFAC sanctions list");
  } else {
    explanationParts.push("Sanctions (0%): No sanctions found");
  }

  // 2. Scam Reports (20% weight)
  if (scamReports > 0) {
    breakdown.scamReports = Math.min(scamReports * 4, 20);
    totalScore += breakdown.scamReports;
    explanationParts.push(`Scam Reports (${breakdown.scamReports}%): ${scamReports} confirmed scam report(s)`);
  } else {
    explanationParts.push("Scam Reports (0%): No scam reports found");
  }

  // 3. AI Money Laundering Detection (25% weight)
  if (geminiAnalysis?.money_laundering_indicators?.length > 0) {
    const mlScore = Math.min(geminiAnalysis.money_laundering_indicators.length * 8, 25);
    breakdown.moneyLaundering = mlScore;
    totalScore += mlScore;
    explanationParts.push(`Money Laundering (${mlScore}%): AI detected ${geminiAnalysis.money_laundering_indicators.length} ML scheme(s) - ${geminiAnalysis.money_laundering_indicators.map((i: any) => i.scheme_type).join(', ')}`);
  } else {
    explanationParts.push("Money Laundering (0%): No ML schemes detected");
  }

  // 4. AI Anomalies (10% weight)
  if (geminiAnalysis?.anomalies?.length > 0) {
    breakdown.aiAnomalies = Math.min(geminiAnalysis.anomalies.length * 3, 10);
    totalScore += breakdown.aiAnomalies;
    explanationParts.push(`Anomalies (${breakdown.aiAnomalies}%): ${geminiAnalysis.anomalies.length} suspicious pattern(s) detected`);
  } else {
    explanationParts.push("Anomalies (0%): No anomalies detected");
  }

  // 5. Cross-Chain Risk (3% weight)
  if (crossChainData?.crossChainAnalysis?.money_laundering_risk === 'high' || 
      crossChainData?.crossChainAnalysis?.money_laundering_risk === 'critical') {
    breakdown.crossChain = 3;
    totalScore += 3;
    explanationParts.push(`Cross-Chain (3%): ${crossChainData.crossChainAnalysis.pattern_type} pattern detected across ${crossChainData.totalChains} chains`);
  } else if (crossChainData?.totalChains > 1) {
    explanationParts.push(`Cross-Chain (0%): Active on ${crossChainData.totalChains} chains (low risk)`);
  }

  // 6. Transaction Patterns (2% weight)
  const highValueTxs = transactions.filter(tx => parseFloat(tx.value) > 10).length;
  if (highValueTxs > 0) {
    breakdown.transactionPatterns = Math.min(highValueTxs, 2);
    totalScore += breakdown.transactionPatterns;
    explanationParts.push(`Transactions (${breakdown.transactionPatterns}%): ${highValueTxs} high-value transaction(s)`);
  } else {
    explanationParts.push("Transactions (0%): No high-value transactions");
  }

  totalScore = Math.min(Math.round(totalScore), 100);

  return {
    totalScore,
    category: getRiskCategory(totalScore),
    breakdown,
    explanation: explanationParts.join(' | ')
  };
}

function getRiskCategory(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 80) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function getAddressLabels(address: string, isSanctioned: boolean, sanctionDetails: any): string[] {
  const labels: string[] = [];
  
  // Add sanction label if applicable
  if (isSanctioned && sanctionDetails) {
    labels.push("OFAC Sanctioned");
    if (sanctionDetails.name) {
      labels.push(sanctionDetails.name.split(' ')[0]); // First word of sanction name
    }
  }
  
  // Mock labeling logic for known entities
  const knownLabels: { [key: string]: string[] } = {
    "0x1234567890abcdef1234567890abcdef12345678": ["Exchange Wallet", "Binance"],
    "0xcafebabecafebabecafebabecafebabecafebabe": ["Reported Scam"],
  };

  const additionalLabels = knownLabels[address.toLowerCase()] || [];
  return [...labels, ...additionalLabels];
}