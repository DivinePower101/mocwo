import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Users, CreditCard, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Plus } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [partnerships, setPartnerships] = useState([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
  const [imageUploading, setImageUploading] = useState(false);
  const [stats, setStats] = useState({
    totalPartnerships: 0,
    totalAmount: 0,
    pendingApplications: 0,
    activePartners: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPartnerships();
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
      
      if (adminUser) {
        setIsAuthenticated(true);
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

      if (adminUser) {
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
      const { data, error } = await supabase
        .from('partnerships')
        .select('*');

      if (error) throw error;

      const total = data?.length || 0;
      const totalAmount = data?.reduce((sum, p) => sum + (parseFloat(p.amount?.toString() || '0') || 0), 0) || 0;
      const pending = data?.filter(p => p.status === 'pending').length || 0;
      const active = data?.filter(p => p.status === 'approved').length || 0;

      setStats({
        totalPartnerships: total,
        totalAmount,
        pendingApplications: pending,
        activePartners: active
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
                  <p className="text-sm text-muted-foreground">Active Partners</p>
                  <p className="text-3xl font-bold text-primary">{stats.activePartners}</p>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* News Management */}
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