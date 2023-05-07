export interface ResponseMessage<T> {
	status: string;
	message: string;
	data: T | null;
}

// ----- type guards -----

export function isResponseMessage<T>(obj: any, isDataType: (data: any) => data is T): obj is ResponseMessage<T> {
	return (
		obj &&
		obj.hasOwnProperty('status') &&
		typeof obj.status === 'string' &&
		obj.hasOwnProperty('message') &&
		typeof obj.message === 'string' &&
		obj.hasOwnProperty('data') &&
		(obj.data === null || isDataType(obj.data))
	);
}

export function isResponseMessageSuccess(responseMessage: ResponseMessage<any>) {
	return responseMessage.status === 'success';
}
