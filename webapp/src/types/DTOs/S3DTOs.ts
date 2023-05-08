export interface S3UploadDTO {
	s3Url: string;
	s3Key: string;
}

export function isS3UploadDTO(obj: any): obj is S3UploadDTO {
	return (
		obj &&
		obj.hasOwnProperty('s3Url') &&
		typeof obj.s3Url === 'string' &&
		obj.hasOwnProperty('s3Key') &&
		typeof obj.s3Key === 'string'
	);
}
