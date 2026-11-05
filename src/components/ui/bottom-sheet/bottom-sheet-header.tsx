import { Column, Row } from '@expo/ui';
import { ButtonContent } from '../button/button';
import { Icon } from '../icon/icon';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextContent } from '../text/universal-text';
import type { BottomSheetBaseProps } from './bottom-sheet.types';

/** The callback owns its outcome: a custom action never implicitly dismisses. */
export function BottomSheetHeader({
  title,
  headerAction,
  testID,
}: Readonly<Pick<BottomSheetBaseProps, 'title' | 'headerAction' | 'testID'>>) {
  if (!title && !headerAction) return null;
  return (
    <Row alignment="center" spacing={12} modifiers={nativeFillWidth}>
      <Column modifiers={nativeRowWeight}>
        {title ? (
          <UniversalTextContent
            variant="subtitle"
            fontWeight="600"
            numberOfLines={2}
            testID={testID ? `${testID}-title` : undefined}
          >
            {title}
          </UniversalTextContent>
        ) : null}
      </Column>
      {headerAction ? (
        <ButtonContent
          variant="tertiary"
          circular
          accessibilityLabel={headerAction.accessibilityLabel}
          onPress={headerAction.onPress}
          testID={headerAction.testID}
        >
          <Icon name={headerAction.icon} size={20} />
        </ButtonContent>
      ) : null}
    </Row>
  );
}
