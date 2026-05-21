import Modal from './Modal';

/**
 * Branded confirm dialog. Drop-in replacement for window.confirm.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <ConfirmDialog open={open} onClose={() => setOpen(false)}
 *     title="Delete dataset?" message="This cannot be undone."
 *     confirmLabel="Delete" danger onConfirm={() => doIt()} />
 */
export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
    busy = false,
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button className="modal-btn" onClick={onClose} disabled={busy}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`modal-btn ${danger ? 'danger' : 'primary'}`}
                        onClick={onConfirm}
                        disabled={busy}
                    >
                        {busy ? 'Working…' : confirmLabel}
                    </button>
                </>
            }
        >
            {message && <p className="modal-message">{message}</p>}
        </Modal>
    );
}
