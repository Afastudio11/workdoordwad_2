import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Send, MoreVertical, ArrowLeft, MessageSquare, WifiOff, Loader2, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/useWebSocket";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  id: string;
  fullName: string;
  role: string;
  photoUrl?: string;
}

interface Conversation {
  otherUser: User;
  lastMessage: {
    content: string;
    createdAt: string;
    isRead: boolean;
    senderId: string;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: conversations = [], isLoading: conversationsLoading, error: conversationsError } = useQuery<Conversation[]>({
    queryKey: ["/api/messages"],
    enabled: !!currentUser,
  });

  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedUserId],
    enabled: !!selectedUserId,
  });

  // WebSocket for real-time updates
  const { isConnected, sendMessage: sendWsMessage } = useWebSocket({
    userId: currentUser?.id,
    onMessage: (data) => {
      if (data.type === "new_message") {
        // Refresh conversations
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
        
        // Refresh message thread if it's the active conversation
        if (selectedUserId === data.message.senderId) {
          queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedUserId] });
        }
      } else if (data.type === "messages_read") {
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      }
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("/api/messages", "POST", {
        receiverId: selectedUserId,
        content,
      });
      return res.json();
    },
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedUserId] });
      
      // Send via WebSocket for real-time delivery
      sendWsMessage({
        type: "message",
        receiverId: selectedUserId,
        data: newMessage,
      });
      
      setMessageInput("");
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      const res = await apiRequest(`/api/messages/${otherUserId}/read`, "PATCH");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      
      // Notify via WebSocket
      if (selectedUserId) {
        sendWsMessage({
          type: "mark_read",
          senderId: selectedUserId,
        });
      }
    },
  });

  useEffect(() => {
    if (selectedUserId) {
      // Mark messages as read when viewing a conversation
      const conversation = conversations.find(c => c.otherUser.id === selectedUserId);
      if (conversation && conversation.unreadCount > 0) {
        markAsReadMutation.mutate(selectedUserId);
      }
    }
  }, [selectedUserId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUserId) {
      sendMessageMutation.mutate(messageInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) => 
    conv.otherUser.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const activeConversation = conversations.find(c => c.otherUser.id === selectedUserId);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Pesan</h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                Real-time aktif
              </span>
            ) : (
              <span className="text-xs text-yellow-600 flex items-center gap-1">
                <WifiOff className="w-3 h-3" />
                Menghubungkan...
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* Conversations List */}
          <div className={`lg:col-span-4 bg-card border border-border rounded-xl overflow-hidden flex flex-col ${selectedUserId ? 'hidden lg:flex' : ''}`}>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari percakapan..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="input-search-messages"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversationsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Memuat percakapan...</p>
                </div>
              ) : conversationsError ? (
                <div className="p-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Gagal memuat percakapan. Silakan refresh halaman.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-base font-medium text-foreground mb-1">
                    {conversations.length === 0 ? 'Belum ada percakapan' : 'Tidak ada hasil'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {conversations.length === 0 
                      ? 'Mulai percakapan dengan melamar pekerjaan' 
                      : 'Coba kata kunci lain'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.otherUser.id}
                    onClick={() => setSelectedUserId(conv.otherUser.id)}
                    className={`w-full p-4 border-b border-border hover:bg-accent transition-colors text-left ${
                      selectedUserId === conv.otherUser.id ? 'bg-accent' : ''
                    }`}
                    data-testid={`conversation-${conv.otherUser.id}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground font-semibold">
                        {conv.otherUser.photoUrl ? (
                          <img src={conv.otherUser.photoUrl} alt={conv.otherUser.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(conv.otherUser.fullName)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">{conv.otherUser.fullName}</h3>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true, locale: idLocale })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            !conv.lastMessage.isRead && conv.lastMessage.senderId !== currentUser?.id
                              ? 'font-semibold text-foreground'
                              : 'text-muted-foreground'
                          }`}>
                            {conv.lastMessage.content}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-8 bg-card border border-border rounded-xl overflow-hidden flex flex-col ${!selectedUserId ? 'hidden lg:flex' : ''}`}>
            {!selectedUserId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-4">
                  <MessageSquare className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">Pilih percakapan</p>
                  <p className="text-sm text-muted-foreground">Pilih percakapan dari daftar untuk melihat pesan</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-card">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedUserId(null)}
                      className="lg:hidden mr-2"
                      data-testid="button-back-conversations"
                    >
                      <ArrowLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {activeConversation?.otherUser.photoUrl ? (
                        <img src={activeConversation.otherUser.photoUrl} alt={activeConversation.otherUser.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        activeConversation && getInitials(activeConversation.otherUser.fullName)
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">{activeConversation?.otherUser.fullName}</h2>
                      <p className="text-xs text-muted-foreground capitalize">{activeConversation?.otherUser.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-accent rounded-lg transition-colors" data-testid="button-more-options">
                    <MoreVertical className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                  {messagesLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Memuat pesan...</p>
                    </div>
                  ) : messagesError ? (
                    <div className="p-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Gagal memuat pesan. Silakan coba lagi.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <p className="text-base font-medium text-foreground mb-1">Belum ada pesan</p>
                      <p className="text-sm text-muted-foreground">Mulai percakapan dengan mengirim pesan</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = message.senderId === currentUser?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          data-testid={`message-${message.id}`}
                        >
                          <div className={`max-w-[70%] ${isMine ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isMine
                                  ? 'bg-[#D4FF00] text-gray-900'
                                  : 'bg-card text-foreground border border-border'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                            <p className={`text-xs text-muted-foreground mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: idLocale })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ketik pesan..."
                      className="flex-1 min-h-[44px] max-h-32 resize-none"
                      rows={1}
                      data-testid="textarea-message-input"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                      className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900 px-4"
                      data-testid="button-send-message"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
