export type UserStatus = "ACTIVE" | "BLOCKED";

export interface User {
  id: string;
  name: string | null;
  email: string;
  status: UserStatus;
  joinDate: string; 
  lessonsCompleted: number;
  lastActive: string; 
  learningLevel: string; 
}