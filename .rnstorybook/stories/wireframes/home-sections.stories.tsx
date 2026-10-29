import { PageScreen, PageSection, UniversalTextContent as Text } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useTranslation } from 'react-i18next';
import { HomeComponents } from '../../components/home-components';
import type { StoryThemeProps } from '../../components/story-theme';
import { SampleRecipeRows } from '../../components/navigation/sample-recipes';

function HomeSections() {
  const { t } = useTranslation();
  return (
    <PageScreen title={t('common.home')} description="" showBack={false}>
      <PageSection testID="home-components">
        <Text variant="title">{t('starter.componentsTitle')}</Text>
        <HomeComponents />
      </PageSection>
    </PageScreen>
  );
}

const meta = {
  title: 'Wireframes/Home Sections',
  component: HomeSections,
  args: { themeId: 'ux', colorScheme: 'light' },
  render: () => <HomeSections />,
} satisfies Meta<StoryThemeProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Cards: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const SampleRows: Story = {
  render: () => (
    <PageScreen title="Home sections" description="" showBack={false}>
      <PageSection testID="home-sample-rows">
        <SampleRecipeRows testIDPrefix="home" />
      </PageSection>
    </PageScreen>
  ),
};
