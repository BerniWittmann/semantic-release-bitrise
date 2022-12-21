import * as semantic from 'semantic-release';
import { triggerBuild } from './common/trigger-build';
import { Config } from './interfaces/config';

export async function success(config: Config, context: semantic.Context) {
	const {
		nextRelease,
	} = context;

	if (nextRelease) {
		await triggerBuild({
			appSlug: config.appSlug,
			tag: nextRelease?.gitTag,
			commitMessage: `Release v${nextRelease.version}`,
			workflowId: config.workflowId
		}, context)
	}
}
