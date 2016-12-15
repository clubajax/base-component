"use strict";

let
    result = 0,
    args = [1,2,3,4,5];
for(let i = 0; i < args.length; i++){
    result += args[i];
}

console.log('result', result);