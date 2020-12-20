import React from 'react';
import {Col, Row, Skeleton} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";
import QueueAnim from 'rc-queue-anim';
import Text from "antd/es/typography/Text";
import Texty from "rc-texty";
import {Header} from "antd/lib/layout/layout";
import Title from "antd/es/typography/Title";


export class Profile extends React.Component {
    state = {
        username: localStorage.getItem("username")
    };

    render() {
        const {username} = this.state

        return (
            <React.Fragment>

                <Row gutter={16}>
                    <QueueAnim component={Col} type="scaleY">
                        <Avatar key="avatar" shape="square" size={128} icon={<UserOutlined/>}/>
                    </QueueAnim>
                    <QueueAnim component={Col} type="scaleY">
                        {username ? <Title key="username"> {username} </Title> : <Skeleton/>}
                    </QueueAnim>
                </Row>

            </React.Fragment>
        );
    }
}