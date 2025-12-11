// types/team.ts
export type Role = "admin" | "editor" | "viewer";
export type Permission = 'content' | 'carte' | 'view';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastActive: Date;
  updated: Date;
}

export interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, role: Role) => void;
}