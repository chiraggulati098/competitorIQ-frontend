import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";

// Mock data
const initialTracked = [
  {
    id: "1",
    name: "Acme Corp",
    links: {
      twitter: "https://twitter.com/acme",
      linkedin: "https://linkedin.com/company/acme",
      custom: ["https://acme.com/blog"]
    },
    freq: "daily"
  },
  {
    id: "2",
    name: "Globex Inc",
    links: {
      twitter: "",
      linkedin: "https://linkedin.com/company/globex",
      custom: []
    },
    freq: "weekly"
  }
];

const freqOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }
];

export default function ManageTracking() {
  const [tracked, setTracked] = useState(initialTracked);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editLinks, setEditLinks] = useState({ twitter: "", linkedin: "", custom: [""] });
  const [showDialog, setShowDialog] = useState(false);
  const [updateFreq, setUpdateFreq] = useState("daily"); // global frequency
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:8000/api/user/preferences?userId=${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch preferences");
        const data = await res.json();
        setUpdateFreq(data.preferences.updateFreq || "daily");
        setReceiveEmail(
          typeof data.preferences.receiveEmail === "boolean"
            ? data.preferences.receiveEmail
            : true
        );
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to load preferences", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Save preferences
  const handleSavePreferences = () => {
    if (!userId) return;
    setSaving(true);
    fetch("http://localhost:8000/api/user/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        preferences: { updateFreq, receiveEmail },
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to save preferences");
        toast({ title: "Preferences saved!", variant: "default" });
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to save preferences", variant: "destructive" });
      })
      .finally(() => setSaving(false));
  };

  // Open edit dialog
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditLinks({ ...tracked[idx].links, custom: [...tracked[idx].links.custom] });
    setShowDialog(true);
  };

  // Save edited links
  const handleSaveLinks = () => {
    if (editIdx === null) return;
    setTracked((prev) => {
      const updated = [...prev];
      updated[editIdx] = { ...updated[editIdx], links: { ...editLinks, custom: editLinks.custom.filter(Boolean) } };
      return updated;
    });
    setShowDialog(false);
  };

  // Remove tracked competitor
  const handleRemove = (idx: number) => {
    setTracked((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update frequency
  const handleFreqChange = (idx: number, freq: string) => {
    setTracked((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], freq };
      return updated;
    });
  };

  // Add custom link field
  const addCustomLink = () => {
    setEditLinks((prev) => ({ ...prev, custom: [...prev.custom, ""] }));
  };

  // Remove custom link field
  const removeCustomLink = (i: number) => {
    setEditLinks((prev) => ({ ...prev, custom: prev.custom.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Manage Tracking</h1>
          {/* User Preferences Box */}
          <div className="mb-8">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Update Frequency:</span>
                    <Select value={updateFreq} onValueChange={setUpdateFreq} disabled={loading || saving}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {freqOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="receive-email" checked={receiveEmail} onCheckedChange={checked => setReceiveEmail(Boolean(checked))} disabled={loading || saving} />
                    <Label htmlFor="receive-email">Receive updates via email?</Label>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Button onClick={handleSavePreferences} disabled={loading || saving || !userId} variant="outline">
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Currently Tracking Heading */}
          <h2 className="text-2xl font-bold mb-4">Currently Tracking</h2>
          <div className="space-y-6 mb-8">
            {tracked.map((item, idx) => (
              <Card key={item.id} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{item.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemove(idx)}>Remove</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <span className="font-semibold">Links:</span>
                    <ul className="ml-4 mt-1 space-y-1 text-muted-foreground text-sm">
                      {item.links.twitter && <li>Twitter: <a href={item.links.twitter} className="underline" target="_blank" rel="noopener noreferrer">{item.links.twitter}</a></li>}
                      {item.links.linkedin && <li>LinkedIn: <a href={item.links.linkedin} className="underline" target="_blank" rel="noopener noreferrer">{item.links.linkedin}</a></li>}
                      {item.links.custom.map((link, i) => link && <li key={i}>Custom: <a href={link} className="underline" target="_blank" rel="noopener noreferrer">{link}</a></li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Add Competitor Button */}
          <div className="mb-8 text-center">
            <Button asChild variant="hero">
              <Link to="/add">Add Competitor</Link>
            </Button>
          </div>
        </div>
      </section>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Links</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <Input value={editLinks.twitter} onChange={e => setEditLinks(l => ({ ...l, twitter: e.target.value }))} placeholder="Twitter URL" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <Input value={editLinks.linkedin} onChange={e => setEditLinks(l => ({ ...l, linkedin: e.target.value }))} placeholder="LinkedIn URL" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Custom Links</label>
              {editLinks.custom.map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input value={link} onChange={e => setEditLinks(l => { const c = [...l.custom]; c[i] = e.target.value; return { ...l, custom: c }; })} placeholder="Custom URL" />
                  <Button size="icon" variant="ghost" onClick={() => removeCustomLink(i)} disabled={editLinks.custom.length === 1}>-</Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addCustomLink}>Add Custom Link</Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveLinks}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
  