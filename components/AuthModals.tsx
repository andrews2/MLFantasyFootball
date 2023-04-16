/*
* Created by Andrew Shipman
* 4/12/2023
*
* creates global layout used for all pages
*/
import { signIn } from "next-auth/react";

import { Modal, Input, Space, Typography } from "antd";
import { useCallback, useState } from "react";


type AuthModalsProps = {
    logInOpen: boolean;
    signUpOpen: boolean;
    onLogInCancel: () => void;
    onSignUpCancel: () => void;
}

const { Text } = Typography;

const AuthModals = ({logInOpen, signUpOpen, onLogInCancel, onSignUpCancel}: AuthModalsProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState('');

    const closeLoginForm = useCallback(() => {
        setUsername('');
        setPassword('');
        setErrorText('');
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
        } else if (attempt?.error) (
            setErrorText('Login credentials were incorrect.')
        );
    }, [closeLoginForm, password, username]);

    return (
        (
            <>
                <Modal title="Log In" open={logInOpen} onCancel={closeLoginForm} onOk={onLoginSubmit} okText={'Log in'} okButtonProps={{disabled: !username || !password}}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Input name="username" placeholder='Username' value={username} onChange={(e) => {setUsername(e.target.value);}}/>
                        <Input.Password name="password" placeholder='Password' value={password} onChange={(e) => {setPassword(e.target.value);}} />
                        <Text type="danger">{errorText}</Text>
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