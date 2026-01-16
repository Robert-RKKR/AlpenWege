// ListCardModelComponent.tsx
import { Badge, Button, Card, Group, SimpleGrid, Spoiler, Text, Tooltip } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { formatValue, resolvePath } from "./listTypes";

// If you have your own ImageLoader, keep it.
// Replace import path as needed.
import { ImageLoader } from "../../elements/imageLoader/ImageLoader";

import type { CardViewConfig, BaseModelDataConfig } from "./listTypes";

type ListCardModelComponentProps<TModel> = {
  items: TModel[];
  baseModelData: BaseModelDataConfig;
  cardView: CardViewConfig;
};

export function ListCardModelComponent<TModel>({
  items,
  baseModelData,
  cardView,
}: ListCardModelComponentProps<TModel>) {
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
          <Card key={id ?? crypto.randomUUID()} withBorder radius="md" p="md" h="100%">
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
                    label={p.label}
                    withArrow
                    multiline
                    color={p.color ? p.color : "blue"}
                  >
                    <Badge key={idx} variant="light" radius="sm" color={p.color ? p.color : "blue"}>
                        {formatValue(resolvePath(item, p.value), p.measurement)}
                    </Badge>
                  </Tooltip>
                ))}
              </Group>
            ) : null}

            {description ? (
              <Text size="sm" c="dimmed" mb="sm">
                <Spoiler maxHeight={60} showLabel="Show more" hideLabel="Hide">
                  {String(description)}
                </Spoiler>
              </Text>
            ) : null}

            {cardView.cardSubProperties?.length ? (
              <Group gap="xs" mb="md">
                {cardView.cardSubProperties.map((p, idx) => (
                  <Tooltip
                    label={p.label}
                    withArrow
                    multiline
                    color={p.color ? p.color : "blue"}
                  >
                    <Badge key={idx} variant="light" radius="sm" color={p.color ? p.color : "blue"}>
                        {formatValue(resolvePath(item, p.value), p.measurement)}
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
