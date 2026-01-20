// Application imports:
import { ObjectRetrieveComponent } from "../../../components/models/retrieve/RetrieveComponent";
import type { TrackDetailedModel } from "../models/trackModel";

// Configuration for ObjectRetrieveComponent to display TrackRelationModel:
export const trackRetrieveConfig = {
  // Base API call data:
  api: {
    listUrl: "/api/explorers/track/",
  },
  // Object mapping configuration:
  image: {
    key: "primary_photo",
    label: "Primary Photo",
    value: ["photos"],
  },
  routes: {
    edit: "/explorer/track",
  },
  title: {
    key: "name",
    label: "Name",
    value: ["name"],
  },
  properties: [
    {
      key: "total_distance",
      label: "Distance",
      value: ["total_distance"],
      suffix: " m",
    },
    {
      key: "elevation_gain",
      label: "Elevation gain",
      value: ["elevation_gain"],
      suffix: " m",
    },
    {
      key: "total_time",
      label: "Total time",
      value: ["total_time"],
      suffix: " s",
    },
    {
      key: "average_speed",
      label: "Avg speed",
      value: ["average_speed"],
      suffix: " km/h",
    },
    {
      key: "maximum_speed",
      label: "Max speed",
      value: ["maximum_speed"],
      suffix: " km/h",
    },
    {
      key: "highest_elevation",
      label: "Highest point",
      value: ["highest_elevation"],
      suffix: " m",
    },
  ],
  chapters: [
    /* ---------------- Distance & Elevation ---------------- */
    {
      title: "Distance & Elevation",
      properties: [
        {
          key: "total_distance",
          label: "Total distance",
          value: ["total_distance"],
          suffix: " m",
        },
        {
          key: "elevation_gain",
          label: "Elevation gain",
          value: ["elevation_gain"],
          suffix: " m",
        },
        {
          key: "elevation_loss",
          label: "Elevation loss",
          value: ["elevation_loss"],
          suffix: " m",
        },
        {
          key: "highest_elevation",
          label: "Highest elevation",
          value: ["highest_elevation"],
          suffix: " m",
        },
        {
          key: "lowest_elevation",
          label: "Lowest elevation",
          value: ["lowest_elevation"],
          suffix: " m",
        },
        {
          key: "average_grade",
          label: "Average grade",
          value: ["average_grade"],
          suffix: " %",
        },
        {
          key: "highest_grade",
          label: "Max grade",
          value: ["highest_grade"],
          suffix: " %",
        },
      ],
    },

    /* ---------------- Speed & Pace ---------------- */
    {
      title: "Speed & Pace",
      properties: [
        {
          key: "average_speed",
          label: "Average speed",
          value: ["average_speed"],
          suffix: " km/h",
        },
        {
          key: "maximum_speed",
          label: "Maximum speed",
          value: ["maximum_speed"],
          suffix: " km/h",
        },
        {
          key: "ascent_avg_speed",
          label: "Ascent avg speed",
          value: ["ascent_average_speed"],
          suffix: " km/h",
        },
        {
          key: "descent_avg_speed",
          label: "Descent avg speed",
          value: ["descent_average_speed"],
          suffix: " km/h",
        },
        {
          key: "pace_average",
          label: "Average pace",
          value: ["pace_average"],
          suffix: " min/km",
        },
        {
          key: "pace_best",
          label: "Best pace",
          value: ["pace_best"],
          suffix: " min/km",
        },
      ],
    },

    /* ---------------- Time ---------------- */
    {
      title: "Time",
      properties: [
        {
          key: "start_time",
          label: "Start time",
          value: ["start_time"],
        },
        {
          key: "end_time",
          label: "End time",
          value: ["end_time"],
        },
        {
          key: "moving_time",
          label: "Moving time",
          value: ["moving_time"],
          suffix: " s",
        },
        {
          key: "total_time",
          label: "Total time",
          value: ["total_time"],
          suffix: " s",
        },
      ],
    },

    /* ---------------- Conditions & Context ---------------- */
    {
      title: "Conditions & Context",
      properties: [
        {
          key: "weather",
          label: "Weather",
          value: ["weather_conditions"],
        },
        {
          key: "temperature",
          label: "Average temperature",
          value: ["temperature_average"],
          suffix: " °C",
        },
        {
          key: "equipment",
          label: "Equipment used",
          value: ["equipment_used"],
        },
        {
          key: "moving_ratio",
          label: "Moving ratio",
          value: ["moving_ratio"],
        },
      ],
    },

    /* ---------------- Safety & Flags ---------------- */
    {
      title: "Safety & Flags",
      properties: [
        {
          key: "hazardous",
          label: "Hazardous track",
          value: ["hazardous_track"],
        },
        {
          key: "injury",
          label: "Injury occurred",
          value: ["injury_occurred"],
        },
        {
          key: "rescue",
          label: "Rescue assistance",
          value: ["rescue_assistance"],
        },
        {
          key: "verified",
          label: "Verified",
          value: ["verified"],
        },
      ],
    },

    /* ---------------- Meta ---------------- */
    {
      title: "Meta",
      properties: [
        {
          key: "created",
          label: "Created",
          value: ["created"],
        },
        {
          key: "updated",
          label: "Last updated",
          value: ["updated"],
        },
        {
          key: "score",
          label: "Score",
          value: ["score"],
        },
        {
          key: "visit_count",
          label: "Visits",
          value: ["visit_count"],
        },
        {
          key: "download_count",
          label: "Downloads",
          value: ["download_count"],
        },
      ],
    },
  ],
};

// TracksRetrievePage component:
export function TrackRetrievePage() {
  return (
    <ObjectRetrieveComponent<TrackDetailedModel>
      config={trackRetrieveConfig}
    />
  );
}
