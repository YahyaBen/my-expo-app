import { radii } from '../layout';

export type ThemeTextVariant = 'heading' | 'title' | 'subtitle' | 'body' | 'label' | 'caption';

/** App-owned geometry and opt-in type presets; native controls keep platform behavior. */
export interface ThemeDesign {
  header: {
    /** Decorative header waves are independent of the native backdrop blur. */
    artwork: boolean;
  };
  typography: Record<
    ThemeTextVariant,
    { fontSize: number; fontWeight: '400' | '500' | '600' | '700' }
  >;
  shape: {
    /** Undefined preserves the native button shape. Explicit caller geometry takes priority. */
    buttonRadius: number | undefined;
    inputRadius: number;
  };
}

export const nativeDesign: ThemeDesign = {
  header: { artwork: true },
  typography: {
    heading: { fontSize: 36, fontWeight: '700' },
    title: { fontSize: 26, fontWeight: '600' },
    subtitle: { fontSize: 20, fontWeight: '500' },
    body: { fontSize: 16, fontWeight: '400' },
    label: { fontSize: 14, fontWeight: '600' },
    caption: { fontSize: 13, fontWeight: '400' },
  },
  shape: { buttonRadius: undefined, inputRadius: radii.control },
};
