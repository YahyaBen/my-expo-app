import type { Meta, StoryObj } from '@storybook/react-native';
import BottomSheetPreview from '../../components/catalog/bottom-sheet-preview';
import ButtonsPreview from '../../components/catalog/buttons-preview';
import CameraPreview from '../../components/catalog/camera-preview';
import CheckboxPreview from '../../components/catalog/checkbox-preview';
import CollapsiblePreview from '../../components/catalog/collapsible-preview';
import FieldGroupPreview from '../../components/catalog/field-group-preview';
import HostPreview from '../../components/catalog/host-preview';
import InputPreview from '../../components/catalog/input-preview';
import ListPreview from '../../components/catalog/list-preview';
import LoadingPreview from '../../components/catalog/loading-preview';
import NativePreview from '../../components/catalog/native-preview';
import PickerPreview from '../../components/catalog/picker-preview';
import SegmentsPreview from '../../components/catalog/segments-preview';
import SkeletonPreview from '../../components/catalog/skeleton-preview';
import SliderPreview from '../../components/catalog/slider-preview';
import SwitchPreview from '../../components/catalog/switch-preview';
import TablePreview from '../../components/catalog/table-preview';
import TextPreview from '../../components/catalog/text-preview';
import TokensPreview from '../../components/catalog/tokens-preview';

const previews = {
  buttons: ButtonsPreview,
  'bottom-sheet': BottomSheetPreview,
  camera: CameraPreview,
  checkbox: CheckboxPreview,
  collapsible: CollapsiblePreview,
  'field-group': FieldGroupPreview,
  host: HostPreview,
  input: InputPreview,
  list: ListPreview,
  loading: LoadingPreview,
  native: NativePreview,
  picker: PickerPreview,
  segments: SegmentsPreview,
  skeleton: SkeletonPreview,
  slider: SliderPreview,
  switch: SwitchPreview,
  table: TablePreview,
  text: TextPreview,
  tokens: TokensPreview,
};

function Gallery({ page }: Readonly<{ page: keyof typeof previews }>) {
  const Preview = previews[page];
  return <Preview />;
}

const meta = {
  title: 'Wireframes/Component Gallery',
  component: Gallery,
  args: { page: 'buttons' },
  argTypes: { page: { control: 'select', options: Object.keys(previews) } },
} satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Buttons: Story = {};
export const BottomSheet: Story = { args: { page: 'bottom-sheet' } };
export const Camera: Story = { args: { page: 'camera' } };
export const Checkbox: Story = { args: { page: 'checkbox' } };
export const Collapsible: Story = { args: { page: 'collapsible' } };
export const FieldGroup: Story = { args: { page: 'field-group' } };
export const Host: Story = { args: { page: 'host' } };
export const Inputs: Story = { args: { page: 'input' } };
export const List: Story = { args: { page: 'list' } };
export const Loading: Story = { args: { page: 'loading' } };
export const Native: Story = { args: { page: 'native' } };
export const Picker: Story = { args: { page: 'picker' } };
export const SegmentedControl: Story = { args: { page: 'segments' } };
export const Skeleton: Story = { args: { page: 'skeleton' } };
export const Slider: Story = { args: { page: 'slider' } };
export const Switch: Story = { args: { page: 'switch' } };
export const Table: Story = { args: { page: 'table' } };
export const Text: Story = { args: { page: 'text' } };
export const Tokens: Story = { args: { page: 'tokens' } };
