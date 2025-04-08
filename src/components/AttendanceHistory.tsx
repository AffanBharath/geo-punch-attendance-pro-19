
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Clock, Calendar, FileExcel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface AttendanceRecord {
  userId: string;
  name: string;
  date: string;
  time: string;
  type: string;
  location: { lat: number; lng: number } | null;
  timestamp: number;
}

const AttendanceHistory = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Get attendance records from localStorage
    const storedRecords = localStorage.getItem('attendanceRecords');
    if (storedRecords) {
      const parsedRecords = JSON.parse(storedRecords) as AttendanceRecord[];
      // Sort by timestamp, newest first
      const sortedRecords = parsedRecords.sort((a, b) => b.timestamp - a.timestamp);
      setRecords(sortedRecords);
      setFilteredRecords(sortedRecords);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(
        (record) =>
          record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  const handleExport = () => {
    // In a real app, this would generate an Excel file
    // For this demo, we'll just show a toast
    toast({
      title: "Export Initiated",
      description: "Your attendance data would be exported to Excel",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>View and search your attendance records</CardDescription>
          </div>
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <FileExcel className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search by date, time or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{record.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{record.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            record.type === "Check In"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {record.type}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {record.location
                              ? `${record.location.lat.toFixed(6)}, ${record.location.lng.toFixed(6)}`
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
