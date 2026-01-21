import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ErrorModal = ({status, setShow, show}) => {
    const statusMessages = {
        401: "Your username or password was incorrect.",
        "Passnomatch": "Passwords do not match.",
        "emptylinklist": "No links were generated, please check your event details and try again.",
    }
    return (
        <Modal show={show} onHide={() => setShow(!show)} className='error-modal'>
            <Modal.Body>
                <p>{statusMessages[status]}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(!show)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ErrorModal;