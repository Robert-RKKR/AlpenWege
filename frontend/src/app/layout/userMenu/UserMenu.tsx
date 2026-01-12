// Imports:
import { Menu, Button, Avatar, Group, Tooltip, Divider, Stack, Text } from "@mantine/core";
import { logout } from "../../../modules/profiles/api/authApi";
import { useAuthStore } from "../../../stores/authStore";
import { useNavigate, NavLink } from "react-router-dom";
import type { UserMenuProps } from "./UserMenuProps";
import { userMenuItems } from "./userMenuData";

// UserMenu Component:
export function UserMenu({
  mobile = false,
  onItemClick,
}: UserMenuProps) {
  { /* Router navigation helper */ }
  const navigate = useNavigate();

  { /* Authentication state and helpers */ }
  const { user, refreshToken, clearAuth } = useAuthStore();

  { /* Handles logout flow and local auth cleanup */ }
  async function handleLogout() {
    try {
      { /* Revoke refresh token on backend if available */ }
      if (refreshToken) {
        await logout(refreshToken);
      }
    } finally {
      { /* Clear local auth state and redirect to login */ }
      clearAuth();
      onItemClick?.();
      navigate("/auth/login");
    }
  }

  // User avatar initials:
  const avatarName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

  /* ---------------- Mobile layout (list style) ---------------- */
  if (mobile) {
    return (
      <Stack gap="xs">
        <Text fw={600} ta="center">
          {avatarName}
        </Text>

        {userMenuItems.map((item) => {
          const isLogout = item.action === "logout";
          const Icon = item.icon;

          return isLogout ? (
            <Button
              key={item.key}
              variant="subtle"
              color={item.color}
              fullWidth
              leftSection={<Icon size={18} />}
              onClick={handleLogout}
            >
              {item.title}
            </Button>
          ) : (
            <Button
              key={item.key}
              variant="subtle"
              color="gray"
              fullWidth
              leftSection={<Icon size={18} />}
              component={NavLink}
              to={item.to}
              onClick={onItemClick}
            >
              {item.title}
            </Button>
          );
        })}
      </Stack>
    );
  }

  /* ---------------- Desktop layout (dropdown) ---------------- */
  return (
    <Menu shadow="md" width={220} position="bottom-end">

      { /* Menu trigger: user avatar and name */ }
      <Menu.Target>
        <Button variant="transparent" px="xs">
          <Group gap="xs">
            <Avatar radius="xl" size={32} key={avatarName} name={avatarName} color="initials">
            </Avatar>
          </Group>
        </Button>
      </Menu.Target>

      { /* Dropdown content */ }
      <Menu.Dropdown>
        <Menu.Label>
          {avatarName || "User"}
        </Menu.Label>

        { /* Link to user profile */ }
        {userMenuItems.map((item) => {
          const isLogout = item.action === "logout";
          const Icon = item.icon;

          { /* Logout item uses action handler instead of navigation */ }
          return (
            <>
              {isLogout && (
                <Divider key={`${item.key}-divider`} my="sm" />
              )}

              <Tooltip
                key={item.key}
                label={item.description}
                position="left"
                disabled={isLogout}
              >
                {isLogout ? (
                  <Menu.Item
                    color={item.color}
                    leftSection={<Icon size={16} />}
                    onClick={handleLogout}
                  >
                    {item.title}
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    component={NavLink}
                    to={item.to}
                    color={item.color}
                    leftSection={<Icon size={16} />}
                  >
                    {item.title}
                  </Menu.Item>
                )}
              </Tooltip>
            </>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}
