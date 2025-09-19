
// singleton decoder
const decoder = TextDecoder()

function GetMessageIncompleteErr(actual_byte_count, expected_byte_count){
    return new Error("message incomplete, expected "+expected_byte_count+" bytes \n got "+actual_byte_count)
}


// need to put in a try catch block

function OnMessageArrive(message, res, rej){
  const msg = new Uint8Array(message);         // message = ArrayBuffer or Uint8Array
  const decoder = new TextDecoder();
  const HEADER_LEN_BYTES = 4;
  let offset = 0;

  if (msg.length < HEADER_LEN_BYTES) {
    rej(GetMessageIncompleteErr(msg.length, HEADER_LEN_BYTES));
    return;
  }

  // read 4-byte big-endian header length
  const dv = new DataView(msg.buffer, msg.byteOffset + offset, HEADER_LEN_BYTES);
  const header_len = dv.getUint32(0, false);
  offset += HEADER_LEN_BYTES;

  if (msg.length < offset + header_len) {
    rej(GetMessageIncompleteErr(msg.length, offset + header_len));
    return;
  }

  const headerBytes = msg.slice(offset, offset + header_len);
  const headerStr = decoder.decode(headerBytes);
  const headerObj = JSON.parse(headerStr);
  offset += header_len;


  // get the body size from the header object
  const body_len = headerObj[size]
  
  // need to check if the body is completely there or not
  if(msg.length < offset + body_len){
    rej(GetMessageIncompleteErr(msg.length , offset + body_len));
    return;
  }

  const body_bytes = msg.slice(offset, offset + body_len)
  const body_str = decoder.decode(body_bytes)
  const body_obj = JSON.parse(body_str)

  res(body_obj)




}