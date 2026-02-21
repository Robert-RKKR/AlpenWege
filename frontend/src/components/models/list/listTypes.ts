// Import types and utility functions for list components:
import type { TablerIcon } from "@tabler/icons-react";

// Utility to resolve nested paths in objects and format values with optional measurement units:
export type Path = string[];

// Formats a property value based on optional transformation and measurement configuration:
export function resolvePath(obj: any, path?: Path) {
  if (!path) return undefined;
  return path.reduce((acc, key) => acc?.[key], obj);
}

// Formats a value with optional prefix, suffix, and measurement unit. Handles numeric transformations if specified:
function toNumberOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function formatValue(
  raw: unknown,
  config?: {
    prefix?: string;
    suffix?: string;
    transform?: ValueTransform;
  },
) {
  if (raw === null || raw === undefined || raw === "") return "—";

  const n = toNumberOrNull(raw);

  if (config?.transform) {
    if (n === null) return config.transform.fallback ?? "—";

    const { op, by, decimals } = config.transform;

    const computed =
      op === "divide"
        ? (by === 0 ? NaN : n / by)
        : n * by;

    if (!Number.isFinite(computed))
      return config.transform.fallback ?? "—";

    const formatted =
      typeof decimals === "number"
        ? computed.toFixed(decimals)
        : String(computed);

    return `${config.prefix ?? ""}${formatted}${
      config.suffix ? ` ${config.suffix}` : ""
    }`;
  }

  const base = n !== null ? String(n) : String(raw);

  return `${config?.prefix ?? ""}${base}${
    config?.suffix ? ` ${config.suffix}` : ""
  }`;
}

// Types for list components:
export type SearchItemType = "text" | "integer" | "date" | "boolean" | "range" | "select";

// Select option type for dropdown filters:
export type SelectOption = { value: string; label: string };

// Configuration types for list components, including search bar, card view, and table view:

export type ValueTransform = {
  op: "multiply" | "divide";
  by: number;
  decimals?: number;
  fallback?: string;
};


export type SearchItemConfig =
  | {
      itemLabel: string;
      itemValue: string;
      itemType: "text";
      itemDescription?: string;
      itemPlaceholder?: string;
    }
  | {
      itemLabel: string;
      itemValue: string;
      itemType: "integer";
      itemDescription?: string;
      itemPlaceholder?: string;
      min?: number;
      max?: number;
    }
  | {
      itemLabel: string;
      itemValue: string;
      itemType: "date";
      itemDescription?: string;
      itemPlaceholder?: string;
    }
  | {
      itemLabel: string;
      itemValue: string;
      itemType: "boolean";
      itemDescription?: string;
    }
  | {
      itemLabel: string;
      itemValue: [string, string];
      itemType: "range";
      itemDescription?: string;
      itemUi?: "slider" | "inputs";

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
      itemValue: string;
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
  prefix?: string;
  suffix?: string;
  transform?: ValueTransform;
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
  prefix?: string;
  suffix?: string;
  transform?: ValueTransform;
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

// Types for list components, including API response format:
export type BaseModelDataConfig = {
  value: string;
  label: string;
  plural: string;
  href: string;
  id: string;
};

// Overall configuration type for list components, combining base model data and page content configuration:
export type ModelListConfig = {
  baseModelData: BaseModelDataConfig;
  listPageContent: ListPageContentConfig;
};

// API response (align to your existing backend contract):
export type ApiListResponse<T> = {
  page_results: T[];
  page_count: number;
  page_number?: number;
  page_size?: number;
  total_count?: number;
};
