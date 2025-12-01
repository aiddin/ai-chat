"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Import other shadcn components as needed

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Error occurred." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-md px-4 py-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}>
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="flex justify-start"><div className="bg-gray-100 px-4 py-2 rounded-lg">Typing...</div></div>}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
}