<script>
    import Main from "./Main.svelte";
    import PageError from "./PageError.svelte";
    import Edit from "./Edit.svelte";
    import Auth from "./Auth.svelte";
    import CardSets from "./CardSets.svelte";
    import Study from "./Study.svelte";
	const path = window.location.pathname;
</script>

{#if path == "/" }
<Main />
{:else if path == "/edit"}
<Edit />
{:else if path == "/auth"}
<Auth />
{:else if path == "/cardsets"}
<CardSets />
{:else if path == "/study"}
<Study />
{:else}
<PageError />
{/if}

