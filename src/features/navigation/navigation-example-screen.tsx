import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageScreen, PageSection, TextInput, UniversalTextContent } from '@components/ui';
import { SampleRecipeRows, sampleRecipes } from './sample-recipes';

export function SearchExampleScreen() {
  return <NavigationExampleScreen search />;
}

export function RecipesExampleScreen() {
  return <NavigationExampleScreen />;
}

function NavigationExampleScreen({ search = false }: Readonly<{ search?: boolean }>) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const matches = sampleRecipes.filter((recipe) =>
    `${t(`examples.${recipe.kind}`)} ${recipe.number} ${t(`examples.${recipe.kind}Detail`)}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <PageScreen
      tab
      title={t(search ? 'common.search' : 'common.myRecipes')}
      description={t('starter.navigationExampleDescription')}
    >
      <PageSection>
        {search ? (
          <TextInput
            label={t('common.search')}
            placeholder={t('starter.searchExamples')}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            testID="navigation-search-input"
          />
        ) : null}
        <SampleRecipeRows
          recipes={matches}
          testIDPrefix={`navigation-${search ? 'search' : 'recipes'}`}
        />
        {matches.length === 0 ? (
          <UniversalTextContent testID="navigation-search-empty">
            {t('starter.noExampleResults')}
          </UniversalTextContent>
        ) : null}
      </PageSection>
    </PageScreen>
  );
}
