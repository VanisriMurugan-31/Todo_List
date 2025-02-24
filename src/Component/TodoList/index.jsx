import React, { useState, useEffect } from "react";
import { Input, Button,Space, Upload, Row, Col, Form, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import CardInfo from "../Layout/Card";

const { TextArea } = Input;

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [imageError, setImageError] = useState(false); // Error state for image validation

  const [form] = Form.useForm();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Handle file upload
  const handleFileChange = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewImage(e.target.result);
      setImageError(false); // Remove error when image is uploaded
    };
    reader.readAsDataURL(file);
  };

  // Remove Image
  const removeImage = () => {
    setNewImage(null);
    setImageError(true); // Show error when image is removed
  };

  // Add Task
  const addTask = (values) => {
    if (!newImage) {
      setImageError(true);
      message.error("Please upload an image!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      image: newImage,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    form.resetFields(); // Reset form fields after submission
    setNewImage(null); 
    setImageError(false); 
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };
  
  {/*delete card*/}
  
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };
  

  return (
    <div className="container text-center " style={{marginBottom:"50px",marginTop:"50px" }} >
      <h2 style={{ textAlign: "center",color:'#2b297f' ,marginBottom:"50px" }}>To-Do App</h2>

      {/* Task Input Form */}
      <Form form={form} layout="vertical" style={{ maxWidth: "600px", margin: "0 auto" }} onFinish={addTask}>
        <Form.Item 
          label={<span style={{ fontSize: "16px" ,fontWeight: "bold"}}>Task Title</span>} 
          name="title" 
          rules={[{ required: true, message: "Title is required!" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item 
          label={<span style={{ fontSize: "16px" ,fontWeight: "bold"}}>Task Description</span>} 
          name="description" 
          rules={[{ required: true, message: "Description is required!" }]}
        >
          <TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        <Form.Item label={<span style={{ fontSize: "16px" ,fontWeight: "bold"}}>Upload Image </span>}  required>
          <Upload beforeUpload={() => false} showUploadList={false} onChange={handleFileChange}>
            <Button icon={<UploadOutlined />} size="large">Upload Image</Button>
          </Upload>
          {imageError && <p style={{ color: "red", marginTop: "5px" }}>Image is required!</p>}

          {newImage && (
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <img src={newImage} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd", padding: "5px" }} />
              <div>
                <Button danger type="text" icon={<DeleteOutlined />} onClick={removeImage} style={{ marginTop: "5px" }}>
                  Remove Image
                </Button>
              </div>
            </div>
          )}
        </Form.Item>

        <Form.Item style={{ textAlign: "center", marginTop: "40px" }}>
          <button type="primary" htmlType="submit" size="large" className="btn btn-success">Add Task</button>
        </Form.Item>
      </Form>

      {/* Filter buttons */}
      <Space style={{ marginBottom: "10px" }}>
        {["all", "completed", "pending"].map((type) => (
          <Button key={type} size="large" type={filter === type ? "primary" : "default"} onClick={() => setFilter(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </Space>

      {/* Task Cards */}
      <Row gutter={[16, 16]} >
        {filteredTasks.map((task) => (
          <Col key={task.id} xs={{ span: 24, style: { display: "flex", justifyContent: "center" } }}  sm={12} md={8} lg={6}>
            <CardInfo title={task.title} description={task.description} image={task.image} 
             completed={task.completed}
             onToggle={() => toggleTaskCompletion(task.id)}
             onDelete={() => deleteTask(task.id)}/>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TodoApp;
