import process from 'node:process';

import { cleanEnv, num, str } from 'envalid';

import { apiConfig, generalConfig, mikroORMConfig } from '@/configs';
import { env } from '@/env';

export function checkEnvironmentVariables() {
	const config = mikroORMConfig[env.NODE_ENV];

	// @ts-expect-error
	const isSqliteDatabase = !!config.dbName && !config.port;
	if (!isSqliteDatabase) {
		cleanEnv(process.env, {
			DATABASE_HOST: str(),
			DATABASE_PORT: num(),
			DATABASE_NAME: str(),
			DATABASE_USER: str(),
			DATABASE_PASSWORD: str(),
		});
	}

	if (apiConfig.enabled === true) {
		cleanEnv(process.env, {
			API_PORT: num(),
			API_ADMIN_TOKEN: str(),
		});
	}

	if (generalConfig.automaticUploadImagesToImgur === true) {
		cleanEnv(process.env, {
			IMGUR_CLIENT_ID: str(),
		});
	}
}