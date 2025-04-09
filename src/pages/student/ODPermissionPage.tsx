
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, FileText, Clock, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define form validation schema
const formSchema = z.object({
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }),
  supportingDetails: z.string().optional(),
});

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

const ODPermissionPage = () => {
  const [requests, setRequests] = useState<ODRequest[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      reason: "",
      supportingDetails: "",
    },
  });

  useEffect(() => {
    // Load existing OD requests from localStorage
    const storedRequests = localStorage.getItem("odRequests");
    if (storedRequests) {
      // Parse and convert date strings back to Date objects
      const parsedRequests = JSON.parse(storedRequests, (key, value) => {
        if (key === "startDate" || key === "endDate" || key === "submittedOn" || key === "reviewedOn") {
          return value ? new Date(value) : null;
        }
        return value;
      });
      
      // Filter requests for the current user
      const userRequests = parsedRequests.filter(
        (req: ODRequest) => req.studentId === user?.id
      );
      setRequests(userRequests);
    }
  }, [user]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to submit an OD request.",
      });
      return;
    }

    // Validate dates
    if (data.endDate < data.startDate) {
      toast({
        variant: "destructive",
        title: "Date Error",
        description: "End date cannot be before start date.",
      });
      return;
    }

    // Create new OD request
    const newRequest: ODRequest = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      subject: data.subject,
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
      supportingDetails: data.supportingDetails,
      status: "pending",
      submittedOn: new Date(),
    };

    // Get existing requests
    const storedRequests = localStorage.getItem("odRequests");
    const allRequests = storedRequests ? JSON.parse(storedRequests) : [];
    
    // Add new request
    allRequests.push(newRequest);
    localStorage.setItem("odRequests", JSON.stringify(allRequests));
    
    // Update local state
    setRequests([...requests, newRequest]);
    
    // Reset form
    form.reset();
    
    toast({
      title: "OD Request Submitted",
      description: "Your OD permission request has been submitted successfully.",
    });
  };

  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    if (format(start, "PP") === format(end, "PP")) {
      return format(start, "PP");
    }
    return `${format(start, "PP")} to ${format(end, "PP")}`;
  };

  // Get status badge color
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

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">OD Permission</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request OD Permission</CardTitle>
              <CardDescription>
                Submit a request for On-Duty permission to attend events, programs or other academic activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Conference Attendance" {...field} />
                        </FormControl>
                        <FormDescription>
                          Brief subject of your OD request
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>From Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>To Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain why you need OD permission"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide detailed explanation for your OD request
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supportingDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supporting Details (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Event details, venue, organizer information, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Submit OD Request
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your OD Requests</CardTitle>
              <CardDescription>
                View status and history of your On-Duty permission requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <Table>
                  <TableCaption>Your recent OD permission requests</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date(s)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{request.subject}</TableCell>
                        <TableCell>
                          {formatDateRange(request.startDate, request.endDate)}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No OD Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't submitted any OD permission requests yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ODPermissionPage;
