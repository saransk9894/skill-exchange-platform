export type Role = 'user' | 'admin';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type SessionType = 'online' | 'offline';
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Expert';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hidden on client
  phone: string;
  bio: string;
  location: string;
  avatar: string;
  experienceLevel: ExperienceLevel;
  skillsOffered: string[]; // List of skill names/IDs
  skillsWanted: string[];  // List of skill names/IDs
  role: Role;
  createdAt: string;
  isFake?: boolean; // Flag to simulate admin deleting/flagging fake accounts
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  level: ExperienceLevel;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface ExchangeRequest {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  skillOfferedId: string;
  skillOfferedName: string;
  skillWantedId: string;
  skillWantedName: string;
  status: RequestStatus;
  createdAt: string;
}

export interface SessionBooking {
  id: string;
  requestId: string;
  date: string;
  time: string;
  type: SessionType;
  locationDetails: string; // online URL or offline physical location
  status: SessionStatus;
  notes?: string;
  completed: boolean;
  hasCertificate: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeName: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  type: 'request' | 'chat' | 'session' | 'system' | 'review';
  read: boolean;
  createdAt: string;
}

export interface AdminReport {
  totalUsers: number;
  totalSkills: number;
  totalRequests: number;
  totalSessions: number;
  totalReviews: number;
}
