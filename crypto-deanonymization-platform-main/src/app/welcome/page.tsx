"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Globe, Webhook, Bell, BarChart3, Lock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WelcomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect authenticated users to the main platform
  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Crypto Deanonymization Platform</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center py-20">
          <Badge variant="outline" className="mb-6 text-sm px-4 py-1.5">
            <Lock className="h-3 w-3 mr-1 inline" />
            Enterprise-Grade Blockchain Forensics
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Advanced Crypto
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Deanonymization Platform
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Investigate blockchain transactions with AI-powered money laundering detection, 
            cross-chain analytics, and real-time risk alerts.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => router.push("/register")} className="gap-2">
              Start Investigation
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Gemini 2.0 Flash AI
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              Multi-Chain Support
            </div>
            <div className="flex items-center gap-2">
              <Webhook className="h-4 w-4 text-green-500" />
              Discord Alerts
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-3">
                  <Brain className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl">AI Money Laundering Detection</CardTitle>
                <CardDescription>
                  Gemini 2.0 Flash AI analyzes transaction patterns to detect layering, 
                  structuring, smurfing, and 6+ other money laundering schemes automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-3">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Comprehensive Risk Analysis</CardTitle>
                <CardDescription>
                  Multi-factor risk scoring combining sanctions screening (40%), scam reports (20%), 
                  AI detection (25%), and transaction anomalies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-3">
                  <Globe className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl">Cross-Chain Analytics</CardTitle>
                <CardDescription>
                  Track wallet activity across Ethereum, Polygon, BSC, Arbitrum, Optimism, 
                  and other major blockchain networks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-3">
                  <Bell className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-xl">Real-Time Alerts</CardTitle>
                <CardDescription>
                  Get instant notifications for high-risk transactions, sanctioned wallet 
                  interactions, and suspicious activity patterns.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="p-3 bg-red-500/10 rounded-lg w-fit mb-3">
                  <Webhook className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-xl">Discord Integration</CardTitle>
                <CardDescription>
                  Receive critical alerts directly in Discord channels with customizable 
                  webhooks for your team or organization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="p-3 bg-indigo-500/10 rounded-lg w-fit mb-3">
                  <Shield className="h-6 w-6 text-indigo-500" />
                </div>
                <CardTitle className="text-xl">Case Management</CardTitle>
                <CardDescription>
                  Organize investigations with structured case files, evidence tracking, 
                  and collaborative tools for forensic teams.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto pb-20">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-8 pt-12">
              <CardTitle className="text-3xl mb-4">
                Ready to Start Your Investigation?
              </CardTitle>
              <CardDescription className="text-base mb-6">
                Join investigators, compliance teams, and security researchers using our platform 
                to track illicit crypto activity.
              </CardDescription>
              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={() => router.push("/register")} className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Footer */}
        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Crypto Deanonymization Platform. Enterprise blockchain forensics.
          </p>
        </footer>
      </div>
    </div>
  );
}
