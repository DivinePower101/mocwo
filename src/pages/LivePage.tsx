import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Users, MessageSquare, Heart, Settings, Maximize, Volume2, Share, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LivePage = () => {
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(8543);
  const [chatMessage, setChatMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState("720p HD");
  const [iframeError, setIframeError] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [prayerRequest, setPrayerRequest] = useState("");

  const [chatMessages, setChatMessages] = useState<Array<{id:string;user_name:string;message:string;created_at:string;is_highlighted:boolean}>>([]);
  const [displayName, setDisplayName] = useState<string>("Guest");

  const upcomingServices = [
    {
      title: "Wednesday Midweek Service",
      time: "Tonight at 7:00 PM",
      description: "Bible study and prayer",
      isNext: true
    },
    {
      title: "Thursday Dominion Hour",
      time: "Tomorrow at 10:00 AM",
      description: "Prayer and prophetic ministry",
      isNext: false
    },
    {
      title: "Friday Prayer Encounter",
      time: "Friday at 7:00 PM",
      description: "Intensive prayer session",
      isNext: false
    }
  ];

const streamQualities = [
  { quality: "1080p HD", viewers: "5.2K", bandwidth: "High", videoId: "MRu5yQN0t04" },
  { quality: "720p HD", viewers: "2.8K", bandwidth: "Medium", videoId: "MRu5yQN0t04" },
  { quality: "480p", viewers: "1.1K", bandwidth: "Low", videoId: "MRu5yQN0t04" },
  { quality: "Audio Only", viewers: "892", bandwidth: "Minimal", videoId: "MRu5yQN0t04" }
];

const [iframeKey, setIframeKey] = useState(0);

const handleQualityChange = (quality: string) => {
  setSelectedQuality(quality);
  // Force iframe to reload by changing key
  setIframeKey(prev => prev + 1);
};

  const handleSendMessage = () => {
    const text = chatMessage.trim();
    if (!text) return;
    const payload = {
      user_name: displayName,
      message: text,
    };
    (async () => {
      const { error } = await supabase.from("live_messages").insert([payload]);
      if (error) console.error("Failed to send message:", error);
      setChatMessage("");
    })();
  };

  useEffect(() => {
    // generate or reuse a guest display name
    let name = localStorage.getItem("moc_display_name");
    if (!name) {
      name = `Guest-${Math.floor(Math.random() * 9000) + 1000}`;
      localStorage.setItem("moc_display_name", name);
    }
    setDisplayName(name);

    let mounted = true;

    const loadRecent = async () => {
      const { data, error } = await supabase
        .from("live_messages")
        .select("id,user_name,message,created_at,is_highlighted")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return console.error("Error loading messages:", error);
      if (!mounted) return;
      setChatMessages((data || []).reverse() as any);
    };

    loadRecent();

    const channel = supabase
      .channel("public:live_messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_messages" }, (payload) => {
        const msg = payload.new;
        setChatMessages((prev) => [...prev, msg]);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePrayerRequest = () => {
    if (prayerRequest.trim()) {
      console.log("Prayer request submitted:", prayerRequest);
      setPrayerRequest("");
      setShowPrayerModal(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 min-h-[calc(100vh-8rem)]">
          {/* Main Video Player */}
          <div className="lg:col-span-3 order-1">
            <Card className="border-0 shadow-divine bg-black overflow-hidden">
              <div className="relative">
                {/* Video Player Area - YouTube Embed */}
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  {/* Use the selected stream's videoId in a proper embed URL */}
                  {(() => {
                    const chosen = streamQualities.find(s => s.quality === selectedQuality) || streamQualities[1];
                    const src = `https://www.youtube.com/embed/${chosen.videoId}?autoplay=1&mute=1`;
                    return (
                      <>
                        <iframe
                          key={iframeKey}
                          className="w-full h-full"
                          src={src}
                          title="Sunday Service - Live"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                          allowFullScreen
                          onLoad={() => setIframeError(false)}
                          onError={() => setIframeError(true)}
                        />

                        {iframeError && (
                          <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-center p-4">
                            <div className="text-white font-semibold mb-2">Unable to play the stream.</div>
                            <div className="text-sm text-muted-foreground mb-4">An error occurred. Please try again later.</div>
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => { setIframeKey(k => k + 1); setIframeError(false); }}>Retry</Button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  {/* Live Indicator */}
                  {isLive && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                      <Badge className="bg-red-600 text-white animate-pulse">
                        ● LIVE
                      </Badge>
                      <Badge variant="secondary" className="bg-background/80">
                        <Users className="w-4 h-4 mr-1" />
                        {viewerCount.toLocaleString()}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Stream Quality Options */}
                <div className="p-4 bg-background border-t border-border">
                  <h3 className="font-semibold mb-3 text-sm">Stream Quality</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {streamQualities.map((stream) => (
  <Button
    key={stream.quality}
    variant={selectedQuality === stream.quality ? "default" : "outline"}
    size="sm"
    className="flex flex-col items-center p-3 h-auto"
    onClick={() => handleQualityChange(stream.quality)}
  >
    <span className="font-semibold text-xs">{stream.quality}</span>
    <span className="text-xs text-muted-foreground">{stream.viewers}</span>
  </Button>
))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-none">
            {/* Live Chat */}
            <Card className="border-0 shadow-divine h-80 lg:h-96 flex flex-col">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Live Chat
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowChat(!showChat)}
                  >
                    {showChat ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showChat && (
                <CardContent className="flex flex-col flex-1 pb-0 overflow-hidden">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 py-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded-lg text-sm transition-all ${
                          msg.is_highlighted
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <div className="font-semibold text-primary text-xs">{msg.user_name}</div>
                        <div className="text-foreground text-sm">{msg.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleTimeString()}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex space-x-2 pb-4 border-t border-border pt-3">
                    <Input
                      placeholder="Type message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 text-sm"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      className="px-3"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 space-y-3">
                <Link to="/give/offering" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600">
                    <Heart className="w-4 h-4 mr-2" />
                    Give Offering
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowPrayerModal(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Prayer Request
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigator.share({
                      title: "Join Our Live Service",
                      text: "Watch live worship and teaching",
                      url: window.location.href
                    }).catch(err => console.log("Error sharing:", err))
                  }}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Stream
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Services */}
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingServices.map((service, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all ${
                      service.isNext
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold text-sm">{service.title}</div>
                    <div className="text-primary text-xs font-medium">{service.time}</div>
                    <div className="text-xs text-muted-foreground">{service.description}</div>
                  </div>
                ))}
                <Link to="/services">
                  <Button variant="outline" className="w-full" size="sm">
                    View Full Schedule
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Prayer Request Modal */}
      {showPrayerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-divine">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
              <CardTitle>Submit Prayer Request</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrayerModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Prayer Request</label>
                <textarea
                  placeholder="Share your prayer request..."
                  value={prayerRequest}
                  onChange={(e) => setPrayerRequest(e.target.value)}
                  className="min-h-24 w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPrayerModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handlePrayerRequest}
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LivePage;