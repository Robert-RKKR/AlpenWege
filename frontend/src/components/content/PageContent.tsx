// Imports
import { Box, Flex, ScrollArea, Divider } from "@mantine/core";
import type { ReactNode, ReactElement } from "react";
import { Children, isValidElement } from "react";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./PageContent.module.css";

// Types:
type PageContentProps = {
  children: ReactNode;
};

type PageContentItemProps = {
  children: ReactNode;
};

/**
 * Optional slot wrapper.
 * If used, area is explicit.
 */
function PageContentItem({ children }: PageContentItemProps) {
  return <>{children}</>;
}

// PageContent Component:
export function PageContent({ children }: PageContentProps) {
  const isMobile = useMediaQuery("(max-width: 48em)");

  /* Normalize children once. */
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];

  // If explicit areas are used, map them:
  const menu = items[0];
  const content = items[1];

  /* Mobile layout */
  if (isMobile) {
    return (
      <ScrollArea h="100%">
        <Box p="md">
          {menu && <Box mb="md">{menu}</Box>}
          {menu && content && <Divider my="sm" />}
          {content && <Box>{content}</Box>}
        </Box>
      </ScrollArea>
    );
  }

  /* Desktop layout */
  return (
    <Flex h="100%" align="stretch" className={classes.wrapper}>
      {/* LEFT MENU */}
      {menu && (
        <Box w={280} className={classes.leftContent}>
          <ScrollArea>
            <Box>{menu}</Box>
          </ScrollArea>
        </Box>
      )}

      {menu && content && <Divider orientation="vertical" size="xs" />}

      {/* MAIN CONTENT */}
      {content && (
        <Box flex={1}>
          <ScrollArea
            className={classes.rightContentScrollArea}
            offsetScrollbars
            scrollbarSize={6}
            scrollHideDelay={100}
          >
            <Box p="md">{content}</Box>
          </ScrollArea>
        </Box>
      )}
    </Flex>
  );
}

/* Slot export */
PageContent.Item = PageContentItem;
