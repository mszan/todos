import React from 'react';
import {Col, Row, Skeleton, Statistic} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";
import AuthService from "../../services/auth.service";

export class Profile extends React.Component {
    state = {
        currentUser: AuthService.getCurrentUser()
    };

    render() {
        const {currentUser} = this.state

        return (
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={12}>
                        <Avatar shape="square" size={64} icon={<UserOutlined/>}/>
                        {currentUser ? currentUser.username : <Skeleton/>}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}