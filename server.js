import express from "express";
import {FlatFFT} from "flat-fft"

const app = express();
const ctx = new FlatFFT(10);//2^10 = 1024

const repeat = function(v,n){
    const arr = [];
    for(let i = 0; i < n; i++){
        arr.push(v);
    }
    return arr;
};
const srepeat = (v,n)=>repeat(v,n).join("")

const asciiToBrainfuck = function(n){
    if(n < 10){
        return "[-]"+srepeat("+",n)+"."
    }
    const v1 = Math.floor(Math.sqrt(n));
    const v2 = Math.floor(n/v1);
    const r = n-v1*v2;
    return `[-]>[-]${srepeat("+",v1)}[-<${srepeat("+",v2)}>]<${srepeat("+",r)}.`;
};

const toBrainfuck = function(str){
    return [...str].map(v=>v.charCodeAt(0)).map(v=>asciiToBrainfuck(v)).join("");
};

app.get("/hello-world",(req,res)=>{
    const bfcode = toBrainfuck("Hello World");
    const buff = new Float32Array(1024*2);
    for(let i = 0; i < bfcode.length; i++){
        const byte = bfcode.charCodeAt(i);
        buff[i*2] = byte;
    }
    const freqDomain = ctx.fft(buff);
    res.send(JSON.stringify([...freqDomain]));
});

app.listen(3030,()=>{
    console.log("server listening to 3030");
});
