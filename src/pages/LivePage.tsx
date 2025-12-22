import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Users, MessageSquare, Heart, Settings, Maximize, Volume2, Share, X } from "lucide-react";
import { Link } from "react-router-dom";

const LivePage = () => {
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(8543);
  const [chatMessage, setChatMessage] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [prayerRequest, setPrayerRequest] = useState("");

  const chatMessages = [
    {
      user: "Grace M.",
      message: "Praise God! This message is exactly what I needed to hear today 🙏",
      time: "2 min ago",
      isHighlighted: false
    },
    {
      user: "John K.",
      message: "Praying for everyone watching from Kenya. God bless!",
      time: "3 min ago",
      isHighlighted: false
    },
    {
      user: "Pastor Assistant",
      message: "Welcome everyone! Please share your prayer requests in the chat",
      time: "5 min ago",
      isHighlighted: true
    },
    {
      user: "Sarah L.",
      message: "Thank you Pastor for this powerful word! Lives are being changed",
      time: "7 min ago",
      isHighlighted: false
    },
    {
      user: "Michael R.",
      message: "Watching from South Africa. The presence of God is so strong! 🔥",
      time: "10 min ago",
      isHighlighted: false
    }
  ];

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
  { quality: "1080p HD", viewers: "5.2K", bandwidth: "High", videoId: "_Ggh3GmOY5A" },
  { quality: "720p HD", viewers: "2.8K", bandwidth: "Medium", videoId: "_Ggh3GmOY5A" },
  { quality: "480p", viewers: "1.1K", bandwidth: "Low", videoId: "_Ggh3GmOY5A" },
  { quality: "Audio Only", viewers: "892", bandwidth: "Minimal", videoId: "_Ggh3GmOY5A" }
];

const [iframeKey, setIframeKey] = useState(0);

const handleQualityChange = (quality) => {
  setSelectedQuality(quality);
  // Force iframe to reload by changing key
  setIframeKey(prev => prev + 1);
};

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log("Sending message:", chatMessage);
      setChatMessage("");
    }
  };

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
                  <iframe
  key={iframeKey}
  className="w-full h-full"
  src={`https://www.youtube.com/embed/live/UCgJlc4AenFuOA6eRH94w4Ew`}
  title="Sunday Service - Live"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
                  
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
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg text-sm transition-all ${
                          msg.isHighlighted
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <div className="font-semibold text-primary text-xs">{msg.user}</div>
                        <div className="text-foreground text-sm">{msg.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{msg.time}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex space-x-2 pb-4 border-t border-border pt-3">
                    <Input
                      placeholder="Type message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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