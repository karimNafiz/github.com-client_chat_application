import WebSocket from "ws";
import {once} from "./utils"
import {GetWebSocketPayload} from "./encode"
import {OnMessageArrive} from "./decode"



const ws = new WebSocket("wss://localhost:4000/v1/chat/connect");
ws.binaryType = "arraybuffer";

async function main(){

// try once to establish the connection 

    try{
        await once(ws , "open") // await the connection starting
        // once the connection is established
    }catch(err){
        console.debug("web socket connection failed")
    }

    const message_resolved = (payloadJSON)=>{
        console.debug("payload -> ",payloadJSON)
    }
    const message_rejected = (err)=>{
        console.debug("err", err.message)
    }
    ws.addEventListener("onmessage", OnMessageArrive(message_resolved , message_rejected))





}

await main()
