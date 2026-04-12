<script lang="ts">
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";

interface SearchIndexItem {
	title: string;
	description: string;
	content: string;
	link: string;
}

interface SearchResult {
	title: string;
	description: string;
	link: string;
	score: number;
	hitCount: number;
	snippet: string;
}

const SEARCH_DEBOUNCE_MS = 300;

let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let showLoading = false;
let searchTimer: ReturnType<typeof setTimeout> | undefined;
let isComposingDesktop = false;
let isComposingMobile = false;
let searchIndex: SearchIndexItem[] | null = null;
let indexLoadPromise: Promise<void> | null = null;

const closePanel = () => {
	if (typeof document === "undefined") return;
	const panel = document.getElementById("search-panel");
	panel?.classList.add("float-panel-closed");
};

const openPanel = () => {
	if (typeof document === "undefined") return;
	const panel = document.getElementById("search-panel");
	panel?.classList.remove("float-panel-closed");
};

const reopenPanelIfHasQuery = (): void => {
	if (keyword || result.length > 0) {
		openPanel();
	}
};

const setPanelVisibility = (show: boolean): void => {
	if (typeof document === "undefined") return;
	const panel = document.getElementById("search-panel");
	if (!panel) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const removeSpaces = (value: string) => value.replace(/\s+/g, "");

const sanitizeKeyword = () => {
	keyword = removeSpaces(keyword);
};

const loadSearchIndex = async (): Promise<void> => {
	if (searchIndex) return;
	if (indexLoadPromise) {
		await indexLoadPromise;
		return;
	}

	indexLoadPromise = (async () => {
		try {
			const response = await fetch("/search.json");
			if (!response.ok) {
				throw new Error("Failed to load search index");
			}
			searchIndex = (await response.json()) as SearchIndexItem[];
		} catch (error) {
			console.error("Failed to load search index:", error);
			searchIndex = [];
		}
	})();

	await indexLoadPromise;
};

const escapeRegExp = (str: string): string => {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const highlightText = (text: string, keywords: string[]): string => {
	if (!text || keywords.length === 0) return text;

	let result = text;
	for (const kw of keywords) {
		const regex = new RegExp(`(${escapeRegExp(kw)})`, "gi");
		result = result.replace(regex, '<mark class="hl">$1</mark>');
	}
	return result;
};

const getSnippet = (content: string, keywords: string[], maxLength = 150): string => {
	if (!content) return "";

	const lowerContent = content.toLowerCase();
	let bestPos = 0;

	for (const kw of keywords) {
		const pos = lowerContent.indexOf(kw.toLowerCase());
		if (pos !== -1) {
			bestPos = pos;
			break;
		}
	}

	const start = Math.max(0, bestPos - 50);
	const end = Math.min(content.length, bestPos + maxLength - 50);
	let snippet = content.slice(start, end);

	if (start > 0) snippet = "..." + snippet;
	if (end < content.length) snippet = snippet + "...";

	return highlightText(snippet, keywords);
};

const countMatches = (text: string, keywords: string[]): number => {
	let count = 0;
	const lowerText = text.toLowerCase();
	for (const kw of keywords) {
		const regex = new RegExp(escapeRegExp(kw), "gi");
		const matches = lowerText.match(regex);
		count += matches ? matches.length : 0;
	}
	return count;
};

const searchInField = (field: string, keywords: string[]): { score: number; hitCount: number } => {
	const lowerField = field.toLowerCase();
	let score = 0;
	let hitCount = 0;

	for (const kw of keywords) {
		const lowerKw = kw.toLowerCase();
		if (lowerField.includes(lowerKw)) {
			hitCount += countMatches(field, [kw]);
			if (lowerField === lowerKw) {
				score += 100;
			} else if (lowerField.startsWith(lowerKw)) {
				score += 50;
			} else {
				score += 10;
			}
		}
	}

	return { score, hitCount };
};

const performSearch = (kw: string, types: string[]): SearchResult[] => {
	if (!searchIndex || !kw) return [];

	const keywords = kw.split(/\s+/).filter((k) => k.length > 0);
	if (keywords.length === 0) return [];

	const searchFields = types.length > 0 ? types : ["title", "description", "content", "link"];

	const results: SearchResult[] = [];

	for (const item of searchIndex) {
		let totalScore = 0;
		let totalHitCount = 0;

		if (searchFields.includes("title")) {
			const { score, hitCount } = searchInField(item.title, keywords);
			totalScore += score * 3;
			totalHitCount += hitCount;
		}

		if (searchFields.includes("description")) {
			const { score, hitCount } = searchInField(item.description, keywords);
			totalScore += score * 2;
			totalHitCount += hitCount;
		}

		if (searchFields.includes("content")) {
			const { score, hitCount } = searchInField(item.content, keywords);
			totalScore += score;
			totalHitCount += hitCount;
		}

		if (searchFields.includes("link")) {
			const { score, hitCount } = searchInField(item.link, keywords);
			totalScore += score * 2;
			totalHitCount += hitCount;
		}

		if (totalScore > 0) {
			const snippet = getSnippet(
				searchFields.includes("content") ? item.content : item.description,
				keywords,
			);

			results.push({
				title: highlightText(item.title, keywords),
				description: item.description,
				link: item.link,
				score: totalScore,
				hitCount: totalHitCount,
				snippet,
			});
		}
	}

	return results.sort((a, b) => b.score - a.score).slice(0, 20);
};

const scheduleSearch = (keyword: string): void => {
	openPanel();
	result = [];
	showLoading = true;
	searchTimer = setTimeout(() => {
		void search(keyword, selectedTypes);
	}, SEARCH_DEBOUNCE_MS);
};

const search = async (kw: string, types: string[] = selectedTypes): Promise<void> => {
	if (!kw) {
		setPanelVisibility(false);
		result = [];
		return;
	}

	isSearching = true;
	showLoading = true;

	try {
		await loadSearchIndex();
		result = performSearch(kw, types);
		setPanelVisibility(true);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(true);
	} finally {
		isSearching = false;
		showLoading = false;
	}
};

$: {
	if (searchTimer) {
		clearTimeout(searchTimer);
	}

	if (isComposingDesktop || isComposingMobile) {
		openPanel();
		showLoading = true;
	} else if (keyword) {
		scheduleSearch(keyword);
	} else {
		showLoading = false;
		isSearching = false;
		result = [];
		setPanelVisibility(false);
	}
}
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="hidden min-[1066px]:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-white/5 hover:bg-white/10 focus-within:bg-white/10
">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-white/30"></Icon>
    <input placeholder="搜索" bind:value={keyword} on:focus={() => { void reopenPanelIfHasQuery(); }}
           on:input={sanitizeKeyword}
           on:compositionstart={() => { isComposingDesktop = true; }}
           on:compositionend={() => { isComposingDesktop = false; sanitizeKeyword(); }}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-white/50"
    >
</div>

<!-- search bar for phone/tablet view -->
<div id="search-bar-mobile" class="relative flex h-11 flex-1 items-center rounded-lg bg-white/5 transition hover:bg-white/10 focus-within:bg-white/10 min-[1066px]:hidden">
    <Icon icon="material-symbols:search" class="pointer-events-none absolute ml-3 text-[1.25rem] text-white/30 transition"></Icon>
    <input placeholder="搜索" bind:value={keyword} on:focus={() => { void openPanel(); }}
           on:input={sanitizeKeyword}
           on:compositionstart={() => { isComposingMobile = true; }}
           on:compositionend={() => { isComposingMobile = false; sanitizeKeyword(); }}
           class="h-full w-full rounded-lg bg-transparent pl-10 pr-3 text-sm text-white/50 outline-0"
    >
</div>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute z-50 md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-none rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="hidden relative min-[1066px]:hidden transition-all items-center h-11 rounded-xl
      bg-white/5 hover:bg-white/10 focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-white/30"></Icon>
        <input placeholder="搜索" bind:value={keyword} on:focus={() => { void reopenPanelIfHasQuery(); }}
               on:input={sanitizeKeyword}
               on:compositionstart={() => { isComposingMobile = true; }}
               on:compositionend={() => { isComposingMobile = false; sanitizeKeyword(); }}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-white/50"
        >
    </div>

    {#if keyword}
        <!-- search loading -->
        {#if showLoading}
            <div class="flex items-center justify-center py-6">
                <span class="text-sm text-white/50">搜索中</span>
                <span class="loading-dots">
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                </span>
            </div>
        {/if}

        <!-- search results header -->
        {#if result.length > 0}
            <div class="text-xs text-white/40 px-3 py-2 border-b border-white/5">
                {result.length} 条搜索结果
            </div>
        {/if}

        <!-- search results -->
        {#each result as item}
            <a href={url(`/posts/${item.link}/`)} on:click={closePanel}
               class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
           rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
                <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                    {@html item.title}
                    <Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
                </div>
                <div class="transition text-xs text-white/50 mb-1 font-mono">
                    /posts/{item.link}
                    <span class="ml-2 text-[var(--primary)]">命中 {item.hitCount} 次</span>
                </div>
                <div class="transition text-sm text-50">
                    {@html item.snippet}
                </div>
            </a>
        {/each}

        {#if !showLoading && !isSearching && result.length === 0}
            <div class="text-sm text-white/50 px-3 py-4">
                无搜索结果
            </div>
        {/if}
    {/if}
</div>

<style>
  :global(.hl) {
    color: var(--primary);
  }
  :global(.hl.no-wrap) {
    white-space: nowrap;
    display: inline-block;
  }
  input:focus {
    outline: 0;
  }
  .search-panel {
    background-color: var(--float-panel-bg-opaque);
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .search-panel::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  .search-panel :global(mark) {
    color: var(--primary);
    background: none;
  }

  .loading-dots {
    display: inline-block;
    margin-left: 0;
  }

  .loading-dots .dot {
    color: var(--primary);
    font-size: 1.2em;
    line-height: 1;
    animation: dot-blink 1.4s infinite;
    opacity: 0;
  }

  .loading-dots .dot:nth-child(1) {
    animation-delay: 0s;
  }

  .loading-dots .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dots .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes dot-blink {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    40% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
</style>
