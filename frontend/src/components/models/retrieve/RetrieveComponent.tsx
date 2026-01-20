// Application imports:
import { BaseApi } from "../../../services/api/baseApi";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";

// Imports:
import { Paper, Tabs, Stack, Group, Text, Button, Table } from "@mantine/core";
import { ImageLoader } from "../../elements/imageLoader/ImageLoader";
import { useState, type ReactNode } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from '@mantine/carousel';

// Helpers:
function resolvePath(obj: any, path?: string[]) {
  if (!path) return undefined;
  return path.reduce((acc, key) => acc?.[key], obj);
}

// Types:
type ObjectRetrieveConfig = {
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
  properties?: {
    key: string;
    label: string;
    value: string[];
    suffix?: string;
  }[];
  chapters?: {
    title: string;
    properties: {
      key: string;
      label: string;
      value: string[];
      suffix?: string;
    }[];
  }[];
};

type Props<T> = {
  config: ObjectRetrieveConfig;
};

export function ObjectRetrieveComponent<T>({ config }: Props<T>) {

  // Responsive check:
  const isMobile = useMediaQuery("(max-width: 48em)");

  // State & Params:
  const { id } = useParams<{ id: string }>();
  const [activeChapter, setActiveChapter] = useState<string | null>("0");

  const { data, isLoading, error } = useQuery<T>({
    queryKey: [config.api.listUrl, id],
    queryFn: () => BaseApi.retrieve<T>(`${config.api.listUrl}${id}/`),
    enabled: !!id,
  });

  const resolvedTitle =
    data && config.title
      ? resolvePath(data, config.title.value)
      : undefined;

  const resolvedImages =
    data && config.image
      ? resolvePath(data, config.image.value)
      : undefined;

  const ResponsiveLayout = ({
    mobile,
    children,
  }: {
    mobile: boolean;
    children: ReactNode;
  }) => {
    return mobile ? (
      <Stack gap="md">{children}</Stack>
    ) : (
      <Group align="flex-start" gap="md" wrap="nowrap">
        {children}
      </Group>
    );
  };

  return (
    <Stack className="object-retrieve" gap="md" mt="md" mb="md">
      {/* Title */}
      {!isLoading && !error && resolvedTitle && (
        <Paper withBorder p="md">
          <Text size="xl" fw={600}>
            {resolvedTitle}
          </Text>
        </Paper>
      )}

      {/* Loading */}
      {isLoading && (
        <Paper withBorder p="md">
          <Text>Loading…</Text>
        </Paper>
      )}

      {/* Error */}
      {!isLoading && error && (
        <Paper withBorder p="md">
          <Text c="red">Failed to load data</Text>
        </Paper>
      )}

      {/* Data */}
      {!isLoading && !error && data && (
        <ResponsiveLayout mobile={isMobile}>
          {/* LEFT COLUMN */}
          <Stack style={{ flex: 2 }} gap="md">
            {/* Images */}
            {Array.isArray(resolvedImages) && resolvedImages.length > 0 && (
              <Paper withBorder>
                <Carousel withIndicators height={500} slideGap="sm" controlsOffset="md" emblaOptions={{
                  loop: true, dragFree: false, align: 'center'}}>
                  {resolvedImages.map((item, index) => (
                    <Carousel.Slide key={index}>
                      <ImageLoader
                        src={item.photo?.path ?? null}
                        alt={String(resolvedTitle ?? "")}
                        height={500}
                        fit="cover"
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              </Paper>
            )}

            {/* Chapters */}
            {config.chapters && config.chapters.length > 0 && (
              <Paper withBorder p="sm">
                <Tabs value={activeChapter} onChange={setActiveChapter}>
                  <Tabs.List>
                    {config.chapters.map((chapter, index) => (
                      <Tabs.Tab key={index} value={String(index)}>
                        {chapter.title}
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>

                  {config.chapters.map((chapter, index) => (
                    <Tabs.Panel key={index} value={String(index)} pt="sm">
                      <Stack>
                        <Table striped verticalSpacing="xs" horizontalSpacing="md">
                          <Table.Tbody>
                            {chapter.properties.map((p, i) => (
                              <Table.Tr key={i}>
                                <Table.Td>
                                  <Text size="sm" fw={500}>
                                    {p.label}
                                  </Text>
                                </Table.Td>
                                <Table.Td>
                                  <Text size="sm">
                                    {`${resolvePath(data, p.value) ?? ""}${p.suffix ?? ""}`}
                                  </Text>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Stack>
                    </Tabs.Panel>
                  ))}
                </Tabs>
              </Paper>
            )}
          </Stack>

          {/* RIGHT COLUMN */}
          <Stack style={{ flex: 1 }} gap="md">
            {/* Properties */}
            {config.properties && (
              <Paper withBorder p="md">
                <Stack gap="xs">
                  {config.properties.map((p, i) => (  
                    <Group key={i} justify="space-between">
                      <Text fw={500}>{p.label}</Text>
                      <Text>
                        {`${resolvePath(data, p.value) ?? ""}${p.suffix ?? ""}`}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Edit button */}
            {id && (
              <Paper withBorder p="md">
                <Button component={Link} to={`${config.routes.edit}/${id}/edit`} fullWidth>
                  Edit
                </Button>
              </Paper>
            )}
          </Stack>
        </ResponsiveLayout>
      )}
    </Stack>
  );
}
