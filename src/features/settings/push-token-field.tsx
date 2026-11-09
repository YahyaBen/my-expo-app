import { Icon, TextInput } from '@components/ui';
import { useIsFocused } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { getAppBrand } from '@/config/brand';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import { useAppActive } from '@/hooks/use-motion-enabled';
import type { DevicePermission } from '@/lib/device-permissions';

type TokenResult = { token: string; status: 'loading' | 'ready' | 'failed' };

export function PushTokenField({
  permission,
}: Readonly<{ permission: DevicePermission | undefined }>) {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const active = useAppActive();
  const ready = useContext(PerformanceReadyContext);
  const visible = focused && active && ready !== false;
  const configured = Platform.OS === 'android' && getAppBrand().pushNotifications;
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<TokenResult>({ token: '', status: 'loading' });

  useEffect(() => {
    if (!visible || !configured || !permission?.granted) return;
    let disposed = false;
    void import('@/lib/push-notifications')
      .then(async ({ getExpoPushToken }) => {
        if (disposed) return;
        const token = await getExpoPushToken();
        if (!disposed) setResult({ token: token ?? '', status: token ? 'ready' : 'failed' });
      })
      .catch(() => {
        if (!disposed) {
          setResult((current) => ({ ...current, status: 'failed' }));
        }
      });
    return () => {
      disposed = true;
    };
  }, [visible, configured, permission?.granted, revision]);

  const status = !configured
    ? 'unavailable'
    : !permission
      ? 'loading'
      : !permission.granted
        ? 'permissionRequired'
        : result.status;
  const canRefresh = visible && configured && permission?.granted && status !== 'loading';

  return (
    <TextInput
      label={t('settings.messaging.token')}
      value={configured && permission?.granted ? result.token : ''}
      readOnly
      multiline
      selectTextOnFocus
      helperText={t(`settings.messaging.${status}`)}
      status={status === 'failed' ? 'error' : 'default'}
      rightIcon={
        canRefresh ? Icon.select({ ios: 'arrow.clockwise', android: 'refresh' }) : undefined
      }
      onRightIconPress={
        canRefresh
          ? () => {
              setResult((current) => ({ ...current, status: 'loading' }));
              setRevision((current) => current + 1);
            }
          : undefined
      }
      rightIconAccessibilityLabel={t('settings.messaging.refresh')}
      testID="app-settings-expo-push-token"
    />
  );
}
