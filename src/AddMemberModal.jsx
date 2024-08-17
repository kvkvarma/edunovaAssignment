import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddMemberModal = ({ isOpen, onClose, onSave }) => {
  const [newMember, setNewMember] = useState({
    Name: '',
    Role: '',
    Status: '',
    Email: '',
    Teams: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(newMember).every(value => value)) {
      onSave({ ...newMember, id: Date.now().toString() }); // Generate a simple unique ID
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="userimage.png"
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 mb-4"
          />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-semibold">Name:</label>
              <input
                type="text"
                name="Name"
                value={newMember.Name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Email:</label>
              <input
                type="email"
                name="Email"
                value={newMember.Email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Role:</label>
              <input
                type="text"
                name="Role"
                value={newMember.Role}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Status:</label>
              <input
                type="text"
                name="Status"
                value={newMember.Status}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddMemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddMemberModal;
