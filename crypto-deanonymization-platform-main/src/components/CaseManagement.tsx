"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Download, Calendar, Link as LinkIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CaseItem {
  id: string;
  title: string;
  description: string;
  status: "open" | "investigating" | "closed";
  addresses: string[];
  notes: string[];
  evidence: string[];
  created: number;
  updated: number;
}

export function CaseManagement() {
  const [cases, setCases] = useState<CaseItem[]>([
    {
      id: "1",
      title: "Suspicious High-Value Transfers",
      description: "Investigation into a series of high-value transfers from multiple wallets",
      status: "investigating",
      addresses: ["0x1234...5678", "0xabcd...ef01"],
      notes: ["Initial analysis shows connection to mixer", "Awaiting additional blockchain data"],
      evidence: ["Transaction hash: 0xabc123...", "Linked to known scam operation"],
      created: Date.now() - 86400000 * 3,
      updated: Date.now() - 3600000,
    },
  ]);
  
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    addresses: "",
  });

  const createCase = () => {
    if (!newCase.title) return;

    const caseItem: CaseItem = {
      id: Date.now().toString(),
      title: newCase.title,
      description: newCase.description,
      status: "open",
      addresses: newCase.addresses.split(",").map(a => a.trim()).filter(Boolean),
      notes: [],
      evidence: [],
      created: Date.now(),
      updated: Date.now(),
    };

    setCases([caseItem, ...cases]);
    setNewCase({ title: "", description: "", addresses: "" });
    setIsCreating(false);
  };

  const addNote = (caseId: string, note: string) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          notes: [...c.notes, note],
          updated: Date.now(),
        };
      }
      return c;
    }));
  };

  const addEvidence = (caseId: string, evidence: string) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          evidence: [...c.evidence, evidence],
          updated: Date.now(),
        };
      }
      return c;
    }));
  };

  const updateStatus = (caseId: string, status: CaseItem["status"]) => {
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return { ...c, status, updated: Date.now() };
      }
      return c;
    }));
  };

  const deleteCase = (caseId: string) => {
    setCases(cases.filter(c => c.id !== caseId));
    setSelectedCase(null);
  };

  const exportCase = (caseItem: CaseItem) => {
    const content = `
Case Report: ${caseItem.title}
Generated: ${format(Date.now(), "PPpp")}

Description:
${caseItem.description}

Status: ${caseItem.status}

Addresses:
${caseItem.addresses.map(a => `- ${a}`).join("\n")}

Notes:
${caseItem.notes.map((n, i) => `${i + 1}. ${n}`).join("\n")}

Evidence:
${caseItem.evidence.map((e, i) => `${i + 1}. ${e}`).join("\n")}

Created: ${format(caseItem.created, "PPpp")}
Last Updated: ${format(caseItem.updated, "PPpp")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `case-${caseItem.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>;
      case "investigating":
        return <Badge className="bg-yellow-500">Investigating</Badge>;
      case "closed":
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Investigation Cases</CardTitle>
              <CardDescription>Manage and track your investigations</CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Case</DialogTitle>
                  <DialogDescription>Start a new investigation case</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Case title"
                      value={newCase.title}
                      onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Case description"
                      value={newCase.description}
                      onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Addresses (comma-separated)</label>
                    <Input
                      placeholder="0x123..., 0xabc..."
                      value={newCase.addresses}
                      onChange={(e) => setNewCase({ ...newCase, addresses: e.target.value })}
                    />
                  </div>
                  <Button onClick={createCase} className="w-full">
                    Create Case
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map((caseItem) => (
              <Card
                key={caseItem.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedCase(caseItem)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{caseItem.title}</CardTitle>
                    {getStatusBadge(caseItem.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {caseItem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                    {caseItem.addresses.length} addresses
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {caseItem.notes.length} notes, {caseItem.evidence.length} evidence
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Updated {format(caseItem.updated, "MMM d, yyyy")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCase && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{selectedCase.title}</CardTitle>
                <CardDescription>{selectedCase.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportCase(selectedCase)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteCase(selectedCase.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <div className="flex gap-2">
                <Button
                  variant={selectedCase.status === "open" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(selectedCase.id, "open")}
                >
                  Open
                </Button>
                <Button
                  variant={selectedCase.status === "investigating" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(selectedCase.id, "investigating")}
                >
                  Investigating
                </Button>
                <Button
                  variant={selectedCase.status === "closed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(selectedCase.id, "closed")}
                >
                  Closed
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Linked Addresses</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCase.addresses.map((addr, idx) => (
                  <Badge key={idx} variant="outline" className="font-mono">{addr}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <ScrollArea className="h-[150px] rounded-md border p-4">
                <div className="space-y-2">
                  {selectedCase.notes.map((note, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-muted-foreground">{idx + 1}.</span> {note}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Input
                placeholder="Add note..."
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    addNote(selectedCase.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Evidence</h3>
              <ScrollArea className="h-[150px] rounded-md border p-4">
                <div className="space-y-2">
                  {selectedCase.evidence.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-muted-foreground">{idx + 1}.</span> {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Input
                placeholder="Add evidence..."
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    addEvidence(selectedCase.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
