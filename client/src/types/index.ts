export interface Project {
  id: string;
  name: string;
  initial_prompt: string;
  current_code?: string;
  current_version_index?: string;
  isPublished: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
  conversation?: Message[];
  versions?: Version[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  credits: number;
}

export interface Version {
  id: string;
  patch: string;
  fullHtml?: string;
  timestamp: string;
  branchId: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  projectId: string;
}