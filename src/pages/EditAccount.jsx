import { useState, useEffect } from "react";
import api from "../api.js";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import "../styles/EditAccount.css";

const EditAccount = ({ userInfo, setUserInfo }) => {
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo.username || "");
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (!currentPassword) {
            setError("Please enter your current password to make changes.");
            setLoading(false);
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const body = {
                username,
                current_password: currentPassword,
            };

            if (newPassword) {
                body.password = newPassword;
            }

            const res = await api.patch(`/api/getOrUpdateUser/${userInfo.id}/`, body);
            setUserInfo({ ...userInfo, username: res.data.username });
            setMessage("Account updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data?.current_password || "Failed to update account.");
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        return <div>Loading user info...</div>;
    }

    return (
        <form className="account-edit-form" onSubmit={handleSubmit}>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <InputGroup className="mb-3">
                <InputGroup.Text>Email</InputGroup.Text>
                <Form.Control
                    placeholder="Username"
                    aria-label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </InputGroup>

            <div className="divider-line"></div>

            <InputGroup className="mb-3">
                <InputGroup.Text>New Password</InputGroup.Text>
                <div className="scrolling-placeholder-wrapper">
                    <Form.Control
                        type="password"
                        aria-label="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="scrolling-placeholder-input"
                    />
                    {!newPassword && (
                        <div className="scrolling-placeholder">
                            <span>Leave blank to keep current password</span>
                        </div>
                    )}
                </div>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text>Confirm Password</InputGroup.Text>
                <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    aria-label="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </InputGroup>

            <div className="divider-line"></div>

            <InputGroup className="mb-3">
                <InputGroup.Text>Current Password</InputGroup.Text>
                <Form.Control
                    type="password"
                    placeholder="Current password"
                    aria-label="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
            </InputGroup>

            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </Button>
        </form>
    );
};

export default EditAccount;