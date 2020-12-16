import React from 'react';
import axios from "axios";
import {Button, Empty, List, message, Popconfirm} from "antd";
import authHeader from "../../services/auth-header";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import AddForm from "./AddForm";


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

    confirmTaskDelete = taskId => {
        axios.delete(`http://localhost:5000/api/tasks/${taskId}`, { headers: authHeader() })
            .then(response => {
                message.info('Task deleted');

                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === taskId);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            .catch(err => {
                message.error('Something went wrong...');
                console.log(err)
            })
    }

    render() {
        return (
            <>
                <List
                    locale={{
                        emptyText:
                            <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                imageStyle={{height: 60}}
                                description={<span>You don't have any active tasks. Want to create one?</span>}
                            >
                                <AddForm
                                    handleTasksRefresh={this.handleTasksRefresh}
                                />
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
                                <Popconfirm
                                    title="You sure?"
                                    onConfirm={() => this.confirmTaskDelete(item.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <a href="#"><DeleteOutlined /></a>
                                </Popconfirm>
                            </div>
                        </List.Item>
                    )}
                />
            </>
        );
    }
}