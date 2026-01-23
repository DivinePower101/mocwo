import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Users, MessageSquare, Heart, Settings, Maximize, Volume2, Share, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// YouTube Configuration
const YOUTUBE_CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || "";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "";

// Fallback video link if YouTube API is not configured
const FALLBACK_VIDEO_URL = "https://www.youtube.com/watch?v=2AXtwCNMVKc";

const LivePage = () => {
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(8543);
  const [chatMessage, setChatMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState("720p HD");
  const [iframeError, setIframeError] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [prayerRequest, setPrayerRequest] = useState("");
  const [isLoadingLiveStream, setIsLoadingLiveStream] = useState(false);

  const [chatMessages, setChatMessages] = useState<Array<{id:string;user_name:string;message:string;created_at:string;is_highlighted:boolean}>>([]);
  const [displayName, setDisplayName] = useState<string>("Guest");

  // Function to fetch current live video from YouTube API
  const fetchCurrentLiveVideo = async () => {
    if (!YOUTUBE_CHANNEL_ID || !YOUTUBE_API_KEY) {
      console.warn("YouTube API credentials not configured");
      return null;
    }

    setIsLoadingLiveStream(true);
    try {
      const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
      searchUrl.searchParams.set("part", "snippet");
      searchUrl.searchParams.set("channelId", YOUTUBE_CHANNEL_ID);
      searchUrl.searchParams.set("eventType", "live");
      searchUrl.searchParams.set("type", "video");
      searchUrl.searchParams.set("key", YOUTUBE_API_KEY);
      searchUrl.searchParams.set("maxResults", "1");
      searchUrl.searchParams.set("order", "date");

      const response = await fetch(searchUrl.toString());
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        console.log("Found live video:", videoId);
        return videoId;
      }

      console.log("No live video currently streaming");
      return null;
    } catch (error) {
      console.error("Failed to fetch live video from YouTube:", error);
      return null;
    } finally {
      setIsLoadingLiveStream(false);
    }
  };

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
  { quality: "1080p HD", viewers: "5.2K", bandwidth: "High", videoId: "yNB1h2ubyYM" },
  { quality: "720p HD", viewers: "2.8K", bandwidth: "Medium", videoId: "yNB1h2ubyYM" },
  { quality: "480p", viewers: "1.1K", bandwidth: "Low", videoId: "yNB1h2ubyYM" },
  { quality: "Audio Only", viewers: "892", bandwidth: "Minimal", videoId: "yNB1h2ubyYM" }
];

const [iframeKey, setIframeKey] = useState(0);
const [selectedVideoId, setSelectedVideoId] = useState<string | null>(streamQualities[1].videoId);
const [externalSource, setExternalSource] = useState<string | null>(null);
const [searchParams] = useSearchParams();
const [iframeErrorHandled, setIframeErrorHandled] = useState(false);
const [pasteLink, setPasteLink] = useState("");

// Helper: extract YouTube video id from various URL formats
const getYouTubeVideoId = (url: string) => {
  try {
    // direct id
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
      // youtu.be short links
      const short = url.match(/youtu\.be\/([-_a-zA-Z0-9]{11})/);
    if (short) return short[1];
    // watch?v= links
    const watch = url.match(/[?&]v=([-_a-zA-Z0-9]{11})/);
    if (watch) return watch[1];
    // embed/ links
    const embed = url.match(/embed\/([-_a-zA-Z0-9]{11})/);
    if (embed) return embed[1];
      // live/<id> links
      const live = url.match(/live\/([-_a-zA-Z0-9]{11})/);
      if (live) return live[1];
    return null;
  } catch (e) {
    return null;
  }
};

const extractChannelHandle = (url: string) => {
  // get @handle from urls like https://www.youtube.com/@handle
  const m = url.match(/youtube\.com\/(?:@[-_a-zA-Z0-9]+)/);
  if (!m) return null;
  const handle = m[0].split('/').pop();
  return handle || null;
};

const handleQualityChange = (quality: string) => {
  setSelectedQuality(quality);
  // Force iframe to reload by changing key
  setIframeKey(prev => prev + 1);
};

// read optional `videoId` or `source` query params to pick a stream
useEffect(() => {
  const vid = searchParams.get("videoId");
  const source = searchParams.get("source");
  if (vid) {
    setSelectedVideoId(vid);
    setExternalSource(null);
    setIframeKey(k => k + 1);
    return;
  }
  if (source) {
    const decoded = decodeURIComponent(source);
    const id = getYouTubeVideoId(decoded);
    if (id) {
      setSelectedVideoId(id);
      setExternalSource(null);
      setIframeKey(k => k + 1);
      return;
    }
    // try channel handle -> use live_stream embed param (may work for channel handles)
    const handle = extractChannelHandle(decoded);
    if (handle) {
      // store the channel handle in externalSource so UI can attempt channel embed
      setExternalSource(`channel:${handle}`);
      setSelectedVideoId(null);
      setIframeKey(k => k + 1);
      return;
    }

    // unknown external source; show a link to open externally
    setExternalSource(decoded);
    setSelectedVideoId(null);
    setIframeKey(k => k + 1);
  }
}, [searchParams]);

const handleLoadLink = (link?: string) => {
  const raw = (link ?? pasteLink).trim();
  if (!raw) return;
  const id = getYouTubeVideoId(raw);
  if (id) {
    setSelectedVideoId(id);
    setExternalSource(null);
  } else {
    const handle = extractChannelHandle(raw);
    if (handle) {
      setExternalSource(`channel:${handle}`);
      setSelectedVideoId(null);
    } else {
      setExternalSource(raw);
      setSelectedVideoId(null);
    }
  }
  setIframeKey(k => k + 1);
  setIframeError(false);
  setIframeErrorHandled(false);
};

  const handleSendMessage = () => {
    const text = chatMessage.trim();
    if (!text) return;
    const payload = {
      user_name: displayName,
      message: text,
    };
    (async () => {
      const { error } = await supabase.from("live_messages" as any).insert([payload]);
      if (error) console.error("Failed to send message:", error);
      setChatMessage("");
    })();
  };

  // Fetch live video on component mount
  useEffect(() => {
    const initializeLiveStream = async () => {
      const liveVideoId = await fetchCurrentLiveVideo();
      if (liveVideoId) {
        setSelectedVideoId(liveVideoId);
        setExternalSource(null);
        setIframeKey(k => k + 1);
        console.log("Live stream initialized with video:", liveVideoId);
      } else {
        console.log("No live stream detected, using default or fallback");
      }
    };

    initializeLiveStream();

    // Refresh live status every 2 minutes
    const interval = setInterval(initializeLiveStream, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
        .from("live_messages" as any)
        .select("id,user_name,message,created_at,is_highlighted")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return console.error("Error loading messages:", error);
      if (!mounted) return;
      setChatMessages(((data as unknown || []) as Array<{id:string;user_name:string;message:string;created_at:string;is_highlighted:boolean}>).reverse());
    };

    loadRecent();

    const channel = supabase
      .channel("public:live_messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_messages" }, (payload) => {
        const msg = payload.new as {id:string;user_name:string;message:string;created_at:string;is_highlighted:boolean};
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
                {/* Paste a stream URL here to load into the player */}
                <div className="p-3 border-b border-border bg-background/5 flex items-center gap-2">
                  <Input
                    placeholder="Paste stream URL (YouTube/TikTok/etc.)"
                    value={pasteLink}
                    onChange={(e) => setPasteLink(e.target.value)}
                    className="flex-1 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleLoadLink()}
                  />
                  <Button size="sm" onClick={() => handleLoadLink()}>Load</Button>
                </div>

                {/* Video Player Area - YouTube Embed */}
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  {/* Use the selected stream's videoId in a proper embed URL */}
                  {(() => {
                    // prefer an explicitly selected video id (via query param or clicking a link)
                    let src: string | null = null;
                    if (selectedVideoId) {
                      src = `https://www.youtube.com/live/yNB1h2ubyYM?si=_tPwUI9yxZCDFGMO`;
                    } else if (externalSource && externalSource.startsWith("channel:")) {
                      const handle = externalSource.replace("channel:", "");
                      // attempt to use live_stream embed by handle (may work for some channels)
                      src = `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(handle)}`;
                    } else if (!externalSource) {
                      const chosen = streamQualities.find(s => s.quality === selectedQuality) || streamQualities[1];
                      src = `https://www.youtube.com/embed/${chosen.videoId}?autoplay=1&mute=1`;
                    }

                    const embedNoCookie = src ? src.replace("youtube.com/embed", "youtube-nocookie.com/embed") : null;
                    const watchUrl = selectedVideoId ? `https://www.youtube.com/watch?v=${selectedVideoId}` : externalSource;

                    // Auto-open the watch URL if embedding fails and we haven't handled it yet
                    useEffect(() => {
                      if (iframeError && !iframeErrorHandled && watchUrl) {
                        try {
                          window.open(watchUrl, "_blank");
                        } catch (e) {
                          console.warn("Failed to auto-open watch URL", e);
                        }
                        setIframeErrorHandled(true);
                      }
                    }, [iframeError, iframeErrorHandled, watchUrl]);

                    return (
                      <>
                        {src ? (
                          <iframe
                            key={iframeKey}
                            className="w-full h-full"
                            src={src}
                            title="Sunday Service - Live"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                            allowFullScreen
                            onLoad={() => { console.debug("iframe loaded", src); setIframeError(false); }}
                            onError={() => { console.debug("iframe error", src); setIframeError(true); }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-white mb-2">This stream cannot be embedded.</div>
                              {externalSource ? (
                                <div className="flex space-x-2 justify-center">
                                  <Button size="sm" onClick={() => window.open(externalSource, "_blank")}>Open External</Button>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">No embeddable stream available.</div>
                              )}
                            </div>
                          </div>
                        )}

                        {iframeError && (
                          <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-center p-4">
                            <div className="text-white font-semibold mb-2">Unable to play the stream.</div>
                            <div className="text-sm text-muted-foreground mb-4">Embedding was blocked — YouTube may have disabled embedding for this stream.</div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <Button size="sm" onClick={() => { setIframeKey(k => k + 1); setIframeError(false); }}>Retry</Button>
                              {embedNoCookie && (
                                <Button size="sm" variant="outline" onClick={() => window.open(embedNoCookie, "_blank")}>Open Embed (nocookie)</Button>
                              )}
                              {watchUrl && (
                                <Button size="sm" variant="ghost" onClick={() => window.open(watchUrl, "_blank")}>Open on YouTube</Button>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-3 break-words">Embed URL: {src}</div>
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