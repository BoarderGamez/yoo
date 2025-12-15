import { AirtableTs } from 'airtable-ts';
import { env } from '$env/dynamic/private';

export const airtableDB = env.AIRTABLE_TOKEN ? new AirtableTs({ apiKey: env.AIRTABLE_TOKEN }) : null;
