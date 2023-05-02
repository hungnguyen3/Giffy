import styles from '../styles/FileUploadBox.module.scss';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface FileUploadBoxProps {
	setFileHolderForParent: Dispatch<SetStateAction<File | null>>;
	displayText: string | null;
}

const FileUploadBox = (props: FileUploadBoxProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedImgURL, setSelectedImgURL] = useState<string | null>(null);

	const imageMimeType = /image\/*/i; ///image\/(png|jpg|jpeg)/i;

	useEffect(() => {
		let fileReader: FileReader,
			isCancel = false;

		props.setFileHolderForParent(selectedFile);
		if (selectedFile) {
			// put the selectedFile into the holder of the parent
			fileReader = new FileReader();
			fileReader.onload = e => {
				if (e.target) {
					const { result } = e.target;
					if (result && !isCancel) {
						if (typeof result === 'string') {
							setSelectedImgURL(result);
						}
					}
				}
			};
			fileReader.readAsDataURL(selectedFile);
		}
		return () => {
			isCancel = true;
			if (fileReader && fileReader.readyState === 1) {
				fileReader.abort();
			}
		};
	}, [selectedFile]);

	return (
		<div className={styles.fileUploadBody}>
			{selectedImgURL ? (
				// TODO: style
				<div className={styles.fileUploadContent}>
					<div className={styles.imgPreviewWrapper}>
						<img
							src={selectedImgURL}
							alt="preview"
							className={styles.previewImg}
						></img>
					</div>

					<div className={styles.imageTitleWrap}>
						<button
							type="button"
							// onClick="removeUpload()"
							className={styles.removeImage}
							onClick={() => {
								if (selectedFile) {
									setSelectedFile(null);
									setSelectedImgURL(null);
								}
							}}
						>
							Remove
						</button>
					</div>
				</div>
			) : null}

			<div className={styles.fileUpload}>
				{selectedFile ? null : (
					<div className={styles.imageUploadWrap}>
						<input
							type="file"
							//multiple // TODO: make it ok to do multiple uploads
							className={styles.fileUploadInput}
							onChange={event => {
								if (event.target.files) {
									const file = event.target.files[0];

									if (!file.type.match(imageMimeType)) {
										alert('Image type not valid.');
										return;
									}

									setSelectedFile(file);
								} else setSelectedFile(null);
							}}
							accept="image/*"
						/>
						<div className={styles.dragText}>
							<h3>
								{props.displayText
									? props.displayText
									: 'Drag and drop a file or click here'}
							</h3>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FileUploadBox;
