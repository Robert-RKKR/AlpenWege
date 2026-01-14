// Imports:
import { platformHighlights } from './homePageData';
import { IconCheck } from '@tabler/icons-react';
import classes from './HomePage.module.css';
import { Link } from 'react-router-dom';
import {
  useMantineTheme,
  SimpleGrid,
  Container,
  ThemeIcon,
  Divider,
  Button,
  Grid,
  Text,
  Title,
  Group,
  Badge,
  Card,
  List,
  Image,
  Stack,
  Center,
  Flex,
} from '@mantine/core';

// HomePage component:
export function HomePage() {
  const theme = useMantineTheme();

  /* Platform highlights */
  const platformHighlightCards = platformHighlights.map((item) => (
    <Card
      key={item.title}
      component={Link}
      to={item.to}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      {/* Feature icon */}
      <item.icon size={50} stroke={1.5} color={theme.colors.blue[6]} />

      {/* Feature title */}
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {item.title}
      </Text>

      {/* Feature description */}
      <Text fz="sm" c="dimmed" mt="sm">
        {item.description}
      </Text>
    </Card>
  ));

  return (
    <div className={classes.wrapper}>

      {/* Introduction Section */}
      <Container size="lg" py="xl">

        {/* Mobile-only hero header */}
        <Flex
          direction="column"
          align="center"
          mb="xl"
          hiddenFrom="md"
        >
          <Title order={1}>AlpenWege</Title>

          <Text fz="xl" mt="sm">
            A <span className={classes.introductionHighlight}>better</span> way to explore the Swiss Alps
          </Text>
        </Flex>

        {/* Main introduction layout */}
        <Grid align="center" gutter="xl">

          {/* Image column (shown first on mobile) */}
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
            <Center>
              <Image
                src="/homePage.png"
                alt="AlpenWegs platform overview"
                fit="contain"
                className={classes.introductionImage}
              />
            </Center>
          </Grid.Col>

          {/* Text content column */}
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
            <Stack gap="md">

              {/* Desktop-only hero title */}
              <Title order={1} visibleFrom="md">
                A <span className={classes.introductionHighlight}>better</span>
                way to explore the Swiss Alps
              </Title>

              {/* Introduction description */}
              <Text c="dimmed" mt="md">
                AlpenWege is a comprehensive hiking and outdoor adventure application that
                supports users in planning, tracking, and documenting mountain activities
                across Switzerland. The platform covers hiking, biking, trail running, and
                camping, all within a single, unified system.
              </Text>

              {/* Core platform components */}
              <List
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <IconCheck size={12} stroke={1.5} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <b>Profiles</b> – manage user accounts, roles, preferences, and personal
                  achievements.
                </List.Item>

                <List.Item>
                  <b>Explorer</b> – discover, plan, and track routes for a wide range of
                  outdoor activities.
                </List.Item>

                <List.Item>
                  <b>Compendium</b> – access a curated knowledge base about Swiss nature,
                  culture, and points of interest.
                </List.Item>

                <List.Item>
                  <b>Events</b> – create, join, and manage outdoor events such as hikes or
                  group rides.
                </List.Item>
              </List>

              {/* Primary actions */}
              <Group mt="md">
                <Button radius="xl" size="md" component={Link} to="/explorer">
                  Start exploring
                </Button>

                <Button
                  variant="default"
                  radius="xl"
                  size="md"
                  component={Link}
                  to="/compendium"
                >
                  Learn more
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      
      {/* Section divider */}
      <Divider my="sm" />
      
      {/* Platform highlights */}
      <Container size="lg" py="xl">

        {/* Section badge */}
        <Group justify="center">
          <Badge variant="filled" size="lg">
            Designed for long-term outdoor journeys
          </Badge>
        </Group>

        {/* Section title */}
        <Title order={2} className={classes.title} ta="center" mt="sm">
          Built with purpose, not just features
        </Title>

        {/* Section description */}
        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          AlpenWeg is shaped around real alpine use cases — from geography-first
          design to long-term progress tracking — supporting meaningful outdoor
          experiences rather than isolated activities.
        </Text>

        {/* Feature cards */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          {platformHighlightCards}
        </SimpleGrid>

      </Container>
    </div>
  );
}
