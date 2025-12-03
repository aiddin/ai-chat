"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQ {
  "no.": string;
  question: string;
}

export interface StructuredResponse {
  response: string;
  faqs_used?: FAQ[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  structuredData?: StructuredResponse;
}

export interface AIChatProps {
  /** API endpoint URL (e.g., "https://api.example.com") */
  apiUrl: string;
  /** Session ID for maintaining conversation context */
  sessionId?: string;
  /** Custom header title */
  title?: string;
  /** Initial messages to display */
  initialMessages?: Message[];
  /** Custom CSS class for the container */
  className?: string;
  /** Callback when a message is sent */
  onMessageSent?: (message: Message) => void;
  /** Callback when a response is received */
  onResponseReceived?: (message: Message) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

function FAQList({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        Related FAQs:
      </p>
      <ul className="space-y-2">
        {faqs.map((faq) => (
          <li
            key={faq["no."]}
            className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2"
          >
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {faq["no."]}.
            </span>
            <span>{faq.question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AIChat({
  apiUrl,
  sessionId = "default-session",
  title = "My AI Agent",
  initialMessages = [],
  className,
  onMessageSent,
  onResponseReceived,
  onError,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    onMessageSent?.(userMessage);

    try {
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          question: input.trim(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend error: ${res.status} ${errorText}`);
      }

      const data = await res.json();

      // Parse the response correctly
      let responseText: string;
      let structuredData: StructuredResponse | undefined;

      // Check if data has the expected structure directly
      if (data.response && typeof data.response === "string") {
        responseText = data.response;
        structuredData = {
          response: data.response,
          faqs_used: data.faqs_used || [],
        };
      } else {
        // Fallback: display the whole response
        responseText = "No response from agent";
        structuredData = undefined;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        structuredData: structuredData,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      onResponseReceived?.(assistantMessage);
    } catch (err) {
      console.error("Backend connection failed:", err);
      const error = err instanceof Error ? err : new Error('Unknown error');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message}\n\nPlease check your API endpoint configuration.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-screen bg-zinc-50 dark:bg-black", className)}>
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 dark:text-zinc-400 mt-20">
              <p className="text-2xl font-medium">How can I help you today?</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === "user" && "flex-row-reverse gap-4"
              )}
            >
              <Avatar className="shrink-0">
                <AvatarFallback>
                  {message.role === "user" ? "U" : "AI"}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  "max-w-xl px-4 py-3 rounded-2xl",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === "assistant" && message.structuredData?.faqs_used && (
                  <FAQList faqs={message.structuredData.faqs_used} />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-2xl">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              </div>
            </div>
          )}

          <div ref={scrollAreaRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 text-base h-12"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-full p-0"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
