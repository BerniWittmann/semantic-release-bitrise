import * as semantic from 'semantic-release';
import { triggerBuild } from './common/trigger-build';
import { Config } from './interfaces/config';
import * as SemanticReleaseError from '@semantic-release/error';

const getWorkflowIds = (config: Config, context: semantic.Context): string | string[] | undefined => {
	if (config.workflowId) {
		return [config.workflowId];
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
	const nextRelease = context.nextRelease;
	// @ts-expect-error
	const branch = context.branch;

	if (nextRelease) {
		const workflowIds = getWorkflowIds(config, context);
		if (!Array.isArray(workflowIds)) {
			await triggerBuild({
				appSlug: config.appSlug,
				tag: nextRelease?.gitTag,
				commitMessage: `Release v${nextRelease.version}`,
				branch: branch.name,
				workflowId: workflowIds
			}, context)
		} else {
			await (workflowIds?? [undefined]).forEach(async (workflowId) => {
				await triggerBuild({
					appSlug: config.appSlug,
					tag: nextRelease?.gitTag,
					commitMessage: `Release v${nextRelease.version}`,
					branch: branch.name,
					workflowId
				}, context)
			});
		}
		
	}
}
