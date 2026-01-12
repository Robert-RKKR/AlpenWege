// Imports
import type { DropdownProps } from "./PageHeaderDropdownProps";
import classes from "./PageHeader.module.css";
import { NavLink } from "react-router-dom";
import {
  useMantineTheme,
  UnstyledButton,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Button,
  Anchor,
  Group,
  Text,
} from "@mantine/core";

// Dropdown component:
export function PageHeaderDropdown({
  config,
  onItemClick,
  mobile,
}: DropdownProps) {
  
  { /* Mantine theme access for consistent colors and spacing */ }
  const theme = useMantineTheme();

  return (
    <>
      { /* Header section: dropdown label and "view all" link */ }
      <Group justify="space-between" px={mobile ? "md" : undefined}>
        <Text fw={500} fz={mobile ? "md" : "sm"}>
          {config.label}
        </Text>

        <Anchor
          component={NavLink}
          to={config.viewAll.to}
          fz="xs"
        >
          {config.viewAll.label}
        </Anchor>
      </Group>

      { /* Visual separation between header and items */ }
      <Divider my="sm" />

      { /* Grid of dropdown navigation items */ }
      <SimpleGrid cols={2} spacing={0}>
        {config.items.map((item) => (
          <UnstyledButton
            key={item.title}
            className={classes.pageHeaderSubLink}
            component={NavLink}
            to={item.to}
            onClick={onItemClick}
          >
            { /* Single dropdown item with icon and text */ }
            <Group
              wrap="nowrap"
              align="flex-start"
              m={mobile ? "md" : undefined}
            >
              <ThemeIcon size={34} variant="default" radius="md">
                <item.icon
                  size={22}
                  color={theme.colors.blue[6]}
                />
              </ThemeIcon>

              <div>
                <Text size={mobile ? "md" : "sm"} fw={500}>
                  {item.title}
                </Text>
                <Text size={mobile ? "sm" : "xs"} c="dimmed">
                  {item.description}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        ))}
      </SimpleGrid>

      { /* Footer section with description and call-to-action */ }
      <div className={classes.dropdownFooter}>
        <Group justify="space-between">
          <div>
            <Text fw={500} fz="sm">
              {config.footer.title}
            </Text>
            <Text size="xs" c="dimmed">
              {config.footer.description}
            </Text>
          </div>

          <Button
            variant="default"
            component={NavLink}
            onClick={onItemClick}
            className={classes.pageHeaderSubLink}
            to={config.footer.button.to}
          >
            {config.footer.button.label}
          </Button>
        </Group>
      </div>
    </>
  );
}
