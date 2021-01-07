import React from 'react';
import {Col, Divider, Row, Skeleton, Spin, Statistic} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";
import QueueAnim from 'rc-queue-anim';
import Title from "antd/es/typography/Title";
import axios from "axios";
import authHeader from "../../services/auth-header";
import Paragraph from "antd/es/typography/Paragraph";
import moment from "moment";
import TasksSummaryChart from "./Chart";

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
            },
            tasks: {
                fetched: false,
                data: "",
                total: ""
            },
            chart: {}
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
            .then(this.fetchTasks)
    }

    // Fetch tasks from server
    fetchTasks = () => {
        // Send request
        axios.get(process.env.REACT_APP_API_URL + 'tasks', {headers: authHeader()})
            .then(response => {
                const totalTasks = response.data.length
                // Set state with tasks from response
                this.setState({
                    tasks: {
                        ...this.state.tasks,
                        fetched: true,
                        data: response.data,
                        total: response.data.length
                    }
                })
            })
            // Catch errors
            .catch(err => {
                console.log(err)
            })
            .then(this.getChartData)
    }

    getChartData = async () => {
        const today = moment()
        let registerDate = moment(this.state.user.registerDate)

        let dataKeys = ['addDate', 'completeDate']
        let finalData = [
            {
                label: 'Tasks added',
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgb(24,144,255)',
                pointBackgroundColor: 'rgba(24,144,255)',
                pointRadius: 0,
                fill: false,
                data: []
            },
            {
                label: 'Tasks completed',
                backgroundColor: 'rgb(0,0,0,0)',
                borderColor: 'rgb(205,104,104)',
                pointBackgroundColor: 'rgba(205,104,104)',
                pointRadius: 0,
                fill: false,
                data: []
            },
        ]

        // Loop every day since user was registered
        for (registerDate; registerDate.isBefore(today); registerDate.add(1, "days")) {
            // Loop every dateType
            for (const key of dataKeys) {
                // Get data for specific dateType from server
                await axios.get(process.env.REACT_APP_API_URL + `tasks?${key}=${registerDate.format("YYYY-MM-DD")}`, {headers: authHeader()})
                    .then(response => {
                        if (key === 'addDate') {
                            finalData[0]['data'].push({x: registerDate.format("YYYY-MM-DD"), y: response.data.length})
                        } else {
                            finalData[1]['data'].push({x: registerDate.format("YYYY-MM-DD"), y: response.data.length})
                            // finalData[1]['data'].push([registerDate, response.data.length])
                        }
                    })
            }
        }
        await this.setState({chart: {tasksData: finalData}})
    }

    render() {
        return (
            <React.Fragment>
                <Row gutter={16}>
                    <QueueAnim component={Col} type="scaleY">
                        <Avatar key="avatar" shape="square" size={128} icon={<UserOutlined/>}/>
                    </QueueAnim>
                    <QueueAnim component={Col} type="scaleY">
                        {this.state.user.username ?
                            <Title key="username" level={1}> {this.state.user.username} </Title> : null}
                        {this.state.user.firstname && this.state.user.lastname ? <Title key="fullName"
                                                                                        level={5}> {this.state.user.firstname} {this.state.user.lastname} </Title> : null}
                        {this.state.user.registerDate ? <Paragraph
                            key="registerDate"> Joined {moment(this.state.user.registerDate).fromNow()} </Paragraph> : null}
                    </QueueAnim>
                </Row>
                <Row gutter={16}>
                    <QueueAnim component={Col} componentProps={{span: 24}} type="scaleY">
                        <Divider key="headerDivider"/>
                    </QueueAnim>
                </Row>
                <Row gutter={16}>
                    <Title level={4}>Tasks summary</Title>
                    <QueueAnim component={Col} componentProps={{span: 24}} type="scaleY">
                        {this.state.chart.tasksData ?
                            <TasksSummaryChart tasksData={this.state.chart.tasksData}/> : <Skeleton active paragraph={{rows: 8, width: '100%'}} title={false}/>}
                    </QueueAnim>
                </Row>
            </React.Fragment>
        );
    }
}