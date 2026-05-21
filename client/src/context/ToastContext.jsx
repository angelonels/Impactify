import { createContext, useCallback, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import '../styles/Toast.css';

const ToastContext = createContext(null);

const ICONS = {
    success: CheckCircle2,
    error:   AlertCircle,
    info:    Info,
};

let nextId = 1;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    }, []);

    const show = useCallback((message, opts = {}) => {
        const id = nextId++;
        const variant = opts.variant || 'info';
        const duration = opts.duration ?? 3200;
        setToasts((prev) => [...prev, { id, message, variant }]);
        if (duration > 0) {
            timers.current[id] = setTimeout(() => remove(id), duration);
        }
        return id;
    }, [remove]);

    const api = useMemo(() => ({
        show,
        success: (m, o) => show(m, { ...o, variant: 'success' }),
        error:   (m, o) => show(m, { ...o, variant: 'error', duration: 5000 }),
        info:    (m, o) => show(m, { ...o, variant: 'info' }),
        dismiss: remove,
    }), [show, remove]);

    useEffect(() => () => {
        Object.values(timers.current).forEach(clearTimeout);
    }, []);

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="toast-stack" aria-live="polite">
                <AnimatePresence initial={false}>
                    {toasts.map(({ id, message, variant }) => {
                        const Icon = ICONS[variant] || Info;
                        return (
                            <motion.div
                                key={id}
                                layout
                                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                className={`toast toast-${variant}`}
                            >
                                <Icon size={16} className="toast-icon" />
                                <span className="toast-msg">{message}</span>
                                <button
                                    className="toast-close"
                                    onClick={() => remove(id)}
                                    aria-label="Dismiss"
                                >
                                    <X size={12} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}
