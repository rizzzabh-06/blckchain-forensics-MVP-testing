"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Plus, X, AlertTriangle, Shield, TrendingUp, Clock, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertItem {
  id: string;
  type: "high_value" | "sanctioned" | "anomaly" | "mixer" | "money_laundering";
  severity: "low" | "medium" | "high" | "critical";
  address: string;
  message: string;
  timestamp: number;
  value?: string;
  sentToDiscord?: boolean;
}

export function AlertFeed() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [sendingToDiscord, setSendingToDiscord] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
    
    const interval = setInterval(() => {
      addRandomAlert();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadAlerts = () => {
    const initialAlerts: AlertItem[] = [
      {
        id: "1",
        type: "high_value",
        severity: "high",
        address: "0x1234567890abcdef1234567890abcdef12345678",
        message: "High-value transaction detected: 100 ETH",
        timestamp: Date.now() - 300000,
        value: "100 ETH",
      },
      {
        id: "2",
        type: "sanctioned",
        severity: "critical",
        address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
        message: "Interaction with sanctioned address",
        timestamp: Date.now() - 600000,
      },
      {
        id: "3",
        type: "anomaly",
        severity: "medium",
        address: "0xcafebabecafebabecafebabecafebabecafebabe",
        message: "AI detected unusual transaction pattern",
        timestamp: Date.now() - 900000,
      },
      {
        id: "4",
        type: "money_laundering",
        severity: "critical",
        address: "0x9876543210fedcba9876543210fedcba98765432",
        message: "AI detected layering money laundering scheme",
        timestamp: Date.now() - 1200000,
      },
    ];
    setAlerts(initialAlerts);
  };

  const addRandomAlert = () => {
    const types: AlertItem["type"][] = ["high_value", "sanctioned", "anomaly", "mixer", "money_laundering"];
    const severities: AlertItem["severity"][] = ["low", "medium", "high", "critical"];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const messages = {
      high_value: "Large transaction detected",
      sanctioned: "Sanctioned address interaction",
      anomaly: "Suspicious pattern detected",
      mixer: "Mixer service detected",
      money_laundering: "AI detected potential money laundering",
    };

    const newAlert: AlertItem = {
      id: Date.now().toString(),
      type,
      severity,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      message: messages[type],
      timestamp: Date.now(),
      value: type === "high_value" ? `${(Math.random() * 100).toFixed(2)} ETH` : undefined,
    };

    setAlerts((prev) => [newAlert, ...prev].slice(0, 20));

    // Auto-send critical alerts to Discord
    if (severity === "critical") {
      setTimeout(() => sendToDiscord(newAlert), 1000);
    }
  };

  const sendToDiscord = async (alert: AlertItem) => {
    setSendingToDiscord(alert.id);
    
    try {
      const response = await fetch('/api/discord-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: alert.type,
          severity: alert.severity,
          address: alert.address,
          message: alert.message,
          value: alert.value,
          blockchain: "ethereum"
        })
      });

      if (response.ok) {
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, sentToDiscord: true } : a
        ));
      }
    } catch (error) {
      console.error('Failed to send Discord alert:', error);
    } finally {
      setSendingToDiscord(null);
    }
  };

  const addToWatchlist = () => {
    if (newAddress && !watchlist.includes(newAddress)) {
      setWatchlist([...watchlist, newAddress]);
      setNewAddress("");
    }
  };

  const removeFromWatchlist = (address: string) => {
    setWatchlist(watchlist.filter((a) => a !== address));
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "high_value":
        return <TrendingUp className="h-4 w-4" />;
      case "sanctioned":
        return <Shield className="h-4 w-4" />;
      case "anomaly":
        return <AlertTriangle className="h-4 w-4" />;
      case "mixer":
        return <Bell className="h-4 w-4" />;
      case "money_laundering":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Real-time Alert Feed
            </span>
            <Badge variant="outline" className="font-normal">
              Discord Integration Active
            </Badge>
          </CardTitle>
          <CardDescription>
            Monitor suspicious activities and high-risk transactions. Critical alerts are automatically sent to Discord.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No alerts yet
                </div>
              ) : (
                alerts.map((alert) => (
                  <Alert key={alert.id} variant={alert.severity === "critical" || alert.severity === "high" ? "destructive" : "default"}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {getAlertIcon(alert.type)}
                        <AlertTitle className="flex items-center gap-2 mt-2">
                          <span>{alert.message}</span>
                          {getSeverityBadge(alert.severity)}
                        </AlertTitle>
                        <AlertDescription className="space-y-1">
                          <div className="font-mono text-xs">{alert.address}</div>
                          {alert.value && (
                            <div className="font-semibold">{alert.value}</div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                          </div>
                          {alert.sentToDiscord && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Sent to Discord
                            </Badge>
                          )}
                        </AlertDescription>
                      </div>
                      
                      {!alert.sentToDiscord && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendToDiscord(alert)}
                          disabled={sendingToDiscord === alert.id}
                        >
                          {sendingToDiscord === alert.id ? (
                            <span className="flex items-center gap-1">
                              <span className="animate-spin">⏳</span>
                              Sending...
                            </span>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1" />
                              Discord
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Alert>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
          <CardDescription>Monitor specific addresses for activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter address to watch"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addToWatchlist()}
            />
            <Button onClick={addToWatchlist} disabled={!newAddress}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {watchlist.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No addresses in watchlist
              </div>
            ) : (
              watchlist.map((address, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted"
                >
                  <span className="font-mono text-sm">{address}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWatchlist(address)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}