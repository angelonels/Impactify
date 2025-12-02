import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Loader2, Send, Square, X, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

// --- Simplified UI Components ---

// Button
const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-black text-white hover:bg-gray-800",
    ghost: "hover:bg-gray-100 text-gray-600",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Textarea
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// Select (Simplified Context-based)
const SelectContext = createContext(null);

const Select = ({ value, onValueChange, children, className, ...props }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={containerRef} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ className, children, ...props }) => {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
    </button>
  );
};

// ... (SelectValue, SelectContent, SelectItem remain same)

// --- PromptInput Components ---

export const PromptInput = ({ className, ...props }) => (
  <form
    className={cn(
      'w-full divide-y overflow-hidden rounded-xl border bg-white text-black shadow-sm',
      className
    )}
    {...props}
  />
);

export const PromptInputTextarea = ({
  onChange,
  className,
  placeholder = 'What would you like to know?',
  minHeight = 48,
  maxHeight = 164,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };
  return (
    <Textarea
      className={cn(
        'w-full resize-none rounded-none border-none p-4 shadow-none outline-none ring-0',
        'field-sizing-content max-h-[6lh] bg-transparent focus-visible:ring-0 text-black placeholder:text-gray-400',
        className
      )}
      name="message"
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
};

// ... (PromptInputToolbar, PromptInputTools, PromptInputButton, PromptInputSubmit remain same)

export const PromptInputModelSelect = (props) => (
  <Select {...props} />
);

export const PromptInputModelSelectTrigger = ({ className, ...props }) => (
  <SelectTrigger
    className={cn(
      'w-auto border-none bg-transparent font-medium text-gray-500 shadow-none transition-colors',
      'hover:bg-gray-100 hover:text-black [&[aria-expanded="true"]]:bg-gray-100 [&[aria-expanded="true"]]:text-black',
      className
    )}
    {...props}
  />
);

export const PromptInputModelSelectContent = ({ className, ...props }) => (
  <SelectContent className={cn(className)} {...props} />
);

export const PromptInputModelSelectItem = ({ className, ...props }) => (
  <SelectItem className={cn(className)} {...props} />
);

export const PromptInputModelSelectValue = ({ className, ...props }) => (
  <SelectValue className={cn(className)} {...props} />
);
