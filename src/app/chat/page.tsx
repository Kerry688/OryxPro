'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Users, 
  Hash, 
  Settings,
  MoreHorizontal,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  Clock,
  CheckCircle,
  CheckCircle2
} from 'lucide-react';
import { Chat, Message, CreateChatData, ChatType } from '@/lib/models/chat';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [isAddParticipantsOpen, setIsAddParticipantsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [userStatuses, setUserStatuses] = useState<{[key: string]: 'online' | 'offline'}>({});

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setAllUsers(data.data || []);
        // Simulate user statuses (in a real app, this would come from WebSocket or polling)
        const statuses: {[key: string]: 'online' | 'offline'} = {};
        data.data?.forEach((user: any) => {
          // Randomly assign online/offline status for demo
          statuses[user._id.toString()] = Math.random() > 0.3 ? 'online' : 'offline';
        });
        setUserStatuses(statuses);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Fetch chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/chats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setChats(data.data || []);
        toast({
          title: "Chats loaded",
          description: `Found ${data.data?.length || 0} chats`,
        });
      } else {
        setError(data.error || 'Failed to fetch chats');
        toast({
          title: "Error",
          description: data.error || 'Failed to fetch chats',
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch chats';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data.reverse()); // Reverse to show oldest first
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch(`/api/chats/${selectedChat.chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          type: 'text'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setNewMessage('');
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully",
        });
        // Refresh messages
        fetchMessages(selectedChat.chatId);
        // Refresh chats to update last message
        fetchChats();
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to send message',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create new chat
  const createChat = async (chatData: CreateChatData) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
      });

      const data = await response.json();
      
      if (data.success) {
        setChats(prev => [data.data, ...prev]);
        setSelectedChat(data.data);
        setIsCreateChatOpen(false);
        toast({
          title: "Chat created",
          description: `"${chatData.name}" has been created successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to create chat',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Failed to create chat:', err);
      toast({
        title: "Error",
        description: "Failed to create chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchChats();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chatId);
    }
  }, [selectedChat]);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = searchTerm === '' || 
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || chat.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getChatIcon = (chat: Chat) => {
    switch (chat.type) {
      case 'direct':
        return <MessageCircle className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      case 'channel':
        return <Hash className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getMessageStatusIcon = (message: Message) => {
    // This would typically check if the message was read by all participants
    return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
  };

  // Create direct message with a user
  const createDirectMessage = async (userId: string, userName: string) => {
    try {
      const chatData: CreateChatData = {
        name: userName,
        type: 'direct',
        participants: [userId]
      };

      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Check if chat already exists with this user
        const existingChat = chats.find(chat => 
          chat.type === 'direct' && 
          chat.participants.length === 2 && 
          chat.participants.some(p => p.userId === userId)
        );
        
        if (existingChat) {
          setSelectedChat(existingChat);
        } else {
          setChats(prev => [data.data, ...prev]);
          setSelectedChat(data.data);
        }
        
        toast({
          title: "Chat started",
          description: `Started conversation with ${userName}`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to create chat',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Failed to create direct message:', err);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chats</h2>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/chats/test');
                    const data = await response.json();
                    toast({
                      title: "Database Test",
                      description: data.success ? `Connected! Found ${data.data.chats.count} chats, ${data.data.messages.count} messages` : data.error,
                      variant: data.success ? "default" : "destructive",
                    });
                  } catch (err) {
                    toast({
                      title: "Database Test",
                      description: "Failed to test database connection",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Test DB
              </Button>
              <Dialog open={isCreateChatOpen} onOpenChange={setIsCreateChatOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                    <DialogDescription>
                      Start a new conversation or create a channel
                    </DialogDescription>
                  </DialogHeader>
                  <CreateChatForm onSubmit={createChat} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat Tabs */}
        <div className="px-4 pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="direct">Direct</TabsTrigger>
              <TabsTrigger value="channel">Channels</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading chats...
            </div>
          ) : activeTab === 'direct' ? (
            // Show all users for direct messages
            <div className="space-y-1 p-2">
              <div className="px-2 py-1">
                <h4 className="text-sm font-medium text-muted-foreground">All Users</h4>
              </div>
              {allUsers.map((user) => {
                const status = userStatuses[user._id.toString()] || 'offline';
                return (
                  <div
                    key={user._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted`}
                    onClick={() => createDirectMessage(user._id.toString(), `${user.firstName} ${user.lastName}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {/* Status indicator */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                          status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">
                            {user.firstName} {user.lastName}
                          </h3>
                          <Badge 
                            variant={status === 'online' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {user.position || 'No position'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Click to start chat
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No chats found
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat._id.toString()}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?._id.toString() === chat._id.toString()
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {chat.type === 'direct' ? (
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={chat.participants[0]?.userAvatar} />
                            <AvatarFallback>
                              {chat.participants[0]?.userName?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {/* Status indicator for direct chats */}
                          {chat.participants[0] && (
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                              userStatuses[chat.participants[0].userId] === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          )}
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getChatIcon(chat)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(chat.lastMessage.timestamp), 'HH:mm')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">
                          {chat.participants.length} members
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {chat.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedChat.type === 'direct' ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedChat.participants[0]?.userAvatar} />
                      <AvatarFallback>
                        {selectedChat.participants[0]?.userName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getChatIcon(selectedChat)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{selectedChat.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.participants.length} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message._id.toString()} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>
                      {message.senderName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{message.senderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    <div className="bg-muted rounded-lg p-3 max-w-md">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {getMessageStatusIcon(message)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="pr-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a chat to start messaging</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar or create a new chat
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Create Chat Form Component
function CreateChatForm({ onSubmit }: { onSubmit: (data: CreateChatData) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'direct' as ChatType,
    participants: [] as string[]
  });
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  const addParticipant = (userId: string) => {
    if (!formData.participants.includes(userId)) {
      setFormData({ ...formData, participants: [...formData.participants, userId] });
    }
    setSearchQuery('');
  };

  const removeParticipant = (userId: string) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter(id => id !== userId)
    });
  };

  const getSelectedUserDetails = () => {
    return users.filter(user => formData.participants.includes(user._id.toString()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.participants.length === 0) {
      alert('Please select at least one participant');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Chat Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter chat name..."
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description (Optional)</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter description..."
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as ChatType })}
          className="w-full p-2 border rounded-md"
        >
          <option value="direct">Direct Message</option>
          <option value="group">Group Chat</option>
          <option value="channel">Channel</option>
        </select>
      </div>

      {/* Participants Selection */}
      <div>
        <label className="text-sm font-medium">Participants</label>
        <div className="space-y-2">
          {/* Search for users */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search results */}
          {searchQuery && (
            <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading users...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => addParticipant(user._id.toString())}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        addParticipant(user._id.toString());
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No users found</div>
              )}
            </div>
          )}

          {/* Selected participants */}
          {formData.participants.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Selected Participants:</div>
              {getSelectedUserDetails().map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeParticipant(user._id.toString())}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={formData.participants.length === 0}>
          Create Chat
        </Button>
      </div>
    </form>
  );
}
