/*
Display a modal overlay with a message and optional confirm/cancel buttons.

Shows when `message` is truthy. If `onConfirm` is provided, renders
confirm and cancel buttons with given labels.
*/
const Modal = ({ message, onClose ,onConfirm,confirmLabel,cancelLabel}) => {
    return (
        <div className="modal-overlay" style={{ display: message ? 'flex' : 'none' }} onClick={onClose}>
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    {onConfirm && (
                        <>
                            <button className="modal-choice" onClick={onConfirm}>{confirmLabel}</button>
                            <button className="modal-choice" onClick={onClose}>{cancelLabel}</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Modal;