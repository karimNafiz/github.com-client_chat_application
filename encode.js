
// type TCPHeader struct {
// 	MessageType int `json:"message_type"`
// 	BodySize    int `json:"body_size"`
// }

// type TCPBody_Text struct {
// 	Body string `json:"body"`
// }


/*
    pass header arguments and get the header as a dictionary
*/

const encoder = new TextEncoder();
/*
    I'm hard coding this shit
*/
const MESSAGETYPE = 0


function GetHeader(message_type, body_size){
    return {
        message_type:message_type, 
        body_size:body_size
    };

}

/*
    pass the body as a string, this will be used for dms only
    right now I'm prototyping
*/
function GetBody(body){
    return{
        body:body
    };
}

// maybe put the concat bytes into utils TODO

function concatBytes(...arrs){
  const total = arrs.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrs){ out.set(a, off); off += a.length; }
  return out;
}

// bodyObj = your dictionary
/**
 * 
 * @param {*} bodyObj string
 * @returns Uint8Array
 * 
 * this function takes in a string, a dm, and returns the appropraite web socket payload to send to the backend
 * this function is mainly for testing, will be fixed in the future
 * returns a payload in Uint8Array, [4 bytes representing header size][header (json)][body (json)]
 */
export function GetWebSocketPayload(body_str){
  const body = GetBody(body_str); 
  const bodyBytes = encoder.encode(JSON.stringify(body));
  const bodySize  = bodyBytes.length;

  const header = GetHeader(MESSAGETYPE, bodySize); // your fn
  const headerBytes = encoder.encode(JSON.stringify(header));
  const headerSize  = headerBytes.length;

  // 4-byte big-endian header length
  const headLen = new Uint8Array(4);
  new DataView(headLen.buffer).setUint32(0, headerSize, false);

  // final payload: [4B len][header][body]
  return concatBytes(headLen, headerBytes, bodyBytes);
}


