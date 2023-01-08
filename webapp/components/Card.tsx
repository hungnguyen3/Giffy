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
	const dispatch = useAppDispatch();

	const selectedGiffies = useAppSelector(
		(state: RootState) => state.collections.selectedGiffyIds
	);

	useEffect(() => {
		if (selectedGiffies) {
			if (selectedGiffies.includes(props.giffyId)) {
				setIsChecked(true);
			} else {
				setIsChecked(false);
			}
		}
	}, [selectedGiffies]);

	const onClickHandler = () => {
		if (isChecked) {
			setIsChecked(!isChecked);
			dispatch(removeSelectedGiffy(props.giffyId));
		} else {
			setIsChecked(!isChecked);
			dispatch(addSelectedGiffy(props.giffyId));
		}
	};

	return (
		<div className={styles.card} onClick={onClickHandler}>
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
					style={
						isChecked
							? { visibility: isChecked ? 'visible' : 'hidden' }
							: undefined
					}
					onChange={onClickHandler}
				/>
			</div>
		</div>
	);
};

export default Card;
