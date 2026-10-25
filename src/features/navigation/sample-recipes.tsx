import { useTranslation } from 'react-i18next';
import { Column, nativeFillWidth, UniversalTextContent } from '@components/ui';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

const recipeKinds = ['toast', 'salad', 'pasta'] as const;

export type SampleRecipe = {
  id: string;
  kind: (typeof recipeKinds)[number];
  number: number;
};

export const sampleRecipes: readonly SampleRecipe[] = Array.from({ length: 24 }, (_, index) => ({
  id: `sample-recipe-${index + 1}`,
  kind: recipeKinds[index % recipeKinds.length],
  number: index + 1,
}));

/** Local example rows reuse their page's native Host and scrolling container. */
export function SampleRecipeRows({
  recipes = sampleRecipes,
  testIDPrefix,
}: {
  recipes?: readonly SampleRecipe[];
  testIDPrefix: string;
}) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Column spacing={0} modifiers={nativeFillWidth}>
      {recipes.map((recipe) => (
        <Column
          key={recipe.id}
          spacing={0}
          modifiers={nativeFillWidth}
          testID={`${testIDPrefix}-${recipe.id}`}
        >
          <Column
            spacing={spacing.xs}
            modifiers={nativeFillWidth}
            style={{ paddingVertical: spacing.lg }}
          >
            <UniversalTextContent variant="subtitle">
              {`${t(`examples.${recipe.kind}`)} ${recipe.number}`}
            </UniversalTextContent>
            <UniversalTextContent tone="muted">
              {t(`examples.${recipe.kind}Detail`)}
            </UniversalTextContent>
          </Column>
          <Column
            modifiers={nativeFillWidth}
            style={{ height: 1, backgroundColor: colors.divider }}
          />
        </Column>
      ))}
    </Column>
  );
}
