// ListModelComponent.tsx

import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  NativeSelect,
  NumberInput,
  Paper,
  RangeSlider,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  Accordion,
  Pagination as MantinePagination,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContent } from "../../content/PageContent";
import {
  IconInfoCircle,
  IconDatabaseOff,
  IconInbox,
  IconSearch,
  IconX,
  IconPlus,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";

import type {
  ApiListResponse,
  ModelListConfig,
  SearchItemConfig,
} from "./listTypes";

import { ListCardModelComponent } from "./ListCardModelComponent";
import { TableListModelComponent } from "./TableListModelComponent";
import { BaseApi } from "../../../services/api/baseApi";

/* helpers */

function compactParams(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
}

function serializeParams(params: Record<string, any>) {
  const keys = Object.keys(params).sort();
  const stable: Record<string, any> = {};
  for (const k of keys) stable[k] = params[k];
  return JSON.stringify(stable);
}

function EmptyState(props: {
  icon: any;
  title: string;
  description?: string;
}) {
  const Icon = props.icon;
  return (
    <Paper withBorder radius="md" p="xl">
      <Center>
        <Stack align="center" gap="xs">
          <ThemeIcon variant="light" size={54} radius="xl">
            <Icon size={28} />
          </ThemeIcon>
          <Title order={4}>{props.title}</Title>
          {props.description && <Text c="dimmed">{props.description}</Text>}
        </Stack>
      </Center>
    </Paper>
  );
}

type ViewMode = "cards" | "table";

type ListModelComponentProps<TModel> = {
  config: ModelListConfig;
  api: {
    listUrl: string;
  };
  emptyMessage?: string;
};

export function ListModelComponent<TModel>({
  config,
  api,
  emptyMessage = "No items found for the selected filters.",
}: ListModelComponentProps<TModel>) {
  const [view, setView] = useState<ViewMode>("cards");
  const [page, setPage] = useState(1);

  // UI state
  const [draftParams, setDraftParams] = useState<Record<string, any>>({});

  // Query state (empty object = no filters = load all)
  const [appliedParams, setAppliedParams] = useState<Record<string, any>>({});

  const effectiveParams = useMemo(
    () =>
      compactParams({
        ...appliedParams,
        page_number: page,
      }),
    [appliedParams, page]
  );

  const queryKey = useMemo(
    () => ["list", api.listUrl, page, serializeParams(effectiveParams)],
    [api.listUrl, page, effectiveParams]
  );

  const { data, isFetching, isError } = useQuery<ApiListResponse<TModel>>({
    queryKey,
    queryFn: () => BaseApi.list<TModel>(api.listUrl, effectiveParams),
    placeholderData: (prev) => prev,
  });

  const pageResults = data?.page_results ?? [];
  const pageCount = data?.page_count ?? 1;

  const pageContent = config.listPageContent;

  /* actions */

  function onSearch() {
    setAppliedParams(compactParams(draftParams));
    setPage(1);
  }

  function onReset() {
    setDraftParams({});
    setAppliedParams({});
    setPage(1);
  }

  function updateParam(key: string, value: any) {
    setDraftParams((prev) => ({ ...prev, [key]: value }));
  }

  /* search item renderer */

  function renderSearchItem(item: SearchItemConfig) {
    const common = (
      <Group gap={6} align="center">
        <Text fw={600} size="sm">
          {item.itemLabel}
        </Text>

        {item.itemDescription && (
          <Tooltip
            label={item.itemDescription}
            withArrow
            position="right"
            multiline
            w={260}
          >
            <IconInfoCircle size={14} style={{ cursor: "help", opacity: 0.6 }} />
          </Tooltip>
        )}
      </Group>
    );

    if (item.itemType === "text") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {common}
          <TextInput
            placeholder={item.itemPlaceholder}
            value={draftParams[item.itemValue] ?? ""}
            onChange={(e) =>
              updateParam(item.itemValue, e.currentTarget.value)
            }
          />
        </Stack>
      );
    }

    if (item.itemType === "integer") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {common}
          <NumberInput
            value={draftParams[item.itemValue] ?? ""}
            onChange={(v) => updateParam(item.itemValue, v)}
            min={item.min}
            max={item.max}
            allowDecimal={false}
          />
        </Stack>
      );
    }

    if (item.itemType === "date") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {common}
          <DateInput
            value={draftParams[item.itemValue] ?? null}
            onChange={(v) => updateParam(item.itemValue, v)}
            clearable
          />
        </Stack>
      );
    }

    if (item.itemType === "boolean") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {common}
          <Switch
            checked={Boolean(draftParams[item.itemValue])}
            onChange={(e) =>
              updateParam(item.itemValue, e.currentTarget.checked)
            }
          />
        </Stack>
      );
    }

    if (item.itemType === "select") {
      return (
        <Stack key={item.itemValue} gap={6}>
          {common}
          <NativeSelect
            data={[
              { value: "", label: item.placeholder ?? "— Select —" },
              ...item.options,
            ]}
            value={draftParams[item.itemValue] ?? ""}
            onChange={(e) =>
              updateParam(item.itemValue, e.currentTarget.value)
            }
          />
        </Stack>
      );
    }

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
          {common}
          <RangeSlider
            min={min}
            max={max}
            step={item.sliderStep}
            value={value}
            onChange={(v) => {
              updateParam(gtKey, v[0]);
              updateParam(ltKey, v[1]);
            }}
            marks={item.sliderMarks}
          />
        </Stack>
      );
    }

    return null;
  }

  return (
    <PageContent>
      {/* LEFT – SEARCH */}
      <PageContent.Item>
        <Accordion chevron={<IconPlus size={16} />}>
          {pageContent.leftBar.SearchBar.map((section, index) => (
            <Accordion.Item key={index} value={`section-${index}`}>
              <Accordion.Control>
                <Group gap="sm">
                  <Box>
                    <Text fw={600}>{section.sectionIcon && <section.sectionIcon size={18} />} {section.sectionTitle}</Text>
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
          ))}
        </Accordion>

        <Group grow m="lg">
          <Button leftSection={<IconSearch size={16} />} onClick={onSearch}>
            Search
          </Button>
          <Button
            variant="light"
            color="gray"
            leftSection={<IconX size={16} />}
            onClick={onReset}
          >
            Reset
          </Button>
        </Group>
      </PageContent.Item>

      {/* RIGHT – CONTENT */}
      <PageContent.Item>
        <Stack gap="md">
          <Paper withBorder radius="md" p="md">
            <Title order={3}>{pageContent.listTitle}</Title>
            {pageContent.listDescription && (
              <Text c="dimmed" mt={4}>
                {pageContent.listDescription}
              </Text>
            )}

            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                {isFetching
                  ? "Loading…"
                  : data?.total_count
                  ? `${data.total_count} results`
                  : ""}
              </Text>

              <SegmentedControl
                value={view}
                onChange={(v) => setView(v as ViewMode)}
                data={[
                  { value: "cards", label: "Cards" },
                  { value: "table", label: "Table" },
                ]}
              />
            </Group>
          </Paper>

          {isFetching && (
            <Paper withBorder radius="md" p="xl">
              <Center>
                <Stack align="center">
                  <Loader />
                  <Text c="dimmed">Collecting data…</Text>
                </Stack>
              </Center>
            </Paper>
          )}

          {!isFetching && isError && (
            <EmptyState
              icon={IconDatabaseOff}
              title="Failed to load data"
            />
          )}

          {!isFetching && !isError && pageResults.length === 0 && (
            <EmptyState
              icon={IconInbox}
              title="No results"
              description={emptyMessage}
            />
          )}

          {!isFetching && !isError && pageResults.length > 0 && (
            <Stack gap="md">
              {view === "cards" ? (
                <ListCardModelComponent
                  items={pageResults}
                  baseModelData={config.baseModelData}
                  cardView={pageContent.rightBar.cardView}
                />
              ) : (
                <TableListModelComponent
                  items={pageResults}
                  baseModelData={config.baseModelData}
                  tableView={pageContent.rightBar.tableView}
                />
              )}

              <Center>
                <MantinePagination
                  value={page}
                  onChange={setPage}
                  total={pageCount}
                />
              </Center>
            </Stack>
          )}
        </Stack>
      </PageContent.Item>
    </PageContent>
  );
}
