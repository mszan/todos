import React from 'react';
import axios from "axios";
import moment from "moment"
import {Badge, Col, Divider, Empty, List, notification, Popconfirm, Row, Spin, Tooltip} from "antd";
import authHeader from "../../services/auth-header";
import {
    CheckOutlined,
    ClockCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import AddForm from "./AddForm";
import Text from "antd/es/typography/Text";
import {Link} from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import emptyImg from "./empty.svg";
import "./tasks.css"

const EditForm = React.lazy(() => import('./EditForm'));

// Active tasks
export class Active extends React.Component {
    state = {
        animations: {
            emptyTasks: {
                delay: 0 // Animation delay when empty task list info is displayed
            }
        },

        tasks: [], // List of tasks
        tasksFetched: false, // Tasks fetched from server

        editForm: { // Task edit form
            task: null, // Currently editing task instance
        },
    }

    componentDidMount() {
        this.fetchTasks()
    }

    // Fetch tasks from server
    fetchTasks = () => {
        // Send request
        axios.get(process.env.REACT_APP_API_URL + 'tasks/?active=1', {headers: authHeader()})
            .then(response => {
                // Set state with tasks from response
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
            // Catch errors
            .catch(err => {
                console.log(err)
            });
    };

    // Delete task from DB
    handleTaskDelete = task => {
        axios.delete(process.env.REACT_APP_API_URL + `tasks/${task.id}`, {headers: authHeader()})
            .then(response => {
                notification.success({
                    message: 'Task deleted',
                    placement: 'bottomLeft'
                });

                // Delete task from state 'tasks' array
                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            // Catch errors
            .catch(err => {
                notification.error({
                    message: 'Error deleting task',
                    placement: 'bottomLeft'
                });
                console.log(err)
            })
    }

    // Set task completed
    handleTaskComplete = task => {
        axios.put(process.env.REACT_APP_API_URL + `tasks/${task.id}`, {
            active: "0",
            completeDate: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {headers: authHeader()})
            .then(response => {
                notification.success({
                    message: 'Task marked as completed',
                    placement: 'bottomLeft'
                });

                // Delete task from state 'tasks' array
                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.setState({tasks: tasksArray})
            })
            // Catch errors
            .catch(err => {
                notification.error({
                    message: 'Error marking task complete',
                    placement: 'bottomLeft'
                });
                console.log(err)
            })
    }

    // Get display color for dueDate depending on remaining time
    getDueDateStyleColor = dueDate => {
        if (moment(dueDate).isAfter(moment())) {
            if (moment(dueDate).isAfter(moment().add(1, "day"))) {
                return "#bfc0c4" // More than 1 day remaining
            }
            return "#ffcc00" // Less than 1 day remaining
        }
        return "#e52807" // dueDate is after moment() - task is late
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
                                <React.Suspense fallback={<Spin />}>
                                    <EditForm
                                        key="editForm"
                                        task={this.state.editForm.task}
                                        handleTaskClear={() => this.setState({editForm: {task: null}})}
                                        handleTasksRefresh={this.fetchTasks}
                                    />
                                </React.Suspense>
                                <List
                                    key="activeList"
                                    locale={{ emptyText: null }}
                                    itemLayout="horizontal"
                                >
                                    <QueueAnim type="top" interval={50}>
                                        {this.state.tasks.map(task =>
                                            <div className="taskListItem" key={task.id}>
                                                <List.Item
                                                    extra={
                                                        <React.Fragment>
                                                            <div className="taskListBtns">
                                                                <Link to="#" title="Complete" onClick={() => this.handleTaskComplete(task)}>
                                                                    <CheckOutlined style={{marginRight: 10, marginLeft: 20}}/>
                                                                </Link>
                                                                <Link to="#" title="Edit" onClick={() => {
                                                                    this.setState({
                                                                        editForm: {
                                                                            visible: true,
                                                                            task: task
                                                                        }
                                                                    })
                                                                }}
                                                                >
                                                                    <EditOutlined style={{marginRight: 10}}/>
                                                                </Link>
                                                                <Popconfirm
                                                                    title="This will permanently delete task. Are you sure?"
                                                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                                    onConfirm={() => this.handleTaskDelete(task)}
                                                                    okText={<CheckOutlined/>}
                                                                    cancelText={<CloseOutlined/>}
                                                                    placement="left"
                                                                >
                                                                    <Link to="#" title="Delete"><DeleteOutlined style={{color: "#ff7373"}}/></Link>
                                                                </Popconfirm>
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <List.Item.Meta
                                                        title={
                                                            <React.Fragment>
                                                                {task.priority === 1 ?
                                                                    null :
                                                                    task.priority === 2 ?
                                                                        <Tooltip placement="right" title="Has high priority">
                                                                            <Badge color="red"/>
                                                                        </Tooltip>
                                                                        :
                                                                        <Tooltip placement="right" title="Has low priority">
                                                                            <Badge color="green"/>
                                                                        </Tooltip>}
                                                                {task.title}
                                                                {task.dueDate ?
                                                                    <React.Fragment>
                                                                        <Divider type="vertical"/>
                                                                        <Text type="secondary"
                                                                              title={`Must be completed before ${moment(task.dueDate).format('DD MMMM YYYY HH:mm')}`}
                                                                              style={{color: this.getDueDateStyleColor(task.dueDate)}}
                                                                        >
                                                                            <ClockCircleOutlined/> {moment(task.dueDate).format('DD MMM YYYY HH:mm')}
                                                                        </Text>
                                                                    </React.Fragment>
                                                                    : null}
                                                            </React.Fragment>
                                                        }
                                                        description={task.description}
                                                    />
                                                </List.Item>
                                            </div>
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