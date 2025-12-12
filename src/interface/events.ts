export interface Event {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  image_url: string;
  id: number;
  date_created: string;
  last_modified: string;
  is_active: boolean;
  created_by: number;
}


export interface EventPayload {
  title: string;
  description: string;
  start_date: string; // ISO datetime
  end_date: string; // ISO datetime
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  location: string;
  image_url: string;
  is_active?: boolean // for updating
}
