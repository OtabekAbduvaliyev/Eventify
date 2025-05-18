import { Dropdown, Input, Modal, Space } from "antd";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { BsTable, BsThreeDotsVertical } from "react-icons/bs";
import { IoAddCircleOutline, IoSearch } from "react-icons/io5";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../AxiosInctance/AxiosInctance";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdCalendar } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { FaListUl } from "react-icons/fa";
import SheetTabel from "./SheetTabel";
import CreateSheetFormModal from "./CreateEditSheetFormModal";
import Selecter from "../../Pagination and selecter/Selecter";

const Sheets = () => {
  const { id } = useParams(); // workspace ID
  const { sheetId } = useParams(); // sheet ID
  const [editingSheetId, setEditingSheetId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSheetName, setEditingSheetName] = useState("");
  const [editingSheetOrder, setEditingSheetOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { createTask } = useContext(AuthContext);

  const {
    isLoading,
    error,
    data: sheets,
    refetch,
  } = useQuery({
    queryKey: ["sheets", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/workspace/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    staleTime: 300000,
    enabled: !!id,
  });

  useEffect(() => {
    if (sheets?.sheets.length && !sheetId) {
      // Navigate to the first sheet if sheetId is not provided
      navigate(`/dashboard/workspace/${id}/${sheets.sheets[0].id}`);
    }
  }, [sheets, sheetId, id, navigate]);

  const handleToggleModal = useCallback(async () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setIsEditing(false);
      // setSheet({ name: "", workspaceId: id });
      setEditingSheetId(null);
    }
  }, [isOpen, id]);

  const handleEdit = (workspace) => {
    setIsEditing(true);
    setEditingSheetId(workspace.id);
    setEditingSheetOrder(workspace.order);
    setEditingSheetName(workspace.name);
    setIsOpen(true);
  };

  const handleDelete = async (sheetId) => {
    await axiosInstance.delete(`/sheet/${sheetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    refetch();
  };

  const items = (sheetId, sheetOrder, sheetName) => [
    {
      key: "1",
      label: (
        <Link
          className="flex items-center gap-[20px]"
          onClick={() => handleEdit({ id: sheetId, order: sheetOrder, name: sheetName })}
        >
          <p className="text-[14px] font-radioCanada">Edit</p>
          <MdEdit />
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className="flex items-center gap-[10px] text-red-500"
          onClick={() => handleDelete(sheetId)}
        >
          <p className="text-[14px] font-radioCanada">Delete</p>
          <MdDelete />
        </div>
      ),
      disabled: false,
    },
  ];

  const { isLoading: taskLoading, error: errorTask, data, refetch: taskRefetch } = useQuery({
    queryKey: ["tasks", sheetId],
    queryFn: async () =>
      await axiosInstance.get(`/task/${sheetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  const addNewTask = async () => {
    const newTask = {
      sheetId: sheetId, // unique ID for each task
      name: "",
      status: "",
      // members: [
      //   ""
      // ],
      priority: "",
      link: "",
      price: 100,
      paid: true,
      // startDate: "Jan 19,2034",
      // endDate: "Jan 19,2034",
    };
    await createTask(newTask);
    taskRefetch();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (data?.data?.tasks) {
      if (!searchQuery.trim()) {
        setFilteredTasks(data.data.tasks);
        return;
      }
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = data.data.tasks.filter((task) =>
        Object.values(task).some((value) =>
          value && value.toString().toLowerCase().includes(lowercaseQuery)
        )
      );
      setFilteredTasks(filtered);
    }
  }, [searchQuery, data?.data?.tasks]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const tasks = filteredTasks;

  return (
    <>
      <div className="sheets mt-[27px] text-white gap-[10px] flex">
        <CreateSheetFormModal
          handleToggleModal={handleToggleModal}
          isOpen={isOpen}
          refetch={refetch}
          isEditing={isEditing}
          editingSheetId={editingSheetId}
          editingSheetOrder={editingSheetOrder}
          editingSheetName={editingSheetName}
        />
        {sheets?.sheets.map((sheet) => (
          <Link
            key={sheet.id}
            to={`/dashboard/workspace/${id}/${sheet.id}`}
            className="sheet flex items-center gap-[6px] hover:bg-gray transition-all duration-1000 bg-grayDash rounded-[9px] pl-[12px] pr-[6px] py-[6px] inline-flex cursor-pointer"
          >
            <p>{!sheet.name == "" ? sheet.name : "Untitled"}</p>
            <Dropdown trigger={["click"]} menu={{ items: items(sheet.id, sheet.order, sheet.name) }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <BsThreeDotsVertical
                    className={`cursor-pointer text-[10px] ${sheetId == sheet.id ? "block" : "hidden"}`}
                  />
                </Space>
              </a>
            </Dropdown>
          </Link>
        ))}

        <div
          className="sheet flex items-center gap-[6px] bg-grayDash rounded-[9px] hover:bg-gray transition-all duration-1000 px-[6px] py-[7px] cursor-pointer"
          onClick={handleToggleModal}
        >
          <IoAddCircleOutline className="text-[20px]" />
        </div>
      </div>
      <div className="sheetActions mt-[47.5px] flex gap-[14px] items-center justify-between border-b pb-[21px] border-gray3">
        <div className="flex gap-[18px]">
          <div className="newProject">
            <button className="flex bg-white py-[11.5px] px-[12px] items-center rounded-[9px] text-pink2 gap-[10px]" onClick={addNewTask}>
              <IoAddCircleOutline className="text-[22px]" />
              <p className="font-[500] text-[14px]">New project</p>
            </button>
          </div>
          <div className="search inputsr">
            <Input
              prefix={<IoSearch className="text-[21px]" />}
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-grayDash font-radioCanada text-[14px] hover:bg-grayDash outline-none text-white active:bg-grayDash focus:bg-grayDash overflow-hidden border-none w-[210px] h-[46px]"
            />
          </div>
          <div className="filter flex bg-grayDash p-[11px] inline-flex items-center text-white gap-[9px] rounded-[8px]">
            <CiFilter className="text-[22px]" />
            <p>Filter</p>
          </div>
          <div className="delet flex bg-grayDash p-[11px] inline-flex items-center text-white gap-[9px] rounded-[8px]">
            <MdDelete className="text-[22px]" />
            <p>Delete</p>
          </div>
        </div>
        <div className="items-center flex gap-[16px]">
          <div className="text-white flex items-center gap-[6px]">
            <BsTable />
            <p>Table</p>
          </div>
          <div className="text-white flex items-center gap-[6px]">
            <FaListUl className="text-[18px]"/>
            <p>Table</p>
          </div>
          <div className="text-white flex items-center gap-[6px]">
            <IoMdCalendar className="text-[21px]"/>
            <p>Table</p>
          </div>
        </div>
      </div>
      <SheetTabel tasks={tasks} />
    </>
  );
};

export default Sheets;