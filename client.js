import {FlatFFT} from "flat-fft";


const evalBrainfuck = function(bf){
    const buff = new Uint8Array(30000);
    let pc = 0;
    let ptr = 0;
    let res = "";
    while(pc < bf.length){
        switch(bf[pc]){
            case "[":
                if(buff[ptr] === 0){
                    pc++;
                    let bcnt = 1;
                    while(bcnt > 0){
                        let c = bf[pc];
                        if(c === "[")bcnt++;
                        if(c === "]")bcnt--;
                        pc++;
                    }
                    //end up at the letter after the closing bracket
                }else{
                    pc++;
                }
            break;
            case "]":
                pc--;
                let bcnt = 1;
                while(bcnt > 0){
                    let c = bf[pc];
                    if(c === "[")bcnt--;
                    if(c === "]")bcnt++;
                    pc--;
                }
                pc++;
            break;
            case "+":
                buff[ptr]++;
                pc++;
            break;
            case "-":
                buff[ptr]--;
                pc++;
            break;
            case ">":
                ptr++;
                pc++;
            break;
            case "<":
                ptr--;
                pc++;
            break;
            case ".":
                res += String.fromCharCode(buff[ptr]);
                pc++;
            break;
            default:
            pc++;
        }
    }
    return res;
}

const ctx = new FlatFFT(10);//2^10 = 1024

const decodeFourierBuffer = function(freqDomain){
    const timeDomain = ctx.ifft(new Float32Array(freqDomain));
    const buff = [];
    for(let i = 0; i < timeDomain.length; i += 2){
        buff.push(Math.round(timeDomain[i]));
    }
    return buff;
};


const res = await fetch("http://localhost:3030/hello-world").then(v=>v.json());

const bfcode = decodeFourierBuffer(res).map(v=>String.fromCharCode(v)).join("");


console.log("raw response: ",res);
console.log("IFFT=>round=>stringify: ", bfcode);
console.log("Final result: ",evalBrainfuck(bfcode));
