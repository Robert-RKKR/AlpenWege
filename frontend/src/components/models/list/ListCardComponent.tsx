// Import necessary components:
import { Badge, Button, Card, Group, SimpleGrid, Spoiler, Text, Tooltip, Box } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { formatValue, resolvePath } from "./listTypes";
import { ImageLoader } from "../../elements/imageLoader/ImageLoader";
import type { CardViewConfig, BaseModelDataConfig } from "./listTypes";

// Component props type definition for ListCardComponent, parameterized by the model type TModel:
type ListCardComponentProps<TModel> = {
  items: TModel[];
  baseModelData: BaseModelDataConfig;
  cardView: CardViewConfig;
};

// Renders a grid of cards based on the provided items and configuration.
// Each card displays an image, title, description, properties, and a link to the detail page.
export function ListCardComponent<TModel>({
  items,
  baseModelData,
  cardView,
}: ListCardComponentProps<TModel>) {
  
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
      {items.map((item: any) => {
        const id = item?.[baseModelData.id];
        const href = `${baseModelData.href}${id}`;

        const title = resolvePath(item, cardView.cardTitle) ?? "—";
        const description = cardView.cardDescription
          ? (resolvePath(item, cardView.cardDescription) ?? "")
          : "";

        const image = cardView.cardImage ? resolvePath(item, cardView.cardImage) : undefined;

        return (
          <Card key={id} withBorder radius="md" p="md" h="100%">
            {image && (
              <Card.Section>
                <ImageLoader src={String(image)} alt={String(title)} height={160} radius={0} />
              </Card.Section>
            )}

            <Text fw={600} mt={image ? "md" : 0} mb="xs">
              {String(title)}
            </Text>

            {cardView.cardProperties?.length ? (
              <Group gap="xs" mb="sm">
                {cardView.cardProperties.map((p, idx) => (
                  <Tooltip
                    key={idx}
                    label={p.label}
                    withArrow
                    multiline
                    color={p.color ?? "blue"}
                  >
                    <Badge
                      key={idx}
                      variant="light"
                      radius="sm"
                      color={p.color ?? "blue"}
                    >
                      {formatValue(resolvePath(item, p.value), p)}
                    </Badge>
                  </Tooltip>
                ))}
              </Group>
            ) : null}

            {description ? (
              <Box mb="sm">
                <Text size="sm" c="dimmed" mb={4}>
                  Description
                </Text>

                <Spoiler maxHeight={60} showLabel="Show more" hideLabel="Hide">
                  <Text size="sm" c="dimmed">
                    {String(description)}
                  </Text>
                </Spoiler>
              </Box>
            ) : null}

            {cardView.cardSubProperties?.length ? (
              <Group gap="xs" mb="md">
                {cardView.cardSubProperties.map((p, idx) => (
                  <Tooltip
                    key={idx}
                    label={p.label}
                    withArrow
                    multiline
                    color={p.color ? p.color : "blue"}
                  >
                    <Badge key={idx} variant="light" radius="sm" color={p.color ? p.color : "blue"}>
                        {formatValue(resolvePath(item, p.value), p)}
                    </Badge>
                  </Tooltip>
                ))}
              </Group>
            ) : null}

            <Button
              component={Link}
              to={href}
              variant="light"
              fullWidth
              leftSection={<IconEye size={14} />}
              mt="auto"
            >
              View details
            </Button>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
