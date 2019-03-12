import React from 'react';
import ReactDOM from 'react-dom';

import ChatControl from './ChatControl';

ReactDOM.render(
    <div className="overlay-wrapper">
        <ChatControl />
    </div>,
    document.getElementById('app'),
);
