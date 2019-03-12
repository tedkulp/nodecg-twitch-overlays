import React from "react";
import { useTransition, config, animated } from 'react-spring'
import { get } from 'lodash';
import { useReplicantNS } from 'use-nodecg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

export default function ViewerCount() {
    const [streamInfo, _] = useReplicantNS('stream.info', 'nodecg-twitchie');
    const viewerCount = get(streamInfo, 'viewers', 0);
    const showDiv = viewerCount > 0;

    const transitions = useTransition(showDiv, null, {
        from: { opacity: 0, transform: 'translateX(100px)' },
        enter: { opacity: 1, transform: 'translateX(0)' },
        leave: { opacity: 0, transform: 'translateX(100px)' },
        config: config.molasses,
    });

    return transitions.map(({ item, _, props }) => {
        return (item
            ? (
                <animated.div className="viewercount-wrapper" key="only" style={props}>
                    <FontAwesomeIcon className="icon" icon={faTwitch} />
                    <span className="count">{viewerCount}</span>
                </animated.div>
            ) : (
                <animated.div key="none" style={props}></animated.div>
            ));
    });
}
