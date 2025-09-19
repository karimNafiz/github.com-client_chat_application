
// a promisified timeout
export const once = (emitter , type, ms=8000) => new Promise((res , rej)=>{
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
