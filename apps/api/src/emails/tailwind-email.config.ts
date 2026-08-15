import { pixelBasedPreset, type TailwindConfig } from 'react-email';

// Tailwind config for email templates
// Hard-coded design tokens (no CSS variables) because react-email's Tailwind
// implementation doesn't support runtime variables. Copied/flattened from the
// app's theme (apps/client/src/index.css) and the Drivn logo.
//
// Tokens are also exported raw so components that need literal values
// (e.g. Outlook's `bgcolor` attribute) stay on the same source of truth.
export const emailTokens = {
	colors: {
		// Asphalt black — the logo's pennant fill; used for the header band and CTA.
		ink: '#0f0f0f',
		// Road lane marking — app `--border` (#dadce0).
		lane: '#dadce0',
		// Neutral scale aligned to the app theme.
		bg: '#ffffff',
		surface: '#f8fafc',
		text: '#1f1f1f', // app `--foreground`
		muted: '#5f6368', // app `--muted-foreground`
		// Brand blue — app `--primary`.
		brand: '#1a73e8',
		'brand-50': '#e8f0fe',
		'brand-100': '#d2e3fc',
		'brand-600': '#1765d6',
		// Status
		success: '#16a34a',
		danger: '#dc2626',
	},
	fontFamily: {
		// Matches app `--font-sans`.
		sans: ['Google Sans', 'Roboto', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Arial'],
		// Matches app `--font-mono`; used for the odometer/dashboard readouts.
		mono: ['Roboto Mono', 'SFMono-Regular', 'Menlo', 'Consolas'],
	},
} as const;

const config: TailwindConfig = {
	presets: [pixelBasedPreset],
	theme: {
		extend: {
			colors: emailTokens.colors,
			fontFamily: emailTokens.fontFamily,
			borderRadius: {
				sm: '6px',
				md: '8px',
				lg: '12px',
			},
			spacing: {
				'1.5': '6px',
				'2.5': '10px',
				'4.5': '18px',
			},
		},
	},
};

export default config;
