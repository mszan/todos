import React from "react";
import {Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import './LoginForm.css';
import AuthService from "../../services/auth.service";

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onFinish = values => {
        AuthService.login(values.username, values.password).then(
            () => {
                window.location.reload();
            },
            error => {
                // const resMessage =
                //     (error.response &&
                //         error.response.data &&
                //         error.response.data.message) ||
                //     error.message ||
                //     error.toString();
                //
                // this.setState({
                //     loading: false,
                //     message: resMessage
                // });
            }
        );
    };

    render() {
        return (
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
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
                {/*<Form.Item>*/}
                {/*    <Form.Item name="remember" valuePropName="checked" noStyle>*/}
                {/*        <Checkbox>Remember me</Checkbox>*/}
                {/*    </Form.Item>*/}

                {/*    <a className="login-form-forgot" href="">*/}
                {/*        Forgot password*/}
                {/*    </a>*/}
                {/*</Form.Item>*/}

                <Form.Item style={{marginBottom: 0}}>
                    <Button type="primary" htmlType="submit" className="registrationFormBtn">
                        Login
                    </Button>
                    {/*<div style={{marginTop: '1rem'}}>Don't have an account? <a href="">Register now!</a></div>*/}
                </Form.Item>
            </Form>
        );
    }
}