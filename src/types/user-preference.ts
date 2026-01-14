export interface UserPreference {
  id: string;
  userId: string;

  categories: string[];
  organizations: string[];
  cities: string[];
  regions: string[];

  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string;

  createdAt: string;
  updatedAt: string;
}

export type CreateUserPreferenceInput = {
  categories?: string[];
  organizations?: string[];
  cities?: string[];
  regions?: string[];
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
};

export type UpdateUserPreferenceInput = Partial<CreateUserPreferenceInput>;
