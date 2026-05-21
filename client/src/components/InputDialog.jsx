import { useEffect, useState } from 'react';
import Modal from './Modal';

/**
 * Branded prompt dialog. Drop-in replacement for window.prompt.
 *
 * Usage:
 *   <InputDialog
 *     open={open}
 *     onClose={close}
 *     title="New dashboard"
 *     label="Name"
 *     placeholder="Q4 KPIs"
 *     defaultValue=""
 *     confirmLabel="Create"
 *     onConfirm={async (value) => { ... }}
 *   />
 */
export default function InputDialog({
    open,
    onClose,
    onConfirm,
    title,
    label,
    placeholder,
    defaultValue = '',
    confirmLabel = 'Save',
    busy = false,
    multiline = false,
    maxLength,
}) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (open) setValue(defaultValue ?? '');
    }, [open, defaultValue]);

    const submit = () => {
        const trimmed = value.trim();
        if (!trimmed) return;
        onConfirm?.(trimmed);
    };

    const onKey = (e) => {
        if (e.key === 'Enter' && !multiline && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button className="modal-btn" onClick={onClose} disabled={busy}>
                        Cancel
                    </button>
                    <button
                        className="modal-btn primary"
                        onClick={submit}
                        disabled={busy || !value.trim()}
                    >
                        {busy ? 'Working…' : confirmLabel}
                    </button>
                </>
            }
        >
            {label && <label className="modal-label">{label}</label>}
            {multiline ? (
                <textarea
                    className="modal-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKey}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={3}
                    autoFocus
                />
            ) : (
                <input
                    type="text"
                    className="modal-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKey}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoFocus
                />
            )}
        </Modal>
    );
}
