
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Book, Calendar, Clock, GraduationCap, FileText } from "lucide-react";

const courses = [
  {
    id: "CSE1001",
    name: "Introduction to Computer Science",
    description: "Fundamental concepts of computer science and programming",
    instructor: "Dr. Sarah Johnson",
    credits: 4,
    semester: "Fall 2024",
    progress: 65,
    status: "active"
  },
  {
    id: "CSE1002",
    name: "Data Structures",
    description: "Design and implementation of data structures and algorithms",
    instructor: "Dr. Michael Chen",
    credits: 4,
    semester: "Fall 2024",
    progress: 72,
    status: "active"
  },
  {
    id: "MAT1001",
    name: "Discrete Mathematics",
    description: "Mathematical structures for computer science",
    instructor: "Dr. Robert Williams",
    credits: 3,
    semester: "Fall 2024",
    progress: 58,
    status: "active"
  },
  {
    id: "CSE1003",
    name: "Object-Oriented Programming",
    description: "Principles and applications of object-oriented design",
    instructor: "Dr. Emily Zhang",
    credits: 4,
    semester: "Fall 2024",
    progress: 45,
    status: "active"
  },
  {
    id: "ENG1001",
    name: "Technical Communication",
    description: "Effective writing and presentation in technical contexts",
    instructor: "Prof. James Wilson",
    credits: 2,
    semester: "Fall 2024",
    progress: 80,
    status: "active"
  }
];

const assignments = [
  {
    id: "A1001",
    courseId: "CSE1001",
    title: "Algorithm Analysis Report",
    dueDate: "2025-04-15",
    status: "pending",
    description: "Analyze the time and space complexity of the algorithms discussed in class."
  },
  {
    id: "A1002",
    courseId: "CSE1002",
    title: "Implementation of AVL Trees",
    dueDate: "2025-04-20",
    status: "pending",
    description: "Implement AVL tree operations and demonstrate rotations."
  },
  {
    id: "A1003",
    courseId: "MAT1001",
    title: "Graph Theory Problems",
    dueDate: "2025-04-10",
    status: "submitted",
    description: "Solve the graph theory problems from Chapter 7."
  },
  {
    id: "A1004",
    courseId: "CSE1003",
    title: "Design Patterns Implementation",
    dueDate: "2025-04-25",
    status: "pending",
    description: "Implement three design patterns of your choice in a small application."
  },
  {
    id: "A1005",
    courseId: "ENG1001",
    title: "Technical Documentation",
    dueDate: "2025-04-17",
    status: "pending",
    description: "Create technical documentation for a software system of your choice."
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const CoursesPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Book className="h-4 w-4 text-primary" />
                          {course.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <span>{course.id}</span>
                          <span className="text-gray-300">•</span>
                          <span>{course.credits} Credits</span>
                        </CardDescription>
                      </div>
                      <Badge variant={course.status === "active" ? "default" : "secondary"}>
                        {course.status === "active" ? "Active" : "Completed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Course Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{course.semester}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>{course.instructor}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="assignments" className="space-y-6">
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const course = courses.find(c => c.id === assignment.courseId);
                return (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">{assignment.title}</h3>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {course?.name} ({assignment.courseId})
                          </div>
                          <p className="text-sm">{assignment.description}</p>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col sm:flex-row md:flex-col gap-3 sm:items-center md:items-end">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                          </div>
                          <Badge variant={
                            assignment.status === "submitted" ? "default" : 
                            assignment.status === "pending" ? "outline" : "destructive"
                          } className={assignment.status === "submitted" ? "bg-green-600 hover:bg-green-700" : ""}>
                            {assignment.status === "submitted" ? "Submitted" : 
                             assignment.status === "pending" ? "Pending" : "Late"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-6">
            <div className="space-y-6">
              {courses.map((course) => (
                <Card key={`materials-${course.id}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>{course.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">Course Materials</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-primary" />
                            <span>Lecture Slides - Week 1-5</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-primary" />
                            <span>Reading Material - Chapters 1-3</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-primary" />
                            <span>Lab Exercise Instructions</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CoursesPage;
