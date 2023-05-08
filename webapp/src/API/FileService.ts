import { Auth } from 'aws-amplify';
import { S3UploadDTO } from '../types/DTOs/S3DTOs';
import { ResponseMessage } from '../types/ResponseMessage';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';

class FileService {
	private static instance: FileService;

	constructor() {}

	static getInstance(): FileService {
		if (!FileService.instance) {
			FileService.instance = new FileService();
		}
		return FileService.instance;
	}

	async uploadFile(file: File): Promise<ResponseMessage<S3UploadDTO>> {
		const session = await Auth.currentSession();
		const accessToken = session.getIdToken().getJwtToken();
		const formData = new FormData();
		formData.append('fileName', file);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_LAMBDA_URL}/lambda/uploadFile`, {
				method: 'POST',
				cache: 'no-cache',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: formData,
			});

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}
}

export default FileService.getInstance();
