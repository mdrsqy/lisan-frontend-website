import { LessonManagementTable } from '@/components/lesson-management-table';
import { Lesson } from '@/types/lesson';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Shadcn Tabs

// Fungsi untuk mengambil data dari API Route kita
async function getLessonsData(): Promise<Lesson[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/lessons`, {
    cache: 'no-store', 
  });

  if (!res.ok) {
    console.error("Failed to fetch lessons data");
    return []; 
  }
  return res.json();
}

export default async function ContentManagementPage() {
  const lessons = await getLessonsData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Content Management</h1>
      <Separator />

      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="dictionary" disabled>Dictionary</TabsTrigger>
          <TabsTrigger value="quizzes" disabled>Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <LessonManagementTable lessons={lessons} />
        </TabsContent>
      </Tabs>
    </div>
  );
}