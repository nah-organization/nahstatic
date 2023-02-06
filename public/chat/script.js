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
                                for (const user of json.data.users) {
                                    if (!usermap.has(user)) {
                                        const div = documen.createElement('span');
                                        div.textContent = user;
                                        usermap.set(user, div);
                                        users.appendChild(div);
                                    }
                                }
                                if (json.data.event.type === 'leave') {
                                    const div = usermap.get(json.data.event.user);
                                    div.remove();
                                    usermap.delete(json.data.event.user);
                                }
                                break;
                            }
                            case 'signal': {
                                const outer = document.createElement('div');
                                const from = document.createElement('span');
                                from.textContent = json.data.sender;
                                outer.appendChild(from);
                                const to = document.createElement('span');
                                to.textContent = json.data.receiver.join(',');
                                outer.appendChild(to);
                                const message = document.createElement('span');
                                message.textCotent = json.data.message;
                                outer.appedChild(message);
                                messages.appendChild(outer);
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
