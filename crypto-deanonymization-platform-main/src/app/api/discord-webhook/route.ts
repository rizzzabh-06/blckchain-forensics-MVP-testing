import { NextRequest, NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1437119339567517748/G_BLi44xhjH6rSQgavZkuWxg8AfcCetE_ldlLFi1y3c2U19fT1CQQlW5ZvdjmDQHkhoc";

interface AlertData {
  type: "high_value" | "sanctioned" | "anomaly" | "mixer" | "money_laundering";
  severity: "low" | "medium" | "high" | "critical";
  address: string;
  message: string;
  blockchain?: string;
  value?: string;
  riskScore?: number;
  details?: any;
}

export async function POST(request: NextRequest) {
  try {
    const alertData: AlertData = await request.json();

    // Build Discord embed
    const embed = {
      title: `🚨 ${getSeverityEmoji(alertData.severity)} ${alertData.type.toUpperCase().replace(/_/g, ' ')} ALERT`,
      description: alertData.message,
      color: getSeverityColor(alertData.severity),
      fields: [
        {
          name: "Address",
          value: `\`${alertData.address}\``,
          inline: false
        },
        {
          name: "Severity",
          value: alertData.severity.toUpperCase(),
          inline: true
        },
        {
          name: "Blockchain",
          value: alertData.blockchain || "Ethereum",
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Crypto Deanonymization Platform"
      }
    };

    if (alertData.value) {
      embed.fields.push({
        name: "Value",
        value: alertData.value,
        inline: true
      });
    }

    if (alertData.riskScore !== undefined) {
      embed.fields.push({
        name: "Risk Score",
        value: `${alertData.riskScore}/100`,
        inline: true
      });
    }

    // Add money laundering indicators if present
    if (alertData.details?.money_laundering_indicators?.length > 0) {
      const indicators = alertData.details.money_laundering_indicators
        .map((ind: any) => `• **${ind.scheme_type}** (${ind.severity}): ${ind.description}`)
        .join('\n');
      
      embed.fields.push({
        name: "🔍 Money Laundering Indicators",
        value: indicators.slice(0, 1024), // Discord field limit
        inline: false
      });
    }

    // Add regulatory flags if present
    if (alertData.details?.regulatory_flags?.length > 0) {
      embed.fields.push({
        name: "⚖️ Regulatory Flags",
        value: alertData.details.regulatory_flags.join(', '),
        inline: false
      });
    }

    // Send to Discord
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
        username: "Crypto Alert Bot",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png"
      })
    });

    if (!discordResponse.ok) {
      throw new Error(`Discord webhook failed: ${discordResponse.statusText}`);
    }

    return NextResponse.json({ 
      success: true,
      message: "Alert sent to Discord successfully" 
    });

  } catch (error) {
    console.error('Discord webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send Discord alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case "critical": return "🔴";
    case "high": return "🟠";
    case "medium": return "🟡";
    case "low": return "🔵";
    default: return "⚪";
  }
}

function getSeverityColor(severity: string): number {
  switch (severity) {
    case "critical": return 0xFF0000; // Red
    case "high": return 0xFF6600; // Orange
    case "medium": return 0xFFCC00; // Yellow
    case "low": return 0x0099FF; // Blue
    default: return 0x808080; // Gray
  }
}
