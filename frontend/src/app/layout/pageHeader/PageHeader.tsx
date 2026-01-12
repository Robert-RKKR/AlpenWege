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
  HoverCard,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
} from "@mantine/core";

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

          { /* ====== Desktop primary navigation ====== */ }
          <Group h="100%" gap={0} visibleFrom="sm">

            {/* Home section (Desktop) */}
            <NavLink to="/" className={classes.pageHeaderLink}>
              Home
            </NavLink>

            { /* Planning section (Desktop) */ }
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <NavLink to="/plans" className={classes.pageHeaderLink}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Planning
                    </Box>
                    <IconChevronDown size={16} />
                  </Center>
                </NavLink>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <PageHeaderDropdown config={planningMenu} />
              </HoverCard.Dropdown>
            </HoverCard>

            { /* Tracking section (Desktop) */ }
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <NavLink to="/explorer/track" className={classes.pageHeaderLink}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Tracking
                    </Box>
                    <IconChevronDown size={16} />
                  </Center>
                </NavLink>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <PageHeaderDropdown config={trackingMenu} />
              </HoverCard.Dropdown>
            </HoverCard>

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

      { /* ====== Mobile navigation drawer ====== */ }
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
