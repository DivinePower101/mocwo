import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Newspaper, Trash2, Edit2, Plus, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  link: string;
  created_at: string;
}

const AdminNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
  const [editing, setEditing] = useState<any | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial4") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching news", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const fileName = `news-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = await (supabase as any).storage.from('news-images').getPublicUrl(fileName);
      const publicUrl = (urlData as any)?.publicUrl || (urlData as any)?.public_url || '';

      setNewsForm(prev => ({ ...prev, image: publicUrl }));
      toast({ title: 'Image uploaded', description: 'Image uploaded to storage.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setImageUploading(false);
    }
  };

  const handleNewsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        const { error } = await supabase
          .from("news")
          .update(newsForm)
          .eq("id", editing.id);

        if (error) throw error;
        toast({ title: "Success", description: "News updated successfully" });
      } else {
        const { error } = await supabase
          .from("news")
          .insert([newsForm]);

        if (error) throw error;
        toast({ title: "Success", description: "News created successfully" });
      }

      setNewsForm({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
      setEditing(null);
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error saving news",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditing(item);
    setNewsForm(item);
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
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

  return (
    <div className="min-h-screen pt-16 bg-background">
      {isPasswordProtected ? (
        // Password Gate Modal
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-divine">
            <CardHeader className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">News Management Access</CardTitle>
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
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white">
                  Access News Management
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
                <h1 className="text-3xl font-bold text-primary-foreground">News Management</h1>
                <p className="text-primary-foreground/80">Create and manage news articles</p>
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
            <Card className="border-0 shadow-divine mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Newspaper className="w-6 h-6 mr-2" />
                  {editing ? 'Edit News' : 'Create News'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsSave} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newsForm.title} 
                      onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Input 
                      id="excerpt" 
                      value={newsForm.excerpt} 
                      onChange={(e) => setNewsForm(prev => ({ ...prev, excerpt: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      value={newsForm.content} 
                      onChange={(e: any) => setNewsForm(prev => ({ ...prev, content: e.target.value }))} 
                      rows={6} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={newsForm.date} 
                        onChange={(e) => setNewsForm(prev => ({ ...prev, date: e.target.value }))} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input 
                        id="image" 
                        value={newsForm.image} 
                        onChange={(e) => setNewsForm(prev => ({ ...prev, image: e.target.value }))} 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="imageFile">Upload Image</Label>
                    <input 
                      id="imageFile" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="mt-1" 
                    />
                    {imageUploading && <div className="text-sm text-muted-foreground mt-2">Uploading...</div>}
                    {newsForm.image && (
                      <img src={newsForm.image} alt="preview" className="mt-2 max-w-full h-auto object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="link">Link / Slug</Label>
                    <Input 
                      id="link" 
                      value={newsForm.link} 
                      onChange={(e) => setNewsForm(prev => ({ ...prev, link: e.target.value }))} 
                    />
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
                      <Button 
                        variant="outline" 
                        onClick={() => { 
                          setEditing(null); 
                          setNewsForm({ title: "", excerpt: "", content: "", date: "", image: "", link: "" }); 
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-divine">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Newspaper className="w-6 h-6 mr-2" />
                  News Articles ({newsItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsItems.map((item) => (
                      <Card key={item.id} className="border shadow-sm">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.excerpt}</p>
                          <p className="text-xs text-muted-foreground mb-4">{new Date(item.created_at).toLocaleDateString()}</p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteNews(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {newsItems.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No news items yet. Create one to get started!
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

export default AdminNews;
