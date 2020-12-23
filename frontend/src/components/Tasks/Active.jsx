import React from 'react';
import axios from "axios";
import moment from "moment"
import {Badge, Col, Divider, Empty, List, notification, Popconfirm, Row, Tooltip} from "antd";
import authHeader from "../../services/auth-header";
import {
    CheckOutlined,
    ClockCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import AddForm from "./AddForm";
import Text from "antd/es/typography/Text";
import {Link} from "react-router-dom";
import EditForm from "./EditForm";
import QueueAnim from "rc-queue-anim";
import emptyImg from "./empty.svg";


export class Active extends React.Component {
    state = {
        animations: {
            emptyTasks: {
                delay: 0
            }
        },

        tasks: [],
        tasksFetched: false,

        editForm: {
            task: null,
        },

        infiniteScroll: {
            loading: false,
            hasMore: true
        }
    }

    componentDidMount() {
        this.fetchTasks()
    }

    fetchTasks = () => {
        axios.get('http://localhost:5000/api/tasks/?active=1', {headers: authHeader()})
            .then(response => {
                this.setState({
                    tasks: response.data,
                    animations: {
                        emptyTasks: {
                            delay: 600
                        }
                    },
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
            <Row>
                {this.state.tasksFetched && this.state.tasks.length > 0 ?
                    <QueueAnim component={Col} componentProps={{span: 24}} type={["scaleBig", "scaleY"]} delay={[450, 0]}>
                        <Row key="addForm" justify="end">
                            <Col>
                                <AddForm key="addForm" handleTasksRefresh={this.fetchTasks} alignRight/>
                            </Col>
                        </Row>
                        <Row key="tasks" justify="end">
                            <Col span={24}>
                                <Divider/>
                                <EditForm
                                    key="editForm"
                                    task={this.state.editForm.task}
                                    handleTaskClear={() => this.setState({editForm: {task: null}})}
                                    handleTasksRefresh={this.fetchTasks}
                                />
                                <List
                                    key="activeList"
                                    locale={{
                                        emptyText: null
                                    }}
                                    itemLayout="horizontal"
                                >
                                    <QueueAnim type="scaleX" interval={50}>
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
                                                                    <Tooltip placement="right" title="High priority">
                                                                        <Badge color="red"/>
                                                                    </Tooltip>
                                                                    :
                                                                    <Tooltip placement="right" title="Low priority">
                                                                        <Badge color="green"/>
                                                                    </Tooltip>}
                                                            {task.title}
                                                        </React.Fragment>
                                                    }
                                                    description={task.description}
                                                />
                                            </List.Item>
                                        )}
                                    </QueueAnim>
                                </List>
                            </Col>
                        </Row>
                    </QueueAnim>
                    :
                    <QueueAnim component={Col} componentProps={{span: 24}} type="scaleY" delay={[this.state.animations.emptyTasks.delay, 0]}>
                        <Empty
                            key="emptyTasks"
                            image={
                                this.state.tasksFetched && this.state.tasks.length <= 0 ?
                                    emptyImg :
                                    <LoadingOutlined style={{fontSize: 24}} spin/>
                            }
                            imageStyle={{height: 60}}
                            description={<Text type="secondary">{
                                this.state.tasksFetched && this.state.tasks.length <= 0 ?
                                    "You don't have any active tasks. Want to create one?" :
                                    "Fetching tasks..."
                            }</Text>}
                        >
                            {this.state.tasksFetched && this.state.tasks.length ?
                                null :
                                <QueueAnim type="scaleY" delay={400}>
                                    <div key="addFormNoTasks">
                                        <AddForm key="addForm" handleTasksRefresh={this.fetchTasks}/>
                                    </div>
                                </QueueAnim>
                            }
                        </Empty>
                    </QueueAnim>}
            </Row>
        );
    }
}