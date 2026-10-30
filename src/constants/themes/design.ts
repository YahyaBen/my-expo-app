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
    { fontSize: number; lineHeight: number; fontWeight: '400' | '500' | '600' | '700' }
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
    heading: { fontSize: 36, lineHeight: 40, fontWeight: '700' },
    title: { fontSize: 26, lineHeight: 32, fontWeight: '600' },
    subtitle: { fontSize: 20, lineHeight: 28, fontWeight: '500' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  },
  shape: { buttonRadius: undefined, inputRadius: radii.control },
};

/** Flat wireframe chrome; saved decorative effects cannot add colored artwork. */
export const wireframeDesign: ThemeDesign = {
  ...nativeDesign,
  header: { artwork: false },
};
