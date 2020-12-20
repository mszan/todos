import React from 'react';
import axios from "axios";
import moment from "moment"
import {Divider, Empty, List, notification, Popconfirm, Radio, Spin} from "antd";
import authHeader from "../../services/auth-header";
import {
    ArrowDownOutlined,
    CheckOutlined, ClockCircleOutlined,
    CloseOutlined,
    DeleteOutlined, DownCircleTwoTone, DownOutlined, EditOutlined, ExclamationOutlined,
    LoadingOutlined, UndoOutlined, UpCircleTwoTone,
} from "@ant-design/icons";
import AddForm from "./AddForm";
import Text from "antd/es/typography/Text";
import {Link} from "react-router-dom";


export class Completed extends React.Component {
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
        axios.get('http://localhost:5000/api/tasks?active=0', {headers: authHeader()})
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

    handleTaskCompleteUndo = task => {
        axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
                active: "1",
                completeDate: null
            }, {headers: authHeader()})
            .then(response => {
                notification.success({
                    message: 'Task marked active',
                    placement: 'bottomRight'
                });

                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            .catch(err => {
                notification.error({
                    message: 'Error marking task active',
                    placement: 'bottomRight'
                });
                console.log(err)
            })
    }

    render() {
        return (
            <>
                <List
                    locale={{
                        emptyText:
                            this.state.tasksFetched ?
                                <Empty
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{height: 60}}
                                    description={<span>You don't have any tasks here.</span>}
                                /> : <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>} size="large"
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
                                    <Link href="#" onClick={() => this.handleTaskCompleteUndo(item)}><UndoOutlined style={{marginRight: 10}}/></Link>
                                    <Link href="#" onClick={() => null}><EditOutlined style={{marginRight: 10}}/></Link>
                                    <Popconfirm
                                        title="Delete task?"
                                        onConfirm={() => this.confirmTaskDelete(item)}
                                        okText={<CheckOutlined/>}
                                        cancelText={<CloseOutlined/>}
                                        placement="left"
                                    >
                                        <Link href="#"><DeleteOutlined/></Link>
                                    </Popconfirm>
                                </React.Fragment>
                            }
                        >
                            <List.Item.Meta
                                title={
                                    <React.Fragment>
                                        {item.priority === 1 ?
                                            null :
                                            item.priority === 2 ?
                                                <ExclamationOutlined style={{color: "#e52807"}}/> :
                                                <ArrowDownOutlined style={{color: "#0090ff"}}/> }
                                        {item.title}
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