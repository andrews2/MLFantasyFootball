/*
* Created by Andrew Shipman
* 4/12/2023
*
* creates global layout used for all pages
*/
import { signIn } from "next-auth/react";

import { Modal, Input, Space, Form, Button } from "antd";
import { useCallback } from "react";


type AuthModalsProps = {
    logInOpen: boolean;
    signUpOpen: boolean;
    onLogInCancel: () => void;
    onSignUpCancel: () => void;
}

const AuthModals = ({logInOpen, signUpOpen, onLogInCancel, onSignUpCancel}: AuthModalsProps) => {

	const closeLoginForm = useCallback(() => {
		onLogInCancel();
	}, [onLogInCancel]);

	const onLoginSubmit = useCallback(async (values: Record<string, string>) => {
		const attempt = await signIn("credentials", {
			username: values.username,
			password: values.password,
			redirect: false,
		});
		if (attempt?.ok) {
			closeLoginForm();
		}
	}, [closeLoginForm]);

	return (
		(
			<>
				<Modal title="Login" open={logInOpen} footer={null}>
					<Form
						name="loginForm"
						style={{ width: '100%'}}
						onFinish={onLoginSubmit}
					>
						<Form.Item name="username">
							<Input placeholder='Username'/>
						</Form.Item>
						<Form.Item name="password">
							<Input.Password name="password" placeholder='Password'/>
						</Form.Item>
						<Form.Item>
							<Space>
								<Button type="primary" htmlType="submit">
									Login
								</Button>
								<Button htmlType="button" onClick={closeLoginForm}>
									Cancel
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Modal>
				<Modal title="Sign Up" open={signUpOpen} onCancel={onSignUpCancel}>
					<p>Signup</p>
				</Modal>
			</>
            
		)
	);
};

export default AuthModals;