import { radii, spacing } from '@/constants/layout';
import {
  Badge,
  ButtonContent,
  Column,
  DropdownMenu,
  Popover,
  UniversalTextContent as Text,
  type DropdownMenuSection,
} from '@components/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const triggerAppearance = {
  variant: 'secondary',
  size: 'sm',
  borderRadius: radii.sm,
  contentPadding: 10,
} as const;

export function DropdownMenuExample() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const sections: DropdownMenuSection[] = [
    {
      id: 'account',
      label: t('common.account'),
      items: [
        { id: 'profile', label: t('componentCatalog.overlays.profile'), shortcut: '⇧⌘P' },
        { id: 'billing', label: t('componentCatalog.overlays.billing'), shortcut: '⌘B' },
        { id: 'settings', label: t('settings.tab'), shortcut: '⌘S' },
        {
          id: 'keyboard-shortcuts',
          label: t('componentCatalog.overlays.keyboardShortcuts'),
          shortcut: '⌘K',
        },
      ],
    },
    {
      id: 'team',
      label: t('componentCatalog.overlays.team'),
      items: [
        {
          id: 'invite',
          label: t('componentCatalog.overlays.inviteUsers'),
          items: [
            { id: 'email', label: t('auth.email') },
            { id: 'message', label: t('componentCatalog.overlays.message') },
            { id: 'more', label: t('componentCatalog.overlays.more') },
          ],
        },
        { id: 'new-team', label: t('componentCatalog.overlays.newTeam'), shortcut: '⌘+T' },
      ],
    },
    {
      id: 'resources',
      items: [
        { id: 'github', label: 'GitHub' },
        { id: 'support', label: t('componentCatalog.overlays.support') },
        { id: 'api', label: 'API', disabled: true },
      ],
    },
    {
      id: 'session',
      items: [{ id: 'sign-out', label: t('auth.signOut'), shortcut: '⇧⌘Q' }],
    },
  ];
  const selectedItem = sections
    .flatMap(({ items }) => items.flatMap((item) => item.items ?? [item]))
    .find(({ id }) => id === selectedId);

  return (
    <Column alignment="center" spacing={spacing.md}>
      <DropdownMenu
        isPresented={open}
        onIsPresentedChange={setOpen}
        sections={sections}
        onSelect={setSelectedId}
        testID="component-dropdown-menu"
        trigger={
          <ButtonContent
            {...triggerAppearance}
            label={t('componentCatalog.overlays.open')}
            onPress={() => setOpen(true)}
            testID="component-dropdown-menu-trigger"
          />
        }
      />
      {selectedItem && (
        <Text tone="muted" variant="caption" testID="component-dropdown-menu-result">
          {t('common.selectedValue', { value: selectedItem.label })}
        </Text>
      )}
    </Column>
  );
}

export function PopoverExample({ width }: Readonly<{ width: number }>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover
      isPresented={open}
      onIsPresentedChange={setOpen}
      width={Math.min(228, width)}
      testID="component-popover"
      trigger={
        <ButtonContent
          {...triggerAppearance}
          label={t('componentCatalog.overlays.open')}
          onPress={() => setOpen(true)}
          testID="component-popover-trigger"
        />
      }
    >
      <Column spacing={spacing.sm} style={{ padding: spacing.md }}>
        <Text variant="label">{t('common.account')}</Text>
        <Badge variant="verified" label={t('componentCatalog.badges.verified')} />
        <ButtonContent
          variant="secondary"
          size="sm"
          borderRadius={radii.sm}
          label={t('common.close')}
          onPress={() => setOpen(false)}
          testID="component-popover-close"
        />
      </Column>
    </Popover>
  );
}
