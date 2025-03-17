"use client"

import { useState } from "react"
import { deleteSupplier } from "@/api/supplier/page"
import { useNotification } from "./NotificationService"
import {
  Table,
  Button,
  Input,
  Modal,
  Space,
  Card,
  Typography,
  Select,
  Row,
  Col,
  Tag,
  Descriptions,
  Divider,
  Empty,
  Form,
} from "antd"
import { FilterOutlined, SearchOutlined, PhoneOutlined } from "@ant-design/icons"

const { Search } = Input
const { Title, Text } = Typography
const { Option } = Select

const SupplierManagement = ({ suppliers, updateStatus }) => {
  const [status, setStatus] = useState("")
  const [localShowForm, setLocalShowForm] = useState(false)
  const [localSelectedSupplier, setLocalSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const notify = useNotification()
  const [form] = Form.useForm()

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    address: "",
    status: "",
  })

  const handleViewMore = (supplier) => {
    setLocalSelectedSupplier(supplier)
    setStatus(supplier.deleted_at ? "Inactive" : "Active")
    setLocalShowForm(true)
  }

  const handleSubmit = async (id) => {
    try {
      const response = await deleteSupplier(id)
      if (!response) throw new Error("No response from server")

      notify("Supplier has been deleted.", "", "topRight")
      updateStatus()
    } catch (error) {
      console.error("Error deleting supplier:", error)
      notify("An error occurred. Please try again.", "error", "topRight")
    }

    setLocalShowForm(false)
  }

  const resetFilters = () => {
    form.resetFields()
    setFilters({
      name: "",
      phone: "",
      address: "",
      status: "",
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

  // Apply all filters to the supplier list
  const getFilteredSuppliers = () => {
    let filteredData = suppliers

    // Apply search term (global search)
    if (searchTerm) {
      filteredData = filteredData.filter(
        (supplier) =>
          supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply advanced filters
    if (filters.name) {
      filteredData = filteredData.filter((supplier) =>
        supplier.name?.toLowerCase().includes(filters.name.toLowerCase()),
      )
    }

    if (filters.phone) {
      filteredData = filteredData.filter((supplier) =>
        supplier.phone?.toLowerCase().includes(filters.phone.toLowerCase()),
      )
    }

    if (filters.address) {
      filteredData = filteredData.filter((supplier) =>
        supplier.address?.toLowerCase().includes(filters.address.toLowerCase()),
      )
    }

    if (filters.status) {
      if (filters.status === "active") {
        filteredData = filteredData.filter((supplier) => !supplier.deleted_at)
      } else if (filters.status === "inactive") {
        filteredData = filteredData.filter((supplier) => supplier.deleted_at)
      }
    }

    return filteredData
  }

  const filteredSuppliers = getFilteredSuppliers()
  const customLocale = {
    emptyText: (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Text>No suppliers found. Please try different search criteria.</Text>}
      />
    ),
  }

  const handleFilterChange = (changedValues, allValues) => {
    setFilters({
      name: allValues.name || "",
      phone: allValues.phone || "",
      address: allValues.address || "",
      status: allValues.status || "",
    })
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
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
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewMore(record)}>
          View more
        </Button>
      ),
    },
  ]

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Space style={{ marginBottom: 16, width: "100%" }} direction="vertical">
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="Search by name, phone or address"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <Form.Item name="phone" label="Phone" rules={[{ validator: validatePhoneNumber }]}>
                      <Input placeholder="Filter by phone" allowClear prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="address" label="Address">
                      <Input placeholder="Filter by address" allowClear />
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

        <Title level={4}>SUPPLIERS</Title>
        <Table
          columns={columns}
          dataSource={filteredSuppliers}
          rowKey="id"
          locale={customLocale}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Total ${total} suppliers`,
          }}
        />
      </Card>

      {/* Modal Form */}
      {localShowForm && localSelectedSupplier && (
        <Modal
          title={<Title level={4}>Update Status for {localSelectedSupplier.name}</Title>}
          open={localShowForm}
          onCancel={() => setLocalShowForm(false)}
          footer={[
            <Button key="cancel" onClick={() => setLocalShowForm(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={() => handleSubmit(localSelectedSupplier.id)}>
              Update
            </Button>,
          ]}
          width={600}
        >
          <Divider />
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{localSelectedSupplier.name}</Descriptions.Item>
            <Descriptions.Item label="Phone">{localSelectedSupplier.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{localSelectedSupplier.address}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Select style={{ width: "100%" }} value={status} onChange={(value) => setStatus(value)}>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </div>
  )
}

export default SupplierManagement

