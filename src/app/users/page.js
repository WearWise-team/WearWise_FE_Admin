import Table from '@/components/Table';
import React from 'react'

const UsersPage = () => {
    const columns = ["ID", "Name", "Email", "Role"];
    const data = [
      { ID: 1, Name: "John Doe", Email: "john@example.com", Role: "Admin" },
      { ID: 2, Name: "Jane Smith", Email: "jane@example.com", Role: "User" },
    ];
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Users</h1>
        <Table columns={columns} data={data} />
      </div>
    );
  };

export default UsersPage