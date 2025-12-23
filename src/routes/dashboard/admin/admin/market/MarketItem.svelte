<script lang="ts">
	let { item } = $props();
</script>

<div class="themed-box p-3">
	<div class="mb-3 aspect-square overflow-hidden rounded-lg bg-primary-800/10">
		<img src={item.image} alt={item.name} class="h-full w-full object-contain object-center" />
	</div>
	<h3 class="text-lg font-bold">{item.name}</h3>
	<p class="mb-1 text-sm">{item.description}</p>
	<p class="text-sm text-primary-200">Price: {item.maxPrice}-{item.minPrice}</p>
	<p class="mb-2 text-sm text-primary-200">
		Market score: {item.minRequiredShopScore}, {item.minShopScore}-{item.maxShopScore}
	</p>

	<div class="flex gap-3">
		<a href={`market/${item.id}/edit`} class="button primary md flex-1">Edit</a>
		<a href={`market/${item.id}/delete`} class="button red md flex-1">Delete</a>
	</div>
</div>
