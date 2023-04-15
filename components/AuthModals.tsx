/*
* Created by Andrew Shipman
* 4/12/2023
*
* creates global layout used for all pages
*/
import { signIn, signOut } from "next-auth/react";

import { Modal, Input, Space } from "antd";
import { useCallback, useState } from "react";


type AuthModalsProps = {
    logInOpen: boolean;
    signUpOpen: boolean;
    onLogInCancel: () => void;
    onSignUpCancel: () => void;
}

const AuthModals = ({logInOpen, signUpOpen, onLogInCancel, onSignUpCancel}: AuthModalsProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const closeLoginForm = useCallback(() => {
        setUsername('');
        setPassword('');
        onLogInCancel();
    }, [onLogInCancel]);

    const onLoginSubmit = useCallback(async () => {
        const attempt = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
          });
        if (attempt?.ok) {
            closeLoginForm();
        }
    }, [closeLoginForm, password, username]);

    return (
        (
            <>
                <Modal title="Log In" open={logInOpen} onCancel={closeLoginForm} onOk={onLoginSubmit} okText={'Login'}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Input placeholder='Username' value={username} onChange={(e) => {setUsername(e.target.value);}}/>
                        <Input.Password placeholder='Password' value={password} onChange={(e) => {setPassword(e.target.value);}} />
                    </Space>
                </Modal>
                <Modal title="Sign Up" open={signUpOpen} onCancel={onSignUpCancel}>
                    <p>Signup</p>
                </Modal>
            </>
            
        )
    );
};

export default AuthModals;