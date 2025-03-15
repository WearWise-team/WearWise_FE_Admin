"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Descriptions,
  Space,
  Avatar,
  Tag,
  Card,
  Typography,
  Divider,
  Checkbox,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { activateUserApi, inactiveUser } from "@/api/user/page";
import { useNotification } from "./NotificationService";

const { Search } = Input;
const { Title } = Typography;

const UserManagement = ({ users, activePage }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const notify = useNotification();
  const [activeUsers, setActiveUsers] = useState(users);
  const [blockedUsers, setBlockedUsers] = useState(users.filter(user => user.deleted_at));

  useEffect(() => {
    setActiveUsers(users.filter(user => !user.deleted_at));
  }, [users]);

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGenderDisplay = (gender) => {
    const colorMap = {
      male: "blue",
      female: "pink",
      other: "purple",
    };
    return <Tag color={colorMap[gender] || "default"}>{gender}</Tag>;
  };

  const blockActivity = async (userId) => {
    const response = await inactiveUser(userId);
  
    if (response) {
      notify("User activity has been blocked.", "", "topRight");
  
      // Chuyển user từ danh sách active sang blocked
      setActiveUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setBlockedUsers(prevUsers => [
        ...prevUsers,
        { ...blockedUsers.find(user => user.id === userId), deleted_at: null }
      ]);
    } else {
      notify("Unable to disable account", "", "topRight", "warning");
    }
  };

  const activeUser = async (id) => {
    const response = await activateUserApi(id);

    if(response) {
      notify("User activity has been activated.", "", "topRight");
      // Chuyển user từ danh sách blocked sang active
      setBlockedUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setActiveUsers(prevUsers => [
        ...prevUsers,
        { ...activeUsers.find(user => user.id === id), deleted_at: new Date().toISOString() }
      ]);
    } else {
      notify("Unable to enable account", "", "topRight", "warning");
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => getGenderDisplay(gender),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="green">{role}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => formatDate(date),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        record.deleted_at ? 
          <Button type="link" onClick={() => activeUser(record.id)}>
            Active Users
          </Button> : 
          <>
            <Button type="link" onClick={() => showUserDetails(record)}>
              View more
            </Button>
            <Button type="link" onClick={() => blockActivity(record.id)}>
              Block activity
            </Button>
          </>

      ),
    },
  ];

  const filteredUsers = (activePage === "All Users" ? activeUsers : blockedUsers).filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );  

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Space style={{ marginBottom: 16, width: "100%" }} direction="horizontal">
          <Search
            placeholder="Search Users by Name, Email or Date"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
        </Space>
        <Title level={4}>USERS</Title>
        <Table columns={columns} dataSource={filteredUsers} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <Modal
        title={<Title level={4}>User Details</Title>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[<Button key="back" onClick={handleCancel}>Close</Button>]}
        width={700}
      >
        {selectedUser && (
          <>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <Avatar src={selectedUser.avatar} size={64} icon={<UserOutlined />} />
              <div style={{ marginLeft: 16 }}>
                <Title level={4} style={{ margin: 0 }}>{selectedUser.name}</Title>
                <div>{selectedUser.email}</div>
                <Tag color="green">{selectedUser.role}</Tag>
              </div>
            </div>
            <Divider />
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID">{selectedUser.id}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedUser.phone || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedUser.address || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Gender">{getGenderDisplay(selectedUser.gender)}</Descriptions.Item>
              <Descriptions.Item label="Height">{selectedUser.height || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Weight">{selectedUser.weight || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Shirt Size">{selectedUser.shirt_size || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Pant Size">{selectedUser.pant_size || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Created At">{formatDate(selectedUser.created_at)}</Descriptions.Item>
              <Descriptions.Item label="Updated At">{formatDate(selectedUser.updated_at)}</Descriptions.Item>
              <Descriptions.Item label="Deleted At">{formatDate(selectedUser.deleted_at)}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
