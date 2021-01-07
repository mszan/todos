import React from "react";
import {Button, Spin, Tooltip} from "antd";
import Modal from "antd/es/modal/Modal";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import AuthService from "../../services/auth.service";
import {Redirect} from "react-router";

const LoginForm = React.lazy(() => import('./LoginForm'));

// Login / logout user button
export class LoginBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: null // Redirect to home page?
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    // Logouts user
    handleLogout = () => {
        AuthService.logout()
        this.setState({redirect: true})
    }

    render() {
        const username = localStorage.getItem("username")

        // If user is logged in, display logout button
        if (username) {
            return (
                <React.Fragment>
                    <Tooltip placement="bottom" title="Logout">
                        <Button type="primary" onClick={this.handleLogout}>
                            {username} <LogoutOutlined/>
                        </Button>
                    </Tooltip>
                </React.Fragment>
            )
        }

        // Redirect to home page
        if (this.state.redirect) {
            return (<Redirect to='/' />)
        }

        // Login button with form
        return (
            <React.Fragment>
                <Button type="primary" onClick={this.props.handleVisible}>
                    <LoginOutlined />Login
                </Button>
                <Modal
                    title="Login form"
                    visible={this.props.visible}
                    onCancel={this.props.handleVisible}
                    footer={null}
                >
                    <React.Suspense fallback={<Spin />}>
                        <LoginForm handleLoginRegisterModalSwitch={this.props.handleLoginRegisterModalSwitch} />
                    </React.Suspense>
                </Modal>
            </React.Fragment>
        )
    }
}
