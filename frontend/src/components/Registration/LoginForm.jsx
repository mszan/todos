import React from "react";
import {Button, Form, Input, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import './Registration.css';
import AuthService from "../../services/auth.service";
import {Link} from "react-router-dom";

// Login form
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitBtnLoading: false
        };
    }

    loginForm = React.createRef();

    // On form submit
    onFinish = values => {
        // Set button loading state
        this.setState({submitBtnLoading: true})

        // Try to login user
        AuthService.login(values.username, values.password)

            // If login success, reload window
            .then(() => window.location.reload())

            // If login failed, display message and set new state for loading button
            .catch(err => {
                if (err.response.status === 401) {
                    console.log(`Login failed - username "${values.username}", code 401`)
                    message.error("Login failed") // Display an error
                    this.loginForm.current.resetFields(); // Reset form fields
                    setTimeout(() => this.setState({submitBtnLoading: false}), 1000) // Set timeout to prevent clicking again quick
                }
            })
    };

    render() {
        return (
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                ref={this.loginForm}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item style={{marginBottom: 0}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="formBtn"
                        loading={!!this.state.submitBtnLoading}
                    >
                        Login
                    </Button>
                    <div style={{marginTop: '1rem', textAlign: "center"}}>Don't have an account? <Link to="#" onClick={this.props.handleLoginRegisterModalSwitch}>Register now!</Link></div>
                </Form.Item>
            </Form>
        );
    }
}

export default LoginForm