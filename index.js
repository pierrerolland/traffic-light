const gpio = require('pi-gpio');
const Api = require('./api');
const config = require('./config.json');

let activePin = null;
let lastMessageId = null;

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
    return message.from.name === config.jenkinsBotDisplayedName && message.message.indexOf(config.buildName) !== -1;
};

const jenkinsHaveStatus = (status, message) => {
    return new RegExp(`${config.buildName} .* ${status}`).exec(message) !== null;
};

const turnPinOn = pinId => {
    if (activePin !== null) {
        gpio.close(activePin);
    }
    activePin = pinId;
    gpio.open(pinId, 'output', () => {
        gpio.write(pinId, direction, () => {});
    });
};

setInterval(watch, 5000);
