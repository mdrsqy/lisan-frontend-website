import { PrismaClient, UserStatus, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Fungsi untuk menghapus semua data lama sebelum seeding baru
async function truncateData() {
    console.log("Truncating existing data...");
    // Urutan penghapusan penting karena adanya relasi (Foreign Keys)
    await prisma.userActivity.deleteMany(); 
    await prisma.lesson.deleteMany();
    await prisma.user.deleteMany();
    console.log("Existing data truncated.");
}

async function main() {
    console.log(`Start seeding ...`);

    // 🛑 1. Hapus Data Lama
    await truncateData(); 

    // --- 2. SEED PENGGUNA (USERS) ---
    const userData = [
        { name: 'Sarah Johnson', email: 'sarah.j@email.com', status: UserStatus.ACTIVE, lessonsCompleted: 42, learningLevel: 'Intermediate' },
        { name: 'Mike Chen', email: 'mike.c@email.com', status: UserStatus.ACTIVE, lessonsCompleted: 28, learningLevel: 'Beginner' },
        { name: 'Emily Davis', email: 'emily.d@email.com', status: UserStatus.ACTIVE, lessonsCompleted: 89, learningLevel: 'Advanced' },
        { name: 'Alex Kumar', email: 'alex.k@email.com', status: UserStatus.BLOCKED, lessonsCompleted: 15, learningLevel: 'Beginner' },
        { name: 'Lisa Park', email: 'lisa.p@email.com', status: UserStatus.ACTIVE, lessonsCompleted: 56, learningLevel: 'Intermediate' },
        { name: 'Tom Wilson', email: 'tom.w@email.com', status: UserStatus.ACTIVE, lessonsCompleted: 73, learningLevel: 'Advanced' },
    ];

    const createdUsers = [];
    for (const u of userData) {
        const user = await prisma.user.create({
            data: {
                ...u,
                lastActive: new Date(Date.now() - Math.random() * 86400000 * 7), 
            },
        });
        createdUsers.push(user);
        console.log(`Created user: ${user.name}`);
    }
    const users = createdUsers; // Array of created User objects

    // --- 3. SEED PELAJARAN (LESSONS) ---
    const allLessonData = [
        { title: 'Basic Greetings', module: 'Fundamentals', status: ContentStatus.PUBLISHED, views: 2600, completionRate: 0.87, videoUrl: 'url1' },
        { title: 'Family Signs', module: 'Fundamentals', status: ContentStatus.PUBLISHED, views: 2134, completionRate: 0.82, videoUrl: 'url2' },
        { title: 'Numbers 1-10', module: 'Basics', status: ContentStatus.PUBLISHED, views: 1987, completionRate: 0.91, videoUrl: 'url3' },
        { title: 'Common Phrases', module: 'Conversation', status: ContentStatus.PUBLISHED, views: 1758, completionRate: 0.78, videoUrl: 'url4' },
        { title: 'Alphabet A-Z', module: 'Basics', status: ContentStatus.PUBLISHED, views: 1900, completionRate: 0.78, videoUrl: 'url5' },
        { title: 'Colors & Shapes', module: 'Vocabulary', status: ContentStatus.PUBLISHED, views: 1543, completionRate: 0.84, videoUrl: 'url6' },
    ];

    const createdLessons = [];
    for (const l of allLessonData) {
        const lesson = await prisma.lesson.create({ data: l });
        createdLessons.push(lesson);
        console.log(`Created lesson: ${lesson.title}`);
    }
    const lessons = createdLessons; // Array of created Lesson objects

    // --- 4. SEED AKTIVITAS (ACTIVITIES) ---
    if (users.length > 0 && lessons.length > 0) {
        const activityData = [
            // Sesuai dengan desain 'Recent User Activity'
            { user: users[0], lesson: lessons[0], action: 'Completed lesson', timeOffset: 2 }, 
            { user: users[1], lesson: lessons[1], action: 'Started module', timeOffset: 5 }, 
            { user: users[2], lesson: lessons[2], action: 'Passed quiz', timeOffset: 12 }, 
            { user: users[3], lesson: lessons[3], action: 'Completed lesson', timeOffset: 18 }, 
            { user: users[4], lesson: lessons[4], action: 'Started module', timeOffset: 30 }, 
            { user: users[5], lesson: lessons[5], action: 'Completed lesson', timeOffset: 32 },
        ];

        for (const a of activityData) {
            await prisma.userActivity.create({
                data: {
                    userId: a.user.id,
                    lessonId: a.lesson.id,
                    action: a.action,
                    // Time is calculated backward from now in minutes
                    timestamp: new Date(Date.now() - (a.timeOffset * 60000)), 
                },
            });
        }
        console.log(`Created ${activityData.length} activity records.`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });