import {Config} from './interfaces/config';
import * as semantic from 'semantic-release';
import { TOKEN_ENV_NAME } from './common/constants';
import * as SemanticReleaseError from '@semantic-release/error';

export function verifyConditions(config: Config, {logger, env}: semantic.Context) {
	const accessToken: string | undefined = env[TOKEN_ENV_NAME];

	if (!accessToken) {
		logger.log(`${TOKEN_ENV_NAME} has not been defined.`);
		throw new SemanticReleaseError(
			'No Bitrise access token defined.',
			'ENOBITRISEACCESSTOKEN',
			`A Bitrise access Token must be created and set in the \`${TOKEN_ENV_NAME}\` environment variable on your CI environment.\n\n\nPlease make sure you created a token and to sat it in the \`${TOKEN_ENV_NAME}\` environment variable on your CI environment.`,
		);
	}

	if (!config.appSlug) {
		logger.log('config appSlug is undefined');
		throw new SemanticReleaseError(
			'No appSlug for bitrise defined.',
			'ENOAPPSLUG',
			`The appSlug from bitrisemust be defined. Define appSlug in the plugin config.`,
		);
	}
}
