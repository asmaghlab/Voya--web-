import { useEffect, useState } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import {
  User,
  Clock,
  MessageSquare,
  Send,
  Trash2,
  X,
  CheckCircle2,
  Inbox,
  RefreshCw,
  Edit2,
  Loader2,
} from "lucide-react";
import { Helmet } from "react-helmet";

const API_URL =
  "https://693ad9ce9b80ba7262cba402.mockapi.io/voya-contact-api/messages";

interface Message {
  id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  reply?: string;
  createdAt: string;
}

type FilterType = "all" | "replied" | "pending";

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [originalReply, setOriginalReply] = useState<string | undefined>(undefined);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;

  const [filter, setFilter] = useState<FilterType>("all");

  const [expandedMessages, setExpandedMessages] = useState<{ [id: string]: boolean }>({});

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async () => {
    if (!selectedMessage) return;

    const { email, reply } = selectedMessage;
    if (!email?.trim()) return toast.error("Recipient email is empty!");
    if (!reply?.trim()) return toast.error("Reply cannot be empty!");

    setSendingReply(true);
    try {
      await fetch(`${API_URL}/${selectedMessage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });

      await emailjs.send(
        "service_xk2p9q1",
        "template_2gmqpki",
        {
          to_email: email,
          user_name: selectedMessage.name,
          subject: selectedMessage.subject,
          message: selectedMessage.message,
          reply,
        },
        "3APPgNXmg7rTOjXAa"
      );

      toast.success("Reply sent successfully!");
      fetchMessages();
      setSelectedMessage(null);
      setOriginalReply(undefined);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send reply!");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      toast.success("Message deleted successfully!");
      fetchMessages();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete message");
    }
  };

  const totalMessages = messages.length;
  const repliedMessages = messages.filter((m) => m.reply).length;

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true;
    if (filter === "replied") return msg.reply;
    if (filter === "pending") return !msg.reply;
    return true;
  });

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  return (
    <>
      <Helmet>
        <title>Voya | Messages</title>
        <meta name="description" content="Manage and respond to customer inquiries" />
      </Helmet>

      <style>{`
        :root {
          --background: 210 20% 98%;
          --foreground: 215 25% 15%;
          --card: 0 0% 100%;
          --card-foreground: 215 25% 15%;
          --secondary: 210 15% 95%;
          --secondary-foreground: 215 25% 25%;
          --muted: 210 15% 93%;
          --muted-foreground: 215 15% 50%;
          --warning: 45 100% 50%; 
          --primary-foreground: 0 0% 100%;
          --success: 152 55% 45%;
          --success-foreground: 0 0% 100%;
          --destructive: 0 72% 55%;
          --destructive-foreground: 0 0% 100%;
          --border: 210 20% 88%;
        }
      `}</style>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-sans">
        {/* Header */}
        <header className="bg-[hsl(var(--card))] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Messages</h1>
              <p className="mt-1 text-[hsl(var(--muted-foreground))]">Manage and respond to customer inquiries</p>
            </div>
            <button
              onClick={fetchMessages}
              disabled={loadingMessages}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingMessages ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Stats / Filter Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
              className={`cursor-pointer rounded-xl p-4 flex items-center gap-3 transition hover:shadow-md ${
                filter === "all" ? "bg-[hsl(var(--primary))]/20 shadow-lg" : "bg-[hsl(var(--secondary))]/50"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                <Inbox className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMessages}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Messages</p>
              </div>
            </div>

            <div
              onClick={() => {
                setFilter("replied");
                setCurrentPage(1);
              }}
              className={`cursor-pointer rounded-xl p-4 flex items-center gap-3 transition hover:shadow-md ${
                filter === "replied" ? "bg-[hsl(var(--success))]/20 shadow-lg" : "bg-[hsl(var(--secondary))]/50"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{repliedMessages}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Replied</p>
              </div>
            </div>

            <div
              onClick={() => {
                setFilter("pending");
                setCurrentPage(1);
              }}
              className={`cursor-pointer rounded-xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1 transition hover:shadow-md ${
                filter === "pending" ? "bg-[hsl(var(--destructive))]/20 shadow-lg" : "bg-[hsl(var(--secondary))]/50"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--destructive))]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[hsl(var(--destructive))]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMessages - repliedMessages}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending</p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-[hsl(var(--card))] rounded-xl shadow-md overflow-hidden border border-[hsl(var(--border))] hover:shadow-lg flex flex-col h-full"
            >
              {/* HEADER */}
              <div className="px-4 py-3 bg-[hsl(var(--secondary))]/30 border-b border-[hsl(var(--border))] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-[hsl(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{msg.name}</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{msg.email}</p>
                </div>
                {msg.reply ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] text-xs font-medium rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Replied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] text-xs font-medium rounded-full">
                    <MessageSquare className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                  <Clock className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleDateString()}
                </div>
                <h4 className="font-semibold text-sm line-clamp-1">{msg.subject}</h4>

                <p className={`text-[hsl(var(--secondary-foreground))] text-sm ${expandedMessages[msg.id] ? "" : "line-clamp-2"}`}>
                  {msg.message}
                </p>

                {msg.message.split(" ").length > 20 && (
                  <button
                    className="text-[hsl(var(--primary))] text-xs mt-1 font-medium"
                    onClick={() =>
                      setExpandedMessages((prev) => ({
                        ...prev,
                        [msg.id]: !prev[msg.id],
                      }))
                    }
                  >
                    {expandedMessages[msg.id] ? "Show less" : "Show more"}
                  </button>
                )}

                {msg.reply && (
                  <div className="p-2.5 bg-[hsl(var(--primary))]/10 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Send className="w-3 h-3 text-[hsl(var(--primary))]" /> Reply
                    </div>
                    <p className="text-[hsl(var(--secondary-foreground))] text-xs line-clamp-2">{msg.reply}</p>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="px-4 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 flex justify-end items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedMessage(msg);
                    setOriginalReply(msg.reply); // هنا نخزن الرد الأصلي
                  }}
                  disabled={sendingReply}
                  className={`flex-none w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                    sendingReply ? "opacity-50 cursor-not-allowed" : ""
                  } bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]`}
                >
                  {sendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : msg.reply ? <Edit2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="flex-none w-10 h-10 flex items-center justify-center bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] rounded-lg transition-all hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))]"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </main>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/30 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 rounded-lg bg-[hsl(var(--secondary))]/20 text-[hsl(var(--foreground))]">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/30 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Reply Modal */}
        {selectedMessage && (
          <div
            className="fixed inset-0 bg-[hsl(var(--foreground))]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedMessage(null)}
          >
            <div className="bg-[hsl(var(--card))] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{selectedMessage.name}</h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{selectedMessage.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setOriginalReply(undefined);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-[hsl(var(--muted))] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>

              <div className="px-6 py-4 bg-[hsl(var(--muted))]/30">
                <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">Original Message</p>
                <p className="text-sm text-[hsl(var(--secondary-foreground))]">{selectedMessage.subject}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{selectedMessage.message}</p>
              </div>

              <div className="p-6">
                <label className="block text-sm font-medium mb-2">Your Reply</label>
                <textarea
                  className="w-full px-4 py-3 bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))] rounded-xl text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 resize-none"
                  rows={5}
                  placeholder="Write your reply..."
                  value={selectedMessage.reply || ""}
                  onChange={(e) => setSelectedMessage({ ...selectedMessage, reply: e.target.value })}
                />
              </div>

              <div className="px-6 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/20 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setOriginalReply(undefined);
                  }}
                  className="px-4 py-2.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={sendingReply}
                  className={`px-5 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg font-medium hover:opacity-90 flex items-center gap-2 ${
                    sendingReply ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {sendingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : originalReply ? (
                    <Edit2 className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sendingReply ? "Sending..." : originalReply ? "Edit" : "Reply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}