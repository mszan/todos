import React from 'react';
import {Col, Row, Statistic} from "antd";

export class Home extends React.Component {
    state = {
        totalTasks: null
    }

    componentDidMount() {
    }

    totalTasks = () => {
    }

    render() {
        return (
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Active Users" value={55}/>
                        <Statistic value={112893} loading/>

                    </Col>
                    <Col span={12}>
                        <Statistic title="Total tasks" value={112893}/>
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