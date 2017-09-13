const config = require('./config.json');
const fetch = require('node-fetch');

// To generate a "view messages" API token : https://url.hipchat.com/account/api => view messages token
class Api {
    getRoomMessages() {
        return fetch(`${config.url}/v2/room/${config.roomId}/history?auth_token=${config.token}`)
            .then(response => response.json())
        ;
    }
}

module.exports = new Api();
module.exports.default = module.exports;
