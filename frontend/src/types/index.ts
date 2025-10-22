export type PermissionSet = {
  read: boolean;
  write: boolean;
  delete: boolean;
};

export type User = {
  id: number;
  email: string;
  alias: string;
  isAdmin: boolean;
  permissions: PermissionSet;
};

export type Status = {
  id: number;
  name: string;
  color: string;
};

export type TreeNode = {
  id: number;
  parent_id: number | null;
  level: 'project' | 'major' | 'medium' | 'task';
  name: string;
  status_id: number | null;
  status_name?: string;
  status_color?: string;
  start_date: string | null;
  end_date: string | null;
  sort_order: number | null;
  assignees: { id: number; alias: string }[];
  children?: TreeNode[];
};

export type FlatNode = TreeNode & { children?: TreeNode[] };

export type Todo = {
  id: number;
  node_id: number;
  title: string;
  accomplished: string;
  created_at: string;
  expected_end_date: string | null;
  status: string;
  node_name?: string;
  level?: string;
};

export type FileAttachment = {
  id: number;
  node_id: number;
  original_name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  node_name?: string;
  level?: string;
};

export type Settings = {
  session_timeout_minutes: string;
  highlight_color: string;
  memo_font_size: string;
  attachment_root: string;
};

export type AuthResponse = {
  token: string;
  expiresIn: number;
  user: User;
  settings: Settings;
};

export type AdminUser = {
  id: number;
  email: string;
  alias: string;
  status: 'pending' | 'active' | 'disabled';
  is_admin: number;
  can_read: number;
  can_write: number;
  can_delete: number;
};
