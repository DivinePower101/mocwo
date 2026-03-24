import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PrayerRequest {
  id: string;
  name: string;
  phone: string;
  location?: string;
  prayer_text: string;
  method?: string;
  status: string;
  created_at: string;
}

const AdminPrayers = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial3") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayerRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching prayer requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrayerStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Status updated", description: `Prayer marked as ${status}` });
      fetchPrayerRequests();
      setSelectedPrayer(null);
    } catch (error: any) {
      toast({
        title: "Error updating prayer status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deletePrayerRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Prayer request deleted" });
      fetchPrayerRequests();
      setSelectedPrayer(null);
    } catch (error: any) {
      toast({
        title: "Error deleting prayer request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
      {isPasswordProtected ? (
        // Password Gate Modal
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-divine">
            <CardHeader className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Prayer Requests Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Enter Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter access password"
                    className="mt-2"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-600 mt-2">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-pink-500 text-white">
                  Access Prayer Requests
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Main Content
        <>
          {/* Header */}
          <div className="bg-gradient-hero py-8">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary-foreground">Prayer Requests</h1>
                <p className="text-primary-foreground/80">Monitor and manage prayer requests</p>
              </div>
              <Button 
                variant="outline" 
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate('/admin')}
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <Card className="border-0 shadow-divine">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Heart className="w-6 h-6 mr-2" />
                  Prayer Requests ({prayerRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : selectedPrayer ? (
                  <div>
                    <Button variant="outline" onClick={() => setSelectedPrayer(null)} className="mb-6">
                      ← Back to List
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="text-lg font-semibold">{selectedPrayer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-lg font-semibold">{selectedPrayer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-lg font-semibold">{selectedPrayer.location || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Method</p>
                        <Badge variant="outline" className="text-base">
                          {selectedPrayer.method?.toUpperCase() || 'SMS'}
                        </Badge>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Prayer Request</p>
                        <p className="text-base font-semibold whitespace-pre-wrap">{selectedPrayer.prayer_text}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge 
                          variant={selectedPrayer.status === 'processed' ? 'default' : 
                                  selectedPrayer.status === 'failed' ? 'destructive' : 'secondary'}
                          className="text-base"
                        >
                          {selectedPrayer.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="text-lg font-semibold">{new Date(selectedPrayer.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    {selectedPrayer.status === 'received' && (
                      <div className="flex gap-3 mt-6">
                        <Button 
                          onClick={() => updatePrayerStatus(selectedPrayer.id, 'processed')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Mark as Processed
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => updatePrayerStatus(selectedPrayer.id, 'failed')}
                        >
                          Mark as Failed
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => deletePrayerRequest(selectedPrayer.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prayerRequests.map((prayer) => (
                          <TableRow key={prayer.id}>
                            <TableCell className="font-medium">{prayer.name}</TableCell>
                            <TableCell>{prayer.phone}</TableCell>
                            <TableCell>{prayer.location || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{prayer.method?.toUpperCase() || 'SMS'}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={prayer.status === 'processed' ? 'default' : 
                                        prayer.status === 'failed' ? 'destructive' : 'secondary'}
                              >
                                {prayer.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(prayer.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedPrayer(prayer)}
                              >
                                View Details
                              </Button>
                              {prayer.status === 'received' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => updatePrayerStatus(prayer.id, 'processed')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    Processed
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => updatePrayerStatus(prayer.id, 'failed')}
                                  >
                                    Failed
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deletePrayerRequest(prayer.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {prayerRequests.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No prayer requests yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPrayers;
