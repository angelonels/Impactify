import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import '../styles/Modal.css';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={`modal-card modal-${size}`}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 6 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="modal-head">
                            <h3 className="modal-title">{title}</h3>
                            <button className="modal-x" onClick={onClose} aria-label="Close">
                                <X size={16} />
                            </button>
                        </header>
                        <div className="modal-body">{children}</div>
                        {footer && <footer className="modal-foot">{footer}</footer>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
