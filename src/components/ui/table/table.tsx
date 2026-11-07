import { Column, Row, ScrollView } from '@expo/ui';
import type { ReactNode } from 'react';
import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent } from '../text/universal-text';
import { TableCheckbox } from './table-checkbox';
import { TableRow, tableRowInsets } from './table-row';

export interface TableColumn<T> {
  id: string;
  header: string;
  /** Optional native header control, such as a sort button. */
  renderHeader?: () => ReactNode;
  /** Fixed native width, including cell padding. Defaults to 144 points/dp. */
  width?: number;
  align?: 'start' | 'center' | 'end';
  /** Strings and numbers receive themed text; custom content must be native UI. */
  renderCell: (row: T) => ReactNode;
}

export interface TableSelection<T> {
  selectedKeys: readonly string[];
  onSelectRow: (row: T, selected: boolean) => void;
  /** Select/deselect the supplied visible rows; hidden selection belongs to the caller. */
  onSelectAll: (rows: readonly T[], selected: boolean) => void;
  selectAllLabel: string;
  rowLabel: (row: T) => string;
  disabled?: boolean;
}

export interface TableProps<T> {
  rows: readonly T[];
  columns: readonly TableColumn<T>[];
  keyExtractor: (row: T) => string;
  emptyState: ReactNode;
  /** Native filter controls supplied by the consumer; Table owns no filter state. */
  toolbar?: ReactNode;
  renderActions?: (row: T) => ReactNode;
  actionsHeader?: string;
  actionsWidth?: number;
  selection?: TableSelection<T>;
  /** Makes the data cells one native ListItem; selection and actions remain separate. */
  onRowPress?: (row: T) => void;
  rowAccessibilityLabel?: (row: T) => string;
  testID?: string;
}

function cellContent(content: ReactNode, color: string) {
  return typeof content === 'string' || typeof content === 'number' ? (
    <UniversalTextContent variant="body" fontSize={14} textStyle={{ color }}>
      {String(content)}
    </UniversalTextContent>
  ) : (
    content
  );
}

/** A content-only native table for small datasets or a consumer-owned page of rows. */
export function Table<T>({
  rows,
  columns,
  keyExtractor,
  emptyState,
  toolbar,
  renderActions,
  actionsHeader,
  actionsWidth = 112,
  selection,
  onRowPress,
  rowAccessibilityLabel,
  testID,
}: Readonly<TableProps<T>>) {
  const colors = useThemeColors(useHostColorScheme());
  const rowInsets = onRowPress ? tableRowInsets : { start: 0, end: 0 };
  const dataWidth = columns.reduce((total, column) => total + (column.width ?? 144), 0);
  const rowWidth = dataWidth + rowInsets.start + rowInsets.end;
  const tableWidth = rowWidth + (renderActions ? actionsWidth : 0) + (selection ? 64 : 0);
  const cellStyle = { paddingHorizontal: spacing.md, paddingVertical: spacing.sm };
  const selectionStyle = { width: 64, paddingHorizontal: spacing.xs };
  const actionStyle = { width: actionsWidth, paddingHorizontal: spacing.sm };
  const allSelected =
    rows.length > 0 && rows.every((row) => selection?.selectedKeys.includes(keyExtractor(row)));

  return (
    <Column modifiers={nativeFillWidth} spacing={spacing.md} testID={testID}>
      {toolbar}
      <Column
        modifiers={nativeFillWidth}
        spacing={0}
        style={{
          backgroundColor: colors.tableSurface,
          borderColor: colors.tableBorder,
          borderWidth: 1,
          borderRadius: radii.sm,
        }}
      >
        <ScrollView
          direction="horizontal"
          modifiers={nativeFillWidth}
          testID={testID ? `${testID}-scroll` : undefined}
        >
          <Column spacing={0} style={{ width: tableWidth }}>
            <Row
              alignment="center"
              spacing={0}
              modifiers={nativeFillWidth}
              style={{ backgroundColor: colors.tableHeader }}
              testID={testID ? `${testID}-header` : undefined}
            >
              {selection && (
                <Column alignment="center" style={selectionStyle}>
                  <TableCheckbox
                    value={allSelected}
                    disabled={selection.disabled || rows.length === 0}
                    accessibilityLabel={selection.selectAllLabel}
                    onValueChange={(selected) => selection.onSelectAll(rows, selected)}
                    testID={testID ? `${testID}-select-all` : undefined}
                  />
                </Column>
              )}
              {rowInsets.start > 0 && <Column style={{ width: rowInsets.start }} />}
              {columns.map((column) => (
                <Column
                  key={column.id}
                  alignment={column.align}
                  style={{ ...cellStyle, paddingVertical: spacing.xs, width: column.width ?? 144 }}
                >
                  {column.renderHeader ? (
                    column.renderHeader()
                  ) : (
                    <UniversalTextContent
                      variant="label"
                      fontWeight="500"
                      textStyle={{ color: colors.tableText }}
                    >
                      {column.header}
                    </UniversalTextContent>
                  )}
                </Column>
              ))}
              {rowInsets.end > 0 && <Column style={{ width: rowInsets.end }} />}
              {renderActions && (
                <Column style={actionStyle}>
                  <UniversalTextContent variant="label" textStyle={{ color: colors.tableText }}>
                    {actionsHeader ?? ''}
                  </UniversalTextContent>
                </Column>
              )}
            </Row>
            {rows.map((row) => {
              const rowKey = keyExtractor(row);
              const rowID = testID ? `${testID}-row-${rowKey}` : undefined;
              const cells = columns.map((column) => (
                <Column
                  key={column.id}
                  alignment={column.align}
                  style={{ ...cellStyle, width: column.width ?? 144 }}
                  testID={rowID ? `${rowID}-cell-${column.id}` : undefined}
                >
                  {cellContent(column.renderCell(row), colors.tableText)}
                </Column>
              ));
              return (
                <Column key={rowKey} spacing={0} modifiers={nativeFillWidth}>
                  <Column
                    modifiers={nativeFillWidth}
                    style={{ height: 1, backgroundColor: colors.tableBorder }}
                  />
                  <Row
                    alignment="center"
                    spacing={0}
                    modifiers={nativeFillWidth}
                    testID={onRowPress ? undefined : rowID}
                  >
                    {selection && (
                      <Column alignment="center" style={selectionStyle}>
                        <TableCheckbox
                          value={selection.selectedKeys.includes(rowKey)}
                          disabled={selection.disabled}
                          accessibilityLabel={selection.rowLabel(row)}
                          onValueChange={(selected) => selection.onSelectRow(row, selected)}
                          testID={rowID ? `${rowID}-select` : undefined}
                        />
                      </Column>
                    )}
                    {onRowPress ? (
                      <Column style={{ width: rowWidth }}>
                        <TableRow
                          onPress={() => onRowPress(row)}
                          accessibilityLabel={rowAccessibilityLabel?.(row)}
                          testID={rowID}
                        >
                          <Row alignment="center" spacing={0} style={{ width: dataWidth }}>
                            {cells}
                          </Row>
                        </TableRow>
                      </Column>
                    ) : (
                      cells
                    )}
                    {renderActions && (
                      <Column alignment="center" style={actionStyle}>
                        {renderActions(row)}
                      </Column>
                    )}
                  </Row>
                </Column>
              );
            })}
          </Column>
        </ScrollView>
        {rows.length === 0 && (
          <Column
            modifiers={nativeFillWidth}
            spacing={spacing.md}
            style={{ padding: spacing.xl }}
            testID={testID ? `${testID}-empty` : undefined}
          >
            {cellContent(emptyState, colors.tableText)}
          </Column>
        )}
      </Column>
    </Column>
  );
}
