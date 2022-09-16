let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let current = document.getElementById('current')
let full = document.getElementById('full')
let sep = document.getElementById('separator')
socket.onopen = () => {
    console.log("Successfully Connected");
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};


let tempState;
socket.onmessage = event => {
    let data = JSON.parse(event.data);
    if (tempState !== data.menu.state) {
        tempState = data.menu.state;
        if (tempState == 2) {
            current.style.opacity = 1
            full.style.opacity = 1
            sep.style.opacity = 1
        } else {
            current.style.opacity = 0
            full.style.opacity = 0
            sep.style.opacity = 0
        }
    }
    if (data.menu.state == 2) {
        dtfactor = 1
        if ((data.menu.mods.num >> 6)%2 != 0){
            dtfactor = 1.5
        }
        x = Math.ceil(data.menu.bm.time.current / 1000 / dtfactor);
        y = Math.ceil(data.menu.bm.time.full / 1000 / dtfactor);
        if (x > y){
            x = y;
        }
        
        a = String(x%60);
        b = String(y%60);
        if (a.length < 2){
            a = "0" + a
        }
        if (b.length < 2){
            b = "0" + b
        }
        current.innerText = `${Math.floor(x/60)}:${a}`;
        full.innerText = `${Math.floor(y/60)}:${b}`;
    } else {
        current.innerText = 0
        full.innerText = 0
    }
}