// TableListModelComponent.tsx
import { Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { formatValue, resolvePath } from "./listTypes";

import type { BaseModelDataConfig, TableViewConfig } from "./listTypes";

type TableListModelComponentProps<TModel> = {
  items: TModel[];
  baseModelData: BaseModelDataConfig;
  tableView: TableViewConfig;
};

export function TableListModelComponent<TModel>({
  items,
  baseModelData,
  tableView,
}: TableListModelComponentProps<TModel>) {
  const navigate = useNavigate();

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {tableView.tableColumns.map((c, idx) => (
              <Table.Th key={idx} style={{ width: c.flex ? `${c.flex * 10}%` : undefined }}>
                {c.label}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {items.map((item: any) => {
            const id = item?.[baseModelData.id];
            return (
              <Table.Tr
                key={id ?? crypto.randomUUID()}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`${baseModelData.href}${id}`)}
              >
                {tableView.tableColumns.map((c, idx) => (
                  <Table.Td key={idx}>
                    {formatValue(resolvePath(item, c.value), c.measurement)}
                  </Table.Td>
                ))}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
