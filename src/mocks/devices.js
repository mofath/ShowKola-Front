import { mock } from 'src/utils/axiosMock';

const devices = [
    {
        "id": "61b38c89881c2da2da76981f",
        "brand": "Epson",
        "model": "EB86579D",
        "host": "192.168.0.63",
        "port": 3629,
        "password": null,
        "watch": true,
        "fetchedData": {
            "INITIALISATION": true,
            "GET_LAMP_HOUR": true,
            "GET_HUMIDITY": true,
            "GET_MODEL": true
        },
        "state": "ON"
    },
    {
        "id": "61c23e43727e94b721865f1e",
        "brand": "PjLinkTest",
        "model": "4CNT",
        "host": "127.0.0.1",
        "port": 4352,
        "password": "JBMIAProjectorLink",
        "watch": true,
        "fetchedData": {
            "GET_LAMP_HOUR": true
        },
        "state": "ON"
    }
]

const statistics = {
    totalDevices : 220,
    totalErrorStatus : 2,
    totalWarningStatus : 6,
    totalSuccessStatus : 208,
    totalOfflineStatus : 4
}

mock.onGet('/api/reports/devices').reply(() => {
    return [200, { statistics }];
});

mock.onGet('/api/device').reply(() => {
    return [200, devices];
});