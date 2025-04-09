
import React, { useState } from 'react';
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  CalendarIcon, Clock, FileText, ClipboardList, CheckCircle2, XCircle, Search, 
  MessageSquare, Eye, Download, Filter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type ODRequestStatus = 'pending' | 'approved' | 'rejected';

interface ODRequest {
  id: string;
  studentId: string;
  studentName: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: ODRequestStatus;
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
  department?: string;
  year?: string;
}

const ODRequestsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ODRequest | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ODRequestStatus | 'all'>('all');
  
  // Mock data for OD requests
  const [odRequests, setOdRequests] = useState<ODRequest[]>([
    {
      id: "1",
      studentId: "CS2023001",
      studentName: "Alice Johnson",
      fromDate: new Date(2025, 3, 5),
      toDate: new Date(2025, 3, 6),
      reason: "Medical appointment",
      status: 'pending',
      createdAt: new Date(2025, 3, 3),
      department: "Computer Science",
      year: "2nd Year"
    },
    {
      id: "2",
      studentId: "CS2023002",
      studentName: "Bob Smith",
      fromDate: new Date(2025, 3, 10),
      toDate: new Date(2025, 3, 11),
      reason: "Participation in tech conference",
      status: 'pending',
      createdAt: new Date(2025, 3, 7),
      department: "Computer Science",
      year: "3rd Year"
    },
    {
      id: "3",
      studentId: "CS2023003",
      studentName: "Carol Williams",
      fromDate: new Date(2025, 3, 15),
      toDate: new Date(2025, 3, 15),
      reason: "Family emergency",
      status: 'approved',
      createdAt: new Date(2025, 3, 14),
      reviewedBy: user?.name,
      reviewedAt: new Date(2025, 3, 14),
      comments: "Documentation verified",
      department: "Computer Science",
      year: "1st Year"
    },
    {
      id: "4",
      studentId: "CS2023004",
      studentName: "David Brown",
      fromDate: new Date(2025, 3, 20),
      toDate: new Date(2025, 3, 22),
      reason: "Participating in hackathon",
      status: 'rejected',
      createdAt: new Date(2025, 3, 18),
      reviewedBy: user?.name,
      reviewedAt: new Date(2025, 3, 18),
      comments: "Overlaps with important lab sessions",
      department: "Computer Science",
      year: "4th Year"
    }
  ]);
  
  const handleViewDetails = (request: ODRequest) => {
    setSelectedRequest(request);
    setViewDetailsOpen(true);
  };
  
  const handleReviewRequest = (request: ODRequest) => {
    setSelectedRequest(request);
    setReviewOpen(true);
    setReviewComments('');
    setReviewAction('');
  };
  
  const handleSubmitReview = () => {
    if (!selectedRequest || !reviewAction) {
      toast({
        title: "Missing Information",
        description: "Please select an action",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call
    const updatedRequests = odRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: reviewAction,
          reviewedBy: user?.name,
          reviewedAt: new Date(),
          comments: reviewComments
        };
      }
      return request;
    });
    
    setOdRequests(updatedRequests);
    setReviewOpen(false);
    
    toast({
      title: `Request ${reviewAction === 'approved' ? 'Approved' : 'Rejected'}`,
      description: `The OD request for ${selectedRequest.studentName} has been ${reviewAction}`,
    });
  };
  
  const filteredRequests = odRequests.filter(request => {
    const matchesSearch = 
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const getStatusBadgeClass = (status: ODRequestStatus) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <RoleLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-staff-primary">On-Duty Requests</h1>
        
        <Card className="border-staff-primary/20">
          <CardHeader>
            <CardTitle>Student OD Requests</CardTitle>
            <CardDescription>
              Review and manage on-duty permission requests from students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as ODRequestStatus | 'all')}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No OD requests found</p>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{request.studentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.studentId} • {request.department} • {request.year}
                        </p>
                      </div>
                      <Badge className={getStatusBadgeClass(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">
                        {format(request.fromDate, 'MMM dd, yyyy')}
                        {!request.toDate.toDateString().includes(request.fromDate.toDateString()) && 
                          ` - ${format(request.toDate, 'MMM dd, yyyy')}`}
                      </p>
                      <p className="text-sm line-clamp-2">{request.reason}</p>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                      
                      {request.status === 'pending' && (
                        <Button 
                          className="bg-staff-primary hover:bg-staff-primary/90" 
                          size="sm"
                          onClick={() => handleReviewRequest(request)}
                        >
                          <MessageSquare className="mr-1 h-4 w-4" /> Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* View Details Dialog */}
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>OD Request Details</DialogTitle>
              <DialogDescription>
                Detailed information about the on-duty permission request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedRequest && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-lg">{selectedRequest.studentName}</h3>
                      <Badge className={getStatusBadgeClass(selectedRequest.status)}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.studentId} • {selectedRequest.department} • {selectedRequest.year}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Request Period:</p>
                    <p className="text-sm">
                      {format(selectedRequest.fromDate, 'MMM dd, yyyy')}
                      {!selectedRequest.toDate.toDateString().includes(selectedRequest.fromDate.toDateString()) && 
                        ` - ${format(selectedRequest.toDate, 'MMM dd, yyyy')}`}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reason:</p>
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Submitted on:</p>
                    <p className="text-sm">{format(selectedRequest.createdAt, 'MMM dd, yyyy')}</p>
                  </div>
                  
                  {selectedRequest.status !== 'pending' && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Reviewed by:</p>
                        <p className="text-sm">{selectedRequest.reviewedBy}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Review Date:</p>
                        <p className="text-sm">
                          {selectedRequest.reviewedAt && format(selectedRequest.reviewedAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      
                      {selectedRequest.comments && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Comments:</p>
                          <p className="text-sm">{selectedRequest.comments}</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
                Close
              </Button>
              {selectedRequest && selectedRequest.status === 'pending' && (
                <Button
                  className="bg-staff-primary hover:bg-staff-primary/90"
                  onClick={() => {
                    setViewDetailsOpen(false);
                    handleReviewRequest(selectedRequest);
                  }}
                >
                  Review Request
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Review Dialog */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Review OD Request</DialogTitle>
              <DialogDescription>
                Approve or reject this on-duty permission request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedRequest && (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Student:</p>
                    <p className="text-sm">{selectedRequest.studentName} ({selectedRequest.studentId})</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Request Period:</p>
                    <p className="text-sm">
                      {format(selectedRequest.fromDate, 'MMM dd, yyyy')}
                      {!selectedRequest.toDate.toDateString().includes(selectedRequest.fromDate.toDateString()) && 
                        ` - ${format(selectedRequest.toDate, 'MMM dd, yyyy')}`}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reason:</p>
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Decision:</p>
                    <div className="flex gap-3">
                      <Button
                        variant={reviewAction === 'approved' ? 'default' : 'outline'}
                        className={`flex-1 ${reviewAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => setReviewAction('approved')}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        variant={reviewAction === 'rejected' ? 'default' : 'outline'}
                        className={`flex-1 ${reviewAction === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        onClick={() => setReviewAction('rejected')}
                      >
                        <XCircle className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comments (Optional):</label>
                    <Textarea 
                      placeholder="Add any comments or feedback..."
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} className="bg-staff-primary hover:bg-staff-primary/90">
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleLayout>
  );
};

export default ODRequestsPage;
