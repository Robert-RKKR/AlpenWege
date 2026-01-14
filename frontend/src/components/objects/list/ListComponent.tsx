// Imports:
import { ErrorWindow } from "../../elements/errorWindow/ErrorWindow";
import type { ApiListResponse } from "../../../services/api/types";
import { IconDatabaseOff, IconInbox } from "@tabler/icons-react";
import { Pagination } from "../../elements/pagination/Pagination";
import { BaseApi } from "../../../services/api/baseApi";
import { PageContent } from "../../content/PageContent";
import { useQuery } from "@tanstack/react-query";
import { ObjectCard } from "./card/ObjectCard";
import { useState } from "react";
import {
  Grid,
  Stack,
  Title,
  Center,
  Loader,
  Accordion,
  TextInput,
  RangeSlider,
  Paper,
} from "@mantine/core";

// Helpers:
function resolvePath(obj: any, path?: string[]) {
  if (!path) return undefined;
  return path.reduce((acc, key) => acc?.[key], obj);
}

// Types
type ResolvedFieldConfig = {
  key: string;
  label?: string;
  value?: string[];
  suffix?: string;
  fallback?: string;
};

type HrefFieldConfig = {
  id: string;
  base: string;
  value?: string[];
};

type ObjectListProps<TModel> = {
  config: {
    api: {
      listUrl: string;
    };
    header?: {
      title?: string;
    };
    card: {
      href: HrefFieldConfig;
      image?: ResolvedFieldConfig;
      title?: ResolvedFieldConfig;
      description?: ResolvedFieldConfig;
      properties?: ResolvedFieldConfig[];
      extras?: ResolvedFieldConfig[];
    };
  };
  emptyMessage?: string;
};

export function ObjectListComponent<TModel>({
  config,
  emptyMessage = "No items found",
}: ObjectListProps<TModel>) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<ApiListResponse<TModel>>({
    queryKey: [config.api.listUrl, page],
    queryFn: () =>
      BaseApi.list<TModel>(config.api.listUrl, {
        page_number: page,
      }),
    placeholderData: (prev) => prev,
  });

  // Normalize data:
  const pageResults = data?.page_results ?? [];
  const pageCount = data?.page_count ?? 1;

  const listTitle = config.header?.title;

  return (
    <Stack gap="lg">

      {/* Loading */}
      {isLoading && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {/* Error */}
      {!isLoading && error && (
        <ErrorWindow
          icon={IconDatabaseOff}
          title="Failed to load data"
          description="The server returned an error while loading this list."
        />
      )}

      {/* Empty */}
      {!isLoading && !error && pageResults.length === 0 && (
        <ErrorWindow
          icon={IconInbox}
          title="Nothing here yet"
          description={emptyMessage}
        />
      )}

      {/* Data */}
      {!isLoading && !error && pageResults.length > 0 && (
        <PageContent>

          {/* LEFT MENU */}
          <PageContent.Item>
            <Accordion>
              <Accordion.Item value="name-search">
                <Accordion.Control>Name Search</Accordion.Control>
                <Accordion.Panel>
                  <TextInput label="Name" placeholder="Name..." />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="distance-search">
                <Accordion.Control>Distance Search</Accordion.Control>
                <Accordion.Panel>
                  <RangeSlider
                    mb="md"
                    max={100}
                    defaultValue={[10, 30]}
                    marks={[
                      { value: 20, label: "20 km" },
                      { value: 40, label: "40 km" },
                      { value: 60, label: "60 km" },
                      { value: 80, label: "80 km" },
                    ]}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </PageContent.Item>

          {/* RIGHT CONTENT */}
          <PageContent.Item>
            {listTitle && (
              <Paper withBorder mb="md" p="md">
                <Center>
                  <Title order={3}>{listTitle}</Title>
                </Center>
              </Paper>
            )}

            <Grid gutter="md">
              {pageResults.map((item: any) => {
                const href =
                  config.card.href.base +
                  (item?.[config.card.href.id] ?? "");

                return (
                  <Grid.Col
                    key={item.pk ?? crypto.randomUUID()}
                    span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 3 }}
                  >
                    <ObjectCard
                      href={href}
                      image={resolvePath(item, config.card.image?.value)}
                      title={resolvePath(item, config.card.title?.value) ?? ""}
                      description={
                        resolvePath(item, config.card.description?.value) ?? ""
                      }
                      properties={
                        config.card.properties?.map(
                          (p) =>
                            `${resolvePath(item, p.value) ?? ""}${p.suffix ?? ""}`
                        ) ?? []
                      }
                      extras={
                        config.card.extras?.map(
                          (e) =>
                            `${resolvePath(item, e.value) ?? ""}${e.suffix ?? ""}`
                        ) ?? []
                      }
                    />
                  </Grid.Col>
                );
              })}
            </Grid>

            <Center pt="md">
              <Pagination
                page={page}
                pageCount={pageCount}
                onChange={setPage}
              />
            </Center>
          </PageContent.Item>

        </PageContent>
      )}
    </Stack>
  );
}
