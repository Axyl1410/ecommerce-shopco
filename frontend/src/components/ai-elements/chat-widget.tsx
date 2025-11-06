"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./conversation";
import { Loader } from "./loader";
import { Message, MessageContent } from "./message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "./prompt-input";
import { Response } from "./response";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageContext, setPageContext] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { messages, sendMessage, status } = useChat();

  // Function to get current page context
  const getPageContext = () => {
    try {
      // Get current URL
      const currentUrl = `${window.location.origin}${pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      // Get page text content
      let pageContent = "Unable to read page content.";
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        pageContent = mainContent.innerText.substring(0, 3000); // Limit to 3000 characters
      } else {
        // Fallback: get content from body but remove unnecessary elements
        const bodyText = document.body.innerText;
        // Remove navigation, footer, and other unnecessary UI elements
        pageContent = bodyText
          .replace(/Menu|Navigation|Footer|Header|Sidebar/gi, "")
          .substring(0, 3000);
      }

      // Create context string
      const context = `
Current page context:
- URL: ${currentUrl}
- Path: ${pathname}
- Params: ${searchParams.toString() || "None"}
- Main content: ${pageContent}
      `.trim();

      return context;
    } catch {
      // Fallback context if unable to get detailed information
      return `Context: Currently on page ${pathname}`;
    }
  };

  // Update context when route changes
  useEffect(() => {
    if (isOpen) {
      const context = getPageContext();
      setPageContext(context);
    }
  }, [isOpen, pathname, searchParams]);

  // Function to send message with context via metadata
  const handleSendMessage = (message: string) => {
    // Get the latest context from current page
    const currentContext = getPageContext();

    sendMessage({
      text: message,
      metadata: {
        context: currentContext, // Send latest context via metadata
      },
    });
  };

  // Use messages from useChat directly
  const displayMessages = messages;

  return (
    <>
      <div
        className={`fixed bottom-[80px] right-2 z-30 h-full max-h-[min(650px,calc(100%-100px))] w-[calc(100vw-1rem)] max-w-[420px] translate-y-0 rounded-md bg-white shadow-2xl transition-all duration-300 sm:right-4 sm:w-[380px] md:right-5 md:w-[420px] ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          // Ensure it doesn't go off screen on very small devices
          maxHeight: "calc(100vh - 100px)",
          minHeight: "300px",
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-3 sm:p-4">
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="text-base font-semibold sm:text-lg">
                AI Assistant
              </h3>
              <p className="max-w-[200px] truncate text-xs text-gray-500">
                {pathname === "/" ? "Homepage" : pathname}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close chat"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area with AI Elements */}
          <Conversation className="flex-1">
            <ConversationContent>
              {displayMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-3 sm:p-4">
                  <p className="mb-4 px-2 text-center text-sm text-gray-600 sm:text-base">
                    How can I help you today?
                  </p>
                </div>
              ) : (
                displayMessages.map((message) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.parts?.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <Response key={`${message.id}-${i}`}>
                                {part.text}
                              </Response>
                            );
                          default:
                            return null;
                        }
                      })}
                    </MessageContent>
                  </Message>
                ))
              )}

              {/* Loading State */}
              {status === "streaming" && (
                <Message from="assistant">
                  <MessageContent>
                    <div className="flex items-center space-x-2">
                      <Loader size={16} />
                      <span className="text-sm text-muted-foreground">
                        AI is thinking...
                      </span>
                    </div>
                  </MessageContent>
                </Message>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Input Area with AI Elements */}
          <div className="border-t p-3 sm:p-4">
            <PromptInput
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const message = formData.get("message") as string;
                if (message?.trim()) {
                  handleSendMessage(message);
                  e.currentTarget.reset();
                }
              }}
            >
              <PromptInputTextarea
                name="message"
                placeholder="Ask about this page or anything..."
                disabled={status === "streaming"}
                minHeight={44}
                maxHeight={120}
                className="text-sm sm:text-base"
              />
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-1">
                  {/* Optional: Add more tools here */}
                </div>
                <PromptInputSubmit
                  status={status}
                  disabled={status === "streaming"}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                />
              </div>
            </PromptInput>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
        className={`fixed bottom-4 right-2 z-50 flex cursor-pointer items-center justify-center gap-1 rounded-full p-2 shadow-lg ring-1 ring-slate-500 transition-all duration-200 sm:right-3 sm:gap-2 sm:p-3 md:right-4 ${
          isOpen
            ? "bg-slate-900 text-white hover:bg-slate-800"
            : "bg-slate-50 text-slate-900 hover:bg-slate-100"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="hidden text-xs font-medium sm:inline sm:text-sm">
          {isOpen ? "Close" : "Ask AI"}
        </span>
        <span className="text-xs font-medium sm:hidden">
          {isOpen ? "Close" : "Ask AI"}
        </span>
        {isOpen ? (
          <XIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        ) : (
          <MessageCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
      </button>
    </>
  );
}
