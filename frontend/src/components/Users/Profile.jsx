import React from 'react';
import {Col, Row, Skeleton} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";

export class Profile extends React.Component {
    state = {
        username: localStorage.getItem("username")
    };

    render() {
        const {username} = this.state

        return (
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={12}>
                        <Avatar shape="square" size={64} icon={<UserOutlined/>}/>
                        {username ? username : <Skeleton/>}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}