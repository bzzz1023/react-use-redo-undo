!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("react"),require("lodash")):"function"==typeof define&&define.amd?define("react-redo-undo",["react","lodash"],r):"object"==typeof exports?exports["react-redo-undo"]=r(require("react"),require("lodash")):e["react-redo-undo"]=r(e.react,e.lodash)}(self,((e,r)=>(()=>{"use strict";var t={467:e=>{e.exports=r},156:r=>{r.exports=e}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var c=n[e]={exports:{}};return t[e](c,c.exports,o),c.exports}o.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return o.d(r,{a:r}),r},o.d=(e,r)=>{for(var t in r)o.o(r,t)&&!o.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},o.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var c={};return(()=>{o.r(c),o.d(c,{default:()=>n});var e=o(156),r=o(467);const t={90:"z",89:"y",67:"c",86:"v"},n=({listenKeyboard:n})=>{const o=(0,e.useRef)({}),c=(0,e.useRef)(n),u=(0,e.useRef)(0),a=(0,e.useRef)([]),d=async()=>{const e=a.current[u.current+1];e&&(await e.redo(),u.current=u.current+1)},s=async()=>{if(u.current<0)return;const e=a.current[u.current];e&&(await e.undo(),u.current=u.current-1)},i=(0,r.debounce)((async function(e){if(console.log(u.current),!(u.current<0)&&c.current){const{metaKey:r,keyCode:n}=e;if(!r)return;switch(r&&`ctrl+${t[n]}`){case"ctrl+z":await s();break;case"ctrl+y":await d()}}}),200);return(0,e.useEffect)((()=>(function(e){e&&window.addEventListener("keydown",i)}(n),()=>{window.removeEventListener("keydown",i)})),[]),{registerCommand:e=>{const{commandName:r,execute:t,label:n}=e,{redo:c,undo:d}=t();if("function"!=typeof t||"function"!=typeof c||"function"!=typeof d)throw new Error("it is not function");o.current[r]=async e=>{const{redo:o,undo:c}=t(e);await o(),a.current.length>0&&(a.current=a.current.slice(0,u.current+1)),a.current.push({commandName:r,redo:o,undo:c,label:n}),u.current=a.current.length-1}},currentCommandIndex:u.current,commandQueue:a.current,commandMap:o.current,redo:d,undo:s,setKeyboardFlag:e=>{c.current=e}}}})(),c})()));