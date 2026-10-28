import type { IconName } from '../icon/icon';

export type NavigationTabProps = {
  icon: IconName;
  label: string;
  selected: boolean;
  color: string;
  selectedBackgroundColor: string;
  testID: string;
  onPress: () => void;
};

export declare function NavigationTab(props: Readonly<NavigationTabProps>): React.JSX.Element;
