import React, { useMemo, useState, useEffect } from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiFilter, CiSearch } from "react-icons/ci";
import { useReactTable, getCoreRowModel, flexRender,getPaginationRowModel } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import mData from '../MOCK_DATA';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';
import { MdWindow } from "react-icons/md";

const DetailsPanel = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed items-center right-0 top-0 bg-white shadow-lg border border-gray-300 p-4 overflow-y-auto"
         style={{
           width: '50%', 
           height: '100%',
           maxWidth: '600px', 
           maxHeight: '100%',
           transition: 'transform 0.3s ease-in-out',
           transform: member ? 'translateX(0)' : 'translateX(100%)'
         }}
    >
      <img src="userimage.png" className='h-32 mt-4' alt="" />
      <button onClick={onClose} className="absolute top-2 right-2 ">
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4 mt-2">{member.Name}</h2>
      <p><strong>Status:</strong> {member.Status}</p>
      <p><strong>Role:</strong> {member.Role}</p>
      <p><strong>Email:</strong> {member.Email}</p>
    </div>
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mData);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [isDetailsPanelVisible, setIsDetailsPanelVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activePage, setActivePage] = useState('overview'); // New state to track active page

  const data = useMemo(() => filteredData, [filteredData]);

  const columns = [
    { header: 'Name', accessorKey: 'Name' },
    { header: 'Status', accessorKey: 'Status' },
    { header: 'Role', accessorKey: 'Role' },
    { header: 'Email', accessorKey: 'Email' },
    { header: 'Teams', accessorKey: 'Teams' },
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(),getPaginationRowModel:getPaginationRowModel() });

  const applyFilters = () => {
    const lowercasedFilter = searchTerm ? searchTerm.toLowerCase() : '';
  
    const filtered = mData.filter(item => {
      const itemName = item.Name ? item.Name.toLowerCase() : '';
  
      return (
        itemName.includes(lowercasedFilter) &&
        (selectedRole === "" || item.Role === selectedRole) &&
        (selectedTeam === "" || item.Teams === selectedTeam)
      );
    });
  
    setFilteredData(filtered);
  };
  

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedRole, selectedTeam]);

  const handleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleAddMember = (newMember) => {
    const newMemberData = {
      ...newMember,
      id: Date.now(), 
    };

    setFilteredData(prevData => [...prevData, newMemberData]);
    setIsModalOpen(false);
  };

  const handleEditMember = (updatedMember) => {
    setFilteredData(prevData => 
      prevData.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setIsEditModalOpen(false);
  };

  const handleRowClick = (member) => {
    setSelectedMember(member);
    setIsDetailsPanelVisible(true);
  };
  
  const handleDeleteMember = (id, e) => {
    e.stopPropagation(); 
    setFilteredData(prevData => prevData.filter(member => member.id !== id));
  };
  
  const openEditModal = (member, e) => {
    e.stopPropagation(); 
    setCurrentMember(member);
    setIsEditModalOpen(true);
  };
  

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center bg-white shadow p-4">
        <div className="text-purple-600 text-2xl font-bold">PEOPLE.CO</div>
        <div className="flex items-center space-x-4">
          <span className="cursor-pointer">
            <IoIosNotificationsOutline size={23} />
          </span>
          <div className="flex items-center">
            <img
              src="newuser.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-2 font-medium">Jay Antony</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-gray-100 w-64 p-4">
          <nav>
            <ul>
              <li className="mb-4">
                <a
                  href="#"
                  onClick={() => setActivePage('overview')}
                  className={`flex items-center p-2 text-gray-700 hover:bg-purple-100 rounded ${activePage === 'overview' ? 'bg-purple-200' : ''}`}
                >
                <MdWindow size={25} color='purple'/>  <span className='ml-1'>Overview</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => setActivePage('peopleDirectory')}
                  className={`flex items-center p-2 text-gray-700 hover:bg-purple-100 rounded ${activePage === 'peopleDirectory' ? 'bg-purple-200' : ''}`}
                >
                <MdWindow size={25} color='purple'/> <span className='ml-1'>People Directory</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 p-8">
          {activePage === 'overview' ? (
            <div className="flex text-center text-xl font-semibold">
              <p>Hi Jane Doe</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold">Team members</h1>
                  <span className="ml-4 bg-purple-100 text-purple-600 text-sm font-medium px-3 py-1 rounded-full">
                    {filteredData.length} users
                  </span>
                </div>

                <div className="flex items-center relative">
                  <div className="relative">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded w-80 border-b-2 border-gray-500"
                      />
                      <button
                        type="submit"
                        className="material-icons absolute top-2 right-2 text-gray-400"
                        onClick={applyFilters}
                      >
                        <CiSearch color="purple" size={23} />
                      </button>
                    </form>
                  </div>
                  <div className="relative">
                    <button onClick={handleFilter} className="py-2 px-4 rounded">
                      <CiFilter size={25} />
                    </button>
                    {isFilterVisible && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded">
                        <div className="p-4">
                          <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Roles</label>
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="border p-2 rounded"
                            >
                              <option value="">All Roles</option>
                              <option value="Frontend Developer">Frontend Developer</option>
                              <option value="Backend Developer">Backend Developer</option>
                              <option value="Product Manager">Product Manager</option>
                              <option value="UX Designer">UX Designer</option>
                            </select>
                          </div>
                          <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Teams</label>
                            <select
                              value={selectedTeam}
                              onChange={(e) => setSelectedTeam(e.target.value)}
                              className="border p-2 rounded"
                            >
                              <option value="">All Teams</option>
                              <option value="Design">Design</option>
                              <option value="Product">Product</option>
                              <option value="Marketing">Marketing</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 text-white py-2 px-4 rounded"
                  >
                    + Add Member
                  </button>
                </div>
              </div>

              <table className="w-full table-auto bg-white font-light text-sm shadow rounded">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr className="bg-gray-100 text-left" key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th className="py-2 px-4" key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr
                      className="border-t cursor-pointer hover:bg-gray-100"
                      key={row.id}
                      onClick={() => handleRowClick(row.original)} 
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className={`
                            py-2 
                            ${cell.column.id === "Name" ? "px-4 flex items-center" : ""} 
                            ${cell.column.id === "Teams" ? "px-2 bg-gray-50" : ""}
                            ${cell.column.id === "Email" ? "px-2" : "px-4"}
                          `}
                        >
                          {cell.column.id === "Name" ? (
                            <>
                              <img
                                src="userimage.png"
                                alt="User"
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="font-semibold">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </p>
                                <p className="text-gray-500">@{row.original.Username}</p>
                              </div>
                            </>
                          ) : cell.column.id === "Status" ? (
                            <span className="px-2 py-1 border border-gray-500 rounded font-semibold text-gray-500">
                              <span className="text-green-500">&#9679;</span>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </span>
                          ) : cell.column.id === "Teams" ? (
                            <div className="w-80 flex items-center">
                              <span className="bg-purple-100 text-purple-600 py-1 px-2 rounded-full text-sm mr-2">
                                Design
                              </span>
                              <span className="bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-sm mr-2">
                                Product
                              </span>
                              <span className="bg-pink-100 text-pink-600 py-1 px-2 rounded-full text-sm mr-2">
                                Marketing
                              </span>
                              
                              <button className='ml-10 mr-4'
                                onClick={(e) => handleDeleteMember(row.original.id, e)}
                              >
                                <MdDeleteOutline size={20} />
                              </button>

                              <button 
                                onClick={(e) => openEditModal(row.original, e)}
                              >
                                <MdOutlineModeEdit size={20} />
                              </button>
                            </div>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className='flex justify-evenly mt-2'>
                <button className='bg-gray-300 px-3 py-2 mt-2 rounded-md' onClick={()=> table.setPageIndex(0)}>First Page</button>
                <button className='bg-gray-300 px-3 py-2 mt-2 rounded-md' disabled={!table.getCanPreviousPage()}  onClick={()=> table.previousPage()}>Previous Page</button>
                <button className='bg-gray-300 px-3 py-2 mt-2 rounded-md' disabled={!table.getCanNextPage()} onClick={()=> table.nextPage()}>Next Page</button>
                <button className='bg-gray-300 px-3 py-2 mt-2 rounded-md' onClick={()=> table.setPageIndex(table.getPageCount()-1)}>Last Page</button>
              </div>
            </>
          )}
        </div>
      </div>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMember}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditMember}
        memberData={currentMember}
      />

      {isDetailsPanelVisible && (
        <DetailsPanel
          member={selectedMember}
          onClose={() => setIsDetailsPanelVisible(false)}
        />
      )}
    </div>
  );
};

export default App;
