import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Plus, Globe, DollarSign, MessageSquare, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@clerk/clerk-react';

type Competitor = {
  id: string;
  name: string;
  homepage: string;
  fields: {
    pricing?: string;
    blog?: string;
    releaseNotes?: string;
    playstore?: string;
    appstore?: string;
    linkedin?: string;
    twitter?: string;
    custom?: string[];
  };
  snapshots: Snapshot[];
};

type Snapshot = {
  id: string;
  date: string;
  pages: { url: string; content: string }[];
  diffSummary?: string;
};

const AddCompetitor = () => {
  // State for homepage input
  const [homepage, setHomepage] = useState("");
  // State for loading during crawl
  const [loading, setLoading] = useState(false);
  // State for extracted fields
  const [fields, setFields] = useState({
    pricing: "",
    blog: "",
    releaseNotes: "",
    playstore: "",
    appstore: "",
    linkedin: "",
    twitter: "",
    custom: [""],
  });
  // State for saving
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [homepageContent, setHomepageContent] = useState("");

  useEffect(() => {
    if (localStorage.getItem("competitorAdded") === "1") {
      toast({ title: "Competitor added successfully!" });
      localStorage.removeItem("competitorAdded");
    }
  }, []);

  // Real crawl function using backend API
  const crawlAndExtractFields = async (homepageUrl: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/competitors/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homepage: homepageUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error");
      }
      const data = await res.json();
      setFields({
        pricing: data.pricing || "",
        blog: data.blog || "",
        releaseNotes: data.releaseNotes || "",
        playstore: data.playstore || "",
        appstore: data.appstore || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
        custom: data.custom || [""]
      });
      setHomepageContent(JSON.stringify(data));
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to extract fields", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle homepage submit
  const handleHomepageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepage.trim()) {
      toast({ title: "Error", description: "Please enter a homepage URL", variant: "destructive" });
      return;
    }
    await crawlAndExtractFields(homepage.trim());
  };

  // Handle field change
  const handleFieldChange = (field: string, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  // Handle custom field change
  const handleCustomChange = (idx: number, value: string) => {
    setFields((prev) => {
      const custom = [...(prev.custom || [])];
      custom[idx] = value;
      return { ...prev, custom };
    });
  };

  // Add custom field (max 5)
  const addCustomField = () => {
    setFields((prev) => {
      const custom = prev.custom || [];
      if (custom.length >= 5) return prev;
      return { ...prev, custom: [...custom, ""] };
    });
  };

  // Remove custom field
  const removeCustomField = (idx: number) => {
    setFields((prev) => {
      const custom = [...(prev.custom || [])];
      custom.splice(idx, 1);
      return { ...prev, custom };
    });
  };

  // Save competitor
  const handleSave = async () => {
    setSaving(true);
    try {
      if (!user || !user.id) {
        toast({ title: "Error", description: "You must be logged in to save a competitor.", variant: "destructive" });
        setSaving(false);
        return;
      }
      if (!name.trim()) {
        toast({ title: "Error", description: "Please enter a name for this competitor.", variant: "destructive" });
        setSaving(false);
        return;
      }
      if (!homepageContent) {
        toast({ title: "Error", description: "Please scan the homepage before saving.", variant: "destructive" });
        setSaving(false);
        return;
      }
      // Prepare snapshot using stored homepageContent
      const snapshot = {
        date: new Date().toISOString(),
        pages: [
          { url: homepage, content: homepageContent }
        ]
      };
      // Save to backend
      const res = await fetch("http://localhost:8000/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name, homepage, fields, snapshot }),
      });
      if (res.status === 409) {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Competitor already exists.", variant: "destructive" });
        setSaving(false);
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error");
      }
      // Trigger snapshot in background
      const { id: competitorId } = await res.json();
      fetch(`http://localhost:8000/api/competitors/${competitorId}/snapshot`, { method: "POST" });
      toast({ title: "Competitor saved!", description: "Initial snapshot taken and fields stored." });
      localStorage.setItem("competitorAdded", "1");
      window.location.reload();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save competitor", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const urlTypes = [
    { icon: Globe, label: "Website", example: "https://competitor.com" },
    { icon: DollarSign, label: "Pricing Page", example: "https://competitor.com/pricing" },
    { icon: MessageSquare, label: "Blog", example: "https://competitor.com/blog" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Add a <span className="bg-gradient-primary bg-clip-text text-transparent">Competitor</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter a homepage URL. We’ll auto-extract as much as we can!
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Homepage input form */}
            <form onSubmit={handleHomepageSubmit} className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Homepage URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="https://competitor.com"
                    value={homepage}
                    onChange={(e) => setHomepage(e.target.value)}
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !homepage.trim()} className="w-full">
                    {loading ? "Scanning..." : "Scan & Extract Fields"}
                  </Button>
                </CardContent>
              </Card>
            </form>
            {/* Show extracted fields if not loading and at least one field is filled */}
            {!loading && (fields.pricing || fields.blog || fields.releaseNotes || fields.playstore || fields.appstore || fields.linkedin || fields.twitter || (fields.custom && fields.custom.some(f => f))) && (
              <form className="space-y-6 mt-8" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle>Edit & Confirm Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label>Competitor Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Competitor Name" />
                    <Label>Pricing Page</Label>
                    <Input value={fields.pricing} onChange={e => handleFieldChange("pricing", e.target.value)} />
                    <Label>Blog</Label>
                    <Input value={fields.blog} onChange={e => handleFieldChange("blog", e.target.value)} />
                    <Label>Release Notes</Label>
                    <Input value={fields.releaseNotes} onChange={e => handleFieldChange("releaseNotes", e.target.value)} />
                    <Label>Playstore</Label>
                    <Input value={fields.playstore} onChange={e => handleFieldChange("playstore", e.target.value)} />
                    <Label>Appstore</Label>
                    <Input value={fields.appstore} onChange={e => handleFieldChange("appstore", e.target.value)} />
                    <Label>LinkedIn</Label>
                    <Input value={fields.linkedin} onChange={e => handleFieldChange("linkedin", e.target.value)} />
                    <Label>Twitter</Label>
                    <Input value={fields.twitter} onChange={e => handleFieldChange("twitter", e.target.value)} />
                    <Label>Custom Fields (up to 5)</Label>
                    {fields.custom && fields.custom.map((val, idx) => (
                      <div key={idx} className="flex gap-2 mb-2 items-center">
                        <Input value={val} onChange={e => handleCustomChange(idx, e.target.value)} />
                        {fields.custom.length > 1 && (
                          <Button type="button" variant="destructive" size="icon" onClick={() => removeCustomField(idx)} title="Remove">
                            &times;
                          </Button>
                        )}
                        {idx === fields.custom.length - 1 && fields.custom.length < 5 && (
                          <Button type="button" variant="outline" onClick={addCustomField}>+</Button>
                        )}
                      </div>
                    ))}
                    {(!fields.custom || fields.custom.length === 0) && (
                      <Button type="button" variant="outline" onClick={addCustomField}>Add Custom Field</Button>
                    )}
                  </CardContent>
                </Card>
                <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving..." : "Save Competitor"}</Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AddCompetitor;