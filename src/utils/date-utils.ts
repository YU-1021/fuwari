export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

// 文章列表使用：后两位年份 + 月日（不显示时间）
export function formatPostDateForList(date: Date): string {
	const timeZone = "Asia/Shanghai";

	const dateParts = new Intl.DateTimeFormat("zh-CN", {
		timeZone,
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).formatToParts(date);
	const y = dateParts.find((p) => p.type === "year")?.value ?? "";
	const m = dateParts.find((p) => p.type === "month")?.value ?? "";
	const d = dateParts.find((p) => p.type === "day")?.value ?? "";

	// 只取年份后两位
	const shortYear = y.slice(-2);
	return `${shortYear}年${m}月${d}日`;
}

// 文章内部使用：后两位年份 + 月日 + 时分秒
export function formatPostDateForDisplay(date: Date): string {
	const isDateOnly =
		date.getUTCHours() === 0 &&
		date.getUTCMinutes() === 0 &&
		date.getUTCSeconds() === 0 &&
		date.getUTCMilliseconds() === 0;

	const timeZone = "Asia/Shanghai";

	const dateParts = new Intl.DateTimeFormat("zh-CN", {
		timeZone,
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).formatToParts(date);
	const y = dateParts.find((p) => p.type === "year")?.value ?? "";
	const m = dateParts.find((p) => p.type === "month")?.value ?? "";
	const d = dateParts.find((p) => p.type === "day")?.value ?? "";

	// 只取年份后两位
	const shortYear = y.slice(-2);
	const datePart = `${shortYear}年${m}月${d}日`;
	
	if (isDateOnly) return datePart;

	const timeParts = new Intl.DateTimeFormat("zh-CN", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).formatToParts(date);
	const hh = timeParts.find((p) => p.type === "hour")?.value ?? "00";
	const mm = timeParts.find((p) => p.type === "minute")?.value ?? "00";
	const ss = timeParts.find((p) => p.type === "second")?.value ?? "00";

	// 始终显示秒
	const timePart = `${hh}:${mm}:${ss}`;
	return `${datePart} ${timePart}`;
}

export function parsePostDateToDate(value: unknown): Date {
	if (value instanceof Date) return value;
	if (typeof value !== "string") return new Date(String(value));

	const s = value.trim();
	const dateOnly = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(s);
	if (dateOnly) {
		const y = Number(dateOnly[1]);
		const m = Number(dateOnly[2]);
		const d = Number(dateOnly[3]);
		return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
	}

	const localNoZone =
		/^(\d{4})[-/](\d{2})[-/](\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(s);
	if (localNoZone) {
		const y = Number(localNoZone[1]);
		const m = Number(localNoZone[2]);
		const d = Number(localNoZone[3]);
		const hh = Number(localNoZone[4]);
		const mm = Number(localNoZone[5]);
		const ss = Number(localNoZone[6] ?? "0");
		return new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
	}

	return new Date(s);
}

export function formatForumDateTime(value?: string): string {
	if (!value) return "刚刚";

	const date = parsePostDateToDate(value);
	if (Number.isNaN(date.getTime())) {
		return "刚刚";
	}

	return new Intl.DateTimeFormat("zh-CN", {
		timeZone: "Asia/Shanghai",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).format(date);
}
