// Imports
import { planningMenu, trackingMenu } from "./pageHeaderData";
import { RobertLogo } from "../../../assets/icons/RobertLogo";
import { PageHeaderDropdown } from "./PageHeaderDropdown";
import { useAuthStore } from "../../../stores/authStore";
import { IconChevronDown } from "@tabler/icons-react";
import { NavLink, Link } from "react-router-dom";
import { UserMenu } from "../userMenu/UserMenu";
import { useDisclosure } from "@mantine/hooks";
import classes from "./PageHeader.module.css";
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  useMantineTheme,
  Popover,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
} from "@mantine/core";
import { useState } from "react";

// PageHeader component:
export function PageHeader() {

  { /* State controlling mobile navigation drawer */ }
  const [
    drawerOpened,
    { toggle: toggleDrawer, close: closeDrawer },
  ] = useDisclosure(false);

  { /* State controlling mobile dropdown sections */ }
  const [
    planningOpened,
    { toggle: togglePlanning },
  ] = useDisclosure(false);

  const [
    trackingOpened,
    { toggle: toggleTracking },
  ] = useDisclosure(false);

  { /* Authentication state */ }
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  { /* Mantine theme access for colors and spacing */ }
  const theme = useMantineTheme();

  { /* State control for desktop Popover menu */ }
  const [planningPopoverOpened, setPlanningPopoverOpened] = useState(false);
  const [trackingPopoverOpened, setTrackingPopoverOpened] = useState(false);

  return (
    <Box>
      { /* Header bar (rendered inside AppShell.Header) */ }
      <header className={classes.pageHeader}>
        <Group justify="space-between" h="100%">
          { /* Logo / home navigation */ }
          <UnstyledButton
            component={Link}
            to="/"
            aria-label="Go to homepage"
          >
            <RobertLogo size={40} color={theme.colors.blue[6]} />
          </UnstyledButton>

          { /* Desktop primary navigation */ }
          <Group h="100%" gap={0} visibleFrom="sm">

            {/* Home section (Desktop) */}
            <NavLink to="/" className={classes.pageHeaderLink}>
              Home
            </NavLink>

            { /* Planning section (Desktop) */ }
            <Popover
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
              opened={planningPopoverOpened}
              onChange={setPlanningPopoverOpened}
            >
              <Popover.Target>
                <UnstyledButton
                  className={classes.pageHeaderLink}
                  onClick={() => setPlanningPopoverOpened((o) => !o)}
                >
                  <Center inline mr={10}>
                    <Box component="span" mr={5}>
                      Planning
                    </Box>
                    <IconChevronDown size={16} />
                  </Center>
                </UnstyledButton>
              </Popover.Target>

              <Popover.Dropdown style={{ overflow: "hidden" }}>
                <PageHeaderDropdown
                  config={planningMenu}
                  onItemClick={() => setPlanningPopoverOpened(false)}
                />
              </Popover.Dropdown>
            </Popover>

            { /* Tracking section (Desktop) */ }
            <Popover
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
              opened={trackingPopoverOpened}
              onChange={setTrackingPopoverOpened}
            >
              <Popover.Target>
                <UnstyledButton
                  className={classes.pageHeaderLink}
                  onClick={() => setTrackingPopoverOpened((o) => !o)}
                >
                  <Center inline>
                    <Box component="span" mr={5}>
                      Tracking
                    </Box>
                    <IconChevronDown size={16} />
                  </Center>
                </UnstyledButton>
              </Popover.Target>

              <Popover.Dropdown style={{ overflow: "hidden" }}>
                <PageHeaderDropdown
                  config={trackingMenu}
                  onItemClick={() => setTrackingPopoverOpened(false)}
                />
              </Popover.Dropdown>
            </Popover>

            {/* Compendium section (Desktop) */}
            <NavLink to="/compendium" className={classes.pageHeaderLink}>
              Compendium
            </NavLink>
          </Group>

          { /* Desktop authentication actions (Desktop) */ }
          <Group visibleFrom="sm">
            {!isAuthenticated && (
              <>
                <Button
                  variant="default"
                  component={Link}
                  to="/auth/login"
                >
                  Log in
                </Button>

                <Button component={Link} to="/auth/register">
                  Sign up
                </Button>
              </>
            )}

            {isAuthenticated && <UserMenu />}
          </Group>

          { /* Mobile burger menu toggle (Desktop) */ }
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      { /* Mobile navigation drawer */ }
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          {/* Home section (mobile) */}
          <NavLink
            to="/"
            className={classes.pageHeaderLink}
            onClick={closeDrawer}
          >
            <Center w="100%">
              <Text size="lg">Home</Text>
            </Center>
          </NavLink>

          { /* Planning section (mobile) */ }
          <UnstyledButton
            className={classes.pageHeaderLink}
            onClick={togglePlanning}
          >
            <Center w="100%">
              <Group gap={6}>
                <Box component="span">
                  <Text size="lg">Planning</Text>
                </Box>
                <IconChevronDown size={16} />
              </Group>
            </Center>
          </UnstyledButton>

          <Collapse in={planningOpened}>
            <PageHeaderDropdown
              config={planningMenu}
              onItemClick={closeDrawer}
              mobile
            />
          </Collapse>

          { /* Tracking section (mobile) */ }
          <UnstyledButton
            className={classes.pageHeaderLink}
            onClick={toggleTracking}
          >
            <Center w="100%">
              <Group gap={6}>
                <Box component="span">
                  <Text size="lg">Tracking</Text>
                </Box>
                <IconChevronDown size={16} />
              </Group>
            </Center>
          </UnstyledButton>

          <Collapse in={trackingOpened} mb="lg">
            <PageHeaderDropdown
              config={trackingMenu}
              onItemClick={closeDrawer}
              mobile
            />
          </Collapse>

          {/* Compendium section (mobile) */}
          <NavLink
            to="/compendium"
            className={classes.pageHeaderLink}
            onClick={closeDrawer}
          >
            <Center w="100%">
              <Text size="lg">Compendium</Text>
            </Center>
          </NavLink>

          <Divider my="sm" />

          { /* Mobile authentication actions (mobile) */ }
          <Group justify="center" grow pb="xl" px="md">
            {!isAuthenticated && (
              <>
                <Button
                  onClick={closeDrawer}
                  variant="default"
                  component={Link}
                  to="/auth/login"
                >
                  Log in
                </Button>

                <Button
                  onClick={closeDrawer}
                  component={Link}
                  to="/auth/register"
                >
                  Sign up
                </Button>
              </>
            )}

            {isAuthenticated && <UserMenu mobile={true} onItemClick={closeDrawer} />}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
