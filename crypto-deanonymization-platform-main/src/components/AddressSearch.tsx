"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, AlertTriangle, Shield, TrendingUp, ExternalLink, Loader2, Info, Globe, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RiskScore {
  overall: number;
  sanctions: boolean;
  sanctionDetails?: any;
  scamReports: number;
  aiAnomalies: any[];
  moneyLaunderingIndicators: any[];
  category: "low" | "medium" | "high" | "critical";
  breakdown: any;
  explanation: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
}

interface AnalysisResult {
  address: string;
  blockchain: string;
  riskScore: RiskScore;
  geminiAnalysis: any;
  crossChainData: any;
  transactions: Transaction[];
  balance: string;
  labels?: string[];
}

export function AddressSearch({ onAddressAnalyzed }: { onAddressAnalyzed?: (result: AnalysisResult) => void }) {
  const [address, setAddress] = useState("");
  const [blockchain, setBlockchain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analyze-address?address=${address}&blockchain=${blockchain}`);
      
      if (!response.ok) {
        throw new Error("Failed to analyze address");
      }
      
      const data = await response.json();
      setResult(data);
      onAddressAnalyzed?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze address");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case "low": return "text-green-600 dark:text-green-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "high": return "text-orange-600 dark:text-orange-400";
      case "critical": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600";
    }
  };

  const getRiskBadge = (category: string) => {
    switch (category) {
      case "low": return <Badge className="bg-green-500">Low Risk</Badge>;
      case "medium": return <Badge className="bg-yellow-500">Medium Risk</Badge>;
      case "high": return <Badge className="bg-orange-500">High Risk</Badge>;
      case "critical": return <Badge variant="destructive">Critical Risk</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Address Analysis</CardTitle>
          <CardDescription>Search and analyze blockchain addresses for risk factors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={blockchain} onValueChange={setBlockchain}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="bsc">BSC</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Enter address (0x... or bc1...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading || !address}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Analyze
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Risk Score Analysis</span>
                {getRiskBadge(result.riskScore.category)}
              </CardTitle>
              <CardDescription className="font-mono text-xs">{result.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="ml-indicators">ML Indicators</TabsTrigger>
                  <TabsTrigger value="cross-chain">Cross-Chain</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        Overall Risk Score
                      </div>
                      <div className={`text-3xl font-bold ${getRiskColor(result.riskScore.category)}`}>
                        {result.riskScore.overall}/100
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        Sanctions Status
                      </div>
                      <div className="text-xl font-semibold">
                        {result.riskScore.sanctions ? (
                          <div className="space-y-1">
                            <Badge variant="destructive">OFAC Sanctioned</Badge>
                            {result.riskScore.sanctionDetails?.name && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {result.riskScore.sanctionDetails.name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Badge className="bg-green-500">Clear</Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4" />
                        Scam Reports
                      </div>
                      <div className="text-xl font-semibold">
                        {result.riskScore.scamReports > 0 ? (
                          <Badge variant="destructive">{result.riskScore.scamReports} Reports</Badge>
                        ) : (
                          <Badge className="bg-green-500">None</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {result.riskScore.sanctionDetails && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>OFAC Sanctions Information</AlertTitle>
                      <AlertDescription className="space-y-2 text-sm">
                        {result.riskScore.sanctionDetails.description && (
                          <p>{result.riskScore.sanctionDetails.description}</p>
                        )}
                        {result.riskScore.sanctionDetails.url && (
                          <a 
                            href={result.riskScore.sanctionDetails.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            View Official OFAC Notice
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>How is the risk score calculated?</AlertTitle>
                    <AlertDescription className="text-xs mt-2">
                      {result.riskScore.explanation}
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sanctions Check (40% max)</span>
                        <span className="font-semibold">{result.riskScore.breakdown.sanctions}/40</span>
                      </div>
                      <Progress value={(result.riskScore.breakdown.sanctions / 40) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Scam Reports (20% max)</span>
                        <span className="font-semibold">{result.riskScore.breakdown.scamReports}/20</span>
                      </div>
                      <Progress value={(result.riskScore.breakdown.scamReports / 20) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Money Laundering (25% max)</span>
                        <span className="font-semibold">{result.riskScore.breakdown.moneyLaundering}/25</span>
                      </div>
                      <Progress value={(result.riskScore.breakdown.moneyLaundering / 25) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Anomalies (10% max)</span>
                        <span className="font-semibold">{result.riskScore.breakdown.aiAnomalies}/10</span>
                      </div>
                      <Progress value={(result.riskScore.breakdown.aiAnomalies / 10) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cross-Chain Risk (3% max)</span>
                        <span className="font-semibold">{result.riskScore.breakdown.crossChain}/3</span>
                      </div>
                      <Progress value={(result.riskScore.breakdown.crossChain / 3) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Transaction Patterns (2% max)</span>
                        <span className="font-semibold">{result.riskScore.breakdown.transactionPatterns}/2</span>
                      </div>
                      <Progress value={(result.riskScore.breakdown.transactionPatterns / 2) * 100} className="h-2" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ml-indicators" className="space-y-4">
                  {result.riskScore.moneyLaunderingIndicators.length > 0 ? (
                    <div className="space-y-3">
                      {result.riskScore.moneyLaunderingIndicators.map((indicator: any, idx: number) => (
                        <Alert key={idx} variant={indicator.severity === 'high' || indicator.severity === 'critical' ? 'destructive' : 'default'}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle className="flex items-center justify-between">
                            <span className="capitalize">{indicator.scheme_type.replace(/_/g, ' ')}</span>
                            <Badge variant={indicator.severity === 'critical' ? 'destructive' : 'outline'}>
                              {indicator.severity}
                            </Badge>
                          </AlertTitle>
                          <AlertDescription className="space-y-2 text-sm">
                            <p><strong>Description:</strong> {indicator.description}</p>
                            <p><strong>Evidence:</strong> {indicator.evidence}</p>
                            <p><strong>Recommendation:</strong> {indicator.recommendation}</p>
                            <Badge variant="outline" className="mt-2">
                              Regulatory Risk: {indicator.regulatory_risk}
                            </Badge>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No money laundering indicators detected</p>
                    </div>
                  )}

                  {result.geminiAnalysis?.overall_assessment && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>AI Assessment</AlertTitle>
                      <AlertDescription>{result.geminiAnalysis.overall_assessment}</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="cross-chain" className="space-y-4">
                  {result.crossChainData ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{result.crossChainData.totalChains}</div>
                            <p className="text-xs text-muted-foreground">Active Chains</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{result.crossChainData.totalTransactions}</div>
                            <p className="text-xs text-muted-foreground">Total Txs</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{result.crossChainData.totalValue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Total Value</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{result.crossChainData.averageRiskScore}</div>
                            <p className="text-xs text-muted-foreground">Avg Risk</p>
                          </CardContent>
                        </Card>
                      </div>

                      {result.crossChainData.chains.map((chain: any, idx: number) => (
                        <Card key={idx}>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              {chain.blockchain.toUpperCase()}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Transactions</p>
                              <p className="font-semibold">{chain.transactionCount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Value</p>
                              <p className="font-semibold">{chain.totalValue.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Risk Score</p>
                              <p className="font-semibold">{chain.riskScore}/100</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last Activity</p>
                              <p className="font-semibold">{new Date(chain.lastSeen).toLocaleDateString()}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {result.crossChainData.crossChainAnalysis && (
                        <Alert variant={result.crossChainData.crossChainAnalysis.risk_level === 'high' || result.crossChainData.crossChainAnalysis.risk_level === 'critical' ? 'destructive' : 'default'}>
                          <Activity className="h-4 w-4" />
                          <AlertTitle>Cross-Chain Pattern: {result.crossChainData.crossChainAnalysis.pattern_type.replace(/_/g, ' ')}</AlertTitle>
                          <AlertDescription className="space-y-2">
                            <p>{result.crossChainData.crossChainAnalysis.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge>Risk: {result.crossChainData.crossChainAnalysis.money_laundering_risk}</Badge>
                              <Badge variant="outline">Sophistication: {result.crossChainData.crossChainAnalysis.sophistication_level}</Badge>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No cross-chain activity detected</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent transactions for this address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hash</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      result.transactions.map((tx, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">
                            <a 
                              href={`https://etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              {tx.hash.slice(0, 10)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                          </TableCell>
                          <TableCell>{tx.value} ETH</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp * 1000).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}