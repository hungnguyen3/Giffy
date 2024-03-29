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
		<div
			className={styles.card}
			onClick={onClickHandler}
			style={
				isChecked
					? {
							transform: 'scale(0.85, 0.85)',
							boxShadow: '0px 0px 0px 5px RoyalBlue',
					  }
					: {}
			}
		>
			<div className={styles.cardImage}>
				<img src={props.img} alt="Avatar" draggable="false" />
			</div>

			<div className={styles.cardTitle}>
				<p>{props.name}</p>
			</div>

			<div className={styles.cardCheckbox}>
				<input type="checkbox" checked={isChecked} onChange={onClickHandler} />
			</div>
		</div>
	);
};

export default Card;
