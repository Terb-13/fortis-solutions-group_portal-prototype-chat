"use client";

import type { UIMessage } from "ai";
import { Loader2, Send } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { textFromUIMessage } from "@/lib/message-text";
import { cn } from "@/lib/utils";
import { useFortisChat } from "@/components/chat-provider";

function reactNodeToPlainString(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToPlainString).join("");
  if (isValidElement(node)) {
    const { children } = node.props as { children?: ReactNode };
    return reactNodeToPlainString(children);
  }
  return "";
}

const PRISM_LANGUAGE_ALIASES: Record<string, string> = {
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
  ts: "typescript",
  js: "javascript",
  tsx: "tsx",
  jsx: "jsx",
};

function normalizePrismLanguage(raw: string): string {
  const key = (raw ?? "").toLowerCase();
  if (key === "" || key === "plaintext" || key === "plain") return "text";
  return PRISM_LANGUAGE_ALIASES[key] ?? key;
}

function extractFencedCodeFromPre(children: ReactNode): {
  language: string;
  code: string;
} {
  const [first] = Children.toArray(children);
  if (isValidElement(first)) {
    const props = first.props as {
      className?: string;
      children?: ReactNode;
    };
    const className = String(props.className ?? "");
    const match = /language-([\w-]+)/.exec(className);
    const code = reactNodeToPlainString(props.children).replace(/\n$/, "");
    return {
      language: normalizePrismLanguage(match?.[1] ?? "text"),
      code,
    };
  }
  return {
    language: "text",
    code: reactNodeToPlainString(children).replace(/\n$/, ""),
  };
}

function chatMarkdownComponents(isUser: boolean): Components {
  const linkClass = cn(
    "break-words font-medium underline underline-offset-4 transition-colors",
    isUser
      ? "text-white/95 decoration-white/50 hover:text-white hover:decoration-white"
      : "text-[#003087] decoration-[#003087]/35 hover:text-[#00215f] hover:decoration-[#00215f]/50",
  );

  return {
    p: ({ children }) => (
      <p className="my-0 leading-7 [&:not(:last-child)]:mb-3">{children}</p>
    ),
    h1: ({ children }) => (
      <h1
        className={cn(
          "mb-2 mt-4 text-base font-semibold tracking-tight first:mt-0",
          isUser ? "text-white" : "text-foreground",
        )}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={cn(
          "mb-2 mt-4 text-base font-semibold tracking-tight first:mt-0",
          isUser ? "text-white" : "text-foreground",
        )}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={cn(
          "mb-1.5 mt-3 text-[0.9375rem] font-semibold tracking-tight first:mt-0",
          isUser ? "text-white" : "text-foreground",
        )}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={cn(
          "mb-1.5 mt-3 text-[0.9375rem] font-semibold tracking-tight first:mt-0",
          isUser ? "text-white" : "text-foreground",
        )}
      >
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5
        className={cn(
          "mb-1 mt-2 text-sm font-semibold tracking-tight first:mt-0",
          isUser ? "text-white" : "text-foreground",
        )}
      >
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6
        className={cn(
          "mb-1 mt-2 text-sm font-semibold tracking-tight first:mt-0",
          isUser ? "text-white/90" : "text-muted-foreground",
        )}
      >
        {children}
      </h6>
    ),
    ul: ({ children, className, ...props }) => (
      <ul
        className={cn(
          "my-2 space-y-1 pl-5 marker:text-current [&_ul]:my-1.5 [&_ul]:pl-4 [&_ol]:my-1.5 [&_ol]:pl-4",
          String(className ?? "").includes("contains-task-list")
            ? "list-none pl-1"
            : "list-disc",
          className,
        )}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, className, ...props }) => (
      <ol
        className={cn(
          "my-2 list-decimal space-y-1 pl-5 marker:text-current [&_ul]:my-1.5 [&_ul]:pl-4 [&_ol]:my-1.5 [&_ol]:pl-4",
          className,
        )}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, className, ...props }) => (
      <li
        className={cn(
          "leading-7",
          String(className ?? "").includes("task-list-item") &&
            cn(
              "list-none flex items-start gap-2.5 pl-0 [&>input]:mt-1 [&>input]:h-4 [&>input]:w-4 [&>input]:shrink-0 [&>input]:rounded-sm",
              isUser
                ? "[&>input]:border-white/40 [&>input]:accent-white"
                : "[&>input]:border-border [&>input]:accent-[#003087]",
            ),
          className,
        )}
        {...props}
      >
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    del: ({ children }) => (
      <del className="opacity-80 line-through">{children}</del>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={cn(
          "my-3 border-l-[3px] py-0.5 pl-3.5 text-[0.8125rem] leading-7 [&_p]:mb-2 [&_p:last-child]:mb-0",
          isUser
            ? "border-white/45 text-white/92"
            : "border-[#003087]/40 text-muted-foreground",
        )}
      >
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr
        className={cn(
          "my-4 border-0 border-t",
          isUser ? "border-white/25" : "border-border",
        )}
      />
    ),
    pre: ({ children }) => {
      const { language, code } = extractFencedCodeFromPre(children);
      const prismTheme = isUser ? oneDark : oneLight;
      return (
        <div
          className={cn(
            "my-3 max-w-full overflow-x-auto rounded-xl border px-3.5 py-3",
            isUser
              ? "border-white/20 bg-black/35"
              : "border-border/90 bg-muted/50",
          )}
        >
          <SyntaxHighlighter
            className="syntax-highlighter-root"
            language={language}
            style={prismTheme}
            PreTag="div"
            CodeTag="code"
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
            }}
            codeTagProps={{
              className: "font-mono text-[0.8125rem] leading-6",
            }}
            showLineNumbers={false}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    },
    code: ({ children, className, ...props }) => (
      <code
        className={cn(
          "font-mono text-[0.85em]",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    ),
    a: ({ children, href, className, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(linkClass, className)}
        {...props}
      >
        {children}
      </a>
    ),
    table: ({ children, className, ...props }) => (
      <div
        className={cn(
          "my-3 max-w-full overflow-x-auto rounded-xl border shadow-sm",
          isUser ? "border-white/20 bg-black/15" : "border-border bg-muted/25",
        )}
      >
        <table
          className={cn(
            "w-full min-w-[240px] border-collapse text-left text-[0.8125rem] leading-snug",
            className,
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead
        className={cn(
          "border-b",
          isUser ? "border-white/25 bg-black/25" : "border-border bg-muted/60",
        )}
      >
        {children}
      </thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr
        className={cn(
          "border-b last:border-b-0",
          isUser ? "border-white/12" : "border-border/55",
        )}
      >
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th
        className={cn(
          "px-3 py-2 text-left text-[0.7rem] font-semibold uppercase tracking-wide",
          isUser ? "text-white/75" : "text-muted-foreground",
        )}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 align-top">{children}</td>
    ),
    img: ({ src, alt, title }) => (
      // eslint-disable-next-line @next/next/no-img-element -- assistant may return external image URLs in Markdown
      <img
        src={src ?? ""}
        alt={alt ?? ""}
        title={title ?? undefined}
        className={cn(
          "my-2 max-h-52 max-w-full rounded-lg object-contain",
          isUser ? "border border-white/20" : "border border-border",
        )}
      />
    ),
    sup: ({ children }) => (
      <sup className="text-[0.65rem] leading-none">{children}</sup>
    ),
    sub: ({ children }) => (
      <sub className="text-[0.65rem] leading-none">{children}</sub>
    ),
  };
}

function ChatMessageMarkdown({ text, isUser }: { text: string; isUser: boolean }) {
  const components = useMemo(() => chatMarkdownComponents(isUser), [isUser]);

  return (
    <div
      className={cn(
        "chat-md min-w-0 text-sm leading-relaxed",
        // Inline code chips (fenced blocks use SyntaxHighlighter, not raw pre > code)
        "[&_code]:rounded-md [&_code]:bg-black/12 [&_code]:px-1.5 [&_code]:py-px",
        !isUser && "[&_code]:bg-muted",
        "[&_.syntax-highlighter-root>code]:rounded-none [&_.syntax-highlighter-root>code]:bg-transparent [&_.syntax-highlighter-root>code]:p-0 [&_.syntax-highlighter-root>code]:px-0 [&_.syntax-highlighter-root>code]:py-0 [&_.syntax-highlighter-root>code]:shadow-none",
        "[&_.token]:font-mono [&_.token]:text-[0.8125rem]",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function Bubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = textFromUIMessage(message);
  if (!text.trim()) return null;
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] min-w-0 overflow-x-auto rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-[#003087] text-white"
            : "border border-border bg-card text-card-foreground",
        )}
      >
        <ChatMessageMarkdown text={text} isUser={isUser} />
      </div>
    </div>
  );
}

export function ChatPanel({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { messages, sendMessage, status, error, clearError } = useFortisChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-3", className)}>
      <ScrollArea
        className={cn(
          "min-h-0 flex-1 rounded-xl border border-border bg-muted/30 p-4",
          compact ? "h-[320px]" : "h-[min(560px,70vh)]",
        )}
      >
        <div className="flex flex-col gap-3 pr-2">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
            Ask about Fortis Edge, Orem/Marietta digital plants, Tier 3 &amp;
            4 portal paths, proofing targets, FlexLink, split shipping, or
            Radius / Infigo / LabelTraxx.
            </p>
          )}
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
          {busy && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Packaging Assistant is thinking…
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 pl-2 text-destructive"
                onClick={() => clearError()}
              >
                Dismiss
              </Button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your packaging question…"
          rows={compact ? 2 : 3}
          className="min-h-[44px] resize-none sm:flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          disabled={busy || !input.trim()}
          className="bg-[#003087] text-white hover:bg-[#003087]/90 sm:h-11"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
