// Imports:

import { primaryFeatures, platformHighlights } from './homePageData';
import {  Button, Grid, SimpleGrid, Text, ThemeIcon, Title, Container,
  Group, Badge, Card, useMantineTheme, List, Image, Divider } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './HomePage.module.css';
import { Link } from 'react-router-dom';

// HomePage component:
export function HomePage() {
  const theme = useMantineTheme();

  /* Primary features */
  const primaryFeatureItems = primaryFeatures.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon size={44} component={Link} radius="md" variant="gradient" gradient={{ deg: 133, from: "blue", to: "cyan" }}>
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>

      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>

      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  /* Platform highlights */
  const platformHighlightCards = platformHighlights.map((item) => (
    <Card key={item.title} component={Link} to={item.to} shadow="md" radius="md" className={classes.card} padding="xl">
      <item.icon size={50} stroke={1.5} color={theme.colors.blue[6]} />

      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {item.title}
      </Text>

      <Text fz="sm" c="dimmed" mt="sm">
        {item.description}
      </Text>
    </Card>
  ));

  return (
    <div className={classes.wrapper}>

      <Container size="md">
        
        <Grid className={classes.inner} m="xl">
          <Grid.Col className={classes.content} span={6}>
            <Title className={classes.title}>
              A <span className={classes.highlight}>modern</span> platform for <br />
              alpine exploration
            </Title>

            <Text c="dimmed" mt="md">
              AlpenWegs is a comprehensive outdoor companion designed for hikers,
              trail runners, and explorers. Plan routes, prepare for alpine
              conditions, and capture your experiences — all in one place.
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={12} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Geography-first design</b> – routes, regions, and points of interest
                structured around real alpine terrain
              </List.Item>

              <List.Item>
                <b>Flexible journey planning</b> – create single routes or multi-day
                adventures with alternative stages
              </List.Item>

              <List.Item>
                <b>Long-term progress tracking</b> – record activities, achievements,
                and personal outdoor goals over time
              </List.Item>
            </List>

            <Group mt={30}>
              <Button
                radius="xl"
                size="md"
                component={Link}
                to="/explorer"
                className={classes.control}
              >
                Start exploring
              </Button>

              <Button
                variant="default"
                radius="xl"
                size="md"
                component={Link}
                to="/compendium"
                className={classes.control}
              >
                Learn more
              </Button>
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Image
              src="/homePage.png"
              alt="AlpenWegs platform overview"
              fit="contain"
              className={classes.image}
            />
          </Grid.Col>
        </Grid>
      </Container>
      
      <Divider my="sm" />
      
      {/* Hero + primary navigation */}
      <Container size="xl" py="xl">
        <Grid gutter={80} align="center">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Title className={classes.title} order={2}>
              Plan, explore, and remember your alpine adventures
            </Title>

            <Text c="dimmed">
              AlpenWegs supports every stage of your outdoor journey – from
              planning routes and preparing for the conditions, through
              real-time navigation, to recording experiences and tracking
              long-term goals across Switzerland’s mountains.
            </Text>

            <Button variant="gradient" component={Link} to="/explorer" gradient={{ deg: 133, from: "blue", to: "cyan" }} size="lg" radius="md" mt="xl"> Get started
            </Button>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
              {primaryFeatureItems}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Container>

      <Divider my="sm" />

      {/* Platform highlights */}
      <Container size="lg" py="xl">
        <Group justify="center">
          <Badge variant="filled" size="lg">
            Designed for long-term outdoor journeys
          </Badge>
        </Group>

        <Title order={2} className={classes.title} ta="center" mt="sm">
          Built with purpose, not just features
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          AlpenWeg is shaped around real alpine use cases — from geography-first
          design to long-term progress tracking — supporting meaningful outdoor
          experiences rather than isolated activities.
        </Text>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          {platformHighlightCards}
        </SimpleGrid>
      </Container>
    </div>
  );
}
