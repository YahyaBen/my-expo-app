import { Column, Row, Spacer } from '@expo/ui';
import { useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { ButtonContent } from '../button/button';
import { Collapsible } from '../collapsible/collapsible';
import { useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';
import { Popover, type PopoverProps } from './popover';

export type DropdownMenuAction = {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  testID?: string;
};

export type DropdownMenuItem = DropdownMenuAction &
  ({ items?: never } | { items: readonly DropdownMenuAction[]; shortcut?: never });

export type DropdownMenuSection = {
  id: string;
  label?: string;
  items: readonly DropdownMenuItem[];
};

export type DropdownMenuProps = Omit<PopoverProps, 'children' | 'scrollable'> & {
  sections: readonly DropdownMenuSection[];
  onSelect: (id: string) => void;
};

/** Grouped native actions inside the shared anchored popover. */
export function DropdownMenu({
  width = 228,
  sections,
  onSelect,
  isPresented,
  onIsPresentedChange,
  testID,
  ...props
}: Readonly<DropdownMenuProps>) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const panelWidth = Math.max(
    1,
    Math.min(width, windowWidth - insets.left - insets.right - spacing.xxl),
  );

  return (
    <Popover
      {...props}
      isPresented={isPresented}
      onIsPresentedChange={onIsPresentedChange}
      scrollable
      width={panelWidth}
      testID={testID}
    >
      {isPresented ? (
        <DropdownMenuContent
          sections={sections}
          onSelect={(id) => {
            onIsPresentedChange(false);
            onSelect(id);
          }}
          testID={testID}
        />
      ) : null}
    </Popover>
  );
}

function DropdownMenuContent({
  sections,
  onSelect,
  testID,
}: Readonly<Pick<DropdownMenuProps, 'sections' | 'onSelect' | 'testID'>>) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const [expandedId, setExpandedId] = useState<string>();
  const selectionRequested = useRef(false);
  const divider = colors.divider ?? (scheme === 'dark' ? '#FFFFFF26' : '#00000026');

  function actionTestID(item: DropdownMenuAction) {
    return item.testID ?? (testID ? `${testID}-item-${item.id}` : undefined);
  }

  function renderAction(item: DropdownMenuAction) {
    return (
      <ButtonContent
        key={item.id}
        variant="tertiary"
        size="sm"
        fullWidth
        borderRadius={radii.sm}
        contentPadding={0}
        disabled={item.disabled}
        accessibilityLabel={item.label}
        testID={actionTestID(item)}
        onPress={() => {
          if (selectionRequested.current || item.disabled) return;
          selectionRequested.current = true;
          onSelect(item.id);
        }}
      >
        <Row
          alignment="center"
          spacing={spacing.xs}
          modifiers={nativeFillWidth}
          style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }}
        >
          <Text variant="label" fontWeight="400" tone={item.disabled ? 'disabled' : 'default'}>
            {item.label}
          </Text>
          {item.shortcut && (
            <>
              <Spacer flexible />
              <Text variant="caption" tone={item.disabled ? 'disabled' : 'muted'}>
                {item.shortcut}
              </Text>
            </>
          )}
        </Row>
      </ButtonContent>
    );
  }

  return (
    <Column spacing={0} modifiers={nativeFillWidth} style={{ paddingVertical: spacing.xs }}>
      {sections.map((section, index) => (
        <Column key={section.id} spacing={0} modifiers={nativeFillWidth}>
          {index > 0 && (
            <Column modifiers={nativeFillWidth} style={{ height: 1, backgroundColor: divider }} />
          )}
          {section.label && (
            <Text
              variant="label"
              style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}
            >
              {section.label}
            </Text>
          )}
          {section.items.map((item) =>
            item.items?.length && !item.disabled ? (
              <Column
                key={item.id}
                modifiers={nativeFillWidth}
                style={{ paddingHorizontal: spacing.xs }}
                testID={actionTestID(item)}
              >
                <Collapsible
                  label={item.label}
                  labelStyle={{ color: colors.text }}
                  isOpen={expandedId === item.id}
                  onOpenChange={(open) => {
                    if (selectionRequested.current) return;
                    setExpandedId((current) =>
                      open ? item.id : current === item.id ? undefined : current,
                    );
                  }}
                >
                  <Column spacing={0} modifiers={nativeFillWidth}>
                    {item.items.map(renderAction)}
                  </Column>
                </Collapsible>
              </Column>
            ) : (
              renderAction(item)
            ),
          )}
        </Column>
      ))}
    </Column>
  );
}
