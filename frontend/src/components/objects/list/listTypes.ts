// listTypes.ts
import type { TablerIcon } from "@tabler/icons-react";

export type Path = string[];

export function resolvePath(obj: any, path?: Path) {
  if (!path) return undefined;
  return path.reduce((acc, key) => acc?.[key], obj);
}

export function formatValue(value: unknown, measurement?: string) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number" && measurement) return `${value} ${measurement}`;
  if (measurement) return `${String(value)} ${measurement}`;
  return String(value);
}

export type SearchItemType = "text" | "integer" | "date" | "boolean" | "range" | "select";

export type SelectOption = { value: string; label: string };

export type SearchItemConfig =
  | {
      itemLabel: string;
      itemValue: string; // e.g. "name__icontains"
      itemType: "text";
      itemDescription?: string;
      itemPlaceholder?: string;
    }
  | {
      itemLabel: string;
      itemValue: string; // e.g. "elevation_gain"
      itemType: "integer";
      itemDescription?: string;
      itemPlaceholder?: string;
      min?: number;
      max?: number;
    }
  | {
      itemLabel: string;
      itemValue: string; // e.g. "start_date"
      itemType: "date";
      itemDescription?: string;
      itemPlaceholder?: string;
    }
  | {
      itemLabel: string;
      itemValue: string; // e.g. "is_public"
      itemType: "boolean";
      itemDescription?: string;
    }
  | {
      itemLabel: string;
      itemValue: [string, string]; // e.g. ["total_distance__gt","total_distance__lt"]
      itemType: "range";
      itemDescription?: string;

      /**
       * Range UI options:
       * - slider: RangeSlider
       * - inputs: two NumberInput
       */
      ui?: "slider" | "inputs";

      // slider config
      sliderMin?: number;
      sliderMax?: number;
      sliderStep?: number;
      sliderMarks?: { value: number; label?: string }[];
      sliderDefault?: [number, number];
      sliderLabel?: (value: number) => string;

      // inputs config
      inputMin?: number;
      inputMax?: number;
      inputStep?: number;
      inputPlaceholders?: [string, string];
    }
  | {
      itemLabel: string;
      itemValue: string; // e.g. "category"
      itemType: "select";
      itemDescription?: string;
      options: SelectOption[];
      placeholder?: string;
    };

export type SearchBarConfig = {
  sectionTitle: string;
  sectionDescription?: string;
  sectionIcon?: TablerIcon;
  sectionItems: SearchItemConfig[];
};

export type CardPropertyConfig = {
  label: string;
  value: Path;
  measurement?: string;
  color?: string;
};

export type CardViewConfig = {
  cardTitle: Path;
  cardImage?: Path;
  cardDescription?: Path;

  cardProperties?: CardPropertyConfig[];
  cardSubProperties?: CardPropertyConfig[];
};

export type TableColumnConfig = {
  label: string;
  value: Path;
  flex?: number;
  measurement?: string;
  color?: string;
};

export type TableViewConfig = {
  tableColumns: TableColumnConfig[];
};

export type ListPageContentConfig = {
  listTitle: string;
  listDescription?: string;

  leftBar: {
    SearchBar: SearchBarConfig[];
  };

  rightBar: {
    cardView: CardViewConfig;
    tableView: TableViewConfig;
  };
};

export type BaseModelDataConfig = {
  value: string;     // "track"
  label: string;     // "Track"
  plural: string;    // "Tracks"
  href: string;      // "/explorer/track/"
  id: string;        // "pk"
};

export type ModelListConfig = {
  baseModelData: BaseModelDataConfig;
  listPageContent: ListPageContentConfig;
};

// API response (align to your existing backend contract)
export type ApiListResponse<T> = {
  page_results: T[];
  page_count: number;
  page_number?: number;
  page_size?: number;
  total_count?: number;
};
