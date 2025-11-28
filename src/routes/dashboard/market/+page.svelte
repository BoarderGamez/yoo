<script lang="ts">
	import Head from '$lib/components/Head.svelte';

	let { data } = $props();
</script>

<Head title="Market" />

<h1 class="mt-5 mb-3 font-hero text-3xl font-medium">Market</h1>

<p>Market score: {data.user.shopScore}</p>