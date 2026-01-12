// Imports:
import { pageFooterNavigationLinks, pageFooterSocialLinks } from "./pageFooterData";
import { ActionIcon, Anchor, Group, Box, Center } from '@mantine/core';

// Page footer component:
export function PageFooter() {

  // Generate navigation links items:
  const navigationItems = pageFooterNavigationLinks.map((item) => (
    <Anchor
      key={item.label}
      href={item.href}
      size="sm"
      lh={1}
      c="dimmed"
    >
      {item.label}
    </Anchor>
  ));

  // Generate social links items:
  const socialItems = pageFooterSocialLinks.map((item) => (
    <ActionIcon
      key={item.label}
      component="a"
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      size={22}
      variant="subtle"
      radius="xl"
      aria-label={item.label}
    >
      <item.icon size={14} />
    </ActionIcon>
  ));

  return (
    <Box h={40} px="sm">
      <Center h="100%">
        <Group gap="md">

          {/* Navigation links */}
          <Group gap="sm">{navigationItems}</Group>

          {/* Social links */}
          <Group gap={4}>{socialItems}</Group>

        </Group>
      </Center>
    </Box>
  );
}
