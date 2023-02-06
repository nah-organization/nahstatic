const signalingServer = 'wss://signal.nahsns.ga/';

window.addEventListener('DOMContentsLoad', () => {
    const create = document.getElementById('create');
    const code = document.getElementById('code');
    const users = document.getElementById('users');
    const messages = document.getElementById('messages');

    const usermap = new Map();
    create.addEventListener('click', () => {
        if (!page) {
            if (!code.value) {
                const websocket = new WebSocket(signalingServer);
                let page = null;
                websocket.addEventListener('message', event => {
                    const message = '' + event.data;
                    if (message === 'ping') {
                        websocket.send('pong');
                        return;
                    }
                    try {
                        const json = JSON.parse(message);
                        switch (json.type) {
                            case 'room': {
                                page = json.data.id;
                                break;
                            }
                            case 'users': {
                                eventEmitter.emit('webrtc-mode', json.data);
                                for (const user of json.data.users) {

                                }
                                break;
                            }
                            case 'signal': {
                                eventEmitter.emit('draw', json.data.lines);
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                });
                websocket.send(JSON.stringify({
                    type: 'join'
                }));
            } else {
                const page = code.value;
                const websocket = new WebSocket(signalingServer + page);
            }
        }
    });

});
