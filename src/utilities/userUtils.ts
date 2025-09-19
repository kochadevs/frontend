import { UserProfile } from "../interface/auth/login";

export const getUserInitials = (user: UserProfile | null): string => {
  if (!user) return "??";
  
  const firstName = user.first_name?.trim() || "";
  const lastName = user.last_name?.trim() || "";
  
  if (firstName && lastName) {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  } else if (firstName) {
    return firstName.charAt(0).toUpperCase();
  } else if (lastName) {
    return lastName.charAt(0).toUpperCase();
  } else if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return "??";
};

export const getUserDisplayName = (user: UserProfile | null): string => {
  if (!user) return "Unknown User";
  
  const firstName = user.first_name?.trim() || "";
  const lastName = user.last_name?.trim() || "";
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else if (user.email) {
    return user.email.split("@")[0];
  }
  
  return "Unknown User";
};