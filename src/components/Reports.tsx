
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileExcel, Calendar, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

const Reports = () => {
  const { toast } = useToast();
  
  const handleDownload = (type: string, period: string) => {
    // In a real app, this would generate and download a file
    toast({
      title: "Report Download Initiated",
      description: `Your ${period} ${type} report would be downloaded`,
    });
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex items-center space-x-2">
          <Select defaultValue="current">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">{currentMonth} {currentYear}</SelectItem>
              <SelectItem value="previous">Previous Month</SelectItem>
              <SelectItem value="quarter">Current Quarter</SelectItem>
              <SelectItem value="year">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">Attendance Reports</TabsTrigger>
          <TabsTrigger value="salary">Salary Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Attendance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Detailed daily attendance records with check-in and check-out times, including location data.
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">Current Month</div>
                    <div className="text-xs text-muted-foreground">
                      {currentMonth} {currentYear}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleDownload("attendance", "daily")}
                    >
                      <FileExcel className="h-3.5 w-3.5" />
                      <span>Excel</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleDownload("attendance", "daily")}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Summary</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Monthly attendance summary showing present days, absences, leaves, and attendance percentage.
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">Current Month</div>
                    <div className="text-xs text-muted-foreground">
                      {currentMonth} {currentYear}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleDownload("summary", "monthly")}
                    >
                      <FileExcel className="h-3.5 w-3.5" />
                      <span>Excel</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleDownload("summary", "monthly")}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Custom Attendance Reports</CardTitle>
              <CardDescription>
                Generate attendance reports for specific date ranges or criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Date Range</div>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Report Type</div>
                  <Select defaultValue="detailed">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="geolocation">Geolocation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Format</div>
                  <Select defaultValue="excel">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Generate Custom Report</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Salary Slip</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Detailed monthly salary breakdown including basic pay, allowances, deductions, and net amount.
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">Current Month</div>
                    <div className="text-xs text-muted-foreground">
                      {currentMonth} {currentYear}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleDownload("salary slip", "monthly")}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Yearly Salary Summary</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Annual salary summary with month-by-month breakdown and yearly totals.
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">Current Year</div>
                    <div className="text-xs text-muted-foreground">
                      {currentYear}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleDownload("salary summary", "yearly")}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tax and Compliance Reports</CardTitle>
              <CardDescription>
                Generate tax-related reports and compliance documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between p-6 h-auto"
                  onClick={() => handleDownload("tax statement", "yearly")}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-lg font-medium">Annual Tax Statement</span>
                    <span className="text-sm text-muted-foreground">For income tax filing purposes</span>
                  </div>
                  <FileText className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between p-6 h-auto"
                  onClick={() => handleDownload("earnings record", "yearly")}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-lg font-medium">Earnings Record</span>
                    <span className="text-sm text-muted-foreground">Complete earnings history</span>
                  </div>
                  <FileText className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
