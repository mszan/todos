import React from 'react';
import axios from "axios";
import moment from "moment"
import {Badge, Col, Divider, Empty, List, notification, Popconfirm, Row, Spin, Statistic, Tooltip} from "antd";
import authHeader from "../../services/auth-header";
import {
    CheckOutlined,
    ClockCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import Text from "antd/es/typography/Text";
import {Link} from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import emptyImg from "./empty.svg"
import "./tasks.css"

const EditForm = React.lazy(() => import('./EditForm'));

// Completed tasks
export class Completed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animations: {
                emptyTasks: {
                    delay: 0 // Animation delay when empty task list info is displayed
                }
            },

            tasks: [], // List of tasks
            tasksFetched: false, // Tasks fetched from server
            tasksStats: { // Task statistics
                completedOnTime: "", // Percentage of tasks completed on time
                completedLast7Days: "", // Amount of tasks completed last 7 days
                completedLast30Days: "" // Amount of tasks completed last 30 days
            },

            editForm: { // Task edit form
                task: null, // Currently editing task instance
            }
        }
        this.getTasksStats = this.getTasksStats.bind(this)
    }

    componentDidMount() {
        this.fetchTasks()
    }

    // Fetch tasks from server
    fetchTasks = () => {
        // Send request
        axios.get('http://localhost:5000/api/tasks?active=0&orderField=completeDate&orderType=DESC', {headers: authHeader()})
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
            .catch(err => console.log(err))

            // Update tasks statistics
            .then(() => this.getTasksStats(this.state.tasks))
    };

    // Get tasks stats (to be shown at the top of the page)
    getTasksStats = tasks => {
        let resultOnTime = null
        let resultLast7Days = null
        let resultLast30Days = null

        tasks.forEach((item, index) => {
            for (const [key, val] of Object.entries(item)) {
                // If
                if (key === "completeDate") {
                    if (moment().diff(moment(val), "days") <= 7) resultLast7Days += 1
                    if (moment().diff(moment(val), "days") <= 30) resultLast30Days += 1
                }

                // If task had set dueDate, check if it was completed on time
                if (key === "dueDate" && val) if (moment(val).isAfter()) resultOnTime += 1
            }
        })

        this.setState({
            tasksStats: {
                completedOnTime: Math.round((resultOnTime / this.state.tasks.length * 100) * 10) / 10, // Percentage
                completedLast7Days: resultLast7Days,
                completedLast30Days: resultLast30Days
            }
        })
    }

    // Delete task from DB
    handleTaskDelete = task => {
        axios.delete(`http://localhost:5000/api/tasks/${task.id}`, {headers: authHeader()})
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

    // Undo task completion (set task active)
    handleTaskCompleteUndo = task => {
        axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
            active: "1",
            completeDate: null
        }, {headers: authHeader()})
            .then(response => {
                notification.success({
                    message: 'Task marked active',
                    placement: 'bottomLeft'
                });

                // Delete task from state 'tasks' array
                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.getTasksStats(this.state.tasks) // Update statistics
                this.setState({tasks: tasksArray})
            })
            // Catch errors
            .catch(err => {
                notification.error({
                    message: 'Error marking task active',
                    placement: 'bottomLeft'
                });
                console.log(err)
            })
    }

    render() {
        return (
            <Row>
                {this.state.tasksFetched && this.state.tasks.length > 0 ?
                    <QueueAnim component={Col} componentProps={{span: 24}} type={["scaleY", "scaleY"]} delay={[450, 0]}>
                        <Row key="statistics">
                            <Col span={6} key={"total"}>
                                <Statistic
                                    title="Total"
                                    value={String(this.state.tasks.length)}
                                    formatter={(val) => val}
                                />
                            </Col>
                            <Col span={6} key={"onTime"}>
                                <Statistic
                                    title="On time"
                                    suffix="%"
                                    value={String(this.state.tasksStats.completedOnTime)}
                                    formatter={(val) => val}
                                />
                            </Col>
                            <Col span={6} key={"last7Days"}>
                                <Statistic
                                    title="Last 7 days"
                                    value={String(this.state.tasksStats.completedLast7Days)}
                                    formatter={(val) => val}
                                />
                            </Col>
                            <Col span={6} key={"last30Days"}>
                                <Statistic
                                    title="Last 30 days"
                                    value={String(this.state.tasksStats.completedLast30Days)}
                                    formatter={(val) => val}
                                />
                            </Col>
                        </Row>
                        <Row key="taskList" justify="center">
                            <Col span={24}>
                                <React.Suspense fallback={<Spin />}>
                                    <EditForm
                                        key="editForm"
                                        task={this.state.editForm.task}
                                        handleTaskClear={() => this.setState({editForm: {task: null}})}
                                        handleTasksRefresh={this.fetchTasks}
                                    />
                                </React.Suspense>
                                <Divider />
                                <List
                                    locale={{
                                        emptyText:
                                            <Empty
                                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                                imageStyle={{height: 60}}
                                                description={<span>Seems empty so far...</span>}
                                            />
                                    }}
                                    itemLayout="horizontal"
                                    dataSource={this.state.tasks}
                                >
                                    <QueueAnim type="top" interval={50}>
                                        {this.state.tasks.map(task =>
                                            <div className="taskListItem" key={task.id}>
                                                <List.Item
                                                    key={task.id}
                                                    extra={
                                                        <div className="taskListBtns">
                                                            {task.dueDate ?
                                                                <React.Fragment>
                                                                    <Text
                                                                        type="secondary"
                                                                        style={{color: "#bfc0c4"}}
                                                                        title={`Had to be completed before ${moment(task.dueDate).format('DD MMMM YYYY HH:mm')}`}
                                                                    >
                                                                        <ClockCircleOutlined/> {moment(task.dueDate).format('DD MMM YYYY')}
                                                                    </Text>
                                                                    <Divider type="vertical"/>
                                                                </React.Fragment>
                                                                : null}
                                                            <Text type="secondary"
                                                                  style={{color: "#bfc0c4"}}
                                                                  title={`Completed on ${moment(task.completeDate).format('DD MMMM YYYY HH:mm')}`}
                                                            >
                                                                <CheckOutlined/> {moment(task.completeDate).format('DD MMM YYYY')}
                                                            </Text>
                                                            <Divider type="vertical"/>
                                                            <Link to="#" title="Set active"
                                                                  onClick={() => this.handleTaskCompleteUndo(task)}><UndoOutlined
                                                                style={{marginRight: 10}}/></Link>
                                                            <Link to="#" title="Edit" onClick={() => {
                                                                this.setState({
                                                                    editForm: {
                                                                        visible: true,
                                                                        task: task
                                                                    }
                                                                })
                                                            }}>
                                                                <EditOutlined style={{marginRight: 10}}/>
                                                            </Link>
                                                            <Popconfirm
                                                                title="Delete task?"
                                                                onConfirm={() => this.handleTaskDelete(task)}
                                                                okText={<CheckOutlined/>}
                                                                cancelText={<CloseOutlined/>}
                                                                placement="left"
                                                            >
                                                                <Link to="#" title="Delete"><DeleteOutlined/></Link>
                                                            </Popconfirm>
                                                        </div>
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
                            key="emptyNoActiveTasks"
                            image={
                                this.state.tasksFetched && this.state.tasks.length <= 0 ?
                                    emptyImg :
                                    <LoadingOutlined style={{fontSize: 24}} spin/>
                            }
                            imageStyle={{height: 60}}
                            description={<Text type="secondary">{
                                this.state.tasksFetched && this.state.tasks.length <= 0 ?
                                    "Seems empty so far..." :
                                    "Fetching tasks..."
                            }</Text>}
                        />
                    </QueueAnim>
                }
            </Row>
        );
    }
}