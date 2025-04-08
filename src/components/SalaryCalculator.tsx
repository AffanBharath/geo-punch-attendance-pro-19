
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

interface AttendanceRecord {
  userId: string;
  name: string;
  date: string;
  time: string;
  type: string;
  location: { lat: number; lng: number } | null;
  timestamp: number;
}

const SalaryCalculator = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [salaryData, setSalaryData] = useState({
    daysPresent: 0,
    daysAbsent: 0,
    baseSalary: 3000,
    deductions: 0,
    netSalary: 0,
    totalWorkingDays: 21,
  });
  
  useEffect(() => {
    // Get attendance records from localStorage
    const storedRecords = localStorage.getItem('attendanceRecords');
    if (storedRecords) {
      const parsedRecords = JSON.parse(storedRecords) as AttendanceRecord[];
      setRecords(parsedRecords);
      
      // Calculate salary data
      // For this demo, we'll use simple logic - in a real app, this would be more complex
      const checkInDates = new Set(
        parsedRecords
          .filter(record => record.type === "Check In")
          .map(record => record.date)
      );
      
      const daysPresent = checkInDates.size;
      const totalWorkingDays = 21; // Assuming 21 working days in a month
      const daysAbsent = totalWorkingDays - daysPresent;
      
      // Calculate salary
      const baseSalary = 3000; // $3000 per month
      const dailyRate = baseSalary / totalWorkingDays;
      const deductions = daysAbsent * dailyRate;
      const netSalary = baseSalary - deductions;
      
      setSalaryData({
        daysPresent,
        daysAbsent,
        baseSalary,
        deductions,
        netSalary,
        totalWorkingDays,
      });
    }
  }, []);

  const getMonthName = (monthIndex: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };
  
  const currentMonth = getMonthName(new Date().getMonth());
  const previousMonth = getMonthName((new Date().getMonth() - 1 + 12) % 12);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Salary Details</h2>
          <TabsList>
            <TabsTrigger value="current">Current Month</TabsTrigger>
            <TabsTrigger value="previous">Previous Month</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{currentMonth} Salary Overview</span>
              </CardTitle>
              <CardDescription>
                Your estimated salary for {currentMonth} based on attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Base Salary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${salaryData.baseSalary.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Monthly salary before deductions</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Deductions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">-${salaryData.deductions.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Based on {salaryData.daysAbsent} absent days</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">${salaryData.netSalary.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Final amount after deductions</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Attendance Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {salaryData.daysPresent}/{salaryData.totalWorkingDays} days
                  </span>
                </div>
                <Progress
                  value={(salaryData.daysPresent / salaryData.totalWorkingDays) * 100}
                  className="h-2"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Salary Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Basic Salary</span>
                    <span className="text-sm font-medium">${salaryData.baseSalary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Attendance Bonus</span>
                    <span className="text-sm font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overtime</span>
                    <span className="text-sm font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Absence Deduction</span>
                    <span className="text-sm font-medium text-red-500">-${salaryData.deductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Net Salary</span>
                    <span className="font-semibold">${salaryData.netSalary.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="previous" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{previousMonth} Salary Overview</span>
              </CardTitle>
              <CardDescription>
                Your finalized salary for {previousMonth}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Historical salary data not available in this demo
              </p>
              <p className="text-sm text-muted-foreground max-w-md">
                In a full implementation, this tab would show your previous month's finalized
                salary details including all bonuses, deductions, and tax information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalaryCalculator;
