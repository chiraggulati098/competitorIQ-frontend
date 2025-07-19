import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Globe, DollarSign, MessageSquare, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddCompetitor = () => {
  const [competitors, setCompetitors] = useState([{ url: "", description: "" }]);
  const [email, setEmail] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const { toast } = useToast();

  const addCompetitorField = () => {
    setCompetitors([...competitors, { url: "", description: "" }]);
  };

  const updateCompetitor = (index: number, field: "url" | "description", value: string) => {
    const updated = [...competitors];
    updated[index][field] = value;
    setCompetitors(updated);
  };

  const removeCompetitor = (index: number) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const validCompetitors = competitors.filter(c => c.url.trim());
    if (validCompetitors.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one competitor URL",
        variant: "destructive"
      });
      return;
    }

    if (!email && !slackWebhook) {
      toast({
        title: "Error", 
        description: "Please provide either email or Slack webhook for notifications",
        variant: "destructive"
      });
      return;
    }

    // Simulate successful submission
    toast({
      title: "Success!",
      description: "Your competitor tracking has been set up. You'll receive your first summary within 24 hours.",
    });

    // Reset form
    setCompetitors([{ url: "", description: "" }]);
    setEmail("");
    setSlackWebhook("");
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
            Start Tracking <span className="bg-gradient-primary bg-clip-text text-transparent">Competitors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Add your competitors' URLs and get AI-powered insights delivered to your workflow.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* URL Types Info */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    What can you track?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {urlTypes.map((type, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <type.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.example}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competitor URLs */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Competitor URLs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {competitors.map((competitor, index) => (
                    <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`url-${index}`}>Competitor #{index + 1}</Label>
                        {competitors.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCompetitor(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        id={`url-${index}`}
                        placeholder="https://competitor.com"
                        value={competitor.url}
                        onChange={(e) => updateCompetitor(index, "url", e.target.value)}
                      />
                      <Textarea
                        placeholder="Optional: What should we focus on for this competitor?"
                        value={competitor.description}
                        onChange={(e) => updateCompetitor(index, "description", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCompetitorField}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Competitor
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>How should we notify you?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="text-center text-muted-foreground">or</div>
                  
                  <div>
                    <Label htmlFor="slack">Slack Webhook URL</Label>
                    <Input
                      id="slack"
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      <a href="#" className="text-primary hover:underline">
                        How to get your Slack webhook URL
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="text-center">
                <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Tracking Competitors
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  You'll receive your first summary within 24 hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AddCompetitor;