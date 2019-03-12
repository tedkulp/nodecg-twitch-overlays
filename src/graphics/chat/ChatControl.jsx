import React, { useReducer, useRef, useEffect } from "react";
import { get, takeRight } from 'lodash';
import { useListenForNS } from 'use-nodecg';
import { useTransition, animated } from 'react-spring';
import ColorHash from 'color-hash';
import { EmoteFetcher, EmoteParser } from 'twitch-emoticons';

const colorHash = new ColorHash({
    lightness: 0.65,
    saturation: 0.65,
});

const fetcher = new EmoteFetcher();
const parser = new EmoteParser(fetcher, {
    template: '<img class="message-emote" src="{link}"></a>',
    match: /(\w+)/g,
});

const initialState = {
    messages: [],
};

const reducer = (state, action) => {
    switch(action.type) {
        case 'addMessage':
            return {
                messages: [...takeRight(state.messages, 50), action.msg],
            };
        default:
            return state;
    }
};

const getImageForEmote = (token, key) => {
    return (
        <img key={key} className="message-emote"
            src={`https://static-cdn.jtvnw.net/emoticons/v1/${token.key}/1.0`}
            srcSet={`https://static-cdn.jtvnw.net/emoticons/v1/${token.key}/1.0 1x,https://static-cdn.jtvnw.net/emoticons/v1/${token.key}/2.0 2x,https://static-cdn.jtvnw.net/emoticons/v1/${token.key}/3.0 4x`}
            alt={`${token.title}`} />
    );
};

let currentChannelName;

const fetchEmotes = channel => {
    if (channel !== currentChannelName) {
        currentChannelName = channel;
        return fetcher.fetchBTTVEmotes(channel).then(() => {
            return fetcher.fetchFFZEmotes(channel);
        });
    } else {
        return Promise.resolve();
    }
};

function ChatControl() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const bottomDivRef = useRef();
    useEffect(() => {
        if (bottomDivRef && bottomDivRef.current) {
            bottomDivRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    });
    const transitions = useTransition(get(state, 'messages', []), msg => msg.id, {
        from: { transform: 'translate3d(-50px,0,0)', opacity: '0', },
        enter: { transform: 'translate3d(0,0,0)', opacity: '1', },
        leave: { transform: 'translate3d(0,0,0)', },
    });

    useListenForNS('chat.chat', 'nodecg-twitchie', data => {
        fetchEmotes(data.channel.slice(1)).then(() => {
            const displayName = get(data, 'user.display-name', '');
            const msgParts = get(data, 'message.tokens', []).map((item, idx) => {
                const key = `${item.id}-${idx}`;
                if (item.type === 'text') {
                    const parsedText = parser.parse(item.content, 1);
                    return <span key={key} className="message-text" dangerouslySetInnerHTML={{__html: parsedText}}></span>;
                } else if (item.type === 'emote') {
                    return getImageForEmote(item.content, key);
                }
                return <span key={key}></span>;
            });
            dispatch({type: 'addMessage', msg: {
                contents: msgParts,
                displayName,
                id: data.message.id,
                color: get(data, 'user.color') || colorHash.hex(displayName),
            }});
        });
    });

    return (
        <>
            {transitions.map(({ item, props, key }) =>
                <animated.div className="message" key={key} style={props}>
                    <span className="message-display-name" style={{color: item.color}}>{item.displayName}: </span>
                    {(
                        item.contents.map(i => i)
                    )}
                </animated.div>
            )}
            <div style={{ float: 'left', clear: 'both' }} ref={(el) => { bottomDivRef.current = el; }}></div>
        </>
    );
}

export default ChatControl;
