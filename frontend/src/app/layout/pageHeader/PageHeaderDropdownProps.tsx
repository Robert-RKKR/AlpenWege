// Property for dropdown component:
export type DropdownProps = {
  config: {
    label: string;
    viewAll: {
      label: string;
      to: string;
    };
    items: {
      icon: any;
      title: string;
      description: string;
      to: string;
    }[];
    footer: {
      title: string;
      description: string;
      button: {
        label: string;
        to: string;
      };
    };
  };
  onItemClick?: () => void;
  mobile?: boolean;
};
