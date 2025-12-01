/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal, Input, Form, DatePicker, message } from "antd";
import type { FormProps } from "antd";
import { MoreVertical, Eye, Trash2, Plus } from "lucide-react";
import {
  AnnualTarget,
  CreateAnnualTargetRequest,
} from "@/interface/AnnualTarget";
import { useAccessToken } from "@/store/authStore";
import { tokenUtils } from "@/utilities/cookies";
import dayjs from "dayjs";
import {
  getAnnualTargets,
  createAnnualTarget,
  getAnnualTargetById,
  deleteAnnualTarget,
} from "@/utilities/handlers/annualTargetHandler";
import type { Dayjs } from "dayjs";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";
import Loader from "@/components/common/Loader";

const { TextArea } = Input;

// Define the form values interface that includes the Dayjs object
interface CreateTargetFormValues {
  objective: string;
  measured_by: string;
  completed_by: Dayjs;
  upload_path: string;
}

export default function AnnualTargetView() {
  const [targets, setTargets] = useState<AnnualTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<AnnualTarget | null>(
    null
  );
  const [createForm] = Form.useForm();
  const accessToken = useAccessToken();

  const fetchTargets = async () => {
    try {
      setLoading(true);
      setError(null);

      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required");
      }

      const data = await getAnnualTargets(token);
      setTargets(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch annual targets";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, [accessToken]);

  const handleCreateTarget = async (values: CreateAnnualTargetRequest) => {
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required");
      }

      await createAnnualTarget(token, values);
      message.success("Target created successfully");
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchTargets();
    } catch (err) {
      handleErrorMessage(err, "Failed to create target");
    }
  };

  const handleViewTarget = async (targetId: number) => {
    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required");
      }

      const target = await getAnnualTargetById(token, targetId);
      setSelectedTarget(target);
      setViewModalVisible(true);
    } catch (err) {
      handleErrorMessage(err, "Failed to fetch target details");
    }
  };

  const handleDeleteTarget = async () => {
    if (!selectedTarget) return;

    try {
      let token = accessToken;
      if (!token) {
        const { accessToken: cookieToken } = tokenUtils.getTokens();
        token = cookieToken;
      }

      if (!token) {
        throw new Error("Authentication required");
      }

      await deleteAnnualTarget(token, selectedTarget.id);
      message.success("Target deleted successfully");
      setDeleteModalVisible(false);
      setSelectedTarget(null);
      fetchTargets();
    } catch (err) {
      handleErrorMessage(err, "Failed to delete target");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const onFinish: FormProps<CreateTargetFormValues>["onFinish"] = (values) => {
    // Convert Dayjs object to string format expected by API
    handleCreateTarget({
      objective: values.objective,
      measured_by: values.measured_by,
      completed_by: values.completed_by.format("YYYY-MM-DD"),
      upload_path: values.upload_path,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader text="Loading annual targets..." />
      </div>
    );
  }

  if (error && targets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Annual Targets</h1>
        <Button
          onClick={() => setCreateModalVisible(true)}
          className="flex items-center gap-2 bg-[#251F99] hover:bg-[#251F99]/90"
        >
          <Plus className="w-4 h-4" />
          Add Target
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Objective</TableHead>
              <TableHead>Measured By</TableHead>
              <TableHead>Completed By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {targets.map((target) => (
              <TableRow key={target.id}>
                <TableCell className="font-medium">
                  {target.objective}
                </TableCell>
                <TableCell>{target.measured_by}</TableCell>
                <TableCell>{formatDate(target.completed_by)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      target.status
                    )}`}
                  >
                    {target.status.replace("_", " ").toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>{formatDate(target.date_created)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewTarget(target.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTarget(target);
                          setDeleteModalVisible(true);
                        }}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {targets.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No annual targets found. Create your first target to get started.
          </div>
        )}
      </div>

      {/* Create Target Modal */}
      <Modal
        title="Create Annual Target"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form<CreateTargetFormValues>
          form={createForm}
          layout="vertical"
          onFinish={onFinish}
          className="mt-4"
        >
          <Form.Item
            name="objective"
            label="Objective"
            rules={[{ required: true, message: "Please enter the objective" }]}
          >
            <TextArea rows={3} placeholder="Enter your objective..." />
          </Form.Item>

          <Form.Item
            name="measured_by"
            label="Measured By"
            rules={[
              {
                required: true,
                message: "Please enter how this will be measured",
              },
            ]}
          >
            <Input placeholder="How will this objective be measured?" />
          </Form.Item>

          <Form.Item
            name="completed_by"
            label="Completed By"
            rules={[
              { required: true, message: "Please select a completion date" },
            ]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="upload_path" label="Upload Path">
            <Input placeholder="Optional upload path..." />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#251F99] hover:bg-[#251F99]/90"
              >
                Create Target
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Target Modal */}
      <Modal
        title="Target Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedTarget && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Objective:</label>
              <p className="mt-1 text-gray-900">{selectedTarget.objective}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Measured By:
              </label>
              <p className="mt-1 text-gray-900">{selectedTarget.measured_by}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Completed By:
              </label>
              <p className="mt-1 text-gray-900">
                {formatDate(selectedTarget.completed_by)}
              </p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Status:</label>
              <p className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedTarget.status
                  )}`}
                >
                  {selectedTarget.status.replace("_", " ").toUpperCase()}
                </span>
              </p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Upload Path:
              </label>
              <p className="mt-1 text-gray-900">
                {selectedTarget.upload_path || "Not specified"}
              </p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Created:</label>
              <p className="mt-1 text-gray-900">
                {formatDate(selectedTarget.date_created)}
              </p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">
                Last Modified:
              </label>
              <p className="mt-1 text-gray-900">
                {formatDate(selectedTarget.last_modified)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Target"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedTarget(null);
        }}
        footer={[
          <Button
            key="cancel"
            variant="outline"
            onClick={() => {
              setDeleteModalVisible(false);
              setSelectedTarget(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            variant="destructive"
            onClick={handleDeleteTarget}
          >
            Delete
          </Button>,
        ]}
        width={400}
      >
        <div className="mt-4">
          <p>Are you sure you want to delete this target?</p>
          {selectedTarget && (
            <p className="font-semibold mt-2 text-gray-900">
              {selectedTarget.objective}
            </p>
          )}
          <p className="text-red-600 mt-2">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
