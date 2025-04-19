import React, { useState, useEffect } from 'react';
import RoleLayout from "@/components/RoleLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { useAuth, AppUser } from "@/contexts/AuthContext";

interface ODRequest {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ODRequestsPage: React.FC = () => {
  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Dummy data for OD requests
    const dummyRequests: ODRequest[] = [
      {
        id: "1",
        studentName: "John Doe",
        studentId: "12345",
        department: "Computer Science",
        fromDate: new Date(),
        toDate: new Date(),
        reason: "Attending a workshop",
        status: "pending",
      },
      {
        id: "2",
        studentName: "Jane Smith",
        studentId: "67890",
        department: "Electrical Engineering",
        fromDate: new Date(),
        toDate: new Date(),
        reason: "Medical appointment",
        status: "approved",
      },
      {
        id: "3",
        studentName: "Alice Johnson",
        studentId: "13579",
        department: "Mechanical Engineering",
        fromDate: new Date(),
        toDate: new Date(),
        reason: "Family function",
        status: "rejected",
      },
    ];

    setOdRequests(dummyRequests);
  }, []);

  const handleApprove = (id: string) => {
    setOdRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request
      )
    );
    toast({
      title: "OD Request Approved",
      description: "The OD request has been approved successfully.",
    });
  };

  const handleReject = (id: string) => {
    setOdRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request
      )
    );
    toast({
      title: "OD Request Rejected",
      description: "The OD request has been rejected.",
    });
  };

  return (
    <RoleLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>OD Requests</CardTitle>
            <CardDescription>
              Manage on-duty requests submitted by students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>From Date</TableHead>
                  <TableHead>To Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {odRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.studentName}</TableCell>
                    <TableCell>{request.studentId}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.fromDate.toLocaleDateString()}</TableCell>
                    <TableCell>{request.toDate.toLocaleDateString()}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell className="text-right">
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
};

export default ODRequestsPage;
