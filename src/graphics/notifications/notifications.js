import * as PIXI from 'pixi.js';
import { TweenMax, TimelineLite, Power0, Power2, PixiPlugin, _gsScope } from "gsap/all";

_gsScope.PIXI = PIXI;

const width = 1920;
const height = 1080;

const degreesToRadians = degrees => {
    const pi = Math.PI;
    return degrees * (pi/180);
};

const oppositeHeight = (dist, degrees) => {
    return dist * Math.tan(degreesToRadians(degrees));
};

(() => {
    const timeline = new TimelineLite();
    const app = new PIXI.Application({
        height,
        width,
        transparent: true,
        antialias: true,
    });
    document.body.appendChild(app.view);

    const degreesFromCenter = 3;
    const offsetHeight = oppositeHeight(width + width / 2, degreesFromCenter);
    const centerHeight = (height / 2);

    const topTextStyle = new PIXI.TextStyle({
        fontFamily: "\"Lucida Console\", Monaco, monospace",
        fontSize: 72,
        fill: '#effaff',
    });

    const bottomTextStyle = new PIXI.TextStyle({
        fontFamily: "\"Lucida Console\", Monaco, monospace",
        fontSize: 96,
        fill: '#effaff',
    });

    const sendMessage = (topMessage, bottomMessage) => {
        const container = new PIXI.Container();
        container.pivot = new PIXI.Point(width - 600, 100);
        container.x = -width;
        container.y = centerHeight + offsetHeight;
        container.rotation = degreesToRadians(-degreesFromCenter);

        const dropShadow = new PIXI.Graphics();
        dropShadow.beginFill(0x000000);
        dropShadow.drawRect(8, 8, width + 500, 200);
        dropShadow.endFill();
        container.addChild(dropShadow);

        const rect = new PIXI.Graphics();
        rect.beginFill(0xDE3249);
        rect.drawRect(0, 0, width + 500, 200);
        rect.endFill();
        rect.tint = 0x777777;
        container.addChild(rect);

        const topText = new PIXI.Text(topMessage, topTextStyle);
        topText.x = (width / 2) - (topText.width / 2) + 325;
        topText.y = 15;
        topText.tint = 0x999999;
        container.addChild(topText);

        const bottomText = new PIXI.Text(bottomMessage, bottomTextStyle);
        bottomText.x = (width / 2) - (bottomText.width / 2) + 300;
        bottomText.y = 200 - 10 - (bottomText.height);
        bottomText.tint = 0x999999;
        container.addChild(bottomText);

        app.stage.addChild(container);

        timeline.to(container, 1.5, {
            x: width / 2,
            y: centerHeight,
            ease: Power2.easeOut,
        }).to(container, 4, {
            rotation: degreesToRadians(degreesFromCenter),
            ease: Power2.easeInAndOut,
        }, '-=.5').to(container, 1.5, {
            x: -width,
            y: centerHeight - offsetHeight,
            ease: Power2.easeIn,
        }, '-=.5').to(container, 1, {});

        timeline.to(rect, 7, {
            pixi: {
                tint: '#FFF',
            },
        }, '-=7');

        timeline.to(topText, 7, {
            pixi: {
                tint: '#333',
            },
        }, '-=7');

        timeline.to(bottomText, 7, {
            pixi: {
                tint: '#333',
            },
        }, '-=7');
    };

    nodecg.listenFor('channel.follower', 'nodecg-twitchie', follower => {
        sendMessage('New Follower:', follower.user.display_name);
    });
    sendMessage('New Follower:', 'WWWWWWWWWWWWWWWWWWWW');
})();
