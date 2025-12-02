import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "../utils/cn";

// --- Sub-components (Mocking @/components/prompt-kit/prompt-input) ---

const PromptInput = ({ value, onValueChange, isLoading, onSubmit, className, children }) => {
  return (
    <div className={cn("flex flex-col w-full border rounded-xl bg-white shadow-sm overflow-hidden", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange, onSubmit, isLoading });
        }
        return child;
      })}
    </div>
  );
};

const PromptInputTextarea = ({ value, onValueChange, onSubmit, placeholder, className }) => {
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    onValueChange(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={cn(
        "w-full resize-none border-none bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-0 min-h-[60px] max-h-[200px] text-black placeholder:text-gray-400",
        className
      )}
      rows={1}
    />
  );
};

const PromptInputActions = ({ className, children }) => {
  return <div className={cn("flex items-center p-2 bg-white", className)}>{children}</div>;
};

const PromptInputAction = ({ children, tooltip }) => {
  return (
    <div title={tooltip} className="flex items-center">
      {children}
    </div>
  );
};

// --- Button Component (Mocking @/components/ui/button) ---

const Button = ({ variant = "default", size = "default", className, children, ...props }) => {
  const variants = {
    default: "bg-black text-white hover:bg-gray-800",
    ghost: "hover:bg-gray-100 text-gray-600",
    icon: "p-0 flex items-center justify-center",
  };
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Main Component ---

export function PromptInputBasic({ onSubmit }) { // Added onSubmit prop to lift state up if needed, or use internal
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If the parent passes an onSubmit handler, use it. Otherwise use local simulation.
  const handleSubmit = () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    if (onSubmit) {
        // If parent provided onSubmit, await it (if promise) or just run it
        Promise.resolve(onSubmit(input)).then(() => {
            setIsLoading(false);
            setInput("");
        }).catch(() => {
            setIsLoading(false);
        });
    } else {
        // Local simulation as per user request code
        setTimeout(() => {
            setIsLoading(false);
            setInput("");
        }, 2000);
    }
  };

  const handleValueChange = (value) => {
    setInput(value);
  };

  return (
    <PromptInput
      value={input}
      onValueChange={handleValueChange}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto border-gray-200" // Adjusted max-w to be reasonable
    >
      <PromptInputTextarea placeholder="Ask me anything..." />
      <PromptInputActions className="justify-end pt-2 border-t border-gray-100">
        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
