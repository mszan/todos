import {Modal, Button, Radio, Form, Input, message, notification, Tooltip} from 'antd';
import {InfoCircleOutlined, PlusOutlined, SmileOutlined} from "@ant-design/icons";
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

    // const handleOk = () => {
    //     setModalText('The modal will be closed after two seconds');
    //     setConfirmLoading(true);
    //     setTimeout(() => {
    //         setVisible(false);
    //         setConfirmLoading(false);
    //     }, 2000);
    // };

    const handleFormFinishOk = values => {
        // Hide modal
        setVisible(false);

        // Reset form fields
        form.resetFields();

        // Send request to add task
        axios.post(API_URL + "tasks",{
            title: values['title']
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

    const handleFormFinishErr = errorInfo => {
        console.log(errorInfo);
    };

    const handleModalCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Modal
                title="Adding new task"
                visible={visible}
                // onOk={handleOk}
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
                    onFinishFailed={handleFormFinishErr}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        tooltip="DETAILED INFO"
                        rules={[{ required: true, message: 'Title is required.' }]}
                    >
                        <Input placeholder="e.g. Take the trash out" />
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