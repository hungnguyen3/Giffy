import React from 'react';
import { render } from 'react-dom';

const Popup = () => {
	return <div>Popup Page</div>;
};

export default Popup;

render(<Popup />, document.getElementById('popup'));
