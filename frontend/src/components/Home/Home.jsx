import React from 'react';
import {Col, Divider, Image, Row, Skeleton, Spin, Statistic, Typography} from "antd";
import axios from "axios";
import todosLogo from "./todosLogo.png"
import QueueAnim from "rc-queue-anim";

const {Title, Paragraph} = Typography

// Home (landing) page
export class Home extends React.Component {
    state = {
        tasks: {
            active: null, // Amount of active tasks
            completed: null, // Amount of completed tasks
            total: null // Amount of total tasks
        },
        users: {
            total: null // Amount of total users
        }
    }

    componentDidMount() {
        this.getPublicData()
    }

    // Fetch public data from server
    getPublicData = () => {
        const apiUrl = process.env.REACT_APP_API_URL + "public/"

        // Fetch users data
        axios.get(apiUrl + 'users')
            .then(response => {
                this.setState({
                    users: {
                        ...this.state.users,
                        total: response.data[0]['count']
                    }
                })
            })

        // Fetch tasks data
        axios.get(apiUrl + 'tasks?active=1')
            .then(response => {
                this.setState({
                    tasks: {
                        ...this.state.tasks,
                        active: response.data[0]['count']
                    }
                })
            })
            .catch(err => console.log(err))
            .then(() => {
                axios.get(apiUrl + 'tasks?active=0')
                    .then(response => {
                        this.setState({
                            tasks: {
                                ...this.state.tasks,
                                completed: response.data[0]['count']
                            }
                        })
                    })
                    .catch(err => console.log(err))
                    .then(() => {
                        this.setState({
                            tasks: {
                                ...this.state.tasks,
                                total: this.state.tasks.active + this.state.tasks.completed
                            }
                        })
                    })
            })
    }

    render() {
        return (
            <QueueAnim type="scaleY">
                <Row key="1" gutter={8}>
                    <Col span={24}>
                        <Title> Hi there! </Title>
                    </Col>
                </Row>
                <Row key="2" gutter={8}>
                    <Col span={24}>
                        <Paragraph>Orci nulla pellentesque dignissim enim sit amet. Arcu risus quis varius quam quisque id. Convallis a cras semper auctor neque vitae. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Tristique senectus et netus et malesuada. Ut morbi tincidunt augue interdum. Id volutpat lacus laoreet non. Interdum consectetur libero id faucibus nisl tincidunt. In pellentesque massa placerat duis ultricies. Semper quis lectus nulla at volutpat. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Amet facilisis magna etiam tempor orci eu lobortis elementum. A diam maecenas sed enim ut sem. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat.</ Paragraph>
                    </Col>
                </Row>
                <Row key="3" gutter={8} justify="space-around">
                    <Col style={{marginTop: 30, marginBottom: 30}}>
                        <Image
                            preview={false}
                            placeholder={<Spin/>}
                            src={todosLogo}
                        />
                    </Col>
                </Row>
                <Row key="5" gutter={8}>
                    <Divider />
                    <Col span={24}>
                        <Title> About us </Title>
                    </Col>
                    <Col span={6}>
                        {this.state.users.total || this.state.users.total === 0 ? <Statistic title="Total users" value={this.state.users.total}/> : <Spin />}
                    </Col>
                    <Col span={6}>
                        {this.state.tasks.total || this.state.tasks.total === 0 ? <Statistic title="Total tasks" value={this.state.tasks.total}/> : <Spin />}
                    </Col>
                    <Col span={6}>
                        {this.state.tasks.active || this.state.tasks.active === 0 ? <Statistic title="Active tasks" value={this.state.tasks.active}/> : <Spin />}
                    </Col>
                    <Col span={6}>
                        {this.state.tasks.completed || this.state.tasks.completed === 0 ? <Statistic title="Completed tasks" value={this.state.tasks.completed}/> : <Spin />}
                    </Col>
                </Row>
                <Row key="4" gutter={8} style={{marginTop: '1rem'}}>
                    <Col span={24}>
                        <Paragraph>Nulla at volutpat diam ut venenatis tellus. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi. Amet volutpat consequat  auctor elit sed vulputate mi sit. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae. Aliquet lectus proin nibh nisl condimentum id venenatis a. Suspendisse ultrices gravida dictum fusce ut placerat. Arcu felis bibendum ut tristique et egestas quis ipsum. Pellentesque diam volutpat commodo sed egestas egestas fringilla. Mattis nunc sed blandit libero volutpat. Ac placerat vestibulum lectus mauris ultrices. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Consectetur libero id faucibus nisl tincidunt. Faucibus purus in massa tempor nec feugiat nisl pretium.</Paragraph>
                        <Paragraph>Viverra vitae congue eu consequat ac felis donec et. Vitae semper quis lectus nulla at volutpat diam ut. Id porta nibh venenatis cras sed felis eget. Faucibus ornare suspendisse sed nisi. Posuere urna nec tincidunt praesent semper feugiat nibh sed.</Paragraph>
                    </Col>
                </Row>
            </QueueAnim>
        );
    }
}