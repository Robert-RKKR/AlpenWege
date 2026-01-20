// Imports:
import { ListTableComponent } from "./ListTableComponent";
import { ListCardComponent } from "./ListCardComponent";
import { ListSearchComponent } from "./ListSearchComponent";
import { BaseApi } from "../../../services/api/baseApi";
import { PageContent } from "../../content/PageContent";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  IconDatabaseOff,
  IconInbox,
} from "@tabler/icons-react";
import {
  Box,
  Center,
  Group,
  Loader,
  NativeSelect,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Flex,
  Pagination as MantinePagination,
} from "@mantine/core";
import type {
  ApiListResponse,
  ModelListConfig,
} from "./listTypes";

/*
  Removes empty, null or meaningless values from an object.
  This ensures we do not send unnecessary query parameters to the API.
*/
function compactParams(obj: Record<string, any>) {
  const out: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    out[key] = value;
  }

  return out;
}

/*
  Produces a stable, sorted JSON representation of query params.
  This guarantees consistent React Query cache keys.
*/
function serializeParams(params: Record<string, any>) {
  const sortedKeys = Object.keys(params).sort();
  const stable: Record<string, any> = {};

  for (const key of sortedKeys) {
    stable[key] = params[key];
  }

  return JSON.stringify(stable);
}

/*
  Generic empty / error state renderer for the list content area.
*/
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

          {props.description && (
            <Text c="dimmed">{props.description}</Text>
          )}
        </Stack>
      </Center>
    </Paper>
  );
}


/*
  Available view modes for the list.
*/
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

  /*
    UI state controlling how results are displayed.
  */
  const [view, setView] = useState<ViewMode>("cards");

  /*
    Pagination state.
  */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | null>(null);

  /*
    Accordion state for the search sidebar.
    Only one section can be open at a time.
  */
  const [openSection, setOpenSection] = useState<string | null>(null);

  /*
    Draft search parameters reflect user input,
    but are not yet applied to the API query.
  */
  const [draftParams, setDraftParams] = useState<Record<string, any>>({});

  /*
    Applied parameters are actively used for querying the backend.
    An empty object means no filters and full dataset.
  */
  const [appliedParams, setAppliedParams] = useState<Record<string, any>>({});


  /*
    Updates page size for table view and resets pagination.
  */
  function onPageSizeChange(value: string | null) {
    const size = value ? Number(value) : null;
    setPageSize(size);
    setPage(1);
  }

  /*
    Combines pagination, filters and view-specific parameters
    into a single query object for the API.
  */
  const effectiveParams = useMemo(
    () =>
      compactParams({
        ...appliedParams,
        page_number: page,
        ...(view === "table" && pageSize
          ? { page_size: pageSize }
          : {}),
      }),
    [appliedParams, page, view, pageSize]
  );


  /*
    Stable query key ensures proper caching and refetch behavior.
  */
  const queryKey = useMemo(
    () => ["list", api.listUrl, page, serializeParams(effectiveParams)],
    [api.listUrl, page, effectiveParams]
  );


  /*
    Data fetching via React Query.
    Placeholder data avoids UI flicker between page changes.
  */
  const { data, isFetching, isError } = useQuery<ApiListResponse<TModel>>({
    queryKey,
    queryFn: () => BaseApi.list<TModel>(api.listUrl, effectiveParams),
    placeholderData: (prev) => prev,
  });


  const pageResults = data?.page_results ?? [];
  const pageCount = data?.page_count ?? 1;

  const pageContent = config.listPageContent;


  /*
    Applies draft filters and triggers a new query.
  */
  function onSearch() {
    setAppliedParams(compactParams(draftParams));
    setPage(1);
  }

  /*
    Clears all filters and reloads the full dataset.
  */
  function onReset() {
    setDraftParams({});
    setAppliedParams({});
    setPage(1);
  }

  /*
    Updates a single draft filter value.
  */
  function updateParam(key: string, value: any) {
    setDraftParams((prev) => ({ ...prev, [key]: value }));
  }


  return (
    <PageContent>

      {/* Search sidebar */}
      <PageContent.Item>
        <ListSearchComponent
          sections={pageContent.leftBar.SearchBar}
          draftParams={draftParams}
          onParamChange={updateParam}
          onSearch={onSearch}
          onReset={onReset}
          openSection={openSection}
          setOpenSection={setOpenSection}
        />
      </PageContent.Item>

      {/* Main content area */}
      <PageContent.Item>
        <Stack gap="md">

          {/* Header with title and view controls */}
          <Paper withBorder p="md">
            <Flex justify="space-between" align="flex-start">
              <Box>
                <Title order={3}>{pageContent.listTitle}</Title>

                {pageContent.listDescription && (
                  <Text c="dimmed">
                    {pageContent.listDescription}
                  </Text>
                )}
              </Box>

              <Group gap="sm">
                {view === "table" && (
                  <NativeSelect
                    size="xs"
                    value={pageSize?.toString() ?? ""}
                    onChange={(e) =>
                      onPageSizeChange(e.currentTarget.value)
                    }
                    data={[
                      { value: "", label: "Default" },
                      { value: "10", label: "10 rows" },
                      { value: "20", label: "20 rows" },
                      { value: "30", label: "30 rows" },
                      { value: "40", label: "40 rows" },
                      { value: "50", label: "50 rows" },
                    ]}
                  />
                )}

                <SegmentedControl
                  value={view}
                  onChange={(v) => {
                    setView(v as ViewMode);
                    setPage(1);
                  }}
                  data={[
                    { value: "cards", label: "Cards" },
                    { value: "table", label: "Table" },
                  ]}
                />
              </Group>
            </Flex>
          </Paper>

          {/* Loading state */}
          {isFetching && (
            <Paper withBorder p="xl">
              <Center>
                <Stack align="center">
                  <Loader />
                  <Text c="dimmed">Collecting data…</Text>
                </Stack>
              </Center>
            </Paper>
          )}

          {/* Error state */}
          {!isFetching && isError && (
            <EmptyState
              icon={IconDatabaseOff}
              title="Failed to load data"
            />
          )}

          {/* Empty result set */}
          {!isFetching && !isError && pageResults.length === 0 && (
            <EmptyState
              icon={IconInbox}
              title="No results"
              description={emptyMessage}
            />
          )}

          {/* Results */}
          {!isFetching && !isError && pageResults.length > 0 && (
            <Stack gap="md">
              {view === "cards" ? (
                <ListCardComponent
                  items={pageResults}
                  baseModelData={config.baseModelData}
                  cardView={pageContent.rightBar.cardView}
                />
              ) : (
                <ListTableComponent
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
