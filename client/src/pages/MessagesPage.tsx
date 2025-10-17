import { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";
import DashboardPageHeader from "@/components/DashboardPageHeader";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
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
      name: "PT Maju Jaya",
      avatar: "MJ",
      lastMessage: "Terima kasih sudah apply, kami akan review CV Anda",
      timestamp: "10:30 AM",
      unread: 2,
    },
    {
      id: "2",
      name: "CV Sejahtera",
      avatar: "CS",
      lastMessage: "Kapan bisa interview?",
      timestamp: "Yesterday",
      unread: 0,
    },
    {
      id: "3",
      name: "Toko Elektronik",
      avatar: "TE",
      lastMessage: "Kami tertarik dengan profil Anda",
      timestamp: "2 days ago",
      unread: 1,
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

  return (
    <div className="min-h-screen bg-white">
      <DashboardPageHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Messages</h1>

        <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 240px)' }}>
          <div className="flex h-full">
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    data-testid="input-search-messages"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation === conversation.id ? 'bg-gray-50' : ''
                    }`}
                    data-testid={`conversation-${conversation.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-600">{conversation.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="h-5 w-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">MJ</span>
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">PT Maju Jaya</h2>
                        <p className="text-xs text-gray-500">Active now</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="button-call">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="button-video">
                        <Video className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-testid="button-more">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                        data-testid={`message-${message.id}`}
                      >
                        <div className={`max-w-[70%] ${message.isMine ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.isMine
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        data-testid="input-message"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        data-testid="button-send"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
