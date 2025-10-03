import { ObjectId } from 'mongodb';

export type ChatType = 'direct' | 'group' | 'channel';
export type MessageType = 'text' | 'image' | 'file' | 'system';
export type ChatStatus = 'active' | 'archived' | 'deleted';

export interface ChatParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  lastReadAt?: Date;
  isActive: boolean;
}

export interface Message {
  _id: ObjectId;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  editedAt?: Date;
  isEdited: boolean;
  replyTo?: string; // Message ID being replied to
  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }[];
  reactions?: {
    emoji: string;
    userId: string;
    userName: string;
    timestamp: Date;
  }[];
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface Chat {
  _id: ObjectId;
  chatId: string;
  name: string;
  description?: string;
  type: ChatType;
  status: ChatStatus;
  participants: ChatParticipant[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: Date;
    type: MessageType;
  };
  settings?: {
    allowMemberInvites: boolean;
    allowFileSharing: boolean;
    allowReactions: boolean;
    isPrivate: boolean;
    maxParticipants?: number;
  };
  metadata?: {
    channelCategory?: string;
    channelTopic?: string;
    groupPurpose?: string;
  };
}

export interface CreateChatData {
  name: string;
  description?: string;
  type: ChatType;
  participants: string[]; // User IDs
  settings?: {
    allowMemberInvites?: boolean;
    allowFileSharing?: boolean;
    allowReactions?: boolean;
    isPrivate?: boolean;
    maxParticipants?: number;
  };
  metadata?: {
    channelCategory?: string;
    channelTopic?: string;
    groupPurpose?: string;
  };
}

export interface UpdateChatData {
  name?: string;
  description?: string;
  settings?: {
    allowMemberInvites?: boolean;
    allowFileSharing?: boolean;
    allowReactions?: boolean;
    isPrivate?: boolean;
    maxParticipants?: number;
  };
  metadata?: {
    channelCategory?: string;
    channelTopic?: string;
    groupPurpose?: string;
  };
}

export interface CreateMessageData {
  chatId: string;
  content: string;
  type: MessageType;
  replyTo?: string;
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }[];
}

export interface UpdateMessageData {
  content?: string;
  isDeleted?: boolean;
}

export interface ChatSearchOptions {
  userId?: string;
  type?: ChatType;
  status?: ChatStatus;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface MessageSearchOptions {
  chatId?: string;
  senderId?: string;
  type?: MessageType;
  searchTerm?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}
