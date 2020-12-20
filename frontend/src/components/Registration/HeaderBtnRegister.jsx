import React from "react";
import {Button, Tooltip} from "antd";
import Modal from "antd/es/modal/Modal";
import {LoginOutlined, LogoutOutlined, UserAddOutlined} from "@ant-design/icons";
import {LoginForm} from "./LoginForm";
import AuthService from "../../services/auth.service";
import {Redirect} from "react-router";
import {RegisterForm} from "./RegisterForm";


export class HeaderBtnRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: localStorage.getItem("username"),
            // redirect: null
        }
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    handleCancel = () => {
        this.setState({ modalVisible: false });
    };

    // handleLogout = () => {
    //     AuthService.logout();
    //     this.setState({redirect: true})
    // }


    render() {
        const { username, modalVisible } = this.state;

        // If username is set in localStorage hide button
        if (username) return null;

        // if (this.state.redirect) return (<Redirect to='/' />)

        return (
            <React.Fragment>
                <Button type="primary" onClick={this.showModal} style={{marginRight: "1rem"}}>
                    <UserAddOutlined />Register
                </Button>
                <Modal
                    title="Register form"
                    visible={modalVisible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <RegisterForm />
                </Modal>
            </React.Fragment>
        );
    }
}
