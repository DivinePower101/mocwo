import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Users, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MembershipRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  membership_type?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  message?: string;
  status: string;
  created_at: string;
}

const AdminMemberships = () => {
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [selectedMember, setSelectedMember] = useState<MembershipRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial2") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    fetchMembershipRequests();
  }, []);

  const fetchMembershipRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
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
    } finally {
      setIsLoading(false);
    }
  };

  const updateMembershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Status updated", description: `Membership ${status}` });
      fetchMembershipRequests();
      setSelectedMember(null);
    } catch (error: any) {
      toast({
        title: "Error updating membership",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMembershipRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership request?')) return;
    
    try {
      const { error } = await supabase
        .from('membership_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Membership request deleted" });
      fetchMembershipRequests();
      setSelectedMember(null);
    } catch (error: any) {
      toast({
        title: "Error deleting membership request",
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
              <CardTitle className="text-2xl">Memberships Access</CardTitle>
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
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white">
                  Access Memberships
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
                <h1 className="text-3xl font-bold text-primary-foreground">Memberships</h1>
                <p className="text-primary-foreground/80">Manage membership applications</p>
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
                  <Users className="w-6 h-6 mr-2" />
                  Membership Requests ({membershipRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : selectedMember ? (
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
                          onClick={() => deleteMembershipRequest(selectedMember.id)}
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
                        {membershipRequests.map((member) => (
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
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMemberships;
