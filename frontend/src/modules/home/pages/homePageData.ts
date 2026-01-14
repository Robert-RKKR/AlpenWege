// Imports:
import {
  IconNavigation,
  IconNotebook,
  IconTimeline,
  IconCompass,
  IconRoute,
  IconSun,
} from '@tabler/icons-react';

/* Platform principles / values (secondary section) */
export const platformHighlights = [
  {
    title: "Journey-centric design",
    description:
      "AlpenWege is built around complete outdoor journeys rather than isolated activities, supporting planning, execution, and long-term reflection within a single coherent system.",
    icon: IconCompass,
    to: "/about/philosophy",
  },
  {
    title: "Flexible planning",
    description:
      "Plan both single-day and multi-day adventures using a structured model of trails, routes, and paths, allowing alternative options based on difficulty, terrain, or scenery.",
    icon: IconRoute,
    to: "/about/planning",
  },
  {
    title: "Smart preparation",
    description:
      "Integrated SBB timetables recommend optimal transport to trailheads, while Swiss Meteo weather data helps users prepare safely for current and forecasted conditions.",
    icon: IconSun,
    to: "/about/preparation",
  },
  {
    title: "Guided execution",
    description:
      "Use AlpenWege as a real-time navigation companion during activities, with geolocation tracking, checkpoints, and live progress aligned to the planned trail.",
    icon: IconNavigation,
    to: "/about/execution",
  },
  {
    title: "Meaningful recording",
    description:
      "Each completed activity becomes a personal journal entry, combining GPX tracks, photos, notes, and statistics with a strong focus on individual experience.",
    icon: IconNotebook,
    to: "/about/recording",
  },
  {
    title: "Memories and progress",
    description:
      "Track seasonal goals, milestones, and long-term achievements through visual progress indicators that reflect your evolving relationship with the mountains.",
    icon: IconTimeline,
    to: "/about/memories",
  },
];
