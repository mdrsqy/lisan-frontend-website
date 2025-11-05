import { Lesson, ContentStatus } from "@/types/lesson";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus } from "lucide-react";

interface LessonTableProps {
  lessons: Lesson[];
}

const getStatusVariant = (status: ContentStatus) => {
  return status === "PUBLISHED"
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-yellow-600 hover:bg-yellow-700";
};

export function LessonManagementTable({ lessons }: LessonTableProps) {
  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex justify-end mb-4">
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add New Lesson
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Lesson Title</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Completion Rate</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow
              key={lesson.id}
              className="hover:bg-muted transition-colors"
            >
              <TableCell className="font-medium text-gray-400">
                L{lesson.id}
              </TableCell>
              <TableCell className="font-semibold">{lesson.title}</TableCell>
              <TableCell>{lesson.module}</TableCell>
              <TableCell>
                <Badge className={getStatusVariant(lesson.status)}>
                  {lesson.status}
                </Badge>
              </TableCell>
              <TableCell>{lesson.views.toLocaleString()}</TableCell>
              <TableCell className="font-mono">
                {lesson.completionRate.toFixed(0)}%
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
