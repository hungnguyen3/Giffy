import styles from '../styles/Card.module.scss';

interface CardDistributorProps {
	cards: JSX.Element[];
}

const CardDistributor = (props: CardDistributorProps) => {
	return <div className={styles.cardsContainer}>{props.cards}</div>;
};

export default CardDistributor;
