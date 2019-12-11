import * as PIXI from 'pixi.js';
import moment from 'moment';
import WebFont from 'webfontloader';
import { get } from 'lodash';
// import { TweenMax, TimelineLite, Power0, Power2, PixiPlugin, _gsScope } from "gsap/all";

// _gsScope.PIXI = PIXI;

const width = 1920;
const height = 1080;

const graphWidth = 500;
const graphHeight = 30;

const colorOne = 0xef0000;
const colorTwo = 0x550000;

const margin = 5;

const goalType = NodeCG.Replicant('goalType', 'twitch-viewers');
const title = NodeCG.Replicant('title', 'twitch-viewers');
const startValue = NodeCG.Replicant('startValue', 'twitch-viewers');
const endValue = NodeCG.Replicant('endValue', 'twitch-viewers');
const currentValue = NodeCG.Replicant('currentValue', 'twitch-viewers');
const endDate = NodeCG.Replicant('endDate', 'twitch-viewers');
const enabled = NodeCG.Replicant('enabled', 'twitch-viewers');
const alignment = NodeCG.Replicant('alignment', 'twitch-viewers');
const hasBackground = NodeCG.Replicant('background', 'twitch-viewers');

const degreesToRadians = degrees => {
    const pi = Math.PI;
    return degrees * (pi/180);
};

const clamp = (min, max, val) => Math.min(Math.max(min, val), max);

const start = () => {
    const app = new PIXI.Application({
        height,
        width,
        // backgroundColor: 0x0099f3,
        transparent: true,
        antialias: true,
    });
    document.body.appendChild(app.view);

    const titleTextStyle = new PIXI.TextStyle({
        fontFamily: 'Caveat Brush',
        fontSize: 20,
        fill: '#fffff0',
    });

    const centerTextStyle = new PIXI.TextStyle({
        fontFamily: 'Caveat Brush',
        fontSize: 22,
        fill: '#effaff',
    });

    const bottomTextStyle = new PIXI.TextStyle({
        fontFamily: 'Caveat Brush',
        fontSize: 16,
        fill: '#fffff0',
    });

    const drawIt = percentage => {
        app.stage.removeChildren();

        const formatCurrentValue = val => {
            return goalType.value === 'donations' ? `$${Number(val).toFixed(2)}` : `${val}`;
        };

        if (enabled.value === true) {
            const container = new PIXI.Container();

            const filledWidth = graphWidth * percentage;
            const rect = new PIXI.Graphics();

            let topOffset = margin;

            if (title.value) {
                const titleText = new PIXI.Text(title.value, titleTextStyle);

                titleText.x = (graphWidth / 2) - (titleText.width / 2) + margin;
                titleText.y = margin;
                topOffset = titleText.height + 2 + margin;

                container.addChild(titleText);
            }

            rect.beginFill(colorOne);
            rect.drawRect(0 + margin, topOffset, filledWidth, graphHeight);
            rect.endFill();

            rect.beginFill(colorTwo);
            rect.drawRect(filledWidth + margin, topOffset, graphWidth - filledWidth, graphHeight);
            rect.endFill();

            container.addChild(rect);

            const stringToShow = `${formatCurrentValue(currentValue.value)}(${Math.round(percentage * 100 * 100) / 100}%)`
            const centerText = new PIXI.Text(stringToShow, centerTextStyle);

            centerText.x = (graphWidth / 2) - (centerText.width / 2) + margin;
            centerText.y = (graphHeight / 2) - (centerText.height / 2) + topOffset;

            container.addChild(centerText);

            const startText = new PIXI.Text(`${formatCurrentValue(startValue.value)}`, bottomTextStyle);
            startText.x = 2 + margin;
            startText.y = graphHeight + 2 + topOffset;

            container.addChild(startText);

            const endText = new PIXI.Text(`${formatCurrentValue(endValue.value)}`, bottomTextStyle);
            endText.x = graphWidth - endText.width - 2 + margin;
            endText.y = graphHeight + 2 + topOffset;

            container.addChild(endText);

            if (endDate && endDate.value) {
                const endDateMoment = moment(endDate.value);
                let middleText = new PIXI.Text('Ended', bottomTextStyle);
                if (endDateMoment.isAfter(moment())) {
                    middleText = new PIXI.Text(`Ends ${endDateMoment.fromNow()}`, bottomTextStyle);
                }
                middleText.x = (graphWidth / 2) - (middleText.width / 2) + margin;
                middleText.y = graphHeight + 2 + topOffset;
                container.addChild(middleText);
            }

            const background = new PIXI.Graphics();

            background.beginFill(0x000000);
            background.drawRect(0, 0, container.width + margin * 2, container.height + margin * 2);
            background.endFill();
            background.alpha = .65;

            if (alignment && alignment.value === 'center') {
                background.x = container.x = width / 2 - background.width / 2;
            }

            if (alignment && alignment.value === 'right') {
                container.x = background.x = width - background.width;
            }

            if (hasBackground.value === true) {
                app.stage.addChild(background);
            }
            app.stage.addChild(container);
        }
    };

    NodeCG.waitForReplicants(title, endDate, goalType, startValue, currentValue, endValue, enabled, alignment, hasBackground).then(() => {
        const getPercentage = () => {
            const val = (currentValue.value - startValue.value) / (endValue.value - startValue.value);
            return clamp(0, 1, val);
        };

        [goalType, title, currentValue, startValue, endValue, enabled, alignment, hasBackground, endDate].map(e => {
            e.on('change', (newVal, oldVal) => {
                drawIt(getPercentage());
            });
        });

        nodecg.listenFor('webhook.follow', 'nodecg-twitchie', follower => {
            if (goalType.value === 'followers' && enabled.value === true) {
                currentValue.value = ~~currentValue.value + 1;
            }
        });

        nodecg.listenFor('channel.subscription', 'nodecg-twitchie', sub => {
            if (sub && !sub.resub) {
                if (goalType.value === 'subscriptions' && enabled.value === true) {
                    currentValue.value = ~~currentValue.value + 1;
                }
            }
        });

        nodecg.listenFor('chat.cheer', 'nodecg-twitchie', cheer => {
            if (goalType.value === 'bits' && enabled.value === true) {
                currentValue.value = ~~currentValue.value + ~~(get(cheer, 'cheer.bits', 0));
            }
        });

        nodecg.listenFor('donation', 'nodecg-streamlabs', donation => {
            if (goalType.value === 'donations' && enabled.value === true) {
                currentValue.value = Number(currentValue.value) + Number(get(donation, 'amount.amount', 0));
            }
        });

        drawIt(getPercentage());
    });
};

WebFont.load({
    active: () => start(),
    google: {
        families: [
            'Caveat Brush',
        ],
    },
});
