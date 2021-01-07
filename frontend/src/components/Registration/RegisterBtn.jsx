import React from "react";
import {Button, Spin} from "antd";
import Modal from "antd/es/modal/Modal";
import {UserAddOutlined} from "@ant-design/icons";

const RegisterForm = React.lazy(() => import('./RegisterForm'));

// Register button that opens form
export class RegisterBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const username = localStorage.getItem("username")

        // If username is set in localStorage hide button
        if (username) return null;

        // if (this.state.redirect) return (<Redirect to='/' />)
        return (
            <React.Fragment>
                <Button type="primary" onClick={this.props.handleVisible} style={{marginRight: "1rem"}}>
                    <UserAddOutlined />Register
                </Button>
                <Modal
                    title="Register form"
                    visible={this.props.visible}
                    onCancel={this.props.handleVisible}
                    footer={null}
                >
                    <React.Suspense fallback={<Spin />}>
                        <RegisterForm handleLoginRegisterModalSwitch={this.props.handleLoginRegisterModalSwitch} />
                    </React.Suspense>
                </Modal>
            </React.Fragment>
        );
    }
}
