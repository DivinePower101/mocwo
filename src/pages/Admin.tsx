import { useState, useEffect } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Additional check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      // require active admin with matching auth UID and admin role
      if (
        adminUser &&
        adminUser.is_active === true &&
        adminUser.role === 'admin'
        // Temporarily disabled auth_uid check until column is added
        // && adminUser.auth_uid === session.user.id
      ) {
        setIsAuthenticated(true);
      } else {
        // if user exists but doesn't meet criteria, ensure we sign out as a safety measure
        try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
        setIsAuthenticated(false);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', loginForm.email)
        .single();

      // get current session user id to compare with stored auth_uid
      const { data: { session } } = await supabase.auth.getSession();
      const currentUid = session?.user?.id || null;

      if (
        adminUser &&
        adminUser.is_active === true &&
        adminUser.role === 'admin'
        // Temporarily disabled auth_uid check until column is added
        // && adminUser.auth_uid === currentUid
      ) {
        setIsAuthenticated(true);
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
      } else {
        await supabase.auth.signOut();
        throw new Error("Unauthorized access");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setLoginForm({ email: "", password: "" });
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-divine">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-royal rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
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
            <p className="text-primary-foreground/80">Manage partnerships and church operations</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Partnerships</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalPartnerships}</p>
                </div>
                <Users className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-3xl font-bold text-primary">${stats.totalAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Applications</p>
                  <p className="text-3xl font-bold text-primary">{stats.pendingApplications}</p>
                </div>
                <Calendar className="w-12 h-12 text-primary opacity-60" />
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
                  <p className="text-sm text-muted-foreground">Pending Members</p>
                  <p className="text-3xl font-bold text-primary">{stats.pendingMembers}</p>
                </div>
                <Calendar className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Members</p>
                  <p className="text-3xl font-bold text-primary">{stats.approvedMembers}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partnerships Table */}
        <Card className="border-0 shadow-divine">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <CreditCard className="w-6 h-6 mr-2" />
              Partnership Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerships.map((partnership: any) => (
                    <TableRow key={partnership.id}>
                      <TableCell className="font-medium">{partnership.name}</TableCell>
                      <TableCell>{partnership.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{partnership.level}</Badge>
                      </TableCell>
                      <TableCell>${partnership.amount}</TableCell>
                      <TableCell>{partnership.payment_method}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={partnership.status === 'approved' ? 'default' : 
                                  partnership.status === 'rejected' ? 'destructive' : 'secondary'}
                        >
                          {partnership.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(partnership.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="space-x-2">
                        {partnership.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => updatePartnershipStatus(partnership.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => updatePartnershipStatus(partnership.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deletePartnership(partnership.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Membership Requests Table */}
        <Card className="border-0 shadow-divine mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="w-6 h-6 mr-2" />
              Membership Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMember ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedMember(null)}
                  className="mb-4"
                >
                  ← Back to List
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted p-6 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="text-lg font-semibold">{selectedMember.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="text-lg font-semibold">{selectedMember.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-lg font-semibold">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="text-lg font-semibold">{selectedMember.date_of_birth || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="text-lg font-semibold">{selectedMember.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Marital Status</p>
                    <p className="text-lg font-semibold">{selectedMember.marital_status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membership Type</p>
                    <p className="text-lg font-semibold">{selectedMember.membership_type || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-lg font-semibold">{selectedMember.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="text-lg font-semibold">{selectedMember.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="text-lg font-semibold">{selectedMember.state || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="text-lg font-semibold">{selectedMember.country || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="text-lg font-semibold">{selectedMember.message || 'No message'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge 
                      variant={selectedMember.status === 'approved' ? 'default' : 
                              selectedMember.status === 'rejected' ? 'destructive' : 'secondary'}
                      className="text-base"
                    >
                      {selectedMember.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="text-lg font-semibold">{new Date(selectedMember.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedMember.status === 'pending' && (
                  <div className="flex gap-3 mt-6">
                    <Button 
                      onClick={() => updateMembershipStatus(selectedMember.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => updateMembershipStatus(selectedMember.id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        deleteMembershipRequest(selectedMember.id);
                        setSelectedMember(null);
                      }}
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
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Membership Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membershipRequests.map((member: any) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.first_name} {member.last_name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.membership_type || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={member.status === 'approved' ? 'default' : 
                                    member.status === 'rejected' ? 'destructive' : 'secondary'}
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(member.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedMember(member)}
                          >
                            View Details
                          </Button>
                          {member.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => updateMembershipStatus(member.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateMembershipStatus(member.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteMembershipRequest(member.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {membershipRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No membership requests yet
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prayer Requests */}
        <Card className="border-0 shadow-divine mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Heart className="w-6 h-6 mr-2" />
              Prayer Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPrayer ? (
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
                      onClick={() => {
                        deletePrayerRequest(selectedPrayer.id);
                        setSelectedPrayer(null);
                      }}
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
                    {prayerRequests.map((prayer: any) => (
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
        <Card className="border-0 shadow-divine mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="w-6 h-6 mr-2" />
              News Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <form onSubmit={handleNewsSave} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={newsForm.title} onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input id="excerpt" value={newsForm.excerpt} onChange={(e) => setNewsForm(prev => ({ ...prev, excerpt: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" value={newsForm.content} onChange={(e: any) => setNewsForm(prev => ({ ...prev, content: e.target.value }))} rows={6} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={newsForm.date} onChange={(e) => setNewsForm(prev => ({ ...prev, date: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" value={newsForm.image} onChange={(e) => setNewsForm(prev => ({ ...prev, image: e.target.value }))} />
                    <div className="mt-2">
                      <Label htmlFor="imageFile">Upload Image</Label>
                      <input id="imageFile" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
                      {imageUploading && <div className="text-sm text-muted-foreground mt-2">Uploading...</div>}
                      {newsForm.image && (
                        <img src={newsForm.image} alt="preview" className="mt-2 max-w-full h-auto object-cover rounded" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="link">Link / Slug</Label>
                  <Input id="link" value={newsForm.link} onChange={(e) => setNewsForm(prev => ({ ...prev, link: e.target.value }))} />
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" className="bg-gradient-royal text-white">
                    {editing ? (
                      <><Edit2 className="mr-2" /> Update News</>
                    ) : (
                      <><Plus className="mr-2" /> Create News</>
                    )}
                  </Button>
                  {editing && (
                    <Button variant="outline" onClick={() => { setEditing(null); setNewsForm({ title: "", excerpt: "", content: "", date: "", image: "", link: "" }); }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>

              <div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="space-x-2">
                            <Button size="sm" onClick={() => handleNewsEdit(item)}>
                              <Edit2 />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleNewsDelete(item.id)}>
                              <Trash2 />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;