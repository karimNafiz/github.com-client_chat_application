
// singleton decoder
const decoder = TextDecoder()

function GetMessageIncompleteErr(actual_byte_count, expected_byte_count){
    return new Error("message incomplete, expected "+expected_byte_count+" bytes \n got "+actual_byte_count)
}


// need to put in a try catch block
function OnMessageArrive(message, res, rej) {
    const msg = new Uint8Array(message); // message = ArrayBuffer or Uint8Array
    const decoder = new TextDecoder();
    const HEADER_LEN_BYTES = 4;
    let offset = 0;

    try {
        if (msg.length < HEADER_LEN_BYTES) {
            throw new RangeError(`Not enough bytes for header length: got ${msg.length}, need ${HEADER_LEN_BYTES}`);
        }

        // read 4-byte big-endian header length
        const dv = new DataView(msg.buffer, msg.byteOffset + offset, HEADER_LEN_BYTES);
        const header_len = dv.getUint32(0, false);
        offset += HEADER_LEN_BYTES;

        if (msg.length < offset + header_len) {
            throw new RangeError(`Header incomplete: got ${msg.length}, need ${offset + header_len}`);
        }

        let headerObj;
        try {
            const headerBytes = msg.slice(offset, offset + header_len);
            const headerStr = decoder.decode(headerBytes);
            headerObj = JSON.parse(headerStr);
        } catch (err) {
            throw new SyntaxError(`Failed to parse header JSON: ${err.message}`);
        }
        offset += header_len;

        const body_len = headerObj.size;
        if (typeof body_len !== "number" || body_len < 0) {
            throw new TypeError(`Invalid body length in header: ${body_len}`);
        }

        if (msg.length < offset + body_len) {
            throw new RangeError(`Body incomplete: got ${msg.length}, need ${offset + body_len}`);
        }

        let bodyObj;
        try {
            const body_bytes = msg.slice(offset, offset + body_len);
            const body_str = decoder.decode(body_bytes);
            bodyObj = JSON.parse(body_str);
        } catch (err) {
            throw new SyntaxError(`Failed to parse body JSON: ${err.message}`);
        }

        res(bodyObj);

    } catch (err) {
        // Custom error handling hook
        rej(err);
    }
}
