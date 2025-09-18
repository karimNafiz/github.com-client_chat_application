
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
const decoder = new TextDecoder();

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

// need to handle errors fuck, life is just sad
// I will handle the messaeg type internally
function GetWebSocketPayload(body){
    // the body is an dictionary
    const body = GetBody(body);

    // we need to stringify it 
    const jsonStr_body = JSON.stringify(body);
    const jsonBytes_body = encoder.encode(jsonStr_body)

    // get the length of the body
    const body_size = len(jsonBytes_body)


    // the header is a object 
    const header = GetHeader(MESSAGETYPE , body_size)
    
    const jsonStr_header = JSON.stringify(header)
    const jsonBytes_header = encoder.encode(jsonStr_header)

    // get the header_size
    const header_size = len(jsonBytes_body)

}