import type { IconName } from '@expo/ui';

export type NavigationTabProps = {
  icon: IconName;
  label: string;
  selected: boolean;
  color: string;
  selectedBackgroundColor: string;
  testID: string;
  onPress: () => void;
};

export declare function NavigationTab(props: NavigationTabProps): React.JSX.Element;
