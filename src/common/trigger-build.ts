import * as semantic from 'semantic-release';
import {TOKEN_ENV_NAME} from './constants';
import axios from 'axios';

export async function triggerBuild({ appSlug, tag, branch, workflowId, commitMessage }: { appSlug: string, tag: string, branch: string, workflowId?: string, commitMessage?: string }, {logger}: semantic.Context): Promise<void> {
	const token: string | undefined = process.env[TOKEN_ENV_NAME]

	logger.log(`Triggering build for tag ${tag} ${workflowId ? `with workflow ${workflowId}` : ''}...`);

	await axios.post(
		`https://app.bitrise.io/app/${appSlug}/build/start.json`,
		{
			hook_info: {
				type: 'bitrise',
			},
			build_params: {
				commit_message: commitMessage,
				workflow_id: workflowId,
				tag,
				branch,
			},
			triggered_by: 'semantic-release'
		},
		{
			headers: {
				'Authorization': token
			}
		}
	)
}
