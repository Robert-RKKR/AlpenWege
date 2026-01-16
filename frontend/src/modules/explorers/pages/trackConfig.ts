// trackConfig.ts
import { IconRulerMeasure, IconLabel } from "@tabler/icons-react";

export const trackConfig = {
  baseModelData: {
    value: "track",
    label: "Track",
    plural: "Tracks",
    href: "/explorer/track/",
    id: "pk",
  },

  listPageContent: {
    listTitle: "All Tracks",
    listDescription: "Browse all available tracks.",

    leftBar: {
      SearchBar: [
        {
          sectionTitle: "Representation",
          sectionDescription:
            "Filter tracks based on their representation attributes.",
          sectionIcon: IconLabel,
          sectionItems: [
            {
              itemLabel: "Track Name Contains",
              itemValue: "name__icontains",
              itemType: "text",
              itemDescription:
                "Filter tracks by name containing the specified value.",
              itemPlaceholder: "Enter track name...",
            },
            {
              itemLabel: "Category",
              itemValue: "category",
              itemType: "select",
              placeholder: "Choose category",
              options: [
                { value: 120, label: "Hike" },
                { value: 110, label: "Running" },
                { value: 130, label: "Climbing" },
              ],
            },
          ],
        },
        {
          sectionTitle: "Distance",
          sectionDescription:
            "Filter tracks based on their distance attributes.",
          sectionIcon: IconRulerMeasure,
          sectionItems: [
            {
              itemLabel: "Total Distance (m)",
              itemValue: ["total_distance__gt", "total_distance__lt"],
              itemType: "range",
              ui: "slider",
              sliderMin: 0,
              sliderMax: 50000,
              sliderStep: 100,
              sliderDefault: [0, 20000],
              sliderMarks: [
                { value: 0, label: "0" },
                { value: 10000, label: "10k" },
                { value: 20000, label: "20k" },
                { value: 30000, label: "30k" },
                { value: 40000, label: "40k" },
                { value: 50000, label: "50k" },
              ],
            },
          ],
        },
      ],
    },

    rightBar: {
      cardView: {
        cardTitle: ["name"],
        cardImage: ["primary_photo"],
        cardDescription: ["snippet"],
        cardProperties: [
          {
            label: "Category",
            value: ["category", "label"],
            color: "red",
          },
          {
            label: "Category Specific Difficulty",
            value: ["category_specific_difficulty", "label"],
            color: "blue",
          },
          {
            label: "Total Distance",
            value: ["total_distance"],
            measurement: "m",
            color: "blue",
          },
          {
            label: "Elevation Gain",
            value: ["elevation_gain"],
            measurement: "m",
            color: "blue",
          },
        ],

        cardSubProperties: [
          {
            label: "Average Speed",
            value: ["average_speed"],
            measurement: "km/h",
            color: "gray",
          },
          {
            label: "Maximum Speed",
            value: ["maximum_speed"],
            measurement: "km/h",
            color: "gray",
          },
          {
            label: "Activity Time",
            value: ["total_time"],
            measurement: "sec",
            color: "gray",
          },
        ],
      },

      tableView: {
        tableColumns: [
          { label: "Name", value: ["name"], Flex: 1 },
          { label: "Category", value: ["category", "label"], Flex: 1 },
          {
            label: "Category Specific Difficulty",
            value: ["category_specific_difficulty", "label"],
            Flex: 1,
          },
          { label: "Total Distance", value: ["total_distance"], Flex: 1 },
          { label: "Elevation Gain", value: ["elevation_gain"], Flex: 1 },
          { label: "Average Speed", value: ["average_speed"], Flex: 1 },
        ],
      },
    },
  },
} as const;
