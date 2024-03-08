import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import {
	getAWSCredentials,
	getAWSRegion,
	getAWS_ECS_CLUSTER,
	getAWS_ECS_SUBNETS_SG,
	getAWS_ECS_TASK_DEFINITION,
} from './global-client';

export const client = new ECSClient({
	region: getAWSRegion(),
	credentials: {
		accessKeyId: getAWSCredentials().accessKeyId,
		secretAccessKey: getAWSCredentials().secretAccessKey,
	},
});

export async function runTask(gitURL: string, distFoler: string, projectSlug: string) {
	const params = new RunTaskCommand({
		cluster: getAWS_ECS_CLUSTER(),
		taskDefinition: getAWS_ECS_TASK_DEFINITION(),
		launchType: 'FARGATE',
		count: 1,
		networkConfiguration: {
			awsvpcConfiguration: {
				assignPublicIp: 'ENABLED',
				subnets: getAWS_ECS_SUBNETS_SG().subnets,
				securityGroups: getAWS_ECS_SUBNETS_SG().securityGroups,
			},
		},
		overrides: {
			containerOverrides: [
				{
					name: 'builder-image',
					environment: [
						{ name: 'GIT_REPOSITORY__URL', value: gitURL },
						{ name: 'DIST_FOLDER', value: distFoler },
						{ name: 'PROJECT_ID', value: projectSlug },
					],
				},
			],
		},
	});

	try {
		const data = await client.send(params);
		console.log(data);
	} catch (error: any) {
		throw new Error(error);
	}
}
