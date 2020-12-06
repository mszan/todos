import React from 'react';
import {Col, Row, Skeleton, Statistic} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";

export const UsersProfile = () => {
    return (
        <React.Fragment>
            <Row gutter={16}>
                <Col span={12}>
                    <Avatar shape="square" size={64} icon={<UserOutlined />} />
                    <Skeleton />
                </Col>
            </Row>
        </React.Fragment>
    );
};