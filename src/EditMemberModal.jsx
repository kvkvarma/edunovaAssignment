import React, { useState, useEffect, useRef } from 'react';

const EditMemberModal = ({ isOpen, onClose, onSave, memberData }) => {
  const [formData, setFormData] = useState({ ...memberData });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (memberData) {
      setFormData({ ...memberData });
    }
  }, [memberData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, PhotoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.PhotoUrl || 'userimage.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer"
            onClick={handlePhotoClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              name="Name"
              value={formData.Name || ''}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email || ''}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Role:</label>
            <input
              type="text"
              name="Role"
              value={formData.Role || ''}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Status:</label>
            <input
              type="text"
              name="Status"
              value={formData.Status || ''}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
          <button onClick={handleSave} className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;
