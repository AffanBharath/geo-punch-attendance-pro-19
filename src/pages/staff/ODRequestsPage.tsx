import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarRange, Clock, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Customize the interface for ODRequest
interface ODRequest {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  supportingDetails?: string;
  submittedOn: Date;
  status: "pending" | "approved" | "rejected";
  reviewedOn?: Date;
  reviewedBy?: string;
  comments?: string;
}

const ODRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<ODRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ODRequest | null>(null);
  const [comments, setComments] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected" | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Mock data for OD requests
  const [odRequests, setOdRequests] = useState<ODRequest[]>([
    {
      id: "OD-2025-001",
      studentId: "STU001",
      studentName: "John Smith",
      subject: "CSE Workshop",
      reason: "Attending a two-day workshop on Cloud Computing at MIT.",
      startDate: new Date(2025, 3, 15),
      endDate: new Date(2025, 3, 16),
      supportingDetails: "Invitation letter attached",
      submittedOn: new Date(2025, 3, 10),
      status: "pending"
    },
    {
      id: "OD-2025-002",
      studentId: "STU002",
      studentName: "Emma Davis",
      subject: "IEEE Conference",
      reason: "Presenting a research paper at the IEEE International Conference.",
      startDate: new Date(2025, 3, 18),
      endDate: new Date(2025, 3, 20),
      supportingDetails: "Acceptance letter attached",
      submittedOn: new Date(2025, 3, 8),
      status: "pending"
    },
    {
      id: "OD-2025-003",
      studentId: "STU003",
      studentName: "Michael Johnson",
      subject: "Sports Meet",
      reason: "Representing the university in the Inter-University Basketball Tournament.",
      startDate: new Date(2025, 3, 12),
      endDate: new Date(2025, 3, 14),
      supportingDetails: "Selection letter attached",
      submittedOn: new Date(2025, 3, 5),
      status: "approved",
      reviewedOn: new Date(2025, 3, 7),
      reviewedBy: "Dr. Samuel White",
      comments: "Approved as the student is representing the university."
    },
    {
      id: "OD-2025-004",
      studentId: "STU004",
      studentName: "Sophia Brown",
      subject: "Medical Camp",
      reason: "Volunteering at a medical camp organized by the Red Cross.",
      startDate: new Date(2025, 3, 22),
      endDate: new Date(2025, 3, 23),
      supportingDetails: "Volunteer appointment letter attached",
      submittedOn: new Date(2025, 3, 15),
      status: "rejected",
      reviewedOn: new Date(2025, 3, 16),
      reviewedBy: "Dr. Samuel White",
      comments: "Classes are important during this period. Suggest to volunteer on weekends."
    }
  ]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRequests(odRequests);
    } else {
      const filtered = odRequests.filter(
        (request) =>
          request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [searchTerm, odRequests]);

  const getPendingRequests = () => {
    return filteredRequests.filter((request) => request.status === "pending");
  };

  const getApprovedRequests = () => {
    return filteredRequests.filter((request) => request.status === "approved");
  };

  const getRejectedRequests = () => {
    return filteredRequests.filter((request) => request.status === "rejected");
  };

  const getStatusBadgeVariant = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "pending":
        return "outline";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleOpenDialog = (request: ODRequest, action: "approved" | "rejected") => {
    setSelectedRequest(request);
    setReviewAction(action);
    setComments("");
    setIsDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedRequest || !reviewAction) return;

    const now = new Date();
    const updatedRequests = odRequests.map((request) => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: reviewAction,
          reviewedOn: now,
          reviewedBy: user?.name || "Staff",
          comments: comments.trim() || undefined
        };
      }
      return request;
    });

    setOdRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
    
    toast({
      title: `Request ${reviewAction === "approved" ? "Approved" : "Rejected"}`,
      description: `OD request ${selectedRequest.id} has been ${reviewAction}.`,
      variant: reviewAction === "approved" ? "default" : "destructive",
    });
    
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">On-Duty Requests</h1>
          
          <div className="flex items-center space-x-2 w-full max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="pending">Pending ({getPendingRequests().length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({getApprovedRequests().length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({getRejectedRequests().length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending OD Requests</CardTitle>
                <CardDescription>Review and respond to pending on-duty requests from students</CardDescription>
              </CardHeader>
              <CardContent>
                {getPendingRequests().length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending OD requests found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPendingRequests().map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>
                              <div>
                                <div>{request.studentName}</div>
                                <div className="text-xs text-muted-foreground">{request.studentId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{request.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>
                                  {format(request.startDate, "MMM d")} - {format(request.endDate, "MMM d, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                <span>Submitted: {format(request.submittedOn, "MMM d, yyyy")}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleOpenDialog(request, "approved")}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleOpenDialog(request, "rejected")}
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved OD Requests</CardTitle>
                <CardDescription>List of approved on-duty requests</CardDescription>
              </CardHeader>
              <CardContent>
                {getApprovedRequests().length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No approved OD requests found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getApprovedRequests().map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>
                              <div>
                                <div>{request.studentName}</div>
                                <div className="text-xs text-muted-foreground">{request.studentId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{request.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>
                                  {format(request.startDate, "MMM d")} - {format(request.endDate, "MMM d, yyyy")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1.5">
                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">Approved</Badge>
                                    <span className="sr-only">View Details</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Request Details - {request.id}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-4 gap-4">
                                      <div className="space-y-1 col-span-2">
                                        <p className="text-sm font-medium">Student Name</p>
                                        <p className="text-sm text-muted-foreground">{request.studentName}</p>
                                      </div>
                                      <div className="space-y-1 col-span-2">
                                        <p className="text-sm font-medium">Student ID</p>
                                        <p className="text-sm text-muted-foreground">{request.studentId}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Subject</p>
                                      <p className="text-sm text-muted-foreground">{request.subject}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Reason</p>
                                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                                    </div>
                                    {request.supportingDetails && (
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Supporting Details</p>
                                        <p className="text-sm text-muted-foreground">{request.supportingDetails}</p>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-sm text-muted-foreground">
                                          {format(request.startDate, "MMMM d, yyyy")}
                                        </p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">End Date</p>
                                        <p className="text-sm text-muted-foreground">
                                          {format(request.endDate, "MMMM d, yyyy")}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Submitted On</p>
                                        <p className="text-sm text-muted-foreground">
                                          {format(request.submittedOn, "MMMM d, yyyy")}
                                        </p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Status</p>
                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">Approved</Badge>
                                      </div>
                                    </div>
                                    {request.reviewedOn && (
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">Reviewed On</p>
                                          <p className="text-sm text-muted-foreground">
                                            {format(request.reviewedOn, "MMMM d, yyyy")}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">Reviewed By</p>
                                          <p className="text-sm text-muted-foreground">{request.reviewedBy}</p>
                                        </div>
                                      </div>
                                    )}
                                    {request.comments && (
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Comments</p>
                                        <p className="text-sm text-muted-foreground">{request.comments}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected OD Requests</CardTitle>
                <CardDescription>List of rejected on-duty requests</CardDescription>
              </CardHeader>
              <CardContent>
                {getRejectedRequests().length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No rejected OD requests found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getRejectedRequests().map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>
                              <div>
                                <div>{request.studentName}</div>
                                <div className="text-xs text-muted-foreground">{request.studentId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{request.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>
                                  {format(request.startDate, "MMM d")} - {format(request.endDate, "MMM d, yyyy")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1.5">
                                    <Badge variant="destructive">Rejected</Badge>
                                    <span className="sr-only">View Details</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Request Details - {request.id}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-4 gap-4">
                                      <div className="space-y-1 col-span-2">
                                        <p className="text-sm font-medium">Student Name</p>
                                        <p className="text-sm text-muted-foreground">{request.studentName}</p>
                                      </div>
                                      <div className="space-y-1 col-span-2">
                                        <p className="text-sm font-medium">Student ID</p>
                                        <p className="text-sm text-muted-foreground">{request.studentId}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Subject</p>
                                      <p className="text-sm text-muted-foreground">{request.subject}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Reason</p>
                                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                                    </div>
                                    {request.supportingDetails && (
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Supporting Details</p>
                                        <p className="text-sm text-muted-foreground">{request.supportingDetails}</p>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-sm text-muted-foreground">
                                          {format(request.startDate, "MMMM d, yyyy")}
                                        </p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">End Date</p>
                                        <p className="text-sm text-muted-foreground">
                                          {format(request.endDate, "MMMM d, yyyy")}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Submitted On</p>
                                        <p className="text-sm text-muted-foreground">
                                          {format(request.submittedOn, "MMMM d, yyyy")}
                                        </p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Status</p>
                                        <Badge variant="destructive">Rejected</Badge>
                                      </div>
                                    </div>
                                    {request.reviewedOn && (
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">Reviewed On</p>
                                          <p className="text-sm text-muted-foreground">
                                            {format(request.reviewedOn, "MMMM d, yyyy")}
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">Reviewed By</p>
                                          <p className="text-sm text-muted-foreground">{request.reviewedBy}</p>
                                        </div>
                                      </div>
                                    )}
                                    {request.comments && (
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Comments</p>
                                        <p className="text-sm text-muted-foreground">{request.comments}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approved" ? "Approve" : "Reject"} OD Request
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approved"
                ? "Approve this on-duty request with optional comments."
                : "Please provide a reason for rejecting this on-duty request."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Student</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.studentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Request ID</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Subject</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.subject}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {format(selectedRequest.startDate, "MMMM d")} - {format(selectedRequest.endDate, "MMMM d, yyyy")}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comments">
                  {reviewAction === "approved" ? "Comments (Optional)" : "Reason for Rejection"}
                </Label>
                <Textarea
                  id="comments"
                  placeholder={
                    reviewAction === "approved"
                      ? "Add any comments..."
                      : "Please provide a reason for rejection..."
                  }
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              variant={reviewAction === "approved" ? "default" : "destructive"}
              disabled={reviewAction === "rejected" && comments.trim() === ""}
            >
              {reviewAction === "approved" ? "Approve Request" : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ODRequestsPage;
