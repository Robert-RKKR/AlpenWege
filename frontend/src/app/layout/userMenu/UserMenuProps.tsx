// UserMenu property types:
export type UserMenuItemProps = {
  key: string;
  title: string;
  description: string;
  to: string;
  icon: React.FC<{ size?: number }>;
  color?: string;
  action?: "logout";
};

export type UserMenuProps = {
  mobile?: boolean;
  onItemClick?: () => void;
};
