import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog";
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

type EditLinks = {
  homepage: string;
  pricing: string;
  blog: string;
  releaseNotes: string;
  playstore: string;
  appstore: string;
  linkedin: string;
  twitter: string;
  custom: string[];
};

export default function ManageTracking() {
  const [tracked, setTracked] = useState([]); 
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editLinks, setEditLinks] = useState<EditLinks>({
    homepage: "",
    pricing: "",
    blog: "",
    releaseNotes: "",
    playstore: "",
    appstore: "",
    linkedin: "",
    twitter: "",
    custom: [""]
  });
  const [showDialog, setShowDialog] = useState(false);
  const [updateFreq, setUpdateFreq] = useState("daily"); // global frequency
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    // Fetch user preferences
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
      });
    // Fetch competitors
    fetch(`http://localhost:8000/api/competitors/list?userId=${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch competitors");
        const data = await res.json();
        // Map API fields to tracked state
        setTracked(
          (data.competitors || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            links: {
              homepage: c.homepage || "",
              pricing: c.fields.pricing || "",
              blog: c.fields.blog || "",
              releaseNotes: c.fields.releaseNotes || "",
              playstore: c.fields.playstore || "",
              appstore: c.fields.appstore || "",
              linkedin: c.fields.linkedin || "",
              twitter: c.fields.twitter || "",
              custom: c.fields.custom || [],
            },
          }))
        );
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to load competitors", variant: "destructive" });
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

  const linkFields = [
    { key: "homepage", label: "Homepage" },
    { key: "pricing", label: "Pricing" },
    { key: "blog", label: "Blog" },
    { key: "releaseNotes", label: "Release Notes" },
    { key: "playstore", label: "Play Store" },
    { key: "appstore", label: "App Store" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "twitter", label: "Twitter" },
  ];

  // Open edit dialog
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditName(tracked[idx].name || "");
    const links = tracked[idx].links;
    setEditLinks({
      homepage: links.homepage || "",
      pricing: links.pricing || "",
      blog: links.blog || "",
      releaseNotes: links.releaseNotes || "",
      playstore: links.playstore || "",
      appstore: links.appstore || "",
      linkedin: links.linkedin || "",
      twitter: links.twitter || "",
      custom: links.custom && Array.isArray(links.custom) ? links.custom.slice(0, 5) : [""]
    });
    setShowDialog(true);
  };

  // Save edited links and name
  const handleSaveLinks = async () => {
    if (editIdx === null) return;
    const competitor = tracked[editIdx];
    const updated = {
      name: editName,
      fields: {
        homepage: editLinks.homepage || "",
        pricing: editLinks.pricing || "",
        blog: editLinks.blog || "",
        releaseNotes: editLinks.releaseNotes || "",
        playstore: editLinks.playstore || "",
        appstore: editLinks.appstore || "",
        linkedin: editLinks.linkedin || "",
        twitter: editLinks.twitter || "",
        custom: (editLinks.custom || []).filter(Boolean).slice(0, 5),
      },
    };
    try {
      const res = await fetch(`http://localhost:8000/api/competitors/${competitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to update competitor");
      toast({ title: "Competitor updated!", variant: "default" });
      // Refresh competitor list
      if (userId) {
        const resp = await fetch(`http://localhost:8000/api/competitors/list?userId=${userId}`);
        if (resp.ok) {
          const data = await resp.json();
          setTracked(
            (data.competitors || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              links: {
                homepage: c.homepage || "",
                pricing: c.fields.pricing || "",
                blog: c.fields.blog || "",
                releaseNotes: c.fields.releaseNotes || "",
                playstore: c.fields.playstore || "",
                appstore: c.fields.appstore || "",
                linkedin: c.fields.linkedin || "",
                twitter: c.fields.twitter || "",
                custom: c.fields.custom || [],
              },
            }))
          );
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update competitor", variant: "destructive" });
    }
    setShowDialog(false);
  };

  // Remove tracked competitor (with confirmation)
  const handleRemove = (idx: number) => {
    setConfirmDeleteIdx(idx);
  };

  const confirmDelete = async () => {
    if (confirmDeleteIdx === null) return;
    setDeleting(true);
    const competitor = tracked[confirmDeleteIdx];
    try {
      const res = await fetch(`http://localhost:8000/api/competitors/${competitor.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete competitor");
      toast({ title: "Competitor deleted!", variant: "default" });
      // Refresh competitor list
      if (userId) {
        const resp = await fetch(`http://localhost:8000/api/competitors/list?userId=${userId}`);
        if (resp.ok) {
          const data = await resp.json();
          setTracked(
            (data.competitors || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              links: {
                homepage: c.homepage || "",
                pricing: c.fields.pricing || "",
                blog: c.fields.blog || "",
                releaseNotes: c.fields.releaseNotes || "",
                playstore: c.fields.playstore || "",
                appstore: c.fields.appstore || "",
                linkedin: c.fields.linkedin || "",
                twitter: c.fields.twitter || "",
                custom: c.fields.custom || [],
              },
            }))
          );
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete competitor", variant: "destructive" });
    }
    setDeleting(false);
    setConfirmDeleteIdx(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteIdx(null);
  };

  // Update frequency
  const handleFreqChange = (idx: number, freq: string) => {
    setTracked((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], freq };
      return updated;
    });
  };

  // Add custom link field (max 5)
  const addCustomLink = () => {
    setEditLinks((prev) => {
      const custom = prev.custom || [];
      if (custom.length >= 5) return prev;
      return { ...prev, custom: [...custom, ""] };
    });
  };

  // Remove custom link field
  const removeCustomLink = (i: number) => {
    setEditLinks((prev) => {
      const custom = prev.custom || [];
      return { ...prev, custom: custom.filter((_, idx) => idx !== i) };
    });
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
                  <CardTitle>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      {item.name}
                    </span>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemove(idx)} disabled={deleting}>Remove</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <span className="font-semibold">Links:</span>
                    <ul className="ml-4 mt-1 space-y-1 text-muted-foreground text-sm">
                      {/* Always show homepage */}
                      <li>
                        Homepage: <a href={item.links.homepage} className="underline" target="_blank" rel="noopener noreferrer">{item.links.homepage}</a>
                      </li>
                      {/* Show only non-empty other links */}
                      {linkFields.filter(f => f.key !== "homepage").map(f => (
                        item.links && item.links[f.key] ? (
                          <li key={f.key}>
                            {f.label}: <a href={item.links[f.key]} className="underline" target="_blank" rel="noopener noreferrer">{item.links[f.key]}</a>
                          </li>
                        ) : null
                      ))}
                      {(item.links.custom || []).map((link, i) => (
                        link ? (
                          <li key={"custom-" + i}>Custom {i + 1}: <a href={link} className="underline" target="_blank" rel="noopener noreferrer">{link}</a></li>
                        ) : null
                      ))}
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
            <DialogTitle>Edit Competitor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Competitor Name" />
            </div>
            {linkFields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1">{f.label}</label>
                <Input value={editLinks[f.key] || ""} onChange={e => setEditLinks(l => ({ ...l, [f.key]: e.target.value }))} placeholder={`${f.label} URL`} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Custom Links</label>
              {(editLinks.custom || []).map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input value={link} onChange={e => setEditLinks(l => { const c = [...(l.custom || [])]; c[i] = e.target.value; return { ...l, custom: c }; })} placeholder="Custom URL" />
                  <Button size="icon" variant="ghost" onClick={() => removeCustomLink(i)} disabled={(editLinks.custom || []).length === 1}>-</Button>
                </div>
              ))}
              {(editLinks.custom || []).length < 5 && (
                <Button size="sm" variant="outline" onClick={addCustomLink}>Add Custom Link</Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveLinks}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Delete Dialog */}
      <ConfirmDialog open={confirmDeleteIdx !== null} onOpenChange={cancelDelete}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Delete Competitor</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div>Are you sure you want to delete this competitor? This action cannot be undone.</div>
          <ConfirmDialogFooter>
            <Button variant="outline" onClick={cancelDelete} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
      <Footer />
    </div>
  );
}
  