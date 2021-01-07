import {Badge, Button, DatePicker, Form, Input, Modal, notification, Radio} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import React from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";

// Form for adding new tasks
export default function AddForm(props) {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const [form] = Form.useForm();

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
        axios.post(process.env.REACT_APP_API_URL + "tasks",{
            title: values.title,
            description: values.description ? values.description : null,
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD HH:mm:ss') : null,
            priority: values.priority
        }, { headers: authHeader() })
            .then(response => {
                notification.success({
                    message: 'Task added',
                    placement: 'bottomLeft'
                });

                // Lift the state up to update list with added task
                props.handleTasksRefresh()
            })
            .catch(err => {
                console.log(err)
                notification.info({
                    message: 'Cannot add task',
                    placement: 'bottomLeft'
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
                        <Radio.Group defaultValue="1" buttonStyle="solid" style={{width: "100%", textAlign: "center"}}>
                            <Radio.Button style={{width: "33.3%"}} value="2"><Badge color="red"/>High</Radio.Button>
                            <Radio.Button style={{width: "33.3%"}} value="1">Normal</Radio.Button>
                            <Radio.Button style={{width: "33.3%"}} value="3"><Badge color="green"/>Low</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
            <Button key="addFormBtn" title="New task" type="primary" onClick={showModal}>
                <PlusOutlined /> New task
            </Button>
        </>
    );
};