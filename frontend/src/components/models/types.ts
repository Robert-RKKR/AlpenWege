// Props for ObjectCard component:
export type ObjectCardProps = {
  image?: string | null;
  properties: string[];
  description: string;
  extras: string[];
  title: string;
  href: string;
};

export type ObjectDetailsSchema = {
  image?: string | null;
  title: string;
  subtitle?: string;
  properties?: {
    label: string;
    value: string | number;
  }[];
  chapters?: {
    title: string;
    properties: {
      label: string;
      value: string | number;
    }[];
  }[];
};
