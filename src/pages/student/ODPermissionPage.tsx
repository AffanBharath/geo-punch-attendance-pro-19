
import React, { useState } from 'react';
import RoleLayout from "@/components/RoleLayout";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { 
  CalendarIcon, Clock, FileText, ClipboardList, CheckCircle2, XCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { format } from 'date-fns';

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
}

const ODPermissionPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  
  // Mock data for OD requests
  const [odRequests, setOdRequests] = useState<ODRequest[]>([
    {
      id: "1",
      studentId: user?.studentId || "CS2023001",
      studentName: user?.name || "Student User",
      fromDate: new Date(2025, 3, 5),
      toDate: new Date(2025, 3, 6),
      reason: "Medical appointment",
      status: 'approved',
      createdAt: new Date(2025, 3, 3),
      reviewedBy: "Prof. Johnson",
      reviewedAt: new Date(2025, 3, 4),
      comments: "Documentation verified"
    },
    {
      id: "2",
      studentId: user?.studentId || "CS2023001",
      studentName: user?.name || "Student User",
      fromDate: new Date(2025, 3, 10),
      toDate: new Date(2025, 3, 11),
      reason: "Participation in tech conference",
      status: 'rejected',
      createdAt: new Date(2025, 3, 7),
      reviewedBy: "Prof. Williams",
      reviewedAt: new Date(2025, 3, 8),
      comments: "Insufficient supporting documentation"
    },
    {
      id: "3",
      studentId: user?.studentId || "CS2023001",
      studentName: user?.name || "Student User",
      fromDate: new Date(2025, 3, 15),
      toDate: new Date(2025, 3, 15),
      reason: "Family emergency",
      status: 'pending',
      createdAt: new Date(2025, 3, 14),
    }
  ]);
  
  const handleSubmitODRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromDate || !toDate || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (fromDate > toDate) {
      toast({
        title: "Invalid Dates",
        description: "From date cannot be after To date",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call
    const newODRequest: ODRequest = {
      id: `${odRequests.length + 1}`,
      studentId: user?.studentId || "CS2023001",
      studentName: user?.name || "Student User",
      fromDate: fromDate,
      toDate: toDate,
      reason: reason,
      status: 'pending',
      createdAt: new Date(),
    };
    
    setOdRequests([newODRequest, ...odRequests]);
    setReason('');
    
    toast({
      title: "OD Request Submitted",
      description: "Your request has been submitted for review",
    });
  };
  
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
        <h1 className="text-3xl font-bold tracking-tight text-student-primary">On-Duty Permission</h1>
        
        <Tabs defaultValue="apply">
          <TabsList>
            <TabsTrigger value="apply">Apply for OD</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="apply" className="space-y-4">
            <Card className="border-student-primary/20">
              <CardHeader>
                <CardTitle>Request On-Duty Permission</CardTitle>
                <CardDescription>
                  Submit a request for on-duty permission that will be reviewed by your class counselor
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitODRequest}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From Date</label>
                      <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? format(fromDate, 'PPP') : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={(date) => {
                              setFromDate(date);
                              setIsFromOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">To Date</label>
                      <Popover open={isToOpen} onOpenChange={setIsToOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, 'PPP') : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={(date) => {
                              setToDate(date);
                              setIsToOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for OD</label>
                    <Textarea 
                      placeholder="Please provide a detailed explanation..."
                      className="min-h-[120px]"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supporting Documents (optional)</label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Drop files here or click to upload</p>
                        <p className="text-xs text-muted-foreground">Support for medical certificates, event invitations, etc.</p>
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                      />
                      <Button variant="outline" size="sm" className="mt-4">
                        Select Files
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-student-primary hover:bg-student-primary/90">
                    Submit Request
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card className="border-student-primary/20">
              <CardHeader>
                <CardTitle>OD Request History</CardTitle>
                <CardDescription>
                  View status and history of your previous OD permission requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {odRequests.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No OD requests found</p>
                  ) : (
                    odRequests.map((request) => (
                      <div key={request.id} className="border rounded-md p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {format(request.fromDate, 'MMM dd, yyyy')}
                              {!request.toDate.toDateString().includes(request.fromDate.toDateString()) && 
                                ` - ${format(request.toDate, 'MMM dd, yyyy')}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Submitted on {format(request.createdAt, 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Reason:</p>
                          <p className="text-sm">{request.reason}</p>
                        </div>
                        
                        {request.status !== 'pending' && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">
                              Reviewed by {request.reviewedBy} on {request.reviewedAt && format(request.reviewedAt, 'MMM dd, yyyy')}
                            </p>
                            {request.comments && (
                              <p className="text-sm">
                                <span className="font-medium">Comments:</span> {request.comments}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleLayout>
  );
};

export default ODPermissionPage;
