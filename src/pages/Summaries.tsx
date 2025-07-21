import { useEffect, useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar as CalendarIcon, ChevronDown, Filter } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


function groupByDate(summaries: any[]) {
  // Group summaries by date (YYYY-MM-DD)
  const map: Record<string, any[]> = {};
  summaries.forEach((s) => {
    if (!s.date) return;
    const dateKey = new Date(s.date).toISOString().slice(0, 10); // YYYY-MM-DD
    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(s);
  });
  // Sort dates descending
  const sortedDates = Object.keys(map).sort((a, b) => b.localeCompare(a));
  return sortedDates.map((date) => ({ date, items: map[date] }));
}

const getImpact = (summaryText: string[]) => {
  if (!summaryText || summaryText.length === 0) return "low";
  if (summaryText.length > 4) return "high";
  if (summaryText.length > 2) return "medium";
  return "low";
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const TrackChanges = () => {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  // Filter states
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [hideNoChanges, setHideNoChanges] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/api/competitors/summaries?userId=${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch summaries");
        const data = await res.json();
        setSummaries(data.summaries || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const allCompanies = useMemo(
    () => [...new Set(summaries.map((s) => s.company))],
    [summaries]
  );

  const filteredSummaries = useMemo(() => {
    let result = summaries;

    if (date?.from && date?.to) {
      result = result.filter((s) => {
        if (!s.date) return false;
        const summaryDate = new Date(s.date);
        return summaryDate >= date.from! && summaryDate <= date.to!;
      });
    }

    if (selectedCompanies.length > 0) {
      result = result.filter((s) => selectedCompanies.includes(s.company));
    }

    if (hideNoChanges) {
      result = result.filter((s) => {
        const changes = Array.isArray(s.summary) ? s.summary : [];
        return changes.some(
          (c) => c && c.toLowerCase() !== "no changes detected"
        );
      });
    }

    return result;
  }, [summaries, date, selectedCompanies, hideNoChanges]);

  const grouped = groupByDate(filteredSummaries);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Track <span className="bg-gradient-primary bg-clip-text text-transparent">Changes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            See how CompetitorIQ delivers intelligent, actionable insights 
            about your competitors' latest moves.
          </p>
        </div>
      </section>
      {/* Summaries section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg border border-border/50">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Companies
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {allCompanies.map((company) => (
                    <DropdownMenuCheckboxItem
                      key={company}
                      checked={selectedCompanies.includes(company)}
                      onCheckedChange={(checked) => {
                        setSelectedCompanies((prev) =>
                          checked
                            ? [...prev, company]
                            : prev.filter((c) => c !== company)
                        );
                      }}
                    >
                      {company}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="hide-no-changes" checked={hideNoChanges} onCheckedChange={(checked) => setHideNoChanges(Boolean(checked))} />
                <Label htmlFor="hide-no-changes">Hide "no changes"</Label>
              </div>
            </div>

            {loading && <div className="text-center text-muted-foreground">Loading summaries...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {!loading && !error && grouped.length === 0 && (
              <div className="text-center text-muted-foreground">No summaries found.</div>
            )}
            <div className="space-y-10">
              {grouped.map(({ date, items }) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-semibold">{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="space-y-6">
                    {items.map((summary, idx) => {
                      const impact = getImpact(summary.summary);
                      const changes = Array.isArray(summary.summary) ? summary.summary : [];
                      const hasRealChanges = changes.some(
                        (c) => c && c.toLowerCase() !== "no changes detected"
                      );
                      return (
                        <Card key={idx} className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-300">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{summary.company}</CardTitle>
                              <div className="flex gap-2">
                                <Badge className={getImpactColor(impact)}>
                                  {impact} impact
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {hasRealChanges ? (
                                changes.map((change: string, changeIndex: number) =>
                                  change && change.toLowerCase() !== "no changes detected" ? (
                                    <li key={changeIndex} className="flex items-start gap-2 text-sm">
                                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-muted-foreground">{change}</span>
                                    </li>
                                  ) : null
                                )
                              ) : (
                                <li className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-muted-foreground">No changes detected</span>
                                </li>
                              )}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* CTA */}
            <div className="text-center mt-12 p-8 bg-muted/20 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">
                Want summaries like this for your competitors?
              </h3>
              <p className="text-muted-foreground mb-6">
                Start tracking your competitors and get intelligent weekly summaries 
                delivered to your inbox or Slack.
              </p>
              <Button asChild variant="hero" size="lg">
                <Link to="/add">
                  Start Tracking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TrackChanges;