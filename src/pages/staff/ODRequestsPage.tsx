
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Eye, Check, X } from "lucide-react";

// OD Request interface
interface ODRequest {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  supportingDetails?: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: Date;
  reviewedOn?: Date;
  reviewedBy?: string;
  comments?: string;
}

const ODRequestsPage = () => {
  const [requests, setRequests] = useState<ODRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ODRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ODRequest | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [comments, setComments] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Format date for consistent comparison
  const formatDateForCompare = (date: Date | string) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  useEffect(() => {
    // Load OD requests from localStorage
    const storedRequests = localStorage.getItem("odRequests");
    if (storedRequests) {
      // Parse and convert date strings back to Date objects
      const parsedRequests = JSON.parse(storedRequests, (key, value) => {
        if (key === "startDate" || key === "endDate" || key === "submittedOn" || key === "reviewedOn") {
          return value ? new Date(value) : null;
        }
        return value;
      });
      
      setRequests(parsedRequests);
    }
  }, []);

  // Filter requests based on search term and active tab
  useEffect(() => {
    let filtered = [...requests];
    
    // Filter by tab status
    filtered = filtered.filter(req => {
      if (activeTab === "all") return true;
      return req.status === activeTab;
    });
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req => 
        req.studentName.toLowerCase().includes(term) ||
        req.subject.toLowerCase().includes(term)
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, searchTerm, activeTab]);

  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    if (formatDateForCompare(start) === formatDateForCompare(end)) {
      return format(new Date(start), "PP");
    }
    return `${format(new Date(start), "PP")} to ${format(new Date(end), "PP")}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  // Handle request view
  const handleViewRequest = (request: ODRequest) => {
    setSelectedRequest(request);
    setComments(request.comments || "");
    setIsViewOpen(true);
  };

  // Handle request approval
  const handleApprove = () => {
    if (!selectedRequest || !user) return;
    
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "approved",
          reviewedOn: new Date(),
          reviewedBy: user.name,
          comments: comments
        };
      }
      return req;
    });
    
    updateRequests(updatedRequests);
    setIsViewOpen(false);
    toast({
      title: "Request Approved",
      description: "OD request has been approved successfully.",
    });
  };

  // Handle request rejection
  const handleReject = () => {
    if (!selectedRequest || !user) return;
    
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "rejected",
          reviewedOn: new Date(),
          reviewedBy: user.name,
          comments: comments
        };
      }
      return req;
    });
    
    updateRequests(updatedRequests);
    setIsViewOpen(false);
    toast({
      title: "Request Rejected",
      description: "OD request has been rejected.",
    });
  };

  // Update requests in localStorage
  const updateRequests = (updatedRequests: ODRequest[]) => {
    localStorage.setItem("odRequests", JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">OD Permission Requests</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Student OD Requests</CardTitle>
            <CardDescription>
              Review and respond to On-Duty permission requests from students.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or subject..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Table>
              <TableCaption>
                {filteredRequests.length > 0 
                  ? `Showing ${filteredRequests.length} OD permission requests` 
                  : "No OD permission requests found"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date(s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.studentName}</TableCell>
                      <TableCell>{request.subject}</TableCell>
                      <TableCell>{formatDateRange(request.startDate, request.endDate)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{format(new Date(request.submittedOn), "PP")}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No OD requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* View OD Request Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>OD Request Details</DialogTitle>
            <DialogDescription>
              Review the details of this on-duty permission request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{selectedRequest.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date(s)</p>
                  <p className="font-medium">
                    {formatDateRange(selectedRequest.startDate, selectedRequest.endDate)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{selectedRequest.subject}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p>{selectedRequest.reason}</p>
              </div>
              
              {selectedRequest.supportingDetails && (
                <div>
                  <p className="text-sm text-muted-foreground">Additional Details</p>
                  <p>{selectedRequest.supportingDetails}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Submitted On</p>
                <p>{format(new Date(selectedRequest.submittedOn), "PPp")}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Reviewer Comments</p>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add your comments here..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            {selectedRequest && selectedRequest.status === "pending" ? (
              <>
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button variant="destructive" onClick={handleReject}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button variant="default" onClick={handleApprove}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ODRequestsPage;
