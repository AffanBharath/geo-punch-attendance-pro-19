
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlusCircle, AlertCircle, CalendarRange } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Define custom component styles to ensure amber color is used for OD
const customStyles = {
  odBadge: {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  }
};

const ODPermissionPage = () => {
  // State for form fields
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  const [supportingDetails, setSupportingDetails] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Sample OD Requests
  const [odRequests, setOdRequests] = useState([
    {
      id: "OD-2025-001",
      subject: "IEEE Conference",
      reason: "Presenting a research paper at the IEEE International Conference on Emerging Technologies.",
      supportingDetails: "Acceptance letter attached from conference organizers",
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 22),
      submittedOn: new Date(2025, 3, 10),
      status: "pending"
    },
    {
      id: "OD-2025-002",
      subject: "National Hackathon",
      reason: "Participating in the 48-hour National Coding Challenge organized by Google.",
      supportingDetails: "Registration confirmation and team details attached",
      startDate: new Date(2025, 3, 15),
      endDate: new Date(2025, 3, 16),
      submittedOn: new Date(2025, 3, 5),
      status: "approved",
      reviewedOn: new Date(2025, 3, 7),
      reviewedBy: "Dr. Samuel White",
      comments: "Approved as this aligns with your academic goals."
    },
    {
      id: "OD-2025-003",
      subject: "Industrial Visit",
      reason: "Company visit to Microsoft Development Center organized by the CS department.",
      supportingDetails: "Department circular and permission letter attached",
      startDate: new Date(2025, 2, 25),
      endDate: new Date(2025, 2, 25),
      submittedOn: new Date(2025, 2, 18),
      status: "rejected",
      reviewedOn: new Date(2025, 2, 20),
      reviewedBy: "Dr. Robert Johnson",
      comments: "Rejected as you have an important exam scheduled on the same day."
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !reason || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    if (endDate < startDate) {
      toast({
        variant: "destructive",
        title: "Invalid Date Range",
        description: "End date cannot be before start date.",
      });
      return;
    }
    
    const newRequest = {
      id: `OD-${new Date().getFullYear()}-${(odRequests.length + 1).toString().padStart(3, '0')}`,
      subject,
      reason,
      supportingDetails,
      startDate,
      endDate,
      submittedOn: new Date(),
      status: "pending"
    };
    
    setOdRequests([newRequest, ...odRequests]);
    
    toast({
      title: "Request Submitted",
      description: "Your OD permission request has been submitted successfully.",
    });
    
    // Reset form fields
    setSubject("");
    setReason("");
    setSupportingDetails("");
    setStartDate(undefined);
    setEndDate(undefined);
    setShowDialog(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">On-Duty Permission</h1>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>New OD Request</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Submit OD Permission Request</DialogTitle>
                <DialogDescription>
                  Apply for on-duty permission for academic events, competitions, or other activities.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject/Event Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="subject"
                      placeholder="e.g., IEEE Conference, Industrial Visit"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="start-date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            disabled={(date) => startDate ? date < startDate : date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe the purpose of your OD request..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supporting-details">Supporting Details</Label>
                    <Textarea
                      id="supporting-details"
                      placeholder="Provide any additional information, reference numbers, invitation details..."
                      value={supportingDetails}
                      onChange={(e) => setSupportingDetails(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-md p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Important Information</h3>
            <p className="text-sm text-amber-700 mt-1">
              On-Duty (OD) requests should be submitted at least 3 days in advance. Approvals are granted based on academic policies and availability. Supporting documents may be required for verification.
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>OD Permission Requests</CardTitle>
                <CardDescription>
                  View and track all your on-duty permission requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {odRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You don't have any OD requests yet</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDialog(true)}
                      className="mt-4"
                    >
                      Create your first request
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {odRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>{request.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>
                                  {format(request.startDate, "MMM d")} {request.startDate.toDateString() !== request.endDate.toDateString() && `- ${format(request.endDate, "MMM d")}`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1.5">
                                    <Badge className={cn(
                                      "border",
                                      request.status === "pending" 
                                        ? customStyles.odBadge.pending 
                                        : request.status === "approved" 
                                          ? customStyles.odBadge.approved 
                                          : customStyles.odBadge.rejected
                                    )}>
                                      {request.status === "pending" 
                                        ? "Pending" 
                                        : request.status === "approved" 
                                          ? "Approved" 
                                          : "Rejected"}
                                    </Badge>
                                    <span className="sr-only">View Details</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Request Details - {request.id}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
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
                                        <Badge className={cn(
                                          "border",
                                          request.status === "pending" 
                                            ? customStyles.odBadge.pending 
                                            : request.status === "approved" 
                                              ? customStyles.odBadge.approved 
                                              : customStyles.odBadge.rejected
                                        )}>
                                          {request.status === "pending" 
                                            ? "Pending" 
                                            : request.status === "approved" 
                                              ? "Approved" 
                                              : "Rejected"}
                                        </Badge>
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
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  View your pending on-duty permission requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {odRequests.filter(req => req.status === "pending").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You don't have any pending OD requests</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {odRequests.filter(req => req.status === "pending").map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>{request.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>
                                  {format(request.startDate, "MMM d")} {request.startDate.toDateString() !== request.endDate.toDateString() && `- ${format(request.endDate, "MMM d")}`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={customStyles.odBadge.pending}>Pending</Badge>
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
                <CardTitle>Approved Requests</CardTitle>
                <CardDescription>
                  View your approved on-duty permission requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {odRequests.filter(req => req.status === "approved").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You don't have any approved OD requests</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {odRequests.filter(req => req.status === "approved").map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>{request.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>
                                  {format(request.startDate, "MMM d")} {request.startDate.toDateString() !== request.endDate.toDateString() && `- ${format(request.endDate, "MMM d")}`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={customStyles.odBadge.approved}>Approved</Badge>
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
                <CardTitle>Rejected Requests</CardTitle>
                <CardDescription>
                  View your rejected on-duty permission requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {odRequests.filter(req => req.status === "rejected").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You don't have any rejected OD requests</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {odRequests.filter(req => req.status === "rejected").map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>{request.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>
                                  {format(request.startDate, "MMM d")} {request.startDate.toDateString() !== request.endDate.toDateString() && `- ${format(request.endDate, "MMM d")}`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={customStyles.odBadge.rejected}>Rejected</Badge>
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
    </Layout>
  );
};

export default ODPermissionPage;
