// Imports:
import type { SearchItemConfig } from "./listTypes";
import { DateInput } from "@mantine/dates";
import {
  Accordion,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Tooltip,
  TextInput,
  NumberInput,
  NativeSelect,
  Switch,
  RangeSlider,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconSearch,
  IconX,
  IconPlus,
} from "@tabler/icons-react";

/*
  Configuration for a single accordion section in the search panel.
  Each section groups a logical set of filters.
*/
type ListSearchSection = {
  sectionTitle: string;
  sectionDescription?: string;
  sectionIcon?: React.ComponentType<{ size?: number }>;
  sectionItems: SearchItemConfig[];
};


/*
  Props for the ListSearchComponent.
  This component is intentionally stateless with regard to data fetching;
  it only manages filter UI and user interactions.
*/
type ListSearchComponentProps = {
  sections: ListSearchSection[];

  /*
    Draft filter values reflecting current user input.
    These values are not yet applied to the API query.
  */
  draftParams: Record<string, any>;

  /*
    Callback used to update a single filter value.
  */
  onParamChange: (key: string, value: any) => void;

  /*
    Triggers applying the current draft filters.
  */
  onSearch: () => void;

  /*
    Clears all draft filters.
  */
  onReset: () => void;

  /*
    Controls which accordion section is currently open.
    Only one section is allowed to be open at a time.
  */
  openSection: string | null;
  setOpenSection: (value: string | null) => void;
};


export function ListSearchComponent({
  sections,
  draftParams,
  onParamChange,
  onSearch,
  onReset,
  openSection,
  setOpenSection,
}: ListSearchComponentProps) {

  /*
    Renders a single search input based on its configuration.
    The rendering logic is driven entirely by SearchItemConfig.
  */
  function renderSearchItem(item: SearchItemConfig) {

    /*
      Common label rendering shared by all filter types.
      Includes an optional tooltip for additional context.
    */
    const label = (
      <Group gap={6} align="center">
        <Text fw={600} size="sm">
          {item.itemLabel}
        </Text>

        {item.itemDescription && (
          <Tooltip label={item.itemDescription} withArrow w={260}>
            <IconInfoCircle
              size={14}
              style={{ cursor: "help", opacity: 0.6 }}
            />
          </Tooltip>
        )}
      </Group>
    );

    /*
      Text input filter (e.g. name__icontains).
    */
    if (item.itemType === "text") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {label}
          <TextInput
            value={draftParams[item.itemValue] ?? ""}
            onChange={(e) =>
              onParamChange(item.itemValue, e.currentTarget.value)
            }
          />
        </Stack>
      );
    }

    /*
      Integer input filter.
    */
    if (item.itemType === "integer") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {label}
          <NumberInput
            value={draftParams[item.itemValue] ?? ""}
            onChange={(v) => onParamChange(item.itemValue, v)}
            min={item.min}
            max={item.max}
            allowDecimal={false}
          />
        </Stack>
      );
    }

    /*
      Date picker filter.
    */
    if (item.itemType === "date") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {label}
          <DateInput
            value={draftParams[item.itemValue] ?? null}
            onChange={(v) => onParamChange(item.itemValue, v)}
            clearable
          />
        </Stack>
      );
    }

    /*
      Boolean toggle filter.
    */
    if (item.itemType === "boolean") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {label}
          <Switch
            checked={Boolean(draftParams[item.itemValue])}
            onChange={(e) =>
              onParamChange(item.itemValue, e.currentTarget.checked)
            }
          />
        </Stack>
      );
    }

    /*
      Select dropdown filter.
    */
    if (item.itemType === "select") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {label}
          <NativeSelect
            data={[
              { value: "", label: item.placeholder ?? "— Select —" },
              ...item.options,
            ]}
            value={draftParams[item.itemValue] ?? ""}
            onChange={(e) =>
              onParamChange(item.itemValue, e.currentTarget.value)
            }
          />
        </Stack>
      );
    }

    /*
      Range filter represented by a slider.
      Maps to two backend parameters (gt / lt).
    */
    if (item.itemType === "range") {
      const [gtKey, ltKey] = item.itemValue;

      const min = item.sliderMin ?? 0;
      const max = item.sliderMax ?? 100;

      const value: [number, number] = [
        draftParams[gtKey] ?? item.sliderDefault?.[0] ?? min,
        draftParams[ltKey] ?? item.sliderDefault?.[1] ?? max,
      ];

      return (
        <Stack key={`${gtKey}-${ltKey}`} gap={6}>
          {label}
          <RangeSlider
            min={min}
            max={max}
            step={item.sliderStep}
            value={value}
            onChange={(v) => {
              onParamChange(gtKey, v[0]);
              onParamChange(ltKey, v[1]);
            }}
            marks={item.sliderMarks}
          />
        </Stack>
      );
    }

    return null;
  }


  /*
    Main render.
    Displays accordion-based filter sections and global action buttons.
  */
  return (
    <>
      <Accordion
        chevron={<IconPlus size={16} />}
        value={openSection}
        onChange={setOpenSection}
      >
        {sections.map((section, index) => {
          const value = `section-${index}`;

          return (
            <Accordion.Item key={value} value={value}>
              <Accordion.Control>
                <Group gap="sm">
                  
                  <Box>
                    <Text fw={600}>
                        {section.sectionIcon && (
                            <section.sectionIcon size={18} />
                        )}
                        {" " + section.sectionTitle}
                    </Text>

                    {section.sectionDescription && (
                      <Text size="xs" c="dimmed">
                        {section.sectionDescription}
                      </Text>
                    )}
                  </Box>
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack gap="md" p="md">
                  {section.sectionItems.map(renderSearchItem)}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <Group grow m="lg">
        <Button leftSection={<IconSearch size={16} />} onClick={onSearch}>
          Search
        </Button>

        <Button
          variant="light"
          leftSection={<IconX size={16} />}
          onClick={onReset}
        >
          Reset
        </Button>
      </Group>
    </>
  );
}
