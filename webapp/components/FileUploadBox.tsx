import { ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { storage } from './Firebase/FirebaseInit';

const FileUploadBox = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	return (
		<div>
			<input
				type="file"
				name="file"
				onChange={event => {
					if (event.target.files) {
						setSelectedFile(event.target.files[0]);
					} else {
						setSelectedFile(null);
					}
				}}
			/>
			<div>
				<button
					onClick={() => {
						if (selectedFile)
							if (selectedFile) {
								const storageRef = ref(storage, `images/${selectedFile.name}`);
								uploadBytes(storageRef, selectedFile)
									.then(snapshot => {
										alert('Uploaded Sucessfully.');
									})
									.catch(() => {
										alert('Upload Failed.');
									});
							}
					}}
				>
					Submit
				</button>
			</div>
		</div>
	);
};

export default FileUploadBox;
