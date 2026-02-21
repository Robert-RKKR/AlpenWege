// Imports:
import { ImageLoader } from "../../elements/imageLoader/ImageLoader";
import { BaseApi } from "../../../services/api/baseApi";
import { useParams, Link } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import type {
  ObjectRetrieveConfig,
  ValueTransform,
} from "./retrieveTypes";
import {
  Paper,
  Tabs,
  Stack,
  Group,
  Text,
  Button,
  Table,
  Modal,
} from "@mantine/core";

/** Helper function */
function resolvePath(obj: any, path?: string[]) {
  if (!path) return undefined;
  return path.reduce((acc, key) => acc?.[key], obj);
}

type Props<T> = {
  config: ObjectRetrieveConfig;
};

/** Generic retrieve view capable of rendering any object based on configuration */
export function ObjectRetrieveComponent<T>({ config }: Props<T>) {
  // Responsive breakpoint:
  const isMobile = useMediaQuery("(max-width: 48em)");

  // Extract object ID from URL params:
  const { id } = useParams<{ id: string }>();
  const [activeChapter, setActiveChapter] = useState<string | null>("0");

  // Modal state for fullscreen image preview:
  const [opened, setOpened] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Data fetching using React Query:
  const { data, isLoading, error } = useQuery<T>({
    queryKey: [config.api.listUrl, id],
    queryFn: () => BaseApi.retrieve<T>(`${config.api.listUrl}${id}/`),
    enabled: !!id,
  });

  // State for active image in the modal (name and snippet for display in modal title):
  const [activeImageName, setActiveImageName] = useState<string | null>(null);
  const [activeImageSnippet, setActiveImageSnippet] = useState<string | null>(null);

  // Resolve title and images using the provided configuration and fetched data:
  const resolvedTitle =
    data && config.title ? resolvePath(data, config.title.value) : undefined;
  const resolvedImages =
    data && config.image ? resolvePath(data, config.image.value) : undefined;

  /** Responsive layout abstraction */
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

  // Helper function to convert a value to a number or null:
  function toNumberOrNull(v: unknown): number | null {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }

  // Helper function to format property values with optional transforms and suffixes:
  function formatPropertyValue(
    raw: unknown,
    p: { prefix?: string; suffix?: string; transform?: ValueTransform },
  ): string {
    // null/undefined -> empty string (keep your current behavior):
    if (raw === null || raw === undefined) return "";

    // If it is numeric (or numeric string), apply transforms + formatting:
    const n = toNumberOrNull(raw);

    if (p.transform) {
      // If transform is defined, require numeric input:
      if (n === null) return p.transform.fallback ?? "";

      const { op, by, decimals } = p.transform;

      // Guard against divide by 0:
      const computed =
        op === "divide"
          ? (by === 0 ? NaN : n / by)
          : n * by;

      if (!Number.isFinite(computed)) return p.transform.fallback ?? "";

      const formatted =
        typeof decimals === "number"
          ? computed.toFixed(decimals)
          : String(computed);

      return `${p.prefix ?? ""}${formatted}${p.suffix ? ` ${p.suffix}` : ""}`;
    }

    // No transform:
    // - numeric stays numeric
    // - everything else becomes string
    const base = n !== null ? String(n) : String(raw);
    return `${p.prefix ?? ""}${base}${p.suffix ? ` ${p.suffix}` : ""}`;
  }

  return (
    <Stack className="object-retrieve" gap="md" mt="md" mb="md">
      {/* Fullscreen image modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        size="90%"
        padding="md"
        overlayProps={{
          backgroundOpacity: 0.8,
          blur: 2,
        }}
        withCloseButton
        zIndex={300}
        title={
          <Stack gap={2}>
            <Text fw={600} size="md">
              {activeImageName}
            </Text>

            {activeImageSnippet && (
              <Text size="sm" c="dimmed">
                {activeImageSnippet}
              </Text>
            )}
          </Stack>
        }
      >
        {activeImage && (
          <ImageLoader
            src={activeImage}
            alt={String(activeImageName ?? resolvedTitle ?? "")}
            fit="contain"
            height="80vh"
            style={{ cursor: "zoom-out" }}
            onClick={() => setOpened(false)}
          />
        )}
      </Modal>

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

      {/* Main content */}
      {!isLoading && !error && data && (
        <ResponsiveLayout mobile={isMobile}>
          {/* Left column */}
          <Stack style={{ flex: 2 }} gap="md">
            {/* Image carousel */}
            {Array.isArray(resolvedImages) && resolvedImages.length > 0 && (
              <Paper withBorder>
                <Carousel
                  withIndicators
                  height={500}
                  slideGap="sm"
                  controlsOffset="md"
                >
                  {resolvedImages.map((item, index) => (
                    <Carousel.Slide key={index}>
                      <ImageLoader
                        src={item.photo?.path ?? null}
                        alt={String(resolvedTitle ?? "")}
                        height={500}
                        fit="cover"
                        style={{ cursor: "zoom-in" }}
                        onClickCapture={() => {
                          setActiveImage(item.photo?.path ?? null);
                          setActiveImageName(item.photo?.name ?? null);
                          setActiveImageSnippet(item.photo?.snippet ?? null);
                          setOpened(true);
                        }}
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
                                  {formatPropertyValue(resolvePath(data, p.value), p)}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Tabs.Panel>
                  ))}
                </Tabs>
              </Paper>
            )}
          </Stack>

          {/* Right column */}
          <Stack style={{ flex: 1 }} gap="md">
            {config.properties && (
              <Paper withBorder p="md">
                <Stack gap="xs">
                  {config.properties.map((p, i) => (
                    <Group key={i} justify="space-between">
                      <Text fw={500}>{p.label}</Text>
                      <Text>
                        {formatPropertyValue(resolvePath(data, p.value), p)}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}

            {id && (
              <Paper withBorder p="md">
                <Button
                  component={Link}
                  to={`${config.routes.edit}/${id}/edit`}
                  fullWidth
                >
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
