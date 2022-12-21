import * as semantic from 'semantic-release';
import { triggerBuild } from './common/trigger-build';
import { Config } from './interfaces/config';
import * as SemanticReleaseError from '@semantic-release/error';

const getWorkflowId = (config: Config, context: semantic.Context): string | undefined => {
	if (config.workflowId) {
		return config.workflowId;
	}
	if (config.workflowIdMap) {
		// @ts-expect-error
		const branch = context.branch;
		if (Object.keys(config.workflowIdMap).includes(branch.name)) {
			return config.workflowIdMap[branch.name];
		} else {
			throw new SemanticReleaseError(
				'Unable to find workflow id based on workflowIdMap ',
				'ENOBRANCHMATCH',
				`The workflowIdMap option does not include a configuration for branch '${branch.name}'`,
			);
		}
	}
	return undefined;
}

export async function success(config: Config, context: semantic.Context) {
	const {
		nextRelease,
	} = context;

	if (nextRelease) {
		await triggerBuild({
			appSlug: config.appSlug,
			tag: nextRelease?.gitTag,
			commitMessage: `Release v${nextRelease.version}`,
			workflowId: getWorkflowId(config, context)
		}, context)
	}
}
