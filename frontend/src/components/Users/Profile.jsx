import React from 'react';
import {Col, Divider, Row, Skeleton} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";
import QueueAnim from 'rc-queue-anim';
import Title from "antd/es/typography/Title";
import axios from "axios";
import authHeader from "../../services/auth-header";
import Paragraph from "antd/es/typography/Paragraph";
import moment from "moment";

// User profile page
export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: "",
                firstname: "",
                lastname: "",
                registerDate: ""
            }
        }
    }

    componentDidMount() {
        this.fetchUser(localStorage.getItem("username"))
    }

    // Fetch user information from server
    fetchUser = username => {
        // Send request
        axios.get(process.env.REACT_APP_API_URL + `users?username=${username}`, {headers: authHeader()})
            .then(response => {
                // Set state with user data from response
                this.setState({
                    user: response.data[0]
                })
            })
            // Catch errors
            .catch(err => console.log(err))
    }

    render() {

        return (
            <React.Fragment>
                <Row gutter={16}>
                    <QueueAnim component={Col} type="scaleY">
                        <Avatar key="avatar" shape="square" size={128} icon={<UserOutlined/>}/>
                    </QueueAnim>
                    <QueueAnim component={Col} type="scaleY">
                        {this.state.user.username ? <Title key="username" level={1}> {this.state.user.username} </Title> : null}
                        {this.state.user.firstname && this.state.user.lastname ? <Title key="fullName" level={5}> {this.state.user.firstname} {this.state.user.lastname} </Title> : null}
                        {this.state.user.registerDate ? <Paragraph key="registerDate"> Joined {moment(this.state.user.registerDate).fromNow()} </Paragraph> : null}
                    </QueueAnim>
                </Row>
                <Row gutter={16}>
                    <QueueAnim component={Col} componentProps={{span: 24}} type="scaleY">
                        <Divider key="headerDivider"/>
                    </QueueAnim>
                </Row>
            </React.Fragment>
        );
    }
}