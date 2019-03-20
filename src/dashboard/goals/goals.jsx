import React from 'react';
import ReactDOM from 'react-dom';

import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import GoalBox from './GoalBox';

ReactDOM.render(
    <div className="overlay-wrapper">
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <GoalBox />
        </MuiPickersUtilsProvider>
    </div>,
    document.getElementById('app'),
);
