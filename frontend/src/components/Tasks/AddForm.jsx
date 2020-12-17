import {Modal, Button, Radio, Form, Input, message, notification, Tooltip, DatePicker} from 'antd';
import {
    DownCircleTwoTone,
    DownOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    SmileOutlined,
    UpCircleTwoTone,
    UpOutlined
} from "@ant-design/icons";
import React  from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";

// <PlusOutlined style={{color: "#1890ff"}}/>
export default function AddForm(props) {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const [form] = Form.useForm();
    const API_URL = "http://localhost:5000/api/"

    const showModal = () => {
        setVisible(true);
    };

    const handleFormFinishOk = values => {
        // Hide modal
        setVisible(false);

        // Reset form fields
        form.resetFields();

        console.log(values.dueDate)

        // Send request to add task
        axios.post(API_URL + "tasks",{
            title: values['title'],
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD HH:mm:ss') : null
        }, { headers: authHeader() })
            .then(response => {
                notification.success({
                    message: 'Task added',
                    placement: 'bottomRight'
                });

                // Lift the state up to update list with added task
                props.handleTasksRefresh()
            })
            .catch(err => {
                console.log(err)
                notification.info({
                    message: 'Cannot add task',
                    placement: 'bottomRight'
                });
            })
    };

    const handleModalCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Modal
                title="Adding new task"
                visible={visible}
                confirmLoading={confirmLoading}
                onCancel={handleModalCancel}
                footer={
                    <Button form="taskAddForm" type="primary" htmlType="submit"><PlusOutlined />Add task</Button>
                }
            >
                <Form
                    id="taskAddForm"
                    form={form}
                    layout="vertical"
                    onFinish={handleFormFinishOk}
                    onFinishFailed={err => console.log(err)}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        tooltip="DETAILS HERE"
                        rules={[{ required: true, message: 'Title is required.' }]}
                    >
                        <Input placeholder="e.g. Take the trash out" />
                    </Form.Item>

                    <Form.Item
                        label="Due date"
                        name="dueDate"
                        tooltip="DETAILS HERE"
                    >
                        <DatePicker
                            showNow={false}
                            showTime={{format: "HH:mm"}}
                            format="YYYY-MM-DD HH:mm"
                            style={{width: "100%"}}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        tooltip="DETAILS HERE"
                    >
                        <Input.TextArea rows={3} autoSize={{ minRows: 3 }} showCount maxLength={300} />
                    </Form.Item>

                    <Form.Item
                        label="Priority"
                        name="priority"
                        tooltip="DETAILS HERE"
                    >
                        <Radio.Group defaultValue="b" buttonStyle="solid" style={{width: "100%", textAlign: "center"}}>
                            <Radio.Button style={{width: "33.3%"}} value="a"><UpCircleTwoTone twoToneColor={"#e52807"}/> High</Radio.Button>
                            <Radio.Button style={{width: "33.3%"}} value="b">Normal</Radio.Button>
                            <Radio.Button style={{width: "33.3%"}} value="c"><DownCircleTwoTone twoToneColor={"#6ae74e"}/> Low</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
            <Tooltip title="Add task">
                <Button type="primary" onClick={showModal} style={props.alignRight ? {float: 'right', marginBottom: 24} : null}>
                    <PlusOutlined />{props.noText ? null : "Add task"}
                </Button>
            </Tooltip>
        </>
    );
};