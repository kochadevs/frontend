// interface/AnnualTarget.ts

export type TargetStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "overdue";

// Base interface for creating a target (without auto-generated fields)
export interface CreateAnnualTargetRequest {
  objective: string;
  measured_by: string;
  completed_by: string;
  upload_path: string;
}

// Interface for updating a target (all fields optional)
export interface UpdateAnnualTargetRequest {
  objective?: string;
  measured_by?: string;
  completed_by?: string;
  upload_path?: string;
  status?: TargetStatus;
}

// Full target interface with all fields (for GET responses)
export interface AnnualTarget {
  objective: string;
  measured_by: string;
  completed_by: string;
  upload_path: string;
  status: TargetStatus;
  id: number;
  user_id: number;
  date_created: string;
  last_modified: string;
}
