import React from 'react';
import {Col, Row, Statistic, Spin} from "antd";
import axios from "axios";

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
                <Row gutter={16}>
                    <Col span={12}>
                        {totalUsers ? <Statistic title="Active users" value={totalUsers}/> : <Spin />}
                    </Col>
                    <Col span={12}>
                        {totalUsers ? <Statistic title="Total tasks" value={totalTasks}/> : <Spin />}
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                    </Col>
                    <Col span={12}>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}