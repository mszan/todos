import React from 'react';
import axios from "axios";
import moment from "moment"
import {Button, Divider, Empty, List, message, notification, Popconfirm, Spin, Tooltip} from "antd";
import authHeader from "../../services/auth-header";
import {
    CheckOutlined, ClockCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    LoadingOutlined,
    PlusOutlined,
    SmileOutlined
} from "@ant-design/icons";
import AddForm from "./AddForm";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import {Link} from "react-router-dom";


export class All extends React.Component {
    state = {
        tasks: [],
        tasksFetched: false
    }

    componentDidMount() {
        this.handleTasksRefresh()
    }

    handleTasksRefresh = () => {
        this.getTasks(res => {
            this.setState({
                tasks: res.results,
            });
        });
    }

    getTasks = () => {
        axios.get('http://localhost:5000/api/tasks/', {headers: authHeader()})
            .then(response => {
                this.setState({
                    tasks: response.data,
                    tasksFetched: true
                })
            })
            .catch(err => {
                console.log(err)
            });
    };

    confirmTaskDelete = task => {
        axios.delete(`http://localhost:5000/api/tasks/${task.id}`, {headers: authHeader()})
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

    handleTaskComplete = task => {
        axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
                active: "0",
                completeDate: moment().format('YYYY-MM-DD HH:mm:ss')
            }, {headers: authHeader()})
            .then(response => {
                notification.success({
                    message: 'Task marked as completed',
                    placement: 'bottomRight'
                });

                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            .catch(err => {
                notification.error({
                    message: 'Error marking task complete',
                    placement: 'bottomRight'
                });
                console.log(err)
            })
    }

    render() {
        return (
            <>
                {this.state.tasks.length > 0 && this.state.tasksFetched ?
                    <React.Fragment>
                        <AddForm handleTasksRefresh={this.handleTasksRefresh} noText alignRight/>
                        <Divider/>
                    </React.Fragment>
                    : null}
                <List
                    locale={{
                        emptyText:
                            this.state.tasksFetched ?
                                <Empty
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{height: 60}}
                                    description={<span>You don't have any active tasks. Want to create one?</span>}
                                >
                                    <AddForm handleTasksRefresh={this.handleTasksRefresh}/>
                                </Empty> : <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>} size="large"
                                                 tip="Fetching tasks..."/>
                    }}
                    itemLayout="horizontal"
                    dataSource={this.state.tasks}
                    renderItem={item => (
                        <List.Item
                            extra={
                                <React.Fragment>
                                    {item.dueDate ?
                                        <React.Fragment>
                                            <Text type="secondary" style={{color: "#bfc0c4"}}>
                                                <ClockCircleOutlined /> {moment(item.dueDate).format('DD MMM YYYY')}
                                            </Text>
                                            <Divider type="vertical"/>
                                        </React.Fragment>
                                        : null}
                                    <Popconfirm
                                        title="Delete task?"
                                        onConfirm={() => this.confirmTaskDelete(item)}
                                        okText={<CheckOutlined/>}
                                        cancelText={<CloseOutlined/>}
                                        placement="left"
                                    >
                                        <Link href="#"><DeleteOutlined style={{marginRight: 10}}/></Link>
                                    </Popconfirm>
                                    <Link href="#" onClick={() => this.handleTaskComplete(item)}><CheckOutlined/></Link>
                                </React.Fragment>
                            }
                        >
                            <List.Item.Meta
                                title={
                                    <React.Fragment>
                                        {item.title}
                                        {/*<Text type="secondary" style={{color: "#bfc0c4"}}> due {item.dueDate}</Text>*/}
                                    </React.Fragment>
                                }
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </>
        );
    }
}