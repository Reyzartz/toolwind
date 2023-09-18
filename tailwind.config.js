/** @type {import('tailwindcss').Config} */

/**
 * primary: #7BC74D
 * secondary: #393E46
 * background: #222831
 * text: #8795AB
 */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#7BC74D',
				'primary-light': '#98D373',
				'primary-dark': '#63AB36',
				background: '#222831'
			},
			backgroundColor: {
				default: '#222831',
				light: '#323B48',
				dark: '#191D24'
			},
			textColor: {
				default: '#8795AB',
				alternative: '#222831',
				neutral: '#EEEEEE'
			},
			borderColor: {
				default: '#323B48',
				light: '#8795AB'
			}
		},

		/**
		 * Default tailwind values converted from rem to px:
		 * */
		borderRadius: {
			none: '0px',
			sm: '2px',
			DEFAULT: '4px',
			md: '6px',
			lg: '8px',
			xl: '12px',
			'2xl': '16px',
			'3xl': '24px',
			full: '9999px'
		},
		columns: {
			auto: 'auto',
			1: '1',
			2: '2',
			3: '3',
			4: '4',
			5: '5',
			6: '6',
			7: '7',
			8: '8',
			9: '9',
			10: '10',
			11: '11',
			12: '12',
			'3xs': '256px',
			'2xs': '288px',
			xs: '320px',
			sm: '384px',
			md: '448px',
			lg: '512px',
			xl: '576px',
			'2xl': '672px',
			'3xl': '768px',
			'4xl': '896px',
			'5xl': '1024px',
			'6xl': '1152px',
			'7xl': '1280px'
		},
		fontSize: {
			xs: ['12px', { lineHeight: '16px' }],
			sm: ['14px', { lineHeight: '20px' }],
			base: ['16px', { lineHeight: '24px' }],
			lg: ['18px', { lineHeight: '28px' }],
			xl: ['20px', { lineHeight: '28px' }],
			'2xl': ['24px', { lineHeight: '32px' }],
			'3xl': ['30px', { lineHeight: '36px' }],
			'4xl': ['36px', { lineHeight: '36px' }],
			'5xl': ['48px', { lineHeight: '1' }],
			'6xl': ['60px', { lineHeight: '1' }],
			'7xl': ['72px', { lineHeight: '1' }],
			'8xl': ['96px', { lineHeight: '1' }],
			'9xl': ['144px', { lineHeight: '1' }]
		},
		lineHeight: {
			none: '1',
			tight: '1.25',
			snug: '1.375',
			normal: '1.5',
			relaxed: '1.625',
			loose: '2',
			3: '12px',
			4: '16px',
			5: '20px',
			6: '24px',
			7: '28px',
			8: '32px',
			9: '36px',
			10: '40px'
		},
		maxWidth: ({ theme, breakpoints }) => ({
			none: 'none',
			0: '0px',
			xs: '320px',
			sm: '384px',
			md: '448px',
			lg: '512px',
			xl: '576px',
			'2xl': '672px',
			'3xl': '768px',
			'4xl': '896px',
			'5xl': '1024px',
			'6xl': '1152px',
			'7xl': '1280px',
			full: '100%',
			min: 'min-content',
			max: 'max-content',
			fit: 'fit-content',
			prose: '65ch',
			...breakpoints(theme('screens'))
		}),
		spacing: {
			px: '1px',
			0: '0',
			0.5: '2px',
			1: '4px',
			1.5: '6px',
			2: '8px',
			2.5: '10px',
			3: '12px',
			3.5: '14px',
			4: '16px',
			5: '20px',
			6: '24px',
			7: '28px',
			8: '32px',
			9: '36px',
			10: '40px',
			11: '44px',
			12: '48px',
			14: '56px',
			16: '64px',
			20: '80px',
			24: '96px',
			28: '112px',
			32: '128px',
			36: '144px',
			40: '160px',
			44: '176px',
			48: '192px',
			52: '208px',
			56: '224px',
			60: '240px',
			64: '256px',
			72: '288px',
			80: '320px',
			96: '384px'
		}
	},
	plugins: []
}
