document.addEventListener("DOMContentLoaded", function() {
    setup()
});

function alertFromWasm(message){
    let toast = Metro.toast.create;
    toast(`main.wasm: ${message}`, null, null, "bigtoast");
}

function setup(){
    const go = new Go();
    WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject)
        .then((result) => {
            go.run(result.instance);
        });

    let btn_fizz = document.getElementById("fizz");
    let btn_buzz = document.getElementById("buzz");
    let btn_fizzbuzz = document.getElementById("fizzbuzz");

    btn_fizz.onclick = ()=>{
        const apikey = useApiKey();
        if (apikey.length == 0){
            return false
        }
        alertFromWasm(fizz(apikey))
    };
    btn_buzz.onclick = ()=>{
        const apikey = useApiKey();
        if (apikey.length == 0){
            return false
        }
        alertFromWasm(buzz(apikey))
    };
    btn_fizzbuzz.onclick = ()=>{
        const apikey = useApiKey();
        if (apikey.length == 0){
            return false
        }
        alertFromWasm(fizzbuzz(apikey))
    };

    function useApiKey(){
        return document.getElementById("apikey").value;
    }
}