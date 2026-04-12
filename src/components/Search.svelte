<script lang="ts">
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";

interface SearchResultItem {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
}

let keyword = $state("");
let result: SearchResultItem[] = $state([]);
let isSearching = $state(false);
let showLoading = $state(false);
let pagefindLoaded = $state(false);
let initialized = $state(false);
let isComposingDesktop = false;
let isComposingMobile = false;

const fakeResult: SearchResultItem[] = [
	{
		url: url("/"),
		meta: {
			title: "这是一个模拟搜索结果",
		},
		excerpt: "搜索功能在 <mark>开发环境</mark> 中无法正常工作。",
	},
	{
		url: url("/"),
		meta: {
			title: "如果你想测试搜索功能",
		},
		excerpt: "请运行 <mark>pnpm build && pnpm preview</mark> 来测试。",
	},
];

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

const search = async (kw: string): Promise<void> => {
	if (!kw) {
		setPanelVisibility(false);
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;
	showLoading = true;

	try {
		let searchResults: SearchResultItem[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(kw);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			searchResults = fakeResult;
		} else {
			searchResults = [];
			console.error("Pagefind is not available in production environment.");
		}

		result = searchResults;
		setPanelVisibility(result.length > 0);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false);
	} finally {
		isSearching = false;
		showLoading = false;
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		console.log("Pagefind status on init:", pagefindLoaded);
		if (keyword) search(keyword);
	};

	if (import.meta.env.DEV) {
		console.log(
			"Pagefind is not available in development mode. Using mock data.",
		);
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			console.log("Pagefind ready event received.");
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			console.warn(
				"Pagefind load error event received. Search functionality will be limited.",
			);
			initializeSearch();
		});

		setTimeout(() => {
			if (!initialized) {
				console.log("Fallback: Initializing search after timeout.");
				initializeSearch();
			}
		}, 2000);
	}
});

$effect(() => {
	if (keyword && initialized) {
		openPanel();
		showLoading = true;
		const timer = setTimeout(() => {
			search(keyword);
		}, 300);
		return () => clearTimeout(timer);
	} else if (!keyword) {
		showLoading = false;
		isSearching = false;
		result = [];
		setPanelVisibility(false);
	}
});
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="hidden min-[1066px]:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-white/5 hover:bg-white/10 focus-within:bg-white/10
">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-white/30"></Icon>
    <input placeholder="搜索" bind:value={keyword}
           on:compositionstart={() => { isComposingDesktop = true; }}
           on:compositionend={() => { isComposingDesktop = false; }}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-white/50"
    >
</div>

<!-- search bar for phone/tablet view -->
<div id="search-bar-mobile" class="relative flex h-11 flex-1 items-center rounded-lg bg-white/5 transition hover:bg-white/10 focus-within:bg-white/10 min-[1066px]:hidden">
    <Icon icon="material-symbols:search" class="pointer-events-none absolute ml-3 text-[1.25rem] text-white/30 transition"></Icon>
    <input placeholder="搜索" bind:value={keyword} on:focus={() => { openPanel(); }}
           on:compositionstart={() => { isComposingMobile = true; }}
           on:compositionend={() => { isComposingMobile = false; }}
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
        <input placeholder="搜索" bind:value={keyword}
               on:compositionstart={() => { isComposingMobile = true; }}
               on:compositionend={() => { isComposingMobile = false; }}
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
            <a href={item.url} on:click={closePanel}
               class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
           rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
                <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                    {item.meta.title}
                    <Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
                </div>
                <div class="transition text-sm text-50">
                    {@html item.excerpt}
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
  input:focus {
    outline: 0;
  }
  .search-panel {
    background-color: var(--float-panel-bg-opaque);
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .search-panel::-webkit-scrollbar {
    display: none;
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
