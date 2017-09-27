const gpio = require('pi-gpio');
const Api = require('./api');
const config = require('./config.json');

let activePin = null;
let lastMessageId = null;

initPin(config.greenLightPin);
initPin(config.redLightPin);
initPin(config.yellowLightPin);

const watch = () => {
    Api.getRoomMessages().then(response => {
        const jenkinsMessages = response.items.filter(filterJenkinsMessages);

        if (jenkinsMessages.length > 0) {
            const lastMessage = jenkinsMessages[jenkinsMessages.length - 1];

            if (lastMessage.id !== lastMessageId) {
                lastMessageId = lastMessage.id;
                if (jenkinsHaveStatus('success', lastMessage.message)) {
                    turnPinOn(config.greenLightPin);
                } else if (jenkinsHaveStatus('fail', lastMessage.message)) {
                    turnPinOn(config.redLightPin);
                } else if (jenkinsHaveStatus('start', lastMessage.message)) {
                    turnPinOn(config.yellowLightPin);
                }
            }
        }
    });
};

const filterJenkinsMessages = (message) => {
    return (message.from === config.jenkinsBotDisplayedName || message.from.name === config.jenkinsBotDisplayedName) &&
        message.message.indexOf(config.buildName) !== -1;
};

const jenkinsHaveStatus = (status, message) => {
    return new RegExp(`${config.buildName} .* ${status}`).exec(message) !== null;
};

const initPin = pinId => {
    gpio.open(pinId, "out down", () => { gpio.write(pinId, 1, () => {})});
};

const turnPinOn = pinId => {
    if (activePin !== null) {
        gpio.write(activePin, 1, () => {});
    }
    activePin = pinId;
    gpio.write(pinId, 0, () => {});
};

setInterval(watch, 5000);
