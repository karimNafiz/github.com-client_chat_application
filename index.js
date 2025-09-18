import WebSocket from "ws";

const ws = new WebSocket("wss://localhost:4000/v1/chat/connect");
ws.binaryType = "arraybuffer";


// promise helper for timeouts
// emitter is the object that will be emitting the events
// type is the name of the event, usually string
const once = (emitter , type, ms=8000) => new Promise((res , rej)=>{
    const t = setTimeout(()=>{
        // if the timeout is successful
        // then no connection was not established 
        // we need to remove the event of type -> type
        emitter.removeEventListener(type , on)
        // reject the promise 
        rej(new Error("timeout")) // didnt know javascript had Error
    }, ms);
    function on(ev){
        clearTimeout(t);
        emitter.removeEventListener(type , on);
        res(ev);
    }

    emitter.addEventListener(type, on)

})
