export type ValueTransform = {
  op: "multiply" | "divide";
  by: number;
  decimals?: number;
  fallback?: string;
};

type PropertyConfig = {
  key: string;
  label: string;
  value: string[];
  prefix?: string;
  suffix?: string;
  transform?: ValueTransform;
};

export type ObjectRetrieveConfig = {
  api: {
    listUrl: string;
  };
  routes: {
    edit: string;
  };
  title: {
    key: string;
    label?: string;
    value: string[];
  };
  image?: {
    key: string;
    label?: string;
    value: string[];
  };
  properties: PropertyConfig[];
  chapters?: {
    title: string;
    properties: PropertyConfig[];
  }[];
};
