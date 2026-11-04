import {
  ButtonContent,
  Chip,
  Column,
  Row,
  ScrollView,
  Switch,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/layout';

const topics = ['design', 'code', 'music', 'travel'] as const;
type Topic = (typeof topics)[number];

/** Local chip interactions, composed inside the component page's existing Host. */
export function ChipExamples({ onAction }: Readonly<{ onAction: () => void }>) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<readonly Topic[]>(['design', 'music']);
  const [single, setSingle] = useState<Topic>('design');
  const [tokens, setTokens] = useState<readonly Topic[]>(['design', 'music']);
  const [disabled, setDisabled] = useState(false);
  const selectedTopics = topics.filter((topic) => selected.includes(topic));
  const selectionState =
    selectedTopics.length === 0 ? 'none' : selectedTopics.length === topics.length ? 'all' : 'some';
  const topicLabel = (topic: Topic) => t(`componentCatalog.chips.topics.${topic}`);

  function replaceSelection(next: readonly Topic[]) {
    if (disabled) return;
    setSelected(next);
    onAction();
  }

  return (
    <Column spacing={spacing.xxl} modifiers={nativeFillWidth}>
      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <Text variant="subtitle">{t('componentCatalog.chips.multiple')}</Text>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.chips.multipleHint')}
        </Text>
        <Switch
          label={t('componentCatalog.chips.disableSelection')}
          value={disabled}
          onValueChange={setDisabled}
          testID="component-chip-disable-selection"
        />
        <ChipRail testID="component-chip-filters">
          {topics.map((topic) => (
            <Chip
              key={topic}
              variant="filter"
              label={topicLabel(topic)}
              selected={selected.includes(topic)}
              disabled={disabled}
              onPress={() => {
                if (disabled) return;
                setSelected((previous) =>
                  previous.includes(topic)
                    ? previous.filter((value) => value !== topic)
                    : [...previous, topic],
                );
                onAction();
              }}
              testID={topic === 'design' ? 'component-chip' : `component-chip-filter-${topic}`}
            />
          ))}
        </ChipRail>
        <Text testID="component-chip-selection-count">
          {t('componentCatalog.chips.selectionCount', {
            selected: selectedTopics.length,
            total: topics.length,
          })}
        </Text>
        <Text variant="caption" testID="component-chip-selection-state">
          {t(`componentCatalog.chips.selectionStates.${selectionState}`)}
        </Text>
        <Text variant="caption" tone="muted" testID="component-chip-selected-values">
          {t('componentCatalog.chips.selectedValues', {
            labels: selectedTopics.length
              ? selectedTopics.map(topicLabel).join(' · ')
              : t('common.none'),
          })}
        </Text>
        <Row spacing={spacing.md} modifiers={nativeFillWidth}>
          <Column modifiers={nativeRowWeight}>
            <ButtonContent
              variant="secondary"
              label={t('componentCatalog.chips.selectAll')}
              disabled={disabled || selectionState === 'all'}
              fullWidth
              onPress={() => replaceSelection(topics)}
              testID="component-chip-select-all"
            />
          </Column>
          <Column modifiers={nativeRowWeight}>
            <ButtonContent
              variant="secondary"
              label={t('componentCatalog.chips.clearAll')}
              disabled={disabled || selectionState === 'none'}
              fullWidth
              onPress={() => replaceSelection([])}
              testID="component-chip-clear-all"
            />
          </Column>
        </Row>
      </Column>

      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <Text variant="subtitle">{t('componentCatalog.chips.single')}</Text>
        <ChipRail testID="component-chip-single-options">
          {topics.map((topic) => (
            <Chip
              key={topic}
              variant="filter"
              label={topicLabel(topic)}
              selected={single === topic}
              onPress={() => {
                setSingle(topic);
                onAction();
              }}
              testID={`component-chip-single-${topic}`}
            />
          ))}
        </ChipRail>
        <Text variant="caption" testID="component-chip-single-value">
          {t('componentCatalog.chips.selectedValues', { labels: topicLabel(single) })}
        </Text>
      </Column>

      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <Text variant="subtitle">{t('componentCatalog.chips.input')}</Text>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.chips.inputHint')}
        </Text>
        {tokens.length ? (
          <ChipRail testID="component-chip-inputs">
            {topics
              .filter((topic) => tokens.includes(topic))
              .map((topic) => (
                <Chip
                  key={topic}
                  variant="input"
                  label={topicLabel(topic)}
                  accessibilityLabel={t('componentCatalog.chips.remove', {
                    label: topicLabel(topic),
                  })}
                  selected
                  onPress={() => {
                    setTokens((previous) => previous.filter((value) => value !== topic));
                    onAction();
                  }}
                  testID={`component-chip-input-${topic}`}
                />
              ))}
          </ChipRail>
        ) : (
          <Text testID="component-chip-input-empty">{t('componentCatalog.chips.empty')}</Text>
        )}
        <Text variant="caption" testID="component-chip-input-count">
          {t('componentCatalog.chips.tokenCount', { count: tokens.length })}
        </Text>
        <ButtonContent
          variant="secondary"
          label={t('componentCatalog.chips.restoreAll')}
          disabled={tokens.length === topics.length}
          fullWidth
          onPress={() => {
            setTokens(topics);
            onAction();
          }}
          testID="component-chip-restore-all"
        />
        <Text variant="label">{t('componentCatalog.chips.suggestion')}</Text>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.chips.suggestionHint')}
        </Text>
        <ChipRail testID="component-chip-suggestions">
          {topics.map((topic) => (
            <Chip
              key={topic}
              variant="suggestion"
              label={topicLabel(topic)}
              disabled={tokens.includes(topic)}
              onPress={() => {
                if (tokens.includes(topic)) return;
                setTokens((previous) =>
                  previous.includes(topic) ? previous : [...previous, topic],
                );
                onAction();
              }}
              testID={`component-chip-suggestion-${topic}`}
            />
          ))}
        </ChipRail>
      </Column>

      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <Text variant="subtitle">{t('componentCatalog.chips.assist')}</Text>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.chips.assistHint')}
        </Text>
        <Chip
          variant="assist"
          label={t('componentCatalog.tryAction')}
          onPress={onAction}
          testID="component-chip-assist"
        />
      </Column>

      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <Text variant="subtitle">{t('componentCatalog.chips.disabled')}</Text>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.chips.disabledHint')}
        </Text>
        {(['filter', 'input'] as const).map((variant) => (
          <Column key={variant} spacing={spacing.sm} modifiers={nativeFillWidth}>
            <Text variant="label">{t(`componentCatalog.chips.variants.${variant}`)}</Text>
            <ChipRail testID={`component-chip-disabled-${variant}`}>
              {[false, true].map((selected) => (
                <Chip
                  key={String(selected)}
                  variant={variant}
                  label={t(`componentCatalog.chips.${selected ? 'selected' : 'unselected'}`)}
                  selected={selected}
                  disabled
                  onPress={onAction}
                  testID={`component-chip-disabled-${variant}-${selected ? 'selected' : 'unselected'}`}
                />
              ))}
            </ChipRail>
          </Column>
        ))}
        {(['assist', 'suggestion'] as const).map((variant) => (
          <Chip
            key={variant}
            variant={variant}
            label={t(`componentCatalog.chips.variants.${variant}`)}
            disabled
            onPress={onAction}
            testID={`component-chip-disabled-${variant}`}
          />
        ))}
      </Column>
    </Column>
  );
}

function ChipRail({ children, testID }: Readonly<{ children: ReactNode; testID: string }>) {
  return (
    <ScrollView direction="horizontal" modifiers={nativeFillWidth} testID={testID}>
      <Row spacing={spacing.sm} alignment="center">
        {children}
      </Row>
    </ScrollView>
  );
}
