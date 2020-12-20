import React from "react";
import {Button, Checkbox, Divider, Form, Input, notification} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import AuthService from "../../services/auth.service";
import {Link} from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/";


export class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onFinish = values => {
        // Send register data to server
        axios.post(API_URL + "register", {
            username: values.username,
            password: values.password,
            email: values.email,
            firstname: values.firstname ? values.firstname : null,
            lastname: values.lastname ? values.lastname : null,
        })
            .then(res => {
                // Login user and reload page
                AuthService.login(values.username, values.password).then(() => window.location.reload());
            })
            // Catch errors and display notification
            .catch(err => {
                notification.error({
                    message: 'Error',
                    placement: 'bottomLeft'
                });
                console.log(err)
            })
    };

    render() {
        const layout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const tailLayout = {
            wrapperCol: {
                span: 24,
            },
        }

        return (
            <React.Fragment>
                <Form
                    {...layout}
                    name="registerForm"
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please enter your username.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail.',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail.',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password.'
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password.',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject('The two passwords that you entered do not match.');
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        name="firstname"
                        label="Firstname"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="lastname"
                        label="Lastname"
                    >
                        <Input />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        {...tailLayout}
                        style={{textAlign: "center"}}
                        name="agreeRules"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject('Should accept agreement'),
                            },
                        ]}
                        valuePropName="checked"
                    >
                        <Checkbox>I have read the <Link to="#">agreement</Link></Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout} style={{marginBottom: 0}}>
                        <Button type="primary" htmlType="submit" className="registrationFormBtn">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <Divider />
                <div style={{marginTop: '1rem', textAlign: "center"}}>Already have an account? <Link href="">Login here!</Link></div>
            </React.Fragment>
        );
    }
}