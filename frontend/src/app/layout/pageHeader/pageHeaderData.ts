// Imports:
import { IconRoute, IconMap2, IconSearch, IconLayersIntersect,
  IconActivity, IconPlayerTrackNext, IconListSearch, IconTrendingUp,
} from "@tabler/icons-react";

// Dropdown feature items:
export const planningMenu = {
  label: "Planning",
  viewAll: {
    label: "View all",
    to: "/plans",
  },
  items: [
    {
      icon: IconRoute,
      title: "Plan a new Route",
      description: "Design a single hiking or biking route between two locations, including terrain, difficulty, and elevation.",
      to: "/features/open-source",
    },
    {
      icon: IconMap2,
      title: "Plan a new Journey",
      description: "Create a multi-day adventure composed of multiple routes with flexible options and stages.",
      to: "/features/free",
    },
    {
      icon: IconSearch,
      title: "Discover existing Routes",
      description: "Browse and explore predefined routes shared by the community or curated by AlpenWegs.",
      to: "/features/documentation",
    },
    {
      icon: IconLayersIntersect,
      title: "Discover existing Journeys",
      description: "Explore complete multi-day journeys and alternative paths between the same start and end points.",
      to: "/features/security",
    },
  ],
  footer: {
    title: "Get started",
    description: "Plan your next alpine adventure with flexible routes and smart preparation tools.",
    button: {
      label: "Open planner",
      to: "/explorer",
    },
  },
};

export const trackingMenu = {
  label: "Tracking",
  viewAll: {
    label: "View all",
    to: "/explorer/track",
  },
  items: [
    {
      icon: IconActivity,
      title: "Record a new Track",
      description: "Track your activity in real time using GPS, recording distance, elevation, and duration.",
      to: "/features/open-source",
    },
    {
      icon: IconPlayerTrackNext,
      title: "Start a new Trip",
      description: "Begin a planned route or journey and record it as a complete hiking or biking experience.",
      to: "/features/free",
    },
    {
      icon: IconListSearch,
      title: "Browse recorded Tracks",
      description: "Review your previously recorded activities, including statistics, notes, and media.",
      to: "/features/documentation",
    },
    {
      icon: IconTrendingUp,
      title: "Review completed Trips",
      description: "Analyze finished journeys, compare performance, and track long-term progress.",
      to: "/features/security",
    },
  ],
  footer: {
    title: "Go tracking",
    description: "Turn your adventure into a recorded experience with detailed insights.",
    button: {
      label: "Start tracking",
      to: "/explorer/track",
    },
  },
};
