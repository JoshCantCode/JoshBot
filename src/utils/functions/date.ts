import dayjs from 'dayjs';
import dayjsTimeZone from 'dayjs/plugin/timezone';
import dayjsUTC from 'dayjs/plugin/utc';

import { generalConfig } from '@/configs';

dayjs.extend(dayjsUTC);
dayjs.extend(dayjsTimeZone);

dayjs.tz.setDefault(generalConfig.timezone);

export const datejs = dayjs.tz;

const dateMasks = {
	default: 'DD/MM/YYYY - HH:mm:ss',
	onlyDate: 'DD/MM/YYYY',
	onlyDateFileName: 'YYYY-MM-DD',
};

/**
 * Format a date object to a templated string using the [date-and-time](https://www.npmjs.com/package/date-and-time) library.
 * @param date
 * @param mask - template for the date format
 * @returns formatted date
 */
export function formatDate(date: Date, mask: keyof typeof dateMasks = 'default') {
	return datejs(date).format(dateMasks[mask]);
}

export function timeAgo(date: Date) {
	return dayjs(date).fromNow();
}

/**
 * Parse a duration string into a timestamp.
 * @param input - duration string
 * @returns timestamp in seconds
 */
export function parseDuration(input: string): bigint {
	const timeUnits: Record<string, bigint> = {
		w: BigInt(7 * 24 * 60 * 60), // 1 week in seconds
		d: BigInt(24 * 60 * 60), // 1 day in seconds
		h: BigInt(60 * 60), // 1 hour in seconds
		m: BigInt(60), // 1 minute in seconds
		s: BigInt(1), // 1 second
	};

	let totalSeconds = BigInt(0);

	const matches = input.match(/(\d+)([wdhms])/g);
	if (!matches) throw new Error('Invalid input format');

	for (const match of matches) {
		const [, value, unit] = match.match(/(\d+)([wdhms])/)!;
		totalSeconds += BigInt(value) * timeUnits[unit];
	}

	return totalSeconds;
}
