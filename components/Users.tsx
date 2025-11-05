import React, { useState } from 'react';
import { User } from '../types';

// Define components in the same file as they are only used here
// FIX: Changed component definition to React.FC to correctly type props and allow for the 'key' prop.
const TableRow: React.FC<{ user: User }> = ({ user }) => (
  <tr className="border-b border-brand-light">
    <td className="p-4">
      <div className="flex items-center space-x-3">
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
        <span className="font-medium">{user.name}</span>
      </div>
    </td>
    <td className="p-4 text-gray-400">{user.email}</td>
    <td className="p-4">
      <span className="bg-purple-500 text-white px-3 py-1 text-sm rounded-full font-semibold">
        {user.role}
      </span>
    </td>
    <td className="p-4 text-gray-400">
      <div className="flex space-x-4">
        <button className="hover:text-brand-lime">View</button>
        <button className="hover:text-brand-lime">Edit</button>
        <button className="text-red-500 hover:text-red-400">Delete</button>
      </div>
    </td>
  </tr>
);

const Users: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <div className="p-8 text-brand-text">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <button className="bg-brand-lime text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-lime-400 transition-colors">
          Create New User
        </button>
      </div>

      <div className="bg-brand-light shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-dark text-gray-400 uppercase text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => <TableRow key={user.id} user={user} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;