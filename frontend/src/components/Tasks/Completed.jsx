import React from 'react';
import axios from "axios";
import moment from "moment"
import {Row, Col, Divider, Empty, List, notification, Popconfirm, Spin, Statistic} from "antd";
import authHeader from "../../services/auth-header";
import {
    ArrowDownOutlined, ArrowUpOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationOutlined,
    LoadingOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import Text from "antd/es/typography/Text";
import {Link} from "react-router-dom";
import AddForm from "./AddForm";
import Animate from "rc-animate";
import QueueAnim from "rc-queue-anim";
import Texty from 'rc-texty';



export class Completed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            tasksStats: {
                completedOnTime: "",
                completedLast7Days: "",
                completedLast30Days: ""
            },
            tasksFetched: false
        }
        this.getTasksStats = this.getTasksStats.bind(this)
    }


    componentDidMount() {
        this.fetchTasks()
    }

    // Fetch tasks from server
    fetchTasks = () => {
        // Send request
        axios.get('http://localhost:5000/api/tasks?active=0', {headers: authHeader()})
            .then(response => {
                // Set state with tasks from response
                this.setState({
                    tasks: response.data,
                    tasksFetched: true
                })
            })
            // Catch request errors
            .catch(err => {
                console.log(err)
            })

            // Get tasks completed on time and set state with them
            .then(() => this.getTasksStats(this.state.tasks))
    };

    // Get tasks stats (to be shown at the top of the page)
    getTasksStats = tasks => {
        let resultOnTime = 0 // Percentage of tasks completed on time
        let resultLast7Days = 0 // Count of tasks completed last 7 days
        let resultLast30Days = 0 // Count of tasks completed last 30 days

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
                completedOnTime: (resultOnTime / this.state.tasks.length * 100).toPrecision(4),
                completedLast7Days: resultLast7Days,
                completedLast30Days: resultLast30Days
            }
        })
    }

    // Take list of tasks and days and return number of tasks completed in period of given days
    getCompletedLastDays = (tasks, days) => {
        let result = 0
        tasks.forEach((item, index) => {
            for (const [key, val] of Object.entries(item)) {
                if (key === "completeDate" && val) {
                    if (moment(val).isAfter()) result += 1
                }
            }
        })
        return result
    }

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

                const tasksArrayIndex = this.state.tasks.findIndex(x => x.id === task.id);
                const tasksArray = this.state.tasks
                tasksArray.splice(tasksArrayIndex, 1)
                this.getTasksStats(this.state.tasks)
                this.setState({tasks: tasksArray})
            })
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
            <React.Fragment>
                {this.state.tasksFetched ?
                    <React.Fragment>
                        <QueueAnim component={Row} type="scaleBig">
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
                        </QueueAnim>

                        <Row justify="center">
                            <Col span={24}>
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
                                >
                                    <QueueAnim type="top">
                                        {this.state.tasks.map(task =>
                                            <List.Item
                                                key={task.id}
                                                extra={
                                                    <React.Fragment>
                                                        {task.dueDate ?
                                                            <React.Fragment>
                                                                <Text type="secondary" style={{color: "#bfc0c4"}}
                                                                      title="Due date">
                                                                    <ClockCircleOutlined/> {moment(task.dueDate).format('DD MMM YYYY')}
                                                                </Text>
                                                                <Divider type="vertical"/>
                                                            </React.Fragment>
                                                            : null}
                                                        <Text type="secondary" style={{color: "#bfc0c4"}}
                                                              title="Complete date">
                                                            <CheckOutlined/> {moment(task.completeDate).format('DD MMM YYYY')}
                                                        </Text>
                                                        <Divider type="vertical"/>

                                                        <Link href="#" title="Set active"
                                                              onClick={() => this.handleTaskCompleteUndo(task)}><UndoOutlined
                                                            style={{marginRight: 10}}/></Link>
                                                        <Link href="#" title="Edit" onClick={() => {
                                                        }}><EditOutlined style={{marginRight: 10}}/></Link>
                                                        <Popconfirm
                                                            title="Delete task?"
                                                            onConfirm={() => this.confirmTaskDelete(task)}
                                                            okText={<CheckOutlined/>}
                                                            cancelText={<CloseOutlined/>}
                                                            placement="left"
                                                        >
                                                            <Link href="#" title="Delete"><DeleteOutlined/></Link>
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
                            </Col>
                        </Row>
                    </React.Fragment>
                    :
                    <Animate exclusive={true} transitionName="fade" transitionAppear>
                        <Row justify="center">
                            <Col>
                                {this.state.tasksFetched && this.state.tasks.length <= 0 ?
                                    <Empty
                                        key="emptyNoActiveTasks"
                                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                        imageStyle={{height: 60}}
                                        description={<span>Seems empty...</span>}
                                    /> :
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
                }
            </React.Fragment>
        );
    }
}