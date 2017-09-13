# traffic-light
A traffic light based on the notifications Jenkins pops on a given Hipchat room

## Setup
On a Raspberry Pi (make sure node is installed) :

```
git clone git@github.com:pierrerolland/traffic-light.git && cd traffic-light
```
Plug your lights on pins 11, 15 and 16.
Copy the `config.json.dist` into `config.json` and add your settings (Hipchat room id, Hipchat access token, Jenkins bot name, Jenkins build name you want to audit, etc.)

## Run it
```bash
npm install
node index.js
```

