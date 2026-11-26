const { statSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { z } = require('zod');
const { resolveApiBaseUrl } = require('./api');
const assets = require('./brand-assets.json');
const settings = require('./app');

const variants = ['development', 'preview', 'production'];
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const asset = z.string().startsWith('./').min(3);
const brandSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  scheme: z.string().regex(/^[a-z][a-z0-9+.-]*$/),
  icon: asset,
  lightIcon: asset.optional(),
  redIcon: asset.optional(),
  presentation: z.strictObject({
    palette: z.enum(['bloom', 'ux', 'system']),
    launch: z.enum(['minimal', 'branded']),
    headingFont: z.string().refine((id) => Object.hasOwn(assets.headingFonts, id)),
    launchArtwork: z.string().refine((id) => Object.hasOwn(assets.launchArtworks, id)),
  }),
  ios: z.strictObject({
    icon: asset.optional(),
    bundleIdentifier: z.string().regex(/^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/),
    buildNumber: z.string().regex(/^\d+(?:\.\d+){0,2}$/),
  }),
  android: z.strictObject({
    package: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z][a-zA-Z0-9_]*)+$/),
    versionCode: z.number().int().min(1).max(2_100_000_000),
    icon: asset.optional(),
    lightIconForeground: asset.optional(),
    redIconForeground: asset.optional(),
    adaptiveIcon: z
      .strictObject({
        backgroundColor: color,
        foregroundImage: asset,
        backgroundImage: asset.optional(),
        monochromeImage: asset.optional(),
      })
      .optional(),
  }),
  splash: z.strictObject({
    image: asset,
    backgroundColor: color,
    darkBackgroundColor: color,
  }),
  eas: z
    .strictObject({
      owner: z
        .string()
        .regex(/^[a-zA-Z0-9_-]+$/)
        .optional(),
      projectId: z.uuid().or(z.literal('')),
    })
    .optional(),
});
const oauthClientId = z
  .string()
  .trim()
  .regex(/^(?:\d+-[\w-]+\.apps\.googleusercontent\.com)?$/);
const variantSchema = z.strictObject({
  description: z.string().trim().min(1),
  nameSuffix: z.string(),
  identitySuffix: z.enum(['', '.dev', '.preview']),
  apiUrl: z.string().trim(),
  googleServicesFile: asset.or(z.literal('')),
  developmentPushTopic: z.string().regex(/^[a-zA-Z0-9-_.~%]*$/),
  googleMaps: z.strictObject({ androidApiKey: z.string().trim(), iosApiKey: z.string().trim() }),
  googleAuth: z.strictObject({ webClientId: oauthClientId, iosClientId: oauthClientId }),
});
const settingsSchema = z.strictObject({
  variant: z.enum(variants),
  app: brandSchema,
  variants: z.strictObject({
    development: variantSchema,
    preview: variantSchema,
    production: variantSchema,
  }),
});
const projectRoot = path.resolve(__dirname, '..');

function requireAsset(file, field) {
  const absolute = path.resolve(projectRoot, file);
  const relative = path.relative(projectRoot, absolute);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Brand asset ${field} must be inside the project.`);
  }
  try {
    if (statSync(absolute).isFile()) return absolute;
  } catch {
    // Report the manifest field rather than exposing file contents.
  }
  throw new Error(`Missing brand asset ${field}: ${file}`);
}

/** Resolve a build-time brand without mutating manifests or environment variables. */
function resolveBrand(env = process.env) {
  const parsed = settingsSchema.safeParse(settings);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`Invalid config/app.js; check fields: ${fields}.`);
  }
  const variant = env.APP_VARIANT?.trim() || parsed.data.variant;
  if (!variants.includes(variant)) {
    throw new Error(`APP_VARIANT must be one of: ${variants.join(', ')}.`);
  }
  const brand = parsed.data.app;
  if (env.APP_BRAND?.trim() && env.APP_BRAND.trim() !== brand.id) {
    throw new Error('APP_BRAND must match app.id in config/app.js, or be unset.');
  }
  const integration = parsed.data.variants[variant];
  const apiUrl = env.EXPO_PUBLIC_API_URL?.trim() || integration.apiUrl;
  const googleMaps = {
    androidApiKey: env.GOOGLE_MAPS_ANDROID_API_KEY?.trim() || integration.googleMaps.androidApiKey,
    iosApiKey: env.GOOGLE_MAPS_IOS_API_KEY?.trim() || integration.googleMaps.iosApiKey,
  };
  const googleAuth = {
    webClientId: env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || integration.googleAuth.webClientId,
    iosClientId: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || integration.googleAuth.iosClientId,
  };
  for (const [field, value] of Object.entries(googleAuth)) {
    if (!oauthClientId.safeParse(value).success) {
      throw new Error(`googleAuth.${field} must be a Google OAuth client ID.`);
    }
  }

  // Apply variant IDs before validating package-specific integrations.
  const identitySuffix = integration.identitySuffix;
  brand.name += integration.nameSuffix;
  brand.ios.bundleIdentifier += identitySuffix;
  brand.android.package += identitySuffix;
  brand.scheme += identitySuffix;
  brand.android.googleServicesFile = integration.googleServicesFile || undefined;

  requireAsset(brand.icon, 'icon');
  if (brand.lightIcon) requireAsset(brand.lightIcon, 'lightIcon');
  if (brand.redIcon) requireAsset(brand.redIcon, 'redIcon');
  if (brand.ios.icon) {
    const iconFile = brand.ios.icon.endsWith('.icon')
      ? `${brand.ios.icon}/icon.json`
      : brand.ios.icon;
    requireAsset(iconFile, 'ios.icon');
  }
  if (brand.android.icon) requireAsset(brand.android.icon, 'android.icon');
  if (brand.android.lightIconForeground) {
    requireAsset(brand.android.lightIconForeground, 'android.lightIconForeground');
  }
  if (brand.android.redIconForeground) {
    requireAsset(brand.android.redIconForeground, 'android.redIconForeground');
  }
  requireAsset(brand.splash.image, 'splash.image');
  const headingFont = assets.headingFonts[brand.presentation.headingFont];
  const launchArtwork = assets.launchArtworks[brand.presentation.launchArtwork];
  if (headingFont.file) requireAsset(headingFont.file, 'presentation.headingFont');
  requireAsset(launchArtwork.file, 'presentation.launchArtwork');
  if (launchArtwork.darkFile) {
    requireAsset(launchArtwork.darkFile, 'presentation.launchArtwork.darkFile');
  }
  for (const field of ['foregroundImage', 'backgroundImage', 'monochromeImage']) {
    const image = brand.android.adaptiveIcon?.[field];
    if (image) requireAsset(image, `android.adaptiveIcon.${field}`);
  }
  if (brand.android.googleServicesFile) {
    const file = requireAsset(brand.android.googleServicesFile, 'android.googleServicesFile');
    let google;
    try {
      google = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      throw new Error('Brand android.googleServicesFile must contain valid JSON.');
    }
    const matches =
      Array.isArray(google?.client) &&
      google.client.some(
        (client) =>
          client?.client_info?.android_client_info?.package_name === brand.android.package,
      );
    if (!matches) {
      throw new Error('Brand Firebase configuration does not match android.package.');
    }
  }
  if (variant === 'production' && !brand.eas?.projectId) {
    throw new Error('Set app.eas.projectId in config/app.js before building production.');
  }
  const apiBaseUrl = apiUrl ? resolveApiBaseUrl(apiUrl) : '';
  if (variant === 'production' && apiBaseUrl && new URL(apiBaseUrl).protocol !== 'https:') {
    throw new Error(
      'Production requires an HTTPS API URL in config/app.js or EXPO_PUBLIC_API_URL.',
    );
  }
  // Distinct identities are required for side-by-side installs and Firebase routing.
  const suffixes = variants.map((name) => parsed.data.variants[name].identitySuffix);
  if (
    new Set(suffixes).size !== variants.length ||
    parsed.data.variants.production.identitySuffix
  ) {
    throw new Error(
      'Variant identity suffixes must be unique and production must use the base ID.',
    );
  }
  for (const name of ['preview', 'production']) {
    if (parsed.data.variants[name].developmentPushTopic) {
      throw new Error('Only the development variant may configure developmentPushTopic.');
    }
  }
  return {
    brand,
    variant,
    apiUrl: apiBaseUrl,
    googleMaps,
    googleAuth,
    developmentPushTopic: integration.developmentPushTopic,
  };
}

module.exports = { resolveBrand };
