export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  nationality: string;
  location: string;
  phone: string;
  is_active: boolean;
  email_verified: boolean;
  profile_pic: string;
  cover_photo: string;
  about: string;
  user_type: string;
  social_links: {
    linkedin: string;
    twitter: string;
    website: string;
    portfolio: string;
  };
  availability: {
    days: string[];
    times: string[];
  };
  password: string;
  password_confirmation: string;
}
