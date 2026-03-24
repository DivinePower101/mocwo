import { useState, useEffect } from "react";
import { verifyAdmin } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Users, CreditCard, TrendingUp, DollarSign, Calendar, Heart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Plus } from "lucide-react";

const Admin = () => {
  const [preAuthPassed, setPreAuthPassed] = useState(false);
  const [preAuthAnswer, setPreAuthAnswer] = useState("");
  const [preAuthError, setPreAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [partnerships, setPartnerships] = useState([]);
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [selectedPrayer, setSelectedPrayer] = useState<any | null>(null);
  const [stats, setStats] = useState({
    totalPartnerships: 0,
    totalAmount: 0,
    pendingApplications: 0,
    activePartners: 0,
    totalMembers: 0,
    pendingMembers: 0,
    approvedMembers: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPartnerships();
      fetchMembershipRequests();
      fetchPrayerRequests();
      fetchStats();
      fetchNews();
    }
  }, [isAuthenticated]);

  const fetchNews = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching news", description: error.message, variant: "destructive" });
    }
  };

  const fetchMembershipRequests = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembershipRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching membership requests",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchPrayerRequests = async () => {
    try {
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
    }
  };

  const updatePrayerStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Prayer request marked as ${status}`,
      });

      fetchPrayerRequests();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNewsSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (editing) {
        const { error } = await (supabase as any).from("news").update({
          title: newsForm.title,
          excerpt: newsForm.excerpt,
          content: newsForm.content,
          date: newsForm.date,
          image: newsForm.image,
          link: newsForm.link,
        }).eq("id", editing.id);

        if (error) throw error;
        toast({ title: "News updated", description: "The news item was updated." });
      } else {
        const { error } = await (supabase as any).from("news").insert([{
          title: newsForm.title,
          excerpt: newsForm.excerpt,
          content: newsForm.content,
          date: newsForm.date,
          image: newsForm.image,
          link: newsForm.link,
        }]);

        if (error) throw error;
        toast({ title: "News created", description: "A new news item was created." });
      }

      setNewsForm({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
      setEditing(null);
      fetchNews();
    } catch (error: any) {
      toast({ title: "Error saving news", description: error.message, variant: "destructive" });
    }
  };

  const handleNewsEdit = (item: any) => {
    setEditing(item);
    setNewsForm({ title: item.title || "", excerpt: item.excerpt || "", content: item.content || "", date: item.date || "", image: item.image || "", link: item.link || "" });
  };

  const handleNewsDelete = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    try {
      const { error } = await (supabase as any).from("news").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "News item deleted." });
      fetchNews();
    } catch (error: any) {
      toast({ title: "Error deleting news", description: error.message, variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `news/${fileName}`;

      const { data: uploadData, error: uploadError } = await (supabase as any).storage
        .from('news-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = await (supabase as any).storage.from('news-images').getPublicUrl(filePath);
      const publicUrl = (urlData as any)?.publicUrl || (urlData as any)?.public_url || '';

      setNewsForm(prev => ({ ...prev, image: publicUrl }));
      toast({ title: 'Image uploaded', description: 'Image uploaded to storage.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setImageUploading(false);
    }
  };

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        // Verify admin status using backend API (bypasses RLS)
        const verifyData = await verifyAdmin(session.user.email);

        if (verifyData.success && verifyData.data?.isAdmin) {
          setIsAuthenticated(true);
        } else {
          // if user exists but doesn't meet criteria, ensure we sign out as a safety measure
          try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;

      // Verify admin status
      const verifyData = await verifyAdmin(loginForm.email);

      if (verifyData.success && verifyData.data?.isAdmin) {
        setIsAuthenticated(true);
        setLoginForm({ email: "", password: "" });
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
      } else {
        await supabase.auth.signOut();
        setLoginError(verifyData.error || "Unauthorized access");
      }
    } catch (error: any) {
      setLoginError(error.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setPreAuthPassed(false);
    setLoginForm({ email: "", password: "" });
    setLoginError("");
    setPreAuthAnswer("");
    setPreAuthError("");
  };

  const handlePreAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPreAuthError("");
    
    if (preAuthAnswer.toLowerCase().trim() === "revprince") {
      setPreAuthPassed(true);
      setPreAuthAnswer("");
    } else {
      setPreAuthError("Access denied");
      setPreAuthAnswer("");
    }
  };

  const fetchPartnerships = async () => {
    try {
      const { data, error } = await supabase
        .from('partnerships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartnerships(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching partnerships",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    try {
      const { data: partnershipData, error: partnershipError } = await supabase
        .from('partnerships')
        .select('*');

      if (partnershipError) throw partnershipError;

      const partnershipTotal = partnershipData?.length || 0;
      const partnershipTotalAmount = partnershipData?.reduce((sum, p) => sum + (parseFloat(p.amount?.toString() || '0') || 0), 0) || 0;
      const partnershipPending = partnershipData?.filter(p => p.status === 'pending').length || 0;
      const partnershipActive = partnershipData?.filter(p => p.status === 'approved').length || 0;

      const { data: membershipData, error: membershipError } = await supabase
        .from('membership_requests')
        .select('*');

      if (membershipError) throw membershipError;

      const membershipTotal = membershipData?.length || 0;
      const membershipPending = membershipData?.filter(m => m.status === 'pending').length || 0;
      const membershipApproved = membershipData?.filter(m => m.status === 'approved').length || 0;

      setStats({
        totalPartnerships: partnershipTotal,
        totalAmount: partnershipTotalAmount,
        pendingApplications: partnershipPending,
        activePartners: partnershipActive,
        totalMembers: membershipTotal,
        pendingMembers: membershipPending,
        approvedMembers: membershipApproved
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('partnerships')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Partnership ${status} successfully`,
      });

      fetchPartnerships();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateMembershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Membership ${status} successfully`,
      });

      fetchMembershipRequests();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deletePartnership = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partnership?")) return;
    
    try {
      const { error } = await supabase
        .from('partnerships')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(error.message || 'Failed to delete partnership');
      }

      toast({
        title: "Partnership deleted",
        description: "Entry has been removed successfully",
      });

      fetchPartnerships();
      fetchStats();
    } catch (error: any) {
      console.error('Delete partnership error:', error);
      toast({
        title: "Error deleting partnership",
        description: error.message || 'Check console for details',
        variant: "destructive",
      });
    }
  };

  const deleteMembershipRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership request?")) return;
    
    try {
      const { error } = await supabase
        .from('membership_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(error.message || 'Failed to delete membership request');
      }

      toast({
        title: "Membership request deleted",
        description: "Entry has been removed successfully",
      });

      fetchMembershipRequests();
      fetchStats();
    } catch (error: any) {
      console.error('Delete membership request error:', error);
      toast({
        title: "Error deleting membership request",
        description: error.message || 'Check console for details',
        variant: "destructive",
      });
    }
  };

  const deletePrayerRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prayer request?")) return;
    
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(error.message || 'Failed to delete prayer request');
      }

      toast({
        title: "Prayer request deleted",
        description: "Entry has been removed successfully",
      });

      fetchPrayerRequests();
      setSelectedPrayer(null);
    } catch (error: any) {
      console.error('Delete prayer request error:', error);
      toast({
        title: "Error deleting prayer request",
        description: error.message || 'Check console for details',
        variant: "destructive",
      });
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(error.message || 'Failed to delete news item');
      }

      toast({
        title: "News item deleted",
        description: "Entry has been removed successfully",
      });

      fetchNews();
    } catch (error: any) {
      console.error('Delete news error:', error);
      toast({
        title: "Error deleting news item",
        description: error.message || 'Check console for details',
        variant: "destructive",
      });
    }
  };

  // Pre-authentication gate
  if (!preAuthPassed) {
    return (
      <div className="min-h-screen bg-background fixed inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-black/50 absolute inset-0" />
        <Card className="w-full max-w-md border-0 shadow-divine z-50 relative">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-7xl mb-6">🤔</div>
              <h2 className="text-2xl font-bold mb-4">Who sent you here?</h2>
              <form onSubmit={handlePreAuth} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter the answer"
                  value={preAuthAnswer}
                  onChange={(e) => setPreAuthAnswer(e.target.value)}
                  className="text-center text-lg"
                  autoFocus
                  required
                />
                {preAuthError && (
                  <div className="text-red-500 font-semibold text-center pt-2">
                    {preAuthError}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-royal text-primary-foreground text-lg py-6"
                >
                  Submit
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-divine">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-royal rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {loginError}
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-royal text-primary-foreground">
                Login to Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <div className="bg-gradient-hero py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground">Admin Dashboard</h1>
            <p className="text-primary-foreground/80">Manage all church operations</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Partnerships</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalPartnerships}</p>
                </div>
                <CreditCard className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalMembers}</p>
                </div>
                <Users className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prayer Requests</p>
                  <p className="text-3xl font-bold text-primary">{prayerRequests.length}</p>
                </div>
                <Heart className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">News Articles</p>
                  <p className="text-3xl font-bold text-primary">{newsItems.length}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard - Component Cards with CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Partnerships Card */}
          <Card className="border-0 shadow-divine hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPartnerships}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <Badge variant="secondary">{stats.pendingApplications}</Badge>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/admin-partnerships'}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg"
              >
                Manage Partnerships →
              </Button>
            </CardContent>
          </Card>

          {/* Memberships Card */}
          <Card className="border-0 shadow-divine hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Memberships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalMembers}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <Badge variant="secondary">{stats.pendingMembers}</Badge>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/admin-memberships'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-lg"
              >
                Manage Memberships →
              </Button>
            </CardContent>
          </Card>

          {/* Prayer Requests Card */}
          <Card className="border-0 shadow-divine hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Prayer Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-red-600">{prayerRequests.length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Received</p>
                  <Badge variant="secondary">{prayerRequests.filter((p: any) => p.status === 'received').length}</Badge>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/admin-prayers'}
                className="w-full bg-gradient-to-r from-red-600 to-pink-500 text-white hover:shadow-lg"
              >
                View Prayers →
              </Button>
            </CardContent>
          </Card>

          {/* News Card */}
          <Card className="border-0 shadow-divine hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Articles</p>
                  <p className="text-2xl font-bold text-purple-600">{newsItems.length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Recent</p>
                  <Badge variant="secondary">{newsItems.length > 0 ? 'Updated' : 'None'}</Badge>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/admin-news'}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:shadow-lg"
              >
                Manage News →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;