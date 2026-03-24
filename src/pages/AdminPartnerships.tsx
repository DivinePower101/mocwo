import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Partnership {
  id: string;
  name: string;
  email: string;
  level: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const AdminPartnerships = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial1") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('partnerships')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Status updated", description: `Partnership ${status}` });
      fetchPartnerships();
    } catch (error: any) {
      toast({
        title: "Error updating partnership",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deletePartnership = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partnership?')) return;
    
    try {
      const { error } = await supabase
        .from('partnerships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Partnership deleted" });
      fetchPartnerships();
    } catch (error: any) {
      toast({
        title: "Error deleting partnership",
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
              <CardTitle className="text-2xl">Partnerships Access</CardTitle>
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
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                  Access Partnerships
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
                <h1 className="text-3xl font-bold text-primary-foreground">Partnerships</h1>
                <p className="text-primary-foreground/80">Manage partnership applications</p>
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
                  <CreditCard className="w-6 h-6 mr-2" />
                  Partnership Applications ({partnerships.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : (
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
                        {partnerships.map((partnership) => (
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
                    {partnerships.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No partnerships yet
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

export default AdminPartnerships;
