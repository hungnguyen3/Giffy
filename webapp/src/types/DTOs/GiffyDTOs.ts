export interface GiffyDTO {
	giffyId: number;
	collectionId: number;
	giffyS3Url: string;
	giffyS3Key: string;
	giffyName: string;
}

// ----- type guards -----
export function isGiffyDTO(obj: any): obj is GiffyDTO {
	return (
		obj &&
		obj.hasOwnProperty('giffyId') &&
		typeof obj.giffyId === 'number' &&
		obj.hasOwnProperty('collectionId') &&
		typeof obj.collectionId === 'number' &&
		obj.hasOwnProperty('giffyS3Url') &&
		typeof obj.giffyS3Url === 'string' &&
		obj.hasOwnProperty('giffyS3Key') &&
		typeof obj.giffyS3Key === 'string' &&
		obj.hasOwnProperty('giffyName') &&
		typeof obj.giffyName === 'string'
	);
}
