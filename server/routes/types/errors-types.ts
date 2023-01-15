export interface ErrorDTO {
	error: string;
}

// ----- type guards -----

export function isErrorDTO(obj: any): obj is ErrorDTO {
	return obj && obj.hasOwnProperty('error') && typeof obj.error === 'string';
}
