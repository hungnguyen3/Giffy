import { useAppDispatch } from '../hooks';
import layoutStyles from '../styles/Layout.module.scss';
import { close as closeAccountSetting } from '../slices/AccountSettingSlice';
import {
	closeCreateNewCollectionWindow,
	closeDeleteGiffyConfirmationWindow,
	closeUploadGiffyWindow,
} from '../slices/CollectionsSlice';

interface ModalProps {
	disableCloseButton: boolean;
	children: (JSX.Element | null)[] | JSX.Element;
}

const Modal = (props: ModalProps) => {
	const dispatch = useAppDispatch();

	return (
		<div className={layoutStyles.modal}>
			<div className={layoutStyles.modalContent}>
				{props.disableCloseButton ? null : (
					<span
						className={layoutStyles.closeIcon}
						onClick={() => {
							dispatch(closeAccountSetting());
							dispatch(closeUploadGiffyWindow());
							dispatch(closeCreateNewCollectionWindow());
							dispatch(closeDeleteGiffyConfirmationWindow());
						}}
					>
						x
					</span>
				)}
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
