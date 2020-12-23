import {Badge, Button, DatePicker, Form, Input, Modal, notification, Radio} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import React from "react";
import moment from "moment";
import axios from "axios";
import authHeader from "../../services/auth-header";

export default function EditForm(props) {
    const [visible, setVisible] = React.useState(!!props.task); // Handles visibility of modal with form
    const [form] = Form.useForm(); // Edit form instance

    React.useEffect(() => {
        // If task is passed, set modal visible
        setVisible(!!props.task)

        // If task is passed, set form fields values
        if(props.task) setFormFieldsValues()
    }, [props])

    const setFormFieldsValues = () => {
        // Reset all field values
        form.resetFields()

        // For each field in props.task
        for (const [key, val] of Object.entries(props.task)) {
            // If props.task field is in form
            if (form.getFieldInstance([key])) {
                // If field is date, convert it to moment()
                if (key === "dueDate") {
                    if(val) form.setFieldsValue({[key]: moment(val)})
                }
                // If not, just set the value
                else {
                    if (val) form.setFieldsValue({[key]: String(val)})
                }
            }
        }
    }

    const handleFormFinishOk = values => {
        // Hide modal
        setVisible(false);

        // Reset form fields
        form.resetFields();

        // Send request to add task
        axios.put(process.env.REACT_APP_API_URL + `tasks/${props.task.id}`,{
            title: values.title,
            description: values.description ? values.description : null,
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD HH:mm:ss') : null,
            priority: values.priority
        }, { headers: authHeader() })
            .then(response => {
                notification.success({
                    message: 'Task edited',
                    placement: 'bottomLeft'
                });

                // Lift the state up to update list with added task
                props.handleTasksRefresh()
            })
            .catch(err => {
                console.log(err)
                notification.info({
                    message: 'Cannot edit task',
                    placement: 'bottomLeft'
                });
            })

        // Clear editForm.task prop
        props.handleTaskClear()
    };

    const handleModalCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Modal
                forceRender
                title="Edit task"
                visible={visible}
                onCancel={handleModalCancel}
                footer={
                    <Button form="taskEditForm" type="primary" htmlType="submit"><PlusOutlined />Edit task</Button>
                }
            >
                <Form
                    id="taskEditForm"
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
                        <Radio.Group buttonStyle="solid" style={{width: "100%", textAlign: "center"}}>
                            <Radio.Button style={{width: "33.3%"}} value="2"><Badge color="red"/>High</Radio.Button>
                            <Radio.Button style={{width: "33.3%"}} value="1">Normal</Radio.Button>
                            <Radio.Button style={{width: "33.3%"}} value="3"><Badge color="green"/>Low</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};