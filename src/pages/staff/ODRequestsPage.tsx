
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, FileText, Info } from "lucide-react";
import RoleLayout from "@/components/RoleLayout";
import { useAuth } from "@/contexts/AuthContext";

// Define the proper ODRequest type with a union type for status
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
  const [requests, setRequests] = useState<ODRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ODRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ODRequest | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewComments, setReviewComments] = useState("");
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected" | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo, we'll create mock data
    const mockODRequests: ODRequest[] = [
      {
        id: "OD001",
        studentId: "CS2023001",
        studentName: "Arun Kumar",
        subject: "Database Management",
        reason: "Attending tech conference",
        startDate: new Date(2023, 3, 15),
        endDate: new Date(2023, 3, 17),
        supportingDetails: "Conference registration attached",
        submittedOn: new Date(2023, 3, 10),
        status: "pending"
      },
      {
        id: "OD002",
        studentId: "CS2023002",
        studentName: "Priya Sharma",
        subject: "Software Engineering",
        reason: "Medical appointment",
        startDate: new Date(2023, 3, 12),
        endDate: new Date(2023, 3, 12),
        submittedOn: new Date(2023, 3, 5),
        status: "approved",
        reviewedOn: new Date(2023, 3, 6),
        reviewedBy: "Dr. Suresh",
        comments: "Approved based on medical certificate"
      },
      {
        id: "OD003",
        studentId: "CS2023003",
        studentName: "Ravi Patel",
        subject: "Machine Learning",
        reason: "Participating in hackathon",
        startDate: new Date(2023, 3, 20),
        endDate: new Date(2023, 3, 22),
        supportingDetails: "Event details attached",
        submittedOn: new Date(2023, 3, 15),
        status: "rejected",
        reviewedOn: new Date(2023, 3, 16),
        reviewedBy: "Dr. Suresh",
        comments: "Hackathon does not align with current coursework"
      },
      {
        id: "OD004",
        studentId: "CS2023004",
        studentName: "Anita Desai",
        subject: "Web Development",
        reason: "Family emergency",
        startDate: new Date(2023, 4, 5),
        endDate: new Date(2023, 4, 7),
        submittedOn: new Date(2023, 4, 2),
        status: "pending"
      }
    ];

    setRequests(mockODRequests);
    setFilteredRequests(mockODRequests);
  }, []);

  const handleOpenReviewDialog = (request: ODRequest) => {
    setSelectedRequest(request);
    setReviewComments("");
    setReviewAction(null);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedRequest || !reviewAction) return;

    // Update the request status
    const updatedRequest: ODRequest = {
      ...selectedRequest,
      status: reviewAction,
      reviewedOn: new Date(),
      reviewedBy: user?.name || "Staff Member",
      comments: reviewComments
    };

    // Update the requests array
    const updatedRequests = requests.map(req => 
      req.id === updatedRequest.id ? updatedRequest : req
    ) as ODRequest[];

    setRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
    setReviewDialogOpen(false);

    toast({
      title: `OD Request ${reviewAction === "approved" ? "Approved" : "Rejected"}`,
      description: `You have ${reviewAction} the OD request from ${selectedRequest.studentName}`,
    });
  };

  const handleFilterChange = (filter: "all" | "pending" | "approved" | "rejected") => {
    if (filter === "all") {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(request => request.status === filter);
      setFilteredRequests(filtered);
    }
  };

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    }
  };

  return (
    <RoleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OD Requests</h1>
          <p className="text-muted-foreground">
            Review and manage On Duty permission requests from students
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" onClick={() => handleFilterChange("all")}>All Requests</TabsTrigger>
            <TabsTrigger value="pending" onClick={() => handleFilterChange("pending")}>Pending</TabsTrigger>
            <TabsTrigger value="approved" onClick={() => handleFilterChange("approved")}>Approved</TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => handleFilterChange("rejected")}>Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All OD Requests</CardTitle>
                <CardDescription>
                  Showing all On Duty permission requests from students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No OD requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{request.studentName}</div>
                            <div className="text-sm text-muted-foreground">{request.studentId}</div>
                          </TableCell>
                          <TableCell>{request.subject}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(request.startDate, "MMM d, yyyy")}
                                {!isSameDay(request.startDate, request.endDate) && 
                                  ` - ${format(request.endDate, "MMM d, yyyy")}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8" 
                                onClick={() => handleOpenReviewDialog(request)}
                              >
                                {request.status === "pending" ? "Review" : "Details"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  OD requests awaiting your review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No pending requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{request.studentName}</div>
                            <div className="text-sm text-muted-foreground">{request.studentId}</div>
                          </TableCell>
                          <TableCell>{request.subject}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(request.startDate, "MMM d, yyyy")}
                                {!isSameDay(request.startDate, request.endDate) && 
                                  ` - ${format(request.endDate, "MMM d, yyyy")}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8" 
                              onClick={() => handleOpenReviewDialog(request)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Requests</CardTitle>
                <CardDescription>
                  OD requests you have approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No approved requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{request.studentName}</div>
                            <div className="text-sm text-muted-foreground">{request.studentId}</div>
                          </TableCell>
                          <TableCell>{request.subject}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(request.startDate, "MMM d, yyyy")}
                                {!isSameDay(request.startDate, request.endDate) && 
                                  ` - ${format(request.endDate, "MMM d, yyyy")}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8" 
                              onClick={() => handleOpenReviewDialog(request)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Requests</CardTitle>
                <CardDescription>
                  OD requests you have rejected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No rejected requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{request.studentName}</div>
                            <div className="text-sm text-muted-foreground">{request.studentId}</div>
                          </TableCell>
                          <TableCell>{request.subject}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(request.startDate, "MMM d, yyyy")}
                                {!isSameDay(request.startDate, request.endDate) && 
                                  ` - ${format(request.endDate, "MMM d, yyyy")}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8" 
                              onClick={() => handleOpenReviewDialog(request)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedRequest?.status === "pending" 
                  ? "Review OD Request" 
                  : "OD Request Details"}
              </DialogTitle>
              <DialogDescription>
                {selectedRequest?.status === "pending" 
                  ? "Review and approve or reject this On Duty permission request" 
                  : "View details of this On Duty permission request"}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Student</p>
                    <p>{selectedRequest.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID</p>
                    <p>{selectedRequest.studentId}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p>{selectedRequest.subject}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dates</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>
                      {format(selectedRequest.startDate, "MMMM d, yyyy")}
                      {!isSameDay(selectedRequest.startDate, selectedRequest.endDate) && 
                        ` - ${format(selectedRequest.endDate, "MMMM d, yyyy")}`}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reason</p>
                  <p>{selectedRequest.reason}</p>
                </div>
                
                {selectedRequest.supportingDetails && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Supporting Details</p>
                    <p>{selectedRequest.supportingDetails}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Submitted on {format(selectedRequest.submittedOn, "MMMM d, yyyy")}
                  </p>
                </div>
                
                {selectedRequest.status !== "pending" && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Review Information</p>
                    </div>
                    
                    <div className="rounded-md bg-muted p-3 space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p className="capitalize">{selectedRequest.status}</p>
                      </div>
                      
                      {selectedRequest.reviewedOn && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Reviewed On</p>
                          <p>{format(selectedRequest.reviewedOn, "MMMM d, yyyy")}</p>
                        </div>
                      )}
                      
                      {selectedRequest.reviewedBy && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Reviewed By</p>
                          <p>{selectedRequest.reviewedBy}</p>
                        </div>
                      )}
                      
                      {selectedRequest.comments && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Comments</p>
                          <p>{selectedRequest.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedRequest.status === "pending" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Decision</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className={`flex-1 ${reviewAction === "approved" ? "bg-green-100 border-green-300" : ""}`}
                        onClick={() => setReviewAction("approved")}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`flex-1 ${reviewAction === "rejected" ? "bg-red-100 border-red-300" : ""}`}
                        onClick={() => setReviewAction("rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Comments</p>
                      <Textarea 
                        placeholder="Add comments about your decision"
                        value={reviewComments}
                        onChange={(e) => setReviewComments(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setReviewDialogOpen(false)}
              >
                {selectedRequest?.status === "pending" ? "Cancel" : "Close"}
              </Button>
              
              {selectedRequest?.status === "pending" && (
                <Button 
                  disabled={!reviewAction} 
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleLayout>
  );
};

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default ODRequestsPage;
