import dotenv from 'dotenv';
dotenv.config();

export function getAWSRegion() {
	if( process.env.AWS_REGION == undefined || process.env.AWS_REGION == '' ){
		throw new Error('AWS_REGION is not defined');
	}
	return process.env.AWS_REGION;

}

export function getAWSCredentials() {
	if( process.env.ACCESS_KEY == undefined || process.env.ACCESS_KEY == '' ){
		throw new Error('ACCESS_KEY is not defined');
	}
	if( process.env.ACCESS_SECRET_KEY == undefined || process.env.ACCESS_SECRET_KEY == '' ){
		throw new Error('ACCESS_SECRET_KEY is not defined');
	}
	return {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.ACCESS_SECRET_KEY
	};
}

export function getAWSBucketName(){
	if( process.env.AWS_BUCKET_NAME == undefined || process.env.AWS_BUCKET_NAME == '' ){
		throw new Error('AWS_BUCKET_NAME is not defined');
	}
	return process.env.AWS_BUCKET_NAME;
}

export function getAWSQueueURL(){
	if( process.env.AWS_SQS_URL == undefined || process.env.AWS_SQS_URL == '' ){
		throw new Error('AWS_SQS_URL is not defined');
	}
	return process.env.AWS_SQS_URL;
}

export function getAWS_ECS_CLUSTER(){
	if( process.env.AWS_ECS_CLUSTER == undefined || process.env.AWS_ECS_CLUSTER == '' ){
		throw new Error('AWS_ECS_CLUSTER is not defined');
	}
	return process.env.AWS_ECS_CLUSTER;
}

export function getAWS_ECS_TASK_DEFINITION(){
	if( process.env.AWS_ECS_TASK_DEFINITION == undefined || process.env.AWS_ECS_TASK_DEFINITION == '' ){
		throw new Error('AWS_ECS_TASK_DEFINITION is not defined');
	}
	return process.env.AWS_ECS_TASK_DEFINITION;
}

export function getAWS_ECS_SUBNETS_SG() {
	if( process.env.AWS_ECS_SUBNETS == undefined || process.env.AWS_ECS_SUBNETS == '' ){
		throw new Error('AWS_ECS_SUBNETS is not defined');
	}

	if( process.env.AWS_ECS_SECURITY_GROUP == undefined || process.env.AWS_ECS_SECURITY_GROUP == '' ){
		throw new Error('AWS_ECS_SECURITY_GROUP is not defined');
	}
	return {subnets:process.env.AWS_ECS_SUBNETS.split(','), securityGroups:process.env.AWS_ECS_SECURITY_GROUP.split(',')};
}

