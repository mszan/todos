import React from 'react';
import axios from "axios";
import moment from "moment"
import {Col, Divider, Empty, List, notification, Popconfirm, Radio, Row, Spin} from "antd";
import authHeader from "../../services/auth-header";
import {
    ArrowDownOutlined,
    CheckOutlined, ClockCircleOutlined,
    CloseOutlined,
    DeleteOutlined, EditOutlined, ExclamationOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import AddForm from "./AddForm";
import Text from "antd/es/typography/Text";
import {Link} from "react-router-dom";
import EditForm from "./EditForm";
import QueueAnim from "rc-queue-anim";
import Animate from 'rc-animate';



export class Active extends React.Component {
    state = {
        tasks: [],
        tasksFetched: false,
        editForm: {
            task: null,
        }
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
        axios.get('http://localhost:5000/api/tasks/?active=1', {headers: authHeader()})
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
                    placement: 'bottomLeft'
                });

                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            .catch(err => {
                notification.error({
                    message: 'Error deleting task',
                    placement: 'bottomLeft'
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
                    placement: 'bottomLeft'
                });

                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            .catch(err => {
                notification.error({
                    message: 'Error marking task complete',
                    placement: 'bottomLeft'
                });
                console.log(err)
            })
    }

    render() {
        return (
            this.state.tasksFetched && this.state.tasks.length > 0 ?
                <React.Fragment>
                    <QueueAnim type="scaleBig">
                        <div key="addFormWrapper"> {/*Div need to be here due to animation requirements.*/}
                            <AddForm key="addForm" handleTasksRefresh={this.handleTasksRefresh} alignRight/>
                        </div>
                    </QueueAnim>
                    <QueueAnim>
                        <Divider key="dividerAddForm"/>
                    </QueueAnim>
                    <EditForm
                        key="editForm"
                        task={this.state.editForm.task}
                        handleTaskClear={() => this.setState({editForm: {task: null}})}
                        handleTasksRefresh={this.handleTasksRefresh}
                    />
                    <List
                        key="activeList"
                        locale={{
                            emptyText: null
                        }}
                        itemLayout="horizontal"
                    >
                        <QueueAnim type="top">
                            {this.state.tasks.map(task =>
                                <List.Item
                                    key={task.id}
                                    extra={
                                        <React.Fragment>
                                            {task.dueDate ?
                                                <React.Fragment>
                                                    <Text type="secondary" title="Due date"
                                                          style={moment(task.dueDate).isAfter(moment()) ? {color: "#bfc0c4"} : {color: "#e52807"}}>
                                                        <ClockCircleOutlined
                                                            style={{marginLeft: 10}}/> {moment(task.dueDate).format('DD MMM YYYY HH:mm')}
                                                    </Text>
                                                    <Divider type="vertical"/>
                                                </React.Fragment>
                                                : null}
                                            <Link to="#" title="Complete" onClick={() => this.handleTaskComplete(task)}>
                                                <CheckOutlined style={{marginRight: 10}}/>
                                            </Link>
                                            <Link to="#" title="Edit" onClick={() => {
                                                this.setState({
                                                    editForm: {
                                                        visible: true,
                                                        task: task
                                                    }
                                                })
                                            }}
                                            ><EditOutlined style={{marginRight: 10}}/></Link>
                                            <Popconfirm
                                                title="Delete task?"
                                                onConfirm={() => this.confirmTaskDelete(task)}
                                                okText={<CheckOutlined/>}
                                                cancelText={<CloseOutlined/>}
                                                placement="left"
                                            >
                                                <Link to="#" title="Delete"><DeleteOutlined/></Link>
                                            </Popconfirm>
                                        </React.Fragment>
                                    }
                                >
                                    <List.Item.Meta
                                        title={
                                            <React.Fragment>
                                                {task.priority === 1 ?
                                                    null :
                                                    task.priority === 2 ?
                                                        <ExclamationOutlined style={{color: "#e52807"}}/> :
                                                        <ArrowDownOutlined style={{color: "#0090ff"}}/>}
                                                {task.title}
                                            </React.Fragment>
                                        }
                                        description={task.description}
                                    />
                                </List.Item>
                            )}
                        </QueueAnim>
                    </List>
                </React.Fragment> :
                <Animate exclusive={true} transitionName="fade" transitionAppear>

                    <Row justify="center">
                        <Col>
                            {this.state.tasksFetched && this.state.tasks.length <= 0 ?
                                <Empty
                                    key="emptyNoActiveTasks"
                                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                    imageStyle={{height: 60}}
                                    description={<span>You don't have any active tasks. Want to create one?</span>}
                                >
                                    <AddForm handleTasksRefresh={this.handleTasksRefresh}/>
                                </Empty> :
                                <Empty
                                    key="emptyFetchingTasks"
                                    image={<LoadingOutlined style={{fontSize: 24}} spin/>}
                                    imageStyle={{height: 60}}
                                    description={<span>Fetching tasks...</span>}
                                >
                                </Empty>}
                        </Col>
                    </Row>
                </Animate>
        );
    }
}