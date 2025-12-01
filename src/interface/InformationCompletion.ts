export interface ProfileDetails {
  user_type: string;
  total_fields: number;
  completed_fields: number;
  percentage: number;
  missing_fields: string[];
}

export interface AnnualTargetsSummary {
  total_targets: number;
  completed_targets: number;
  in_progress_targets: number;
  not_started_targets: number;
  overdue_targets: number;
  percentage: number;
}

export interface CompletionDataResponse {
  user_type: string;
  profile_completion_percentage: number;
  annual_target_completion_percentage: number;
  overall_completion_percentage: number;
  profile_details: ProfileDetails;
  annual_targets_summary: AnnualTargetsSummary;
}
