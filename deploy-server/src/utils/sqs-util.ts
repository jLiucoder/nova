import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { getAWSCredentials, getAWSQueueURL, getAWSRegion } from './aws-client';

export const client = new SQSClient({
	region: getAWSRegion(),
	credentials: {
		accessKeyId: getAWSCredentials().accessKeyId,
		secretAccessKey: getAWSCredentials().secretAccessKey,
	},
});

export async function sendSQS(
	key: string,
	message: object,
	messageGroupId: string
): Promise<void> {

	const input = {
		// SendMessageRequest
		QueueUrl: getAWSQueueURL(), // required
		MessageBody: JSON.stringify({ key, message }), // required
		DelaySeconds: 0,
        MessageGroupId: messageGroupId,
	};

	try {
		const response = await client.send(new SendMessageCommand(input));
		console.log('SQS response:', response);
	} catch (error) {
		console.error('Error sending message to SQS:', error);
	}
}
