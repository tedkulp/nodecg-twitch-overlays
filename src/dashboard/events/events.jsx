import React from 'react';
import ReactDOM from 'react-dom';

import EventList from './EventList';

ReactDOM.render(
    <div className="overlay-wrapper">
        <EventList />
    </div>,
    document.getElementById('app'),
);
