import {
  Column,
  FieldGroup as NativeFieldGroup,
  ListItem as NativeListItem,
  type FieldGroupProps,
  type FieldSectionProps,
  type ListItemProps,
} from '@expo/ui';
import {
  LazyColumn,
  ListItem as MaterialListItem,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { clip, fillMaxSize, fillMaxWidth, Shapes } from '@expo/ui/jetpack-compose/modifiers';
import { Children, cloneElement, Fragment, isValidElement, type ReactNode } from 'react';

/** Native form composition keeps complete ListItem cells out of another Material cell. */
export function FieldGroup({ children, style, ...props }: Readonly<FieldGroupProps>) {
  const colors = useMaterialColors();
  const sections: ReactNode[] = [];
  let rows: ReactNode[] = [];
  const flushRows = () => {
    if (!rows.length) return;
    sections.push(<Section key={`rows-${sections.length}`}>{rows}</Section>);
    rows = [];
  };
  for (const child of flattenChildren(children)) {
    if (isValidElement(child) && child.type === Section) {
      flushRows();
      sections.push(child);
    } else rows.push(child);
  }
  flushRows();

  return (
    <Column {...props} style={{ backgroundColor: colors.surface, ...style }}>
      <LazyColumn
        modifiers={[fillMaxSize()]}
        contentPadding={{ start: 16, end: 16, top: 16, bottom: 16 }}
        verticalArrangement={{ spacedBy: 24 }}
      >
        {sections}
      </LazyColumn>
    </Column>
  );
}

function Section({
  children,
  title,
  titleUppercase = false,
  modifiers,
  ...props
}: Readonly<FieldSectionProps>) {
  const colors = useMaterialColors();
  let header: ReactNode;
  let footer: ReactNode;
  const rows: ReactNode[] = [];
  for (const child of flattenChildren(children)) {
    if (isValidElement<{ children?: ReactNode }>(child)) {
      if (child.type === NativeFieldGroup.SectionHeader) {
        header = child.props.children;
        continue;
      }
      if (child.type === NativeFieldGroup.SectionFooter) {
        footer = child.props.children;
        continue;
      }
    }
    rows.push(child);
  }

  if (!rows.some(isListItem)) {
    return (
      <NativeFieldGroup.Section
        {...props}
        title={title}
        titleUppercase={titleUppercase}
        modifiers={modifiers}
      >
        {children}
      </NativeFieldGroup.Section>
    );
  }

  const heading =
    header ??
    (title ? (
      <Text
        color={colors.onSurfaceVariant}
        style={{ typography: 'titleMedium', letterSpacing: titleUppercase ? 0.5 : undefined }}
      >
        {titleUppercase ? title.toUpperCase() : title}
      </Text>
    ) : null);

  return (
    <Column {...props} spacing={4} modifiers={[fillMaxWidth(), ...(modifiers ?? [])]}>
      {heading ? (
        <Column style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 8 }}>{heading}</Column>
      ) : null}
      <Column spacing={2} modifiers={[fillMaxWidth()]}>
        {rows.map((row, index) => {
          const top = index === 0 ? 20 : 4;
          const bottom = index === rows.length - 1 ? 20 : 4;
          const corners = Shapes.RoundedCorner({
            topStart: top,
            topEnd: top,
            bottomStart: bottom,
            bottomEnd: bottom,
          });
          return (
            <Column
              key={isValidElement(row) ? (row.key ?? index) : index}
              modifiers={[fillMaxWidth(), clip(corners)]}
            >
              {isListItem(row) ? (
                cloneElement(row, {
                  colors: { containerColor: colors.surfaceContainer, ...row.props.colors },
                  modifiers: [fillMaxWidth(), ...(row.props.modifiers ?? [])],
                })
              ) : (
                <MaterialListItem
                  colors={{ containerColor: colors.surfaceContainer }}
                  modifiers={[fillMaxWidth()]}
                >
                  <MaterialListItem.HeadlineContent>{row}</MaterialListItem.HeadlineContent>
                </MaterialListItem>
              )}
            </Column>
          );
        })}
      </Column>
      {footer ? (
        <Column style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 4 }}>{footer}</Column>
      ) : null}
    </Column>
  );
}

function isListItem(node: ReactNode): node is React.ReactElement<ListItemProps> {
  if (!isValidElement(node)) return false;
  const component = node.type as typeof NativeListItem;
  return (
    component.Leading === NativeListItem.Leading &&
    component.Supporting === NativeListItem.Supporting &&
    component.Trailing === NativeListItem.Trailing
  );
}

function flattenChildren(children: ReactNode, parentKeys: string[] = []): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [child];
    const keys = [...parentKeys, String(child.key)];
    if (child.type === Fragment) return flattenChildren(child.props.children, keys);
    return [parentKeys.length ? cloneElement(child, { key: JSON.stringify(keys) }) : child];
  });
}

FieldGroup.Section = Section;
FieldGroup.SectionHeader = NativeFieldGroup.SectionHeader;
FieldGroup.SectionFooter = NativeFieldGroup.SectionFooter;

export type { FieldGroupProps } from '@expo/ui';
