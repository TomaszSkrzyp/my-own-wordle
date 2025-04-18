
const Modal = ({ message, onClose }) => {
    return (
        <div className="modal-overlay" style={{ display: message ? 'flex' : 'none' }} onClick={onClose}>
            <div className="modal-content">
                <p>{message}</p>
            </div>
        </div>
    );
};
export default Modal;