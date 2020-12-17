import React from "react";
import {Button, Tooltip} from "antd";
import Modal from "antd/es/modal/Modal";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import {LoginForm} from "./LoginForm";
import AuthService from "../../services/auth.service";
import classes from './HeaderBtn.module.css'
import {Redirect} from "react-router";


export class HeaderBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: localStorage.getItem("username"),
            redirect: null
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    handleCancel = () => {
        this.setState({ modalVisible: false });
    };

    handleLogout = () => {
        AuthService.logout();
        this.setState({redirect: true})
    }


    render() {
        const { username, modalVisible } = this.state;
        console.log(this.props)

        if (username) {
            return (
                <React.Fragment>
                    <Tooltip placement="bottom" title="Logout">
                        <Button type="primary" onClick={this.handleLogout} className={this.props.noStyle ? null : classes.headerBtn}>
                            {username} <LogoutOutlined/>
                        </Button>
                    </Tooltip>
                </React.Fragment>
            );
        }

        if (this.state.redirect) {
            return (<Redirect to='/' />)
        }

        return (
            <React.Fragment>
                <Button type="primary" onClick={this.showModal} className={this.props.noStyle ? null : classes.headerBtn}>
                    <LoginOutlined />Login
                </Button>
                <Modal
                    title="Login form"
                    visible={modalVisible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <LoginForm/>
                </Modal>
            </React.Fragment>
        );
    }
}
