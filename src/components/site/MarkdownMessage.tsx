import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-zinc-700/40 bg-zinc-950 text-zinc-100 font-mono text-xs sm:text-sm shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 text-xs">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-300">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 hover:text-zinc-100 transition-colors px-2 py-0.5 rounded bg-zinc-800/60 hover:bg-zinc-800"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3.5 leading-relaxed font-mono">
        <pre className="m-0 p-0 bg-transparent text-zinc-100 font-mono text-xs sm:text-sm leading-relaxed border-none">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground break-words prose-p:leading-relaxed prose-pre:m-0 prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks & inline code
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isBlock = match || codeString.includes("\n") || Boolean(className);

            if (isBlock) {
              return <CodeBlock language={match ? match[1] : ""} code={codeString} />;
            }

            return (
              <code
                className="bg-surface/80 dark:bg-zinc-800 text-foreground border border-hairline font-mono text-xs px-1.5 py-0.5 rounded-md break-words"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Professional Responsive Table
          table({ children }) {
            return (
              <div className="my-3.5 w-full overflow-x-auto rounded-xl border border-hairline bg-background shadow-xs">
                <table className="w-full text-left text-sm border-collapse divide-y divide-hairline">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-surface/90 text-foreground font-semibold text-xs uppercase tracking-wider">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-hairline bg-background/40">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-surface/50 transition-colors">{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="px-3.5 py-2.5 font-semibold text-foreground border-b border-hairline text-xs">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="px-3.5 py-2.5 text-foreground/90 text-sm">{children}</td>;
          },
          // Hyperlinks
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline font-medium break-all"
              >
                {children}
              </a>
            );
          },
          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-accent-blue/70 pl-3.5 py-1 my-3 text-ink-soft italic bg-surface/30 rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          // Headings
          h1({ children }) {
            return (
              <h1 className="text-xl font-bold mt-4 mb-2 text-foreground tracking-tight border-b border-hairline pb-1">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-lg font-bold mt-3.5 mb-1.5 text-foreground tracking-tight">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base font-semibold mt-3 mb-1 text-foreground">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-sm font-semibold mt-2.5 mb-1 text-foreground">
                {children}
              </h4>
            );
          },
          // Lists
          ul({ children }) {
            return <ul className="list-disc list-outside pl-5 my-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-outside pl-5 my-2 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          p({ children }) {
            return <p className="mb-2.5 last:mb-0 leading-relaxed break-words">{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
