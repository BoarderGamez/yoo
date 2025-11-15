import { db } from '$lib/server/db/index.js';
import { project, user, devlog } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { eq, and, or, sql } from 'drizzle-orm';
import type { Actions } from './$types';
import { ne } from 'drizzle-orm';

const PROJECT_FORMAT = {
	project: {
		id: project.id,
		name: project.name,
		description: project.description,
		url: project.url
	},
	timeSpent: sql<number>`COALESCE(SUM(${devlog.timeSpent}), 0)`
};

export async function load({ locals }) {
	if (!locals.user) {
		throw error(500);
	}
	if (!locals.user.hasT1Review) {
		// TODO: make the 403 page a script that runs a memory filler to use up ram and crash your browser :D
		throw error(403, { message: 'get out, peasant' });
	}

	// TODO: make the database not stupid so it doesn't have to left join every single devlog
	const projects = await db
		.select(PROJECT_FORMAT)
		.from(project)
		.leftJoin(devlog, and(eq(project.id, devlog.projectId), eq(devlog.deleted, false)))
		.where(and(eq(project.deleted, false), eq(project.status, 'submitted')))
		.groupBy(project.id);

	const users = await db
		.select({
			id: user.id,
			name: user.name
		})
		.from(user)
		.where(ne(user.status, 'banned'));

	return {
		projects,
		users
	};
}

export const actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) {
			throw error(500);
		}
		if (!locals.user.hasT1Review) {
			throw error(403, { message: 'get out, peasant' });
		}

		const data = await request.formData();
		const statusFilter = data.get('status');
		const projectFilter = data.get('project');
		const userFilter = data.get('user');
		
		console.log(statusFilter, projectFilter, userFilter);

		const projects = await db
		.select(PROJECT_FORMAT)
		.from(project)
		.leftJoin(devlog, and(eq(project.id, devlog.projectId), eq(devlog.deleted, false)))
		.where(and(eq(project.deleted, false), eq(project.status, 'submitted')))
		.groupBy(project.id);

		return {
			projects
		};
	}
} satisfies Actions;
