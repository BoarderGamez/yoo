import { logger } from '@sentry/core';

export async function GET(event) {
	logger.error('big important error eek');
	throw new Error('wow massive error definitely not a test');
	return {};
}
