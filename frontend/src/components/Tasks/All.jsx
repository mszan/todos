import React from 'react';
import axios from "axios";
import {Button, Divider, Empty, List, message, notification, Popconfirm, Tooltip} from "antd";
import authHeader from "../../services/auth-header";
import {CheckOutlined, CloseOutlined, DeleteOutlined, PlusOutlined, SmileOutlined} from "@ant-design/icons";
import AddForm from "./AddForm";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";


export class All extends React.Component {
    state = {
        tasks: []
    }

    componentDidMount() {
        this.handleTasksRefresh()
    }

    handleTasksRefresh = () => {
        console.log(this.state)
        this.getTasks(res => {
            this.setState({
                tasks: res.results,
            });
        });
        console.log(this.state)
    }

    getTasks = () => {
        axios.get('http://localhost:5000/api/tasks/', { headers: authHeader() })
            .then(response => {
                this.setState({tasks: response.data})
            })
            .catch(err => {console.log(err)});
    };

    confirmTaskDelete = task => {
        axios.delete(`http://localhost:5000/api/tasks/${task.id}`, { headers: authHeader() })
            .then(response => {
                notification.success({
                    message: 'Task deleted',
                    placement: 'bottomRight'
                });

                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            .catch(err => {
                notification.error({
                    message: 'Error deleting task',
                    placement: 'bottomRight'
                });
                console.log(err)
            })
    }

    render() {
        return (
            <>
                {this.state.tasks.length > 0 ?
                    <React.Fragment>
                        <AddForm handleTasksRefresh={this.handleTasksRefresh} noText alignRight/>
                        <Divider />
                    </React.Fragment>
                    : null}
                <List
                    locale={{
                        emptyText:
                            <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                imageStyle={{height: 60}}
                                description={<span>You don't have any active tasks. Want to create one?</span>}
                            >
                                <AddForm handleTasksRefresh={this.handleTasksRefresh}/>
                            </Empty>
                    }}
                    itemLayout="horizontal"
                    dataSource={this.state.tasks}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={item.description}
                            />
                            <div>
                                <Tooltip title="Mark as completed">
                                    <a href="#"><CheckOutlined /></a>
                                </Tooltip>
                                <Divider type="vertical" />
                                <Popconfirm
                                    title="You sure?"
                                    onConfirm={() => this.confirmTaskDelete(item)}
                                    okText={<CheckOutlined />}
                                    cancelText={<CloseOutlined />}
                                    placement="left"
                                >
                                    <Tooltip title="Delete">
                                        <a href="#"><DeleteOutlined /></a>
                                    </Tooltip>
                                </Popconfirm>
                            </div>
                        </List.Item>
                    )}
                />
            </>
        );
    }
}