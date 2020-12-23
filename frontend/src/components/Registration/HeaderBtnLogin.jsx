import React from "react";
import {Button, Spin, Tooltip} from "antd";
import Modal from "antd/es/modal/Modal";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import AuthService from "../../services/auth.service";
import {Redirect} from "react-router";

const LoginForm = React.lazy(() => import('./LoginForm'));


export class HeaderBtnLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: null
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout = () => {
        AuthService.logout()
        this.setState({redirect: true})
    }

    render() {
        const username = localStorage.getItem("username")

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

        if (this.state.redirect) {
            return (<Redirect to='/' />)
        }

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
