import { Column, Row, ScrollView } from '@expo/ui';
import type { ReactNode } from 'react';
import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent } from '../text/universal-text';

export interface TableColumn<T> {
  id: string;
  header: string;
  /** Fixed native width, including cell padding. Defaults to 144 points/dp. */
  width?: number;
  align?: 'start' | 'center' | 'end';
  /** Strings and numbers receive themed text; custom content must be native UI. */
  renderCell: (row: T) => ReactNode;
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
  testID?: string;
}

function cellContent(content: ReactNode) {
  return typeof content === 'string' || typeof content === 'number' ? (
    <UniversalTextContent>{String(content)}</UniversalTextContent>
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
  testID,
}: TableProps<T>) {
  const colors = useThemeColors(useHostColorScheme());
  const tableWidth =
    columns.reduce((total, column) => total + (column.width ?? 144), 0) +
    (renderActions ? actionsWidth : 0);
  const cellStyle = { paddingHorizontal: spacing.md, paddingVertical: spacing.md };

  return (
    <Column modifiers={nativeFillWidth} spacing={spacing.md} testID={testID}>
      {toolbar}
      <Column
        modifiers={nativeFillWidth}
        spacing={0}
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radii.card,
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
              style={{ backgroundColor: colors.surfaceVariant }}
              testID={testID ? `${testID}-header` : undefined}
            >
              {columns.map((column) => (
                <Column
                  key={column.id}
                  alignment={column.align}
                  style={{ ...cellStyle, width: column.width ?? 144 }}
                >
                  <UniversalTextContent variant="label">{column.header}</UniversalTextContent>
                </Column>
              ))}
              {renderActions && (
                <Column style={{ ...cellStyle, width: actionsWidth }}>
                  <UniversalTextContent variant="label">{actionsHeader ?? ''}</UniversalTextContent>
                </Column>
              )}
            </Row>
            {rows.map((row) => {
              const rowKey = keyExtractor(row);
              const rowID = testID ? `${testID}-row-${rowKey}` : undefined;
              return (
                <Column key={rowKey} spacing={0} modifiers={nativeFillWidth}>
                  <Column
                    modifiers={nativeFillWidth}
                    style={{ height: 1, backgroundColor: colors.border }}
                  />
                  <Row alignment="center" spacing={0} modifiers={nativeFillWidth} testID={rowID}>
                    {columns.map((column) => (
                      <Column
                        key={column.id}
                        alignment={column.align}
                        style={{ ...cellStyle, width: column.width ?? 144 }}
                        testID={rowID ? `${rowID}-cell-${column.id}` : undefined}
                      >
                        {cellContent(column.renderCell(row))}
                      </Column>
                    ))}
                    {renderActions && (
                      <Column style={{ ...cellStyle, width: actionsWidth }}>
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
            {cellContent(emptyState)}
          </Column>
        )}
      </Column>
    </Column>
  );
}
