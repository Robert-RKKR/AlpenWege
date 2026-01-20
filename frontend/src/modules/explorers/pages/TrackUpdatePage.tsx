// Application imports:
import { ObjectUpdateComponent } from "../../../components/models/update/UpdateComponent";
import type { TrackDetailedModel } from "../models/trackModel";

// Configuration for trackEditConfig to display TrackRelationModel:
export const trackEditConfig = {
  // Base API call data:
  api: {
    listUrl: "/api/explorers/track/",
  },
  // Object mapping configuration:
  image: {
    key: "primary_photo",
    label: "Primary Photo",
    value: ["primary_photo"],
  },
  title: {
    key: "name",
    label: "Name",
    value: ["name"],
    editable: true,
    type: "text",
  },
  properties: [
    {
      key: "distance",
      label: "Distance",
      value: ["total_distance"],
      suffix: " m",
      editable: false,
    },
    {
      key: "elevation_gain",
      label: "Elevation gain",
      value: ["elevation_gain"],
      suffix: " m",
      editable: false,
    },
  ],
  chapters: [
    {
      title: "Statistics",
      properties: [
        {
          key: "avg_speed",
          label: "Avg speed",
          value: ["average_speed"],
          suffix: " km/h",
          editable: false,
        },
        {
          key: "max_speed",
          label: "Max speed",
          value: ["maximum_speed"],
          suffix: " km/h",
          editable: false,
        },
      ],
    },
    {
      title: "Other information",
      properties: [
        {
          key: "elevation",
          label: "Elevation",
          value: ["elevation_gain"],
          suffix: " m",
          editable: false,
        },
      ],
    },
  ],
};

// TracksRetrievePage component:
export function TrackUpdatePage() {
  return (
    <ObjectUpdateComponent<TrackDetailedModel>
      config={trackEditConfig}
    />
  );
}
