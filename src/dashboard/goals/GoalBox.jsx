import React, { useState } from "react";

import { get } from 'lodash';
import { useReplicant } from 'use-nodecg';
import moment from 'moment';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { InlineDatePicker } from "material-ui-pickers";

export default function EventList(props) {
    const [goalType, setGoalType] = useReplicant('goalType', 'followers');
    const [title, setTitle] = useReplicant('title', '');
    const [startValue, setStartValue] = useReplicant('startValue', '');
    const [endValue, setEndValue] = useReplicant('endValue', '');
    const [currentValue, setCurrentValue] = useReplicant('currentValue', '');
    const [endDate, setEndDate] = useReplicant('endDate', moment().format('YYYY-MM-DD'));
    const [enabled, setEnabled] = useReplicant('enabled', false);
    const [alignment, setAlignment] = useReplicant('alignment', 'left');
    const [background, setBackground] = useReplicant('background', true);

    return (
        <form autoComplete="off">
            <FormControl style={{display: 'block'}}>
                <InputLabel htmlFor="goal-type">Type</InputLabel>
                <Select
                    style={{width: '100%'}}
                    value={goalType || ''}
                    onChange={(e) => setGoalType(e.target.value)}
                    inputProps={{
                        name: 'type',
                        id: 'goal-type',
                    }}
                    >
                    <MenuItem value={'bits'}>Bits</MenuItem>
                    <MenuItem value={'followers'}>Followers</MenuItem>
                    <MenuItem value={'subscriptions'}>Subscriptions</MenuItem>
                    {/* <MenuItem value={'tips'}>Tips</MenuItem> // Waiting on streamtips integration */}
                    <MenuItem value={'manual'}>Manual</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Title"
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
                style={{width: '100%'}}
                />
            <TextField
                label="Start Value"
                type="number"
                value={startValue || ''}
                onChange={(e) => setStartValue(e.target.value)}
                style={{width: '100%'}}
                />
            <TextField
                label="End Value"
                type="number"
                value={endValue || ''}
                onChange={(e) => setEndValue(e.target.value)}
                style={{width: '100%'}}
                />
            <TextField
                label="Current Value"
                type="number"
                value={currentValue || ''}
                onChange={(e) => setCurrentValue(e.target.value)}
                style={{width: '100%'}}
                />
            <div className="picker" style={{width: '100%'}}>
                <InlineDatePicker
                    style={{width: '100%'}}
                    label="Goal End Date"
                    // onlyCalendar
                    format={"YYYY-MM-DD"}
                    clearable
                    value={endDate || ''}
                    onChange={setEndDate}
                    animateYearScrolling
                />
            </div>
            <FormControl style={{display: 'block'}}>
                <InputLabel htmlFor="alignment">Alignment</InputLabel>
                <Select
                    style={{width: '100%'}}
                    value={alignment || ''}
                    onChange={(e) => setAlignment(e.target.value)}
                    inputProps={{
                        name: 'alignment',
                        id: 'alignment',
                    }}
                    >
                    <MenuItem value={'left'}>Left</MenuItem>
                    <MenuItem value={'center'}>Center</MenuItem>
                    <MenuItem value={'right'}>Right</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel
                label="Enabled"
                control={
                    <Switch
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        value="enabled"
                    />
                }
            />
            <FormControlLabel
                label="Background"
                control={
                    <Switch
                        checked={background}
                        onChange={(e) => setBackground(e.target.checked)}
                        value="background"
                    />
                }
            />

        </form>
    );
};
