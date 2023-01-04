import { is } from 'immer/dist/internal';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
	addSelectedGiffy,
	removeSelectedGiffy,
} from '../slices/CollectionsSlice';
import { RootState } from '../store';
import styles from '../styles/Card.module.scss';

interface CardProps {
	img: string;
	name: string;
	likeCount: number;
	giffyId: number;
}

const Card = (props: CardProps) => {
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const [isDeleted, setIsDeleted] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (isChecked) {
			dispatch(addSelectedGiffy(props.giffyId));
		} else {
			dispatch(removeSelectedGiffy(props.giffyId));
		}
	}, [isChecked]);

	const selectedGiffies = useAppSelector(
		(state: RootState) => state.collections.selectedGiffyId
	);
	// TODO: cancel selected ticks when the user cancel delete confirmation modal
	useEffect(() => {
		if (selectedGiffies) {
			if (selectedGiffies.includes(props.giffyId)) {
				setIsChecked(true);
			} else {
				setIsChecked(false);
			}
		}
	}, [selectedGiffies]);

	return isDeleted ? (
		<div></div>
	) : (
		<div
			className={styles.card}
			onClick={() => {
				setIsChecked(!isChecked);
			}}
		>
			<div className={styles.cardImage}>
				<img src={props.img} alt="Avatar" />
			</div>

			<div className={styles.cardTitle}>
				<p>{props.name}</p>
				{/* <p>{props.likeCount}</p> */}
			</div>

			<div className={styles.cardCheckbox}>
				<input
					type="checkbox"
					checked={isChecked}
					onChange={() => {
						setIsChecked(!isChecked);
					}}
				/>
			</div>
		</div>
	);
};

export default Card;
