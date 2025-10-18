import { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

interface Conversation {
  id: string;
  name: string;
  company: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      company: "PT Maju Jaya",
      avatar: "SJ",
      lastMessage: "Terima kasih sudah apply, kami akan review CV Anda",
      timestamp: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      company: "CV Sejahtera",
      avatar: "MC",
      lastMessage: "Kapan bisa interview?",
      timestamp: "Yesterday",
      unread: 0,
      online: true,
    },
    {
      id: "3",
      name: "Emily Davis",
      company: "Toko Elektronik",
      avatar: "ED",
      lastMessage: "Kami tertarik dengan profil Anda",
      timestamp: "2 days ago",
      unread: 1,
      online: false,
    },
    {
      id: "4",
      name: "David Wilson",
      company: "StartupHub Indonesia",
      avatar: "DW",
      lastMessage: "Terima kasih atas minat Anda pada perusahaan kami",
      timestamp: "3 days ago",
      unread: 0,
      online: false,
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: "PT Maju Jaya",
      content: "Halo, terima kasih sudah apply untuk posisi Staff Admin",
      timestamp: "10:00 AM",
      isMine: false,
    },
    {
      id: "2",
      sender: "You",
      content: "Terima kasih kembali. Saya sangat tertarik dengan posisi ini",
      timestamp: "10:15 AM",
      isMine: true,
    },
    {
      id: "3",
      sender: "PT Maju Jaya",
      content: "Terima kasih sudah apply, kami akan review CV Anda dan menghubungi Anda dalam 3 hari kerja",
      timestamp: "10:30 AM",
      isMine: false,
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  const activeConversation = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Pesan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* Conversations List */}
          <div className="lg:col-span-4 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari percakapan..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="input-search-messages"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 border-b border-border hover:bg-secondary/50 transition-colors text-left ${
                    selectedConversation === conversation.id ? 'bg-secondary' : ''
                  }`}
                  data-testid={`conversation-${conversation.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{conversation.avatar}</span>
                      </div>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.company}</p>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-primary-foreground">{conversation.unread}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            {selectedConversation && activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{activeConversation.avatar}</span>
                      </div>
                      {activeConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">{activeConversation.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {activeConversation.online ? 'Aktif sekarang' : activeConversation.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 hover:bg-secondary rounded-lg transition-colors" 
                      data-testid="button-call"
                    >
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button 
                      className="p-2 hover:bg-secondary rounded-lg transition-colors" 
                      data-testid="button-video"
                    >
                      <Video className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button 
                      className="p-2 hover:bg-secondary rounded-lg transition-colors" 
                      data-testid="button-more"
                    >
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                      data-testid={`message-${message.id}`}
                    >
                      <div className={`max-w-[70%]`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.isMine
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs mt-1 px-1 ${
                          message.isMine ? 'text-right text-muted-foreground' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      data-testid="button-attach"
                    >
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <input
                      type="text"
                      placeholder="Ketik pesan..."
                      className="flex-1 px-4 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      data-testid="input-message"
                    />
                    <button 
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      data-testid="button-emoji"
                    >
                      <Smile className="h-5 w-5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      data-testid="button-send"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
