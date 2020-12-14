import React from 'react';
import {Col, Row, Statistic, Spin, Typography, Image, Skeleton, Divider} from "antd";
import axios from "axios";
import todosLogo from "./todosLogo.png"

const {Title, Paragraph} = Typography

export class Home extends React.Component {
    state = {
        totalTasks: null,
        totalUsers: null,
    }

    componentDidMount() {
        this.getPublicData()
    }

    getPublicData = () => {
        const apiUrl = 'http://localhost:5000/api/public/'
        axios.get(apiUrl + 'users')
            .then(response => {
                this.setState({totalUsers: response.data[0]['count']})
            })

        axios.get(apiUrl + 'tasks')
            .then(response => {
                this.setState({totalTasks: response.data[0]['count']})
            })
    }

    render() {
        const {totalTasks, totalUsers} = this.state
        return (
            <React.Fragment>
                <Row gutter={8}>
                    <Col span={24}>
                        <Title> Hi there! </Title>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Paragraph>Orci nulla pellentesque dignissim enim sit amet. Arcu risus quis varius quam quisque id. Convallis a cras semper auctor neque vitae. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Tristique senectus et netus et malesuada. Ut morbi tincidunt augue interdum. Id volutpat lacus laoreet non. Interdum consectetur libero id faucibus nisl tincidunt. In pellentesque massa placerat duis ultricies. Semper quis lectus nulla at volutpat. Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Amet facilisis magna etiam tempor orci eu lobortis elementum. A diam maecenas sed enim ut sem. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat.</ Paragraph>
                    </Col>
                </Row>
                <Row gutter={8} justify="space-around">
                    <Col style={{marginTop: 30, marginBottom: 30}}>
                        <Image
                            src={todosLogo}
                        />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Paragraph>Nulla at volutpat diam ut venenatis tellus. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi. Amet volutpat consequat  auctor elit sed vulputate mi sit. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae. Aliquet lectus proin nibh nisl condimentum id venenatis a. Suspendisse ultrices gravida dictum fusce ut placerat. Arcu felis bibendum ut tristique et egestas quis ipsum. Pellentesque diam volutpat commodo sed egestas egestas fringilla. Mattis nunc sed blandit libero volutpat. Ac placerat vestibulum lectus mauris ultrices. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Consectetur libero id faucibus nisl tincidunt. Faucibus purus in massa tempor nec feugiat nisl pretium.</Paragraph>
                        <Paragraph>Viverra vitae congue eu consequat ac felis donec et. Vitae semper quis lectus nulla at volutpat diam ut. Id porta nibh venenatis cras sed felis eget. Faucibus ornare suspendisse sed nisi. Posuere urna nec tincidunt praesent semper feugiat nibh sed.</Paragraph>
                        <Divider />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Title> About us </Title>
                    </Col>
                    <Col span={6}>
                        <Statistic title="Active users" value={999}/>
                    </Col>
                    <Col span={6}>
                        {totalUsers ? <Statistic title="Total users" value={totalUsers}/> : <Spin />}
                    </Col>
                    <Col span={6}>
                        <Statistic title="Active tasks" value={999}/>
                    </Col>
                    <Col span={6}>
                        {totalUsers ? <Statistic title="Total tasks" value={totalTasks}/> : <Spin />}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}