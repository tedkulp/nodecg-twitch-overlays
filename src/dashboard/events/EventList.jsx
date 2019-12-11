import React from "react";
import { useTransition, config, animated } from 'react-spring';
import { get, take } from 'lodash';
import { useReplicant } from 'use-nodecg';

export default function EventList() {
    const [events, _] = useReplicant('events', [], {
        namespace: 'nodecg-twitchie'
    });
    const transitions = useTransition(
        (take(events, 25) || []),
        event => `${event.subject}-${event.timestamp}`, // calculate key
        {
            from: { opacity: 0 },
            enter: { opacity: 1 },
            leave: { opacity: 0 },
            config: config.molasses,
        },
    );

    return transitions.map(({ item, key, props }) => {
        return (
            <animated.div key={key} style={props}>
                {item.subject}: {item.action}
            </animated.div>
        );
    });
};

