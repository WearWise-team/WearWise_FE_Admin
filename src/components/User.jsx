"use client"

import { useEffect, useState } from "react"
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
  Select,
  Row,
  Col,
  DatePicker,
  Empty,
  Form,
} from "antd"
import { UserOutlined, FilterOutlined, SearchOutlined, PhoneOutlined } from "@ant-design/icons"
import { activateUserApi, inactiveUser } from "@/api/user/page"
import { useNotification } from "./NotificationService"

const { Search } = Input
const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const UserManagement = ({ users, activePage }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeUsers, setActiveUsers] = useState(users)
  const [blockedUsers, setBlockedUsers] = useState(users.filter((user) => user.deleted_at))
  const notify = useNotification()
  const [form] = Form.useForm()

  // Search and filter states
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    status: "",
    dateRange: null,
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setActiveUsers(users.filter((user) => !user.deleted_at))
    setBlockedUsers(users.filter((user) => user.deleted_at))
  }, [users])

  const showUserDetails = (user) => {
    setSelectedUser(user)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getGenderDisplay = (gender) => {
    const colorMap = {
      male: "blue",
      female: "pink",
      other: "purple",
    }
    return <Tag color={colorMap[gender] || "default"}>{gender}</Tag>
  }

  const blockActivity = async (userId) => {
    const response = await inactiveUser(userId)

    if (response) {
      notify("User activity has been blocked.", "", "topRight")

      // Move user from active to blocked list
      const userToBlock = activeUsers.find((user) => user.id === userId)
      if (userToBlock) {
        setActiveUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
        setBlockedUsers((prevUsers) => [...prevUsers, { ...userToBlock, deleted_at: new Date().toISOString() }])
      }
    } else {
      notify("Unable to disable account", "", "topRight", "warning")
    }
  }

  const activeUser = async (id) => {
    const response = await activateUserApi(id)

    if (response) {
      notify("User activity has been activated.", "", "topRight")

      // Move user from blocked to active list
      const userToActivate = blockedUsers.find((user) => user.id === id)
      if (userToActivate) {
        setBlockedUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
        setActiveUsers((prevUsers) => [...prevUsers, { ...userToActivate, deleted_at: null }])
      }
    } else {
      notify("Unable to enable account", "", "topRight", "warning")
    }
  }

  const resetFilters = () => {
    form.resetFields()
    setFilters({
      name: "",
      email: "",
      phone: "",
      gender: "",
      role: "",
      status: "",
      dateRange: null,
    })
  }

  // Phone number validation
  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.resolve()
    }
    const phoneRegex = /^[0-9\-+\s()]*$/
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error("Please enter a valid phone number"))
    }
    return Promise.resolve()
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="green">{role}</Tag>,
      filters: [
        { text: "Admin", value: "admin" },
        { text: "User", value: "user" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.deleted_at ? "red" : "green"}>{record.deleted_at ? "Inactive" : "Active"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.deleted_at ? (
          <Button type="link" onClick={() => activeUser(record.id)}>
            Activate User
          </Button>
        ) : (
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
  ]

  // Apply all filters to the user list
  const getFilteredUsers = () => {
    let filteredData = activePage === "All Users" ? activeUsers : blockedUsers

    // Apply search text filter (global search)
    if (searchText) {
      filteredData = filteredData.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          (user.phone && user.phone.includes(searchText)),
      )
    }

    // Apply advanced filters
    if (filters.name) {
      filteredData = filteredData.filter((user) => user.name.toLowerCase().includes(filters.name.toLowerCase()))
    }

    if (filters.email) {
      filteredData = filteredData.filter((user) => user.email.toLowerCase().includes(filters.email.toLowerCase()))
    }

    if (filters.phone) {
      filteredData = filteredData.filter((user) => user.phone && user.phone.includes(filters.phone))
    }

    if (filters.gender) {
      filteredData = filteredData.filter((user) => user.gender === filters.gender)
    }

    if (filters.role) {
      filteredData = filteredData.filter((user) => user.role === filters.role)
    }

    if (filters.status) {
      if (filters.status === "active") {
        filteredData = filteredData.filter((user) => !user.deleted_at)
      } else if (filters.status === "inactive") {
        filteredData = filteredData.filter((user) => user.deleted_at)
      }
    }

    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0].startOf("day")
      const endDate = filters.dateRange[1].endOf("day")

      filteredData = filteredData.filter((user) => {
        const createdDate = new Date(user.created_at)
        return createdDate >= startDate.toDate() && createdDate <= endDate.toDate()
      })
    }

    return filteredData
  }

  const filteredUsers = getFilteredUsers()
  const customLocale = {
    emptyText: (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Text>No users found. Please try different search criteria.</Text>}
      />
    ),
  }

  const handleFilterChange = (changedValues, allValues) => {
    setFilters({
      name: allValues.name || "",
      email: allValues.email || "",
      phone: allValues.phone || "",
      gender: allValues.gender || "",
      role: allValues.role || "",
      status: allValues.status || "",
      dateRange: allValues.dateRange || null,
    })
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Space style={{ marginBottom: 16, width: "100%" }} direction="vertical">
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="Search by name, email or phone"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col>
              <Button
                type={showFilters ? "primary" : "default"}
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                size="large"
              >
                Filters
              </Button>
            </Col>
          </Row>

          {showFilters && (
            <Card size="small" style={{ marginTop: 16 }}>
              <Form form={form} layout="vertical" onValuesChange={handleFilterChange}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="name" label="Name">
                      <Input placeholder="Filter by name" allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="email" label="Email">
                      <Input placeholder="Filter by email" allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="phone" label="Phone" rules={[{ validator: validatePhoneNumber }]}>
                      <Input placeholder="Filter by phone" allowClear prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="gender" label="Gender">
                      <Select placeholder="Filter by gender" allowClear>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="role" label="Role">
                      <Select placeholder="Filter by role" allowClear>
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="status" label="Status">
                      <Select placeholder="Filter by status" allowClear>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="dateRange" label="Date Range">
                      <RangePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label=" " colon={false}>
                      <Button type="primary" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}
        </Space>

        <Title level={4}>USERS</Title>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          locale={customLocale}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      <Modal
        title={<Title level={4}>User Details</Title>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedUser && (
          <>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <Avatar src={selectedUser.avatar} size={64} icon={<UserOutlined />} />
              <div style={{ marginLeft: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedUser.name}
                </Title>
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
  )
}

export default UserManagement

