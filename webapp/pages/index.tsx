import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { useAppSelector, useAppDispatch } from '../hooks';
import { decrement, increment } from '../slices/CounterSlice';

const Home: NextPage = () => {
	const count = useAppSelector(state => state.counter.value);
	const dispatch = useAppDispatch();

	return (
		<Layout>
			<div>Home Page</div>
			<div>{count}</div>
			<button onClick={() => dispatch(increment())}>+</button>
			<button onClick={() => dispatch(decrement())}>-</button>
		</Layout>
	);
};

export default Home;
