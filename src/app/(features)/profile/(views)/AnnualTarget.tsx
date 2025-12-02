/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal, Input, Form, DatePicker, message, Select } from "antd";
import type { FormProps } from "antd";
import {
  MoreVertical,
  Eye,
  Trash2,
  Plus,
  Edit2,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
} from "lucide-react";
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
  updateAnnualTarget,
} from "@/utilities/handlers/annualTargetHandler";
import type { Dayjs } from "dayjs";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";
import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const { TextArea } = Input;
const { Option } = Select;

interface CreateTargetFormValues {
  objective: string;
  measured_by: string;
  completed_by: Dayjs;
  upload_path: string;
  status?: string;
}

interface EditTargetFormValues {
  objective?: string;
  measured_by?: string;
  completed_by?: Dayjs;
  upload_path?: string;
  status?: string;
}

export default function MyTargetsView() {
  const [targets, setTargets] = useState<AnnualTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<AnnualTarget | null>(
    null
  );
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
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
        err instanceof Error ? err.message : "Failed to fetch targets";
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

  const handleEditTarget = async (values: EditTargetFormValues) => {
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

      const updateData: any = {};
      if (values.objective) updateData.objective = values.objective;
      if (values.measured_by) updateData.measured_by = values.measured_by;
      if (values.completed_by)
        updateData.completed_by = values.completed_by.format("YYYY-MM-DD");
      if (values.upload_path !== undefined)
        updateData.upload_path = values.upload_path;
      if (values.status) updateData.status = values.status;

      await updateAnnualTarget(token, selectedTarget.id, updateData);
      message.success("Target updated successfully");
      setEditModalVisible(false);
      editForm.resetFields();
      fetchTargets();
    } catch (err) {
      handleErrorMessage(err, "Failed to update target");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD-MMM-YYYY").toUpperCase();
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("DD MMM YYYY, h:mm A");
  };

  const onFinishCreate: FormProps<CreateTargetFormValues>["onFinish"] = (
    values
  ) => {
    handleCreateTarget({
      objective: values.objective,
      measured_by: values.measured_by,
      completed_by: values.completed_by.format("YYYY-MM-DD"),
      upload_path: values.upload_path,
    });
  };

  const onFinishEdit: FormProps<EditTargetFormValues>["onFinish"] = (
    values
  ) => {
    handleEditTarget(values);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader text="Loading my targets..." />
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Targets</h1>
          <p className="text-gray-600">
            How we work is as important as what we deliver. Reflect how you will
            demonstrate our values in your goals.
          </p>
        </div>
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

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((target) => (
          <Card key={target.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
                  {target.objective}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewTarget(target.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTarget(target);
                        editForm.setFieldsValue({
                          objective: target.objective,
                          measured_by: target.measured_by,
                          completed_by: target.completed_by
                            ? dayjs(target.completed_by)
                            : null,
                          upload_path: target.upload_path,
                          status: target.status,
                        });
                        setEditModalVisible(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Measured By */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Measured By
                  </p>
                  <p className="text-sm text-gray-900">{target.measured_by}</p>
                </div>

                {/* Status and Date */}
                <div className="flex justify-between items-center">
                  <Badge
                    className={`${getStatusColor(
                      target.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(target.status)}
                    {target.status.replace("_", " ")}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(target.completed_by)}
                  </div>
                </div>

                {/* Upload Path */}
                {target.upload_path && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Upload className="w-4 h-4" />
                      <span className="truncate">{target.upload_path}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {targets.length === 0 && !error && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No targets found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first target to get started on your goals
            </p>
            <Button
              onClick={() => setCreateModalVisible(true)}
              className="bg-[#251F99] hover:bg-[#251F99]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Target
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Target Modal */}
      <Modal
        title="Create New Target"
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
          onFinish={onFinishCreate}
          className="mt-4"
        >
          <Form.Item
            name="objective"
            label="Objective"
            rules={[{ required: true, message: "Please enter the objective" }]}
          >
            <TextArea
              rows={3}
              placeholder="What do you want to achieve? (e.g., Complete Databricks Certification)"
            />
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
            <Input placeholder="How will success be measured? (e.g., Certification completion)" />
          </Form.Item>

          <Form.Item
            name="completed_by"
            label="Complete By"
            rules={[
              { required: true, message: "Please select a completion date" },
            ]}
          >
            <DatePicker
              className="w-full"
              format="DD-MMM-YYYY"
              placeholder="Select completion date"
            />
          </Form.Item>

          <Form.Item name="upload_path" label="Upload Path (Optional)">
            <Input placeholder="Path to supporting documents..." />
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

      {/* Edit Target Modal */}
      <Modal
        title="Edit Target"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form<EditTargetFormValues>
          form={editForm}
          layout="vertical"
          onFinish={onFinishEdit}
          className="mt-4"
        >
          <Form.Item name="objective" label="Objective">
            <TextArea rows={3} placeholder="What do you want to achieve?" />
          </Form.Item>

          <Form.Item name="measured_by" label="Measured By">
            <Input placeholder="How will success be measured?" />
          </Form.Item>

          <Form.Item name="completed_by" label="Complete By">
            <DatePicker
              className="w-full"
              format="DD-MMM-YYYY"
              placeholder="Select completion date"
            />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="not_started">Not Started</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
              <Option value="overdue">Overdue</Option>
            </Select>
          </Form.Item>

          <Form.Item name="upload_path" label="Upload Path">
            <Input placeholder="Path to supporting documents..." />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditModalVisible(false);
                  editForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#251F99] hover:bg-[#251F99]/90"
              >
                Update Target
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
          <div className="mt-4 space-y-6">
            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Objective:
              </label>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {selectedTarget.objective}
              </p>
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-2">
                Measured By:
              </label>
              <p className="text-gray-900">{selectedTarget.measured_by}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-2">
                  Complete By:
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedTarget.completed_by)}
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-2">
                  Status:
                </label>
                <Badge className={`${getStatusColor(selectedTarget.status)}`}>
                  {getStatusIcon(selectedTarget.status)}
                  {selectedTarget.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
            {selectedTarget.upload_path && (
              <div>
                <label className="font-semibold text-gray-700 block mb-2">
                  Upload Path:
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Upload className="w-4 h-4" />
                  {selectedTarget.upload_path}
                </div>
              </div>
            )}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Created:
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(selectedTarget.date_created)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Last Modified:
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(selectedTarget.last_modified)}
                  </p>
                </div>
              </div>
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
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-center mb-2">
            Are you sure you want to delete this target?
          </p>
          {selectedTarget && (
            <p className="font-semibold text-center text-gray-900 mb-2">
              {selectedTarget.objective}
            </p>
          )}
          <p className="text-red-600 text-center text-sm">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
