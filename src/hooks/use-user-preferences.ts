import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userPreferencesApi } from '@/lib/api-endponts';
import {
  CreateUserPreferenceInput,
  UpdateUserPreferenceInput,
  UserPreference,
} from '@/types/user-preference';

// =====================================
// 🔑 QUERY KEY
// =====================================

const USER_PREFERENCES_KEY = ['user-preferences'] as const;

// =====================================
// 📥 GET MY PREFERENCES
// =====================================

export const useMyPreferences = () => {
  return useQuery<UserPreference>({
    queryKey: USER_PREFERENCES_KEY,
    queryFn: userPreferencesApi.getMine,
    retry: false, // IMPORTANT : 404 = préférences non créées
  });
};

// =====================================
// ➕ CREATE PREFERENCES
// =====================================

export const useCreatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPreferenceInput) =>
      userPreferencesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_PREFERENCES_KEY,
      });
    },
  });
};

// =====================================
// ✏️ UPDATE PREFERENCES
// =====================================

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPreferenceInput) =>
      userPreferencesApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_PREFERENCES_KEY,
      });
    },
  });
};
