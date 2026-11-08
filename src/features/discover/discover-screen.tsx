import {
  Badge,
  Column,
  Icon,
  PageScreen,
  PageSection,
  Row,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
} from '@components/ui';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';

const topics = [
  { id: 'outside', icon: Icon.select({ ios: 'leaf', android: 'eco' }) },
  { id: 'spaces', icon: Icon.select({ ios: 'house', android: 'home' }) },
  { id: 'rituals', icon: Icon.select({ ios: 'cup.and.saucer', android: 'coffee' }) },
  { id: 'creativity', icon: Icon.select({ ios: 'pencil.and.outline', android: 'draw' }) },
] as const;
const ideas = ['walk', 'corner', 'offline'] as const;

/** An offline editorial page composed in the shell's existing native page Host. */
export default function DiscoverScreen({ showBack }: Readonly<{ showBack: boolean }>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const { width, fontScale } = useWindowDimensions();
  const columns = width < 380 || fontScale > 1.3 ? 1 : 2;

  return (
    <PageScreen tab title={t('discover.title')} showBack={showBack}>
      <PageSection spacing={24} testID="discover-screen">
        <Column spacing={8} modifiers={nativeFillWidth}>
          <UniversalTextContent variant="caption" tone="muted" textStyle={{ letterSpacing: 1.5 }}>
            {t('discover.eyebrow')}
          </UniversalTextContent>
          <UniversalTextContent variant="heading" fontSize={32} testID="discover-title">
            {t('discover.headline')}
          </UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {t('discover.description')}
          </UniversalTextContent>
        </Column>

        <Column
          spacing={20}
          modifiers={nativeFillWidth}
          style={{ padding: 24, borderRadius: 24, backgroundColor: colors.text }}
          testID="discover-featured"
        >
          <Badge label={t('discover.featured.badge')} variant="secondary" />
          <Icon
            name={Icon.select({ ios: 'sun.max', android: 'light_mode' })}
            size={48}
            color={colors.surface}
          />
          <Column spacing={12} modifiers={nativeFillWidth}>
            <UniversalTextContent
              variant="heading"
              fontSize={36}
              textStyle={{ color: colors.surface }}
            >
              {t('discover.featured.title')}
            </UniversalTextContent>
            <UniversalTextContent variant="body" textStyle={{ color: colors.surface }}>
              {t('discover.featured.description')}
            </UniversalTextContent>
          </Column>
          <UniversalTextContent variant="caption" textStyle={{ color: colors.surface }}>
            {t('discover.featured.caption')}
          </UniversalTextContent>
        </Column>

        <Column spacing={16} modifiers={nativeFillWidth} testID="discover-topics">
          <UniversalTextContent variant="title">{t('discover.topicsTitle')}</UniversalTextContent>
          {Array.from({ length: Math.ceil(topics.length / columns) }, (_, row) => (
            <Row key={row} spacing={12} modifiers={nativeFillWidth}>
              {topics.slice(row * columns, (row + 1) * columns).map((topic) => (
                <Column
                  key={topic.id}
                  spacing={12}
                  modifiers={nativeRowWeight}
                  style={{ padding: 20, borderRadius: 20, backgroundColor: colors.surfaceVariant }}
                  testID={`discover-topic-${topic.id}`}
                >
                  <Icon name={topic.icon} size={28} />
                  <Column spacing={4} modifiers={nativeFillWidth}>
                    <UniversalTextContent variant="subtitle">
                      {t(`discover.topics.${topic.id}.title`)}
                    </UniversalTextContent>
                    <UniversalTextContent variant="caption" tone="muted">
                      {t(`discover.topics.${topic.id}.description`)}
                    </UniversalTextContent>
                  </Column>
                </Column>
              ))}
            </Row>
          ))}
        </Column>

        <Column spacing={8} modifiers={nativeFillWidth} testID="discover-ideas">
          <UniversalTextContent variant="title">{t('discover.ideasTitle')}</UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {t('discover.ideasDescription')}
          </UniversalTextContent>
          {ideas.map((id, index) => (
            <Row
              key={id}
              spacing={16}
              modifiers={nativeFillWidth}
              style={{ paddingVertical: 16 }}
              testID={`discover-idea-${id}`}
            >
              <UniversalTextContent variant="title" tone="muted">
                {String(index + 1).padStart(2, '0')}
              </UniversalTextContent>
              <Column spacing={6} modifiers={nativeRowWeight}>
                <UniversalTextContent variant="subtitle">
                  {t(`discover.ideas.${id}.title`)}
                </UniversalTextContent>
                <UniversalTextContent variant="body" tone="muted">
                  {t(`discover.ideas.${id}.description`)}
                </UniversalTextContent>
              </Column>
            </Row>
          ))}
        </Column>
      </PageSection>
    </PageScreen>
  );
}
