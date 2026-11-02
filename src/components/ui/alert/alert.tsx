import { useThemeColors } from '@/hooks/use-theme';
import { dismissAlert, getAlert, subscribeAlerts, type AlertOptions } from '@/lib/alerts';
import { triggerHaptic } from '@/lib/haptics';
import { useEffect, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { NativeAlert } from './native-alert';

export type { AlertVariant } from '@/lib/alerts';

export interface AlertProps extends AlertOptions {
  onDismiss: () => void;
  colorScheme?: 'light' | 'dark';
}

export function Alert({ variant, title, message, onDismiss, colorScheme }: Readonly<AlertProps>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  const accentColor = colors[variant];
  useEffect(() => {
    if (variant !== 'info') triggerHaptic(variant);
  }, [variant]);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      seedColor={accentColor}
      matchContents={false}
      ignoreSafeArea="all"
      pointerEvents="box-none"
      style={{ position: 'absolute', width: 1, height: 1 }}
    >
      <NativeAlert
        accentColor={accentColor}
        title={title ?? t(`common.${variant}NotificationTitle`)}
        message={message}
        confirmLabel={t('common.ok')}
        onDismiss={onDismiss}
      />
    </UniversalHost>
  );
}

export function AlertHost() {
  const alert = useSyncExternalStore(subscribeAlerts, getAlert);
  return alert ? (
    <Alert key={alert.id} {...alert} onDismiss={() => dismissAlert(alert.id)} />
  ) : null;
}
