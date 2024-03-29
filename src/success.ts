import * as semantic from 'semantic-release';
import { triggerBuild } from './common/trigger-build';
import { Config } from './interfaces/config';
import * as SemanticReleaseError from '@semantic-release/error';

const getWorkflowId = (config: Config, context: semantic.Context): string | undefined => {
	if (config.workflowId) {
		return config.workflowId;
	}
	if (config.workflowIdMap) {
		// check if there is a direct/literal match
		// @ts-expect-error
		const branch = context.branch;
		if (Object.keys(config.workflowIdMap).includes(branch.name)) {
			return config.workflowIdMap[branch.name];
		} 

		// now we check if the workflowIdMap includes regexes and try to match those
		const regexMatchingBranchName = Object.keys(config.workflowIdMap).find((workflowIdMatcher) => {
			let branchRegExp: RegExp;
			try {
				branchRegExp = new RegExp(workflowIdMatcher);
			} catch (error) {
				throw new SemanticReleaseError(
					'Unable to find workflow id based on workflowIdMap ',
					'ENOBRANCHMATCH',
					`The provided branch is not a valid regex pattern '${workflowIdMatcher}'`,
				);
			}
			return branchRegExp.test(branch.name);
    	})
		if (regexMatchingBranchName != null) {
			return config.workflowIdMap[regexMatchingBranchName];
		}
     
		throw new SemanticReleaseError(
			'Unable to find workflow id based on workflowIdMap ',
			'ENOBRANCHMATCH',
			`The workflowIdMap option does not include a configuration for branch '${branch.name}'`,
		);
	}
	return undefined;
}

export async function success(config: Config, context: semantic.Context) {
	const nextRelease = context.nextRelease;
	// @ts-expect-error
	const branch = context.branch;

	if (nextRelease) {
		await triggerBuild({
			appSlug: config.appSlug,
			tag: nextRelease?.gitTag,
			commitMessage: `Release v${nextRelease.version}`,
			branch: branch.name,
			workflowId: getWorkflowId(config, context)
		}, context)
	}
}
