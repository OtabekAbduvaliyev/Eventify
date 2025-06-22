import { Dropdown, Space } from "antd";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";
import { AuthContext } from "../../Auth/AuthContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../AxiosInctance/AxiosInctance";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import WorkspaceFormModal from "../Modals/WorkspaceFormModal";

const Workspaces = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track whether creating or editing
  const [showAll, setShowAll] = useState(false);
  const { createWorkspace, dndOrders } = useContext(AuthContext);
  const [workspaceName, setWorkspaceName] = useState({ name: "" });
  const [editingWorkspaceOrder, setEditingWorkspaceOrder] = useState(null); // Store the id of workspace being edited
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null); // Store the id of workspace being edited
  const token = localStorage.getItem("token");
  const { id: activeWorkspaceId } = useParams();
  const navigate = useNavigate(); // Add the navigate hook here
  const {
    isLoading,
    error,
    data: workspacesData,
    refetch,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await axiosInstance.get("/workspace", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    staleTime: 300000, // Cache for 5 minutes
  });

  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    if (workspacesData) {
      setWorkspaces(workspacesData);
    }
  }, [workspacesData]);

  const handleChange = (e) => {
    setWorkspaceName({ ...workspaceName, [e.target.name]: e.target.value });
  };

  const handleToggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setIsEditing(false); // Reset state when modal closes
      setWorkspaceName({ name: "" });
      setEditingWorkspaceId(null);
    }
  }, [isOpen]);

  const handleOk = useCallback(async () => {
    try {
      if (isEditing) {
        console.log(editingWorkspaceOrder);
        
        // Editing existing workspace
        await axiosInstance.put(
          `/workspace/${editingWorkspaceId}`,
          { name: workspaceName.name,order:editingWorkspaceOrder },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Creating new workspace
        await createWorkspace(workspaceName);
      }

      setWorkspaceName({ name: "" });
      handleToggleModal();
      refetch();
    } catch (error) {
      console.error("Error creating/updating workspace:", error);
    }
  }, [createWorkspace, workspaceName, isEditing, editingWorkspaceId, handleToggleModal, refetch]);

  const handleOnDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const reorderedWorkspaces = Array.from(workspaces);
      const [movedWorkspace] = reorderedWorkspaces.splice(
        result.source.index,
        1
      );
      reorderedWorkspaces.splice(result.destination.index, 0, movedWorkspace);

      setWorkspaces(reorderedWorkspaces);

      const workspaceIds = reorderedWorkspaces.map((workspace) => workspace.id);
      const orders = reorderedWorkspaces.map((_, index) => index + 1);

      const resultData = {
        workspaceIds,
        orders,
      };

      dndOrders(resultData);
      updateWorkspaceOrder(resultData);
    },
    [workspaces, dndOrders]
  );

  const updateWorkspaceOrder = async (data) => {
    try {
      await axiosInstance.post("/workspace/updateOrder", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refetch();
    } catch (error) {
      console.error("Error updating workspace order:", error);
    }
  };

  const handleEdit = (workspace) => {
    setIsEditing(true); // Set the modal to editing mode
    setWorkspaceName({ name: workspace.name }); // Pre-fill the modal with the workspace name
    setEditingWorkspaceId(workspace.id); // Track the ID of the workspace being edited
    setEditingWorkspaceOrder(workspace.order)
    setIsOpen(true); // Open the modal
  };

  const handleDelete = async (workspaceId) => {
    try {
      await axiosInstance.delete(`/workspace/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await refetch(); // Refetch the workspaces after deletion
      if (workspaceId === activeWorkspaceId) {
        // If the deleted workspace is the active one, redirect to the first workspace
        if (workspaces.length > 0) {
          navigate(`/dashboard/workspace/${workspaces[0].id}`);
        }
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };
  
  const items = (workspaceId, workspaceOrder) => [
    {
      key: '1',
      label: (
        <div className="flex items-center gap-[20px]" onClick={() => handleEdit({ id: workspaceId, order:workspaceOrder, name: workspaceName.name })}>
          <p className="text-[14px] font-radioCanada">Edit</p>
          <MdEdit />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className="flex items-center gap-[10px] text-red-500" onClick={() => handleDelete(workspaceId)}>
          <p className="text-[14px] font-radioCanada">Delete</p>
          <MdDelete />
        </div>
      ),
      disabled: false,
    },
  ];

  const visibleWorkspaces = showAll ? workspaces : workspaces.slice(0, 3);

  return (
    <div className="bg-grayDash py-[16px] px-[17px] rounded-[17px] font-radioCanada mt-[18px] shadow-xl">
      <WorkspaceFormModal 
        isOpen={isOpen}
        onClose={handleToggleModal}
        isEditing={isEditing}
        workspaceName={workspaceName}
        onWorkspaceNameChange={handleChange}
        onSubmit={handleOk}
      />

      <div className="frLine flex justify-between items-center">
        <h1 className="text-gray2 font-radioCanada text-[16px]">Workspaces</h1>
        {workspaces.length > 3 && (
          <button 
            onClick={() => setShowAll(!showAll)} 
            className="text-white text-[13px] bg-black py-[7px] px-[15px] rounded-[9px]"
          >
            {showAll ? 'Show Less' : 'See All'}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-red-500 py-[10px]">Error occurred at fetching workspaces</p>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="workspaces">
            {(provided) => (
              <div
                className={`secLine my-[12px] space-y-[4px] ${
                  showAll ? 'h-[200px] overflow-y-auto custom-scrollbar horizontal-scroll pr-1' : ''
                }`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {visibleWorkspaces.map((workspace, index) => (
                  <Draggable
                    key={workspace.id}
                    draggableId={workspace.id}
                    index={index}
                  >
                    {(provided) => (
                      <Link
                        to={`/dashboard/workspace/${workspace.id}`}
                        className={`workspace flex items-center text-white bg-grayDash justify-between py-[10px] pl-[21px] pr-[10px] rounded-[8px] ${
                          workspace.id === activeWorkspaceId // Check if active
                            ? "bg-pink2" : 'bg-grayDash'
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="flex items-center gap-[8px]">
                          <p className="text-[18px]">#</p>
                          <p className="text-[14px]">
                            {!isLoading ? workspace.name : "Loading"}
                          </p>
                        </div>
                        <Dropdown
                          trigger={["click"]}
                          menu={{ items: items(workspace.id, workspace.order) }}
                        >
                          <a onClick={(e) => e.preventDefault()}>
                            <Space>
                              <BsThreeDotsVertical className="cursor-pointer" />
                            </Space>
                          </a>
                        </Dropdown>
                      </Link>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Add workspace button */}
      <div className="addWorkspacebutton">
        <button
          className="flex items-center text-white px-[19px] bg-white w-full justify-between py-[10px] rounded-[9px]"
          onClick={handleToggleModal}
        >
          <IoAddCircleOutline className="text-gray4 text-[18px]" />
          <p className="text-gray4 text-[14px]">Add worklist</p>
          <p className="text-pink2 text-[13px]">Pro+</p>
        </button>
      </div>
    </div>
  );
};

export default Workspaces;
