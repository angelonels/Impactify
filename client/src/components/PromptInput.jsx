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

const Select = ({ value, onValueChange, children, ...props }) => {
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
      <div ref={containerRef} className="relative" {...props}>
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
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

const SelectValue = ({ className, ...props }) => {
  const { value } = useContext(SelectContext);
  // This is a simplification; ideally we'd map value to label. 
  // For now, we assume the parent handles display or we just show value.
  // But the user's code uses <PromptInputModelSelectValue /> which usually displays the selected label.
  // We'll rely on the children of SelectTrigger usually containing the value, but here SelectValue is used.
  // We'll just render the value for now, or we need a way to get the label.
  // The user's example passes children to Item.
  // We can't easily get the label without traversing children or passing options.
  // Let's just render the value (capitalized or as is) for simplicity, or rely on the user to pass a placeholder if empty.
  return <span className={className}>{value}</span>;
};

const SelectContent = ({ className, children, ...props }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-black shadow-md animate-in fade-in-80",
        "bottom-full mb-2", // Position above by default for prompt input
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

const SelectItem = ({ className, children, value, ...props }) => {
  const { onValueChange, setOpen, value: selectedValue } = useContext(SelectContext);
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        selectedValue === value && "bg-gray-100 font-medium",
        className
      )}
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {selectedValue === value && <span className="h-2 w-2 rounded-full bg-black" />}
      </span>
      {children}
    </div>
  );
};


// --- PromptInput Components ---

export const PromptInput = ({ className, ...props }) => (
  <form
    className={cn(
      'w-full divide-y overflow-hidden rounded-xl border bg-white shadow-sm',
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
        'w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0',
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

export const PromptInputToolbar = ({ className, ...props }) => (
  <div
    className={cn('flex items-center justify-between p-1 border-t border-gray-100', className)}
    {...props}
  />
);

export const PromptInputTools = ({ className, ...props }) => (
  <div
    className={cn(
      'flex items-center gap-1',
      '[&_button:first-child]:rounded-bl-xl',
      className
    )}
    {...props}
  />
);

export const PromptInputButton = ({
  variant = 'ghost',
  className,
  size,
  children,
  ...props
}) => {
  const newSize = (size ?? React.Children.count(children) > 1) ? 'default' : 'icon';
  return (
    <Button
      className={cn(
        'shrink-0 gap-1.5 rounded-lg',
        variant === 'ghost' && 'text-gray-500 hover:text-black',
        newSize === 'default' && 'px-3',
        className
      )}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
};

export const PromptInputSubmit = ({
  className,
  variant = 'default',
  size = 'icon',
  status,
  children,
  ...props
}) => {
  let Icon = <Send className="size-4" />;
  if (status === 'submitted') {
    Icon = <Loader2 className="size-4 animate-spin" />;
  } else if (status === 'streaming') {
    Icon = <Square className="size-4" />;
  } else if (status === 'error') {
    Icon = <X className="size-4" />;
  }
  return (
    <Button
      className={cn('gap-1.5 rounded-lg bg-black text-white hover:bg-gray-800', className)}
      size={size}
      type="submit"
      variant={variant}
      {...props}
    >
      {children ?? Icon}
    </Button>
  );
};

export const PromptInputModelSelect = (props) => (
  <Select {...props} />
);

export const PromptInputModelSelectTrigger = ({ className, ...props }) => (
  <SelectTrigger
    className={cn(
      'border-none bg-transparent font-medium text-gray-500 shadow-none transition-colors',
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
