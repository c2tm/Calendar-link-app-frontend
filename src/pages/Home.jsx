import { useState } from "react";
import Form from "../components/Form";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../styles/Home.css";
import api from "../api.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal.jsx";

const Home = ({}) => {
    const [eventDetails, setEventDetails] = useState("");
    const [showLinkModal, setShowLinkModal] = useState("");
    const [showSubscribeModal, setShowSubscribeModal] = useState("");
    const [links, setLinks] = useState([]);
    const [google, setGoogle] = useState(false);
    const [ical, setIcal] = useState(false);
    const [showErrModal, setShowErrModal] = useState(false);
    const [errStatus, setErrStatus] = useState(false);
    const navigate = useNavigate();

    const handleCloseLinkModal = () => {
        setShowLinkModal(false);
        setLinks([]);
    }

    const handleLinkModal = () => {
        setShowLinkModal(true);
    }

    const handleCloseSubscribeModal = () => {
        setShowSubscribeModal(false);
    }

    const handleSubscribeModal = () => {
        setShowSubscribeModal(true);
    }

    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
    }

    const downloadLink = (link) => {
        const a = document.createElement('a');
        a.href = link;
        a.download = '';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const handleSubscribeButton = () => {
        // Placeholder for subscription handling when Stripe is implemented
        // window.open('https://whop.com/checkout/plan_Au6BIfRB3Pchr?d2c=true');
    }

    // test case: Concert at the Roxy September 25, 2025, 8:00 PM Organizer: Live Nation Price: $40
    async function handleSubmit(e) {
        e.preventDefault();

        const platformsToSend = [];

        if(google) platformsToSend.push('google_calendar')
        if(ical) platformsToSend.push('icalendar')

        const res = await api.post("/api/getEventLink/", {
                event_details: eventDetails,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                platforms: platformsToSend
        }).catch((error) => {
            const errorObj = typeof error.response.data === "string" ? JSON.parse(error.response.data) : error.response.data;
            if(!!errorObj['msg'] && errorObj['msg'] == "No free tokens remaining") {
                handleSubscribeModal();
            } else {
                const errorMsgElement = document.getElementById('error-msg');
                errorMsgElement.innerText = "Unexpected error occured; please refresh the page.";
                errorMsgElement.style.display = "block";
            }
        })

        if(!res) {
            return
        }

        const parsedResponse = JSON.parse(await res.data);

        if(!parsedResponse['links'] || Object.keys(parsedResponse['links']).length === 0) {
            setErrStatus("emptylinklist");
            setShowErrModal(!showErrModal);
            return;
        }

        setLinks(prevLinks => {
            const nextLinks = [...prevLinks];

            if(google) {
                const googleLink = parsedResponse['links']['google_calendar'];
                nextLinks.push({
                    linkType: "google",
                    link: googleLink,
                    icon: faCopy,
                    handler: copyLink
                })
            }

            if(ical) {
                const icalendarLink = parsedResponse['links']['icalendar'];
                nextLinks.push({
                    linkType: "icalendar",
                    link: icalendarLink,
                    icon: faFileExport,
                    handler: downloadLink
                })
            }

            return nextLinks;
        })

        handleLinkModal();
    }
    return <div className="home-container">
        <Modal backdrop='static' show={showSubscribeModal} onHide={handleCloseSubscribeModal} className='create-event-subscribe-modal'>
            <Modal.Body>
                <h2>Out of tokens!</h2>
                <p>This account is out of free tokens. Contact your representative for subscription options.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseSubscribeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal backdrop='static' show={showLinkModal} onHide={handleCloseLinkModal} className='create-event-link-modal'>
            
            <Modal.Body>
                <h2>Your event links:</h2>
                <div className="links-container">
                    {links.map((link, i) => {
                        return (
                            <div className="link-container">
                                <input
                                    id={`${link.linkType}-link-${i}`}
                                    key={`${link.linkType}-link-${i}`}
                                    className="link"
                                    type="url"
                                    value={link.link}
                                    readOnly
                                    onFocus={(e) => e.currentTarget.select()}
                                />
                                <button type="button" onClick={() => link.handler(link.link)}>{<FontAwesomeIcon icon={link.icon} />}</button>
                            </div>
                        )
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseLinkModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        <ErrorModal setShow={setShowErrModal} show={showErrModal} status={errStatus}/>

        <form className="event-creator-form" onSubmit={handleSubmit}>
            <textarea id="event-creator-form-textarea-1" onChange={(e) => { setEventDetails(e.currentTarget.value) }} placeholder="Enter event details here"></textarea>

            <Container className="link-option-container">
                <Row>
                    <Col className="link-option">
                        <label htmlFor="google-checkbox"><FontAwesomeIcon icon={faGoogle} /></label>
                        <input type="checkbox" name="google-checkbox" id="google-checkbox" onChange={() => { setGoogle(!google) }}/>
                    </Col>
                    <Col className="link-option">
                        <label htmlFor="ical-checkbox"><FontAwesomeIcon icon={faApple} /></label>
                        <input type="checkbox" name="ical-checkbox" id="ical-checkbox" onChange={() => { setIcal(!ical) }}/>
                    </Col>
                </Row>
            </Container>

            <Button type='submit'>
                Create Links
            </Button>

            <p className="error" id="error-msg"></p>
        </form>
    </div>
}

export default Home;