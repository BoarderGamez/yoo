import { db } from '$lib/server/db/index.js';
import { marketItem } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load({ locals }) {
	if (!locals.user?.hasAdmin) {
		throw error(403, { message: 'oi get out' });
	}

	const marketItems = await db
		.select()
		.from(marketItem)
		.where(eq(marketItem.deleted, false));

	return {
		marketItems
	};
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user?.hasAdmin) {
			throw error(403, { message: 'oi get out' });
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const description = formData.get('description')?.toString();
		const image = formData.get('image')?.toString();
		const minRequiredShopScore = parseInt(formData.get('minRequiredShopScore')?.toString() || '0');
		const minShopScore = parseInt(formData.get('minShopScore')?.toString() || '0');
		const maxShopScore = parseInt(formData.get('maxShopScore')?.toString() || '0');
		const minPrice = parseInt(formData.get('minPrice')?.toString() || '0');
		const maxPrice = parseInt(formData.get('maxPrice')?.toString() || '0');
		const isPublic = formData.get('isPublic') === 'on';

		if (!name || !description || !image) {
			throw error(400, { message: 'Missing required fields' });
		}

		if (maxPrice < minPrice) {
			throw error(400, { message: 'Max price must be greater than or equal to min price' });
		}

		if (maxShopScore < minShopScore) {
			throw error(400, { message: 'Max shop score must be greater than or equal to min shop score' });
		}

		await db.insert(marketItem).values({
			createdBy: locals.user.id,
			name,
			description,
			image,
			minRequiredShopScore,
			minShopScore,
			maxShopScore,
			minPrice,
			maxPrice,
			isPublic
		});

		return { success: true };
	},
	update: async ({ request, locals }) => {
		if (!locals.user?.hasAdmin) {
			throw error(403, { message: 'oi get out' });
		}

		const formData = await request.formData();
		const id = parseInt(formData.get('id')?.toString() || '0');
		const name = formData.get('name')?.toString();
		const description = formData.get('description')?.toString();
		const image = formData.get('image')?.toString();
		const minRequiredShopScore = parseInt(formData.get('minRequiredShopScore')?.toString() || '0');
		const minShopScore = parseInt(formData.get('minShopScore')?.toString() || '0');
		const maxShopScore = parseInt(formData.get('maxShopScore')?.toString() || '0');
		const minPrice = parseInt(formData.get('minPrice')?.toString() || '0');
		const maxPrice = parseInt(formData.get('maxPrice')?.toString() || '0');
		const isPublic = formData.get('isPublic') === 'on';

		if (!id || !name || !description || !image) {
			throw error(400, { message: 'Missing required fields' });
		}

		if (maxPrice < minPrice) {
			throw error(400, { message: 'Max price must be greater than or equal to min price' });
		}

		if (maxShopScore < minShopScore) {
			throw error(400, { message: 'Max shop score must be greater than or equal to min shop score' });
		}

		await db
			.update(marketItem)
			.set({
				name,
				description,
				image,
				minRequiredShopScore,
				minShopScore,
				maxShopScore,
				minPrice,
				maxPrice,
				isPublic,
				updatedAt: new Date()
			})
			.where(eq(marketItem.id, id));

		return { success: true };
	},
	delete: async ({ request, locals }) => {
		if (!locals.user?.hasAdmin) {
			throw error(403, { message: 'oi get out' });
		}

		const formData = await request.formData();
		const id = parseInt(formData.get('id')?.toString() || '0');

		if (!id) {
			throw error(400, { message: 'Missing item id' });
		}

		await db
			.update(marketItem)
			.set({ deleted: true, updatedAt: new Date() })
			.where(eq(marketItem.id, id));

		return { success: true };
	}
};
