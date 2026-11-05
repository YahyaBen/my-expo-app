import {
  Badge,
  Column,
  Row,
  ScrollView,
  UniversalHost,
  UniversalTextContent,
  nativeFillWidth,
  type BadgeProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';

type Props = BadgeProps & {
  colorScheme: 'light' | 'dark';
  layoutDirection: 'leftToRight' | 'rightToLeft';
};

function BadgeDemo({ colorScheme, layoutDirection, ...props }: Readonly<Props>) {
  return (
    <NativeStoryFrame colorScheme={colorScheme}>
      <UniversalHost colorScheme={colorScheme} layoutDirection={layoutDirection}>
        <Column spacing={24} modifiers={nativeFillWidth}>
          <Column spacing={8} modifiers={nativeFillWidth}>
            <UniversalTextContent variant="caption" tone="muted">
              Variants
            </UniversalTextContent>
            <ScrollView direction="horizontal" modifiers={nativeFillWidth}>
              <Row spacing={8} alignment="center">
                <Badge label="Badge" testID="badge-default" />
                <Badge label="Secondary" variant="secondary" testID="badge-secondary" />
                <Badge label="Destructive" variant="destructive" testID="badge-destructive" />
                <Badge label="Outline" variant="outline" testID="badge-outline" />
              </Row>
            </ScrollView>
          </Column>
          <Column spacing={8}>
            <UniversalTextContent variant="caption" tone="muted">
              Playground
            </UniversalTextContent>
            <Badge {...props} />
          </Column>
          <Row spacing={8} alignment="center">
            <Badge label="Nouveau" variant="secondary" testID="badge-french" />
            <Badge label="جديد" variant="outline" testID="badge-arabic" />
          </Row>
        </Column>
      </UniversalHost>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Components/Badge',
  component: BadgeDemo,
  args: {
    label: 'Badge',
    variant: 'default',
    testID: 'badge-playground',
    colorScheme: 'light',
    layoutDirection: 'leftToRight',
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    layoutDirection: { control: 'select', options: ['leftToRight', 'rightToLeft'] },
  },
  render: (args) => <BadgeDemo {...args} />,
} satisfies Meta<typeof BadgeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
