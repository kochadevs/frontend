/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Upload as UploadIcon,
  File,
  Image as ImageIcon,
  X,
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
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const { TextArea } = Input;
const { Option } = Select;

interface CreateTargetFormValues {
  objective: string;
  measured_by: string;
  completed_by: Dayjs;
  upload_path: string;
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
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

  // Handle file selection and preview
  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      message.error("Please upload only image files (JPEG, PNG, GIF, WebP)");
      return false;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      message.error("File size must be less than 5MB");
      return false;
    }

    setUploadedFile(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadPreview(previewUrl);

    // Set form field value - just the file name as string
    if (createModalVisible) {
      createForm.setFieldValue("upload_path", file.name);
    } else if (editModalVisible) {
      editForm.setFieldValue("upload_path", file.name);
    }

    return true;
  };

  // Handle file removal
  const handleRemoveFile = () => {
    // Revoke the object URL to prevent memory leaks
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }

    setUploadedFile(null);
    setUploadPreview(null);

    if (createModalVisible) {
      createForm.setFieldValue("upload_path", "");
    } else if (editModalVisible) {
      editForm.setFieldValue("upload_path", "");
    }
  };

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

      // Just send the file name as string in upload_path field
      const uploadPathValue = values.upload_path || "";

      await createAnnualTarget(token, {
        ...values,
        upload_path: uploadPathValue,
      });
      message.success("Target created successfully");
      setCreateModalVisible(false);
      createForm.resetFields();
      handleRemoveFile(); // Clean up file preview
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
        updateData.upload_path = values.upload_path || "";
      if (values.status) updateData.status = values.status;

      await updateAnnualTarget(token, selectedTarget.id, updateData);
      message.success("Target updated successfully");
      setEditModalVisible(false);
      editForm.resetFields();
      handleRemoveFile(); // Clean up file preview
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

  const getBorderColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "border-l-red-500";
      case "in_progress":
        return "border-l-yellow-500";
      case "completed":
        return "border-l-green-500";
      case "overdue":
        return "border-l-red-700";
      default:
        return "border-l-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD-MMM-YYYY").toUpperCase();
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("DD MMM YYYY, h:mm A");
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const onFinishCreate: FormProps<CreateTargetFormValues>["onFinish"] = async (
    values
  ) => {
    // Convert Dayjs to string for API
    const apiValues: CreateAnnualTargetRequest = {
      objective: values.objective,
      measured_by: values.measured_by,
      completed_by: values.completed_by.format("YYYY-MM-DD"),
      upload_path: values.upload_path || "",
    };
    handleCreateTarget(apiValues);
  };

  const onFinishEdit: FormProps<EditTargetFormValues>["onFinish"] = async (
    values
  ) => {
    handleEditTarget(values);
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (uploadPreview) {
        URL.revokeObjectURL(uploadPreview);
      }
    };
  }, [uploadPreview]);

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
            Set meaningful targets that reflect your core values. Your goals
            should demonstrate excellence in both process and outcome.
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

      {/* Targets List - Compact Full Width */}
      <div className="space-y-3">
        {targets.map((target) => (
          <Card
            key={target.id}
            className={`hover:shadow-md transition-shadow border-l-4 rounded-none ${getBorderColor(
              target.status
            )}`}
          >
            <CardContent className="px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Content - Objective and Measured By */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 pr-2">
                      {target.objective}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 flex-shrink-0"
                        >
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

                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      MEASURED BY
                    </p>
                    <p className="text-sm text-gray-900 line-clamp-1">
                      {target.measured_by}
                    </p>
                  </div>
                </div>

                {/* Vertical Divider - Hidden on mobile */}
                <div className="hidden md:block h-12 border-r border-gray-200"></div>

                {/* Right Content - Compact metadata */}
                <div className="md:w-auto">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Complete By */}
                    <div className="space-y-1 flex gap-x-2 items-center">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <p className="text-xs font-medium text-gray-500">
                        COMPLETE BY
                      </p>
                      <div className="flex items-center gap-1.5 text-gray-900">
                        <span className="text-sm font-medium">
                          {formatDate(target.completed_by)}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1 flex gap-x-2 items-center">
                      <p className="text-xs font-medium text-gray-500">
                        STATUS
                      </p>
                      <Badge
                        className={`${getStatusColor(
                          target.status
                        )} flex items-center gap-1.5 px-2 py-1 text-xs h-6`}
                      >
                        {getStatusIcon(target.status)}
                        <span className="capitalize">
                          {target.status.replace("_", " ")}
                        </span>
                      </Badge>
                    </div>

                    {/* Uploaded File */}
                    <div className="space-y-1 flex gap-x-2 items-center">
                      <p className="text-xs font-medium text-gray-500">
                        {target.upload_path ? "FILE" : "NO FILE"}
                      </p>
                      {target.upload_path ? (
                        <div
                          className="flex items-center gap-1.5 group cursor-pointer"
                          onClick={() => handleViewTarget(target.id)}
                        >
                          <div className="p-1 bg-gray-100 rounded flex-shrink-0">
                            {target.upload_path.match(
                              /\.(jpg|jpeg|png|gif|webp)$/i
                            ) ? (
                              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <File className="w-3.5 h-3.5 text-gray-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-900 truncate max-w-[100px] group-hover:text-blue-600 transition-colors">
                            {target.upload_path.split("/").pop()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No file attached
                        </p>
                      )}
                    </div>
                  </div>
                </div>
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
          handleRemoveFile();
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

          <Form.Item label="Upload File (Optional)">
            <div className="space-y-4">
              {/* File Upload Area */}
              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#251F99] transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 rounded-full bg-gray-100">
                      <UploadIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border">
                        {uploadedFile.type.startsWith("image/") ? (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <File className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {uploadPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </p>
                      <div className="relative h-48 w-full overflow-hidden rounded-md border">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Form.Item name="upload_path" noStyle>
                <Input type="hidden" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                  handleRemoveFile();
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
          handleRemoveFile();
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

          <Form.Item label="Upload File">
            <div className="space-y-4">
              {/* Show existing file if it exists */}
              {selectedTarget?.upload_path && !uploadedFile && (
                <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border">
                        {selectedTarget.upload_path.match(
                          /\.(jpg|jpeg|png|gif|webp)$/i
                        ) ? (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <File className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedTarget.upload_path}
                        </p>
                        <p className="text-sm text-gray-500">
                          Current file name
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* File Upload Area (for new file) */}
              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#251F99] transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 rounded-full bg-gray-100">
                      <UploadIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">
                        {selectedTarget?.upload_path
                          ? "Upload new file to replace"
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border">
                        {uploadedFile.type.startsWith("image/") ? (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <File className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          New file •{" "}
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* New Image Preview */}
                  {uploadPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        New file preview:
                      </p>
                      <div className="relative h-48 w-full overflow-hidden rounded-md border">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Form.Item name="upload_path" noStyle>
                <Input type="hidden" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditModalVisible(false);
                  editForm.resetFields();
                  handleRemoveFile();
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
                  Uploaded File:
                </label>
                <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border">
                        {selectedTarget.upload_path.match(
                          /\.(jpg|jpeg|png|gif|webp)$/i
                        ) ? (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <File className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedTarget.upload_path}
                        </p>
                        <p className="text-sm text-gray-500">File name</p>
                      </div>
                    </div>
                  </div>
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
