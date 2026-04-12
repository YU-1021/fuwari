import type {
	ExpressiveCodeConfig,
	ImageFallbackConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

const customDomain = "yuuu.top";

export const siteConfig: SiteConfig = {
	customDomain,
	title: "Yuの博客",
	subtitle: "Yu",
	description:
		"Yuの博客是一个个人博客，在这里你可以找到技术分享与实践经验。",

	keywords: [
		"yufun",
		"博客",
		"YuのBlog",
		"Yu",
		"Blog",
		"Yu blog",
		"YU-1021",
		"blog",
	],
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 255, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "/xinghui.avif", // Relative to the /src directory. Relative to the /public directory if it starts with '/'

		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "Pixiv @chokei", // Credit text to be displayed

			url: "https://www.pixiv.net/artworks/122782209", // (Optional) URL link to the original artwork or artist's page
		},
	},
	background: {
		enable: true, // Enable background image
		src: "", // Background image URL (supports HTTPS)
		position: "center", // Background position: 'top', 'center', 'bottom'
		size: "cover", // Background size: 'cover', 'contain', 'auto'
		repeat: "no-repeat", // Background repeat: 'no-repeat', 'repeat', 'repeat-x', 'repeat-y'
		attachment: "fixed", // Background attachment: 'fixed', 'scroll', 'local'
		opacity: 1, // Background opacity (0-1)
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "/avatar.png", // Path of the favicon, relative to the /public directory
			//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
	officialSites: [
		{ url: "https://acofork.com", alias: "CN" },
		{ url: `https://${customDomain}`, alias: "Global" },
	],
	server: [
		{ url: "", text: "Blog" },
		{ url: `https://p.${customDomain}`, text: "RandomPic" },
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "赞助",
			url: "/sponsors/",
			external: false,
			icon: "material-symbols:volunteer-activism-outline-rounded",
		},

	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Yu",
	bio: "本站是一个个人博客，在这里你可以找到技术分享与实践经验。",
	links: [
		{
			name: "邮箱",
			icon: "fa6-solid:envelope", // Local icon
			url: "mailto:yufun21@qq.com",
		},
		{
			name: "Telegram",
			icon: "telegram", // Local icon
			url: "https://t.me/+jcYrHcADo985MDI1",
		},
		{
			name: "Bilibili",
			icon: "bilibili", // Local icon
			url: "https://space.bilibili.com/1075986758",
		},
		{
			name: "GitHub",
			icon: "github", // Local icon
			url: "https://github.com/YU-1021",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const imageFallbackConfig: ImageFallbackConfig = {
	enable: false,
	originalDomain: "https://eopfapi.acofork.com/pic?img=ua",
	fallbackDomain: "https://eopfapi.acofork.com/pic?img=ua",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

// todoConfig removed from here
