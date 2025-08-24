import{r as En,g as jn}from"./react-vendor-B3V0GjXe.js";import{r as h,j as s,A as Dn}from"./admin-components-C40h1YYn.js";const an=h.createContext({dragDropManager:void 0});var he={exports:{}},te={},Ge;function Pn(){if(Ge)return te;Ge=1;/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */return function(){function n(o){if(o==null)return null;if(typeof o=="function")return o.$$typeof===Nn?null:o.displayName||o.name||null;if(typeof o=="string")return o;switch(o){case I:return"Fragment";case P:return"Portal";case W:return"Profiler";case z:return"StrictMode";case F:return"Suspense";case $:return"SuspenseList"}if(typeof o=="object")switch(typeof o.tag=="number"&&console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."),o.$$typeof){case V:return(o.displayName||"Context")+".Provider";case L:return(o._context.displayName||"Context")+".Consumer";case _:var u=o.render;return o=o.displayName,o||(o=u.displayName||u.name||"",o=o!==""?"ForwardRef("+o+")":"ForwardRef"),o;case O:return u=o.displayName||null,u!==null?u:n(o.type)||"Memo";case de:u=o._payload,o=o._init;try{return n(o(u))}catch{}}return null}function e(o){return""+o}function t(o){try{e(o);var u=!1}catch{u=!0}if(u){u=console;var d=u.error,D=typeof Symbol=="function"&&Symbol.toStringTag&&o[Symbol.toStringTag]||o.constructor.name||"Object";return d.call(u,"The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",D),e(o)}}function r(){}function i(){if(ee===0){Re=console.log,Me=console.info,_e=console.warn,Ae=console.error,ze=console.group,Fe=console.groupCollapsed,$e=console.groupEnd;var o={configurable:!0,enumerable:!0,value:r,writable:!0};Object.defineProperties(console,{info:o,log:o,warn:o,error:o,group:o,groupCollapsed:o,groupEnd:o})}ee++}function a(){if(ee--,ee===0){var o={configurable:!0,enumerable:!0,writable:!0};Object.defineProperties(console,{log:Y({},o,{value:Re}),info:Y({},o,{value:Me}),warn:Y({},o,{value:_e}),error:Y({},o,{value:Ae}),group:Y({},o,{value:ze}),groupCollapsed:Y({},o,{value:Fe}),groupEnd:Y({},o,{value:$e})})}0>ee&&console.error("disabledDepth fell below zero. This is a bug in React. Please file an issue.")}function l(o){if(me===void 0)try{throw Error()}catch(d){var u=d.stack.trim().match(/\n( *(at )?)/);me=u&&u[1]||"",He=-1<d.stack.indexOf(`
    at`)?" (<anonymous>)":-1<d.stack.indexOf("@")?"@unknown:0:0":""}return`
`+me+o+He}function c(o,u){if(!o||pe)return"";var d=ge.get(o);if(d!==void 0)return d;pe=!0,d=Error.prepareStackTrace,Error.prepareStackTrace=void 0;var D=null;D=G.H,G.H=null,i();try{var R={DetermineComponentFrameRoot:function(){try{if(u){var q=function(){throw Error()};if(Object.defineProperty(q.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(q,[])}catch(U){var ie=U}Reflect.construct(o,[],q)}else{try{q.call()}catch(U){ie=U}o.call(q.prototype)}}else{try{throw Error()}catch(U){ie=U}(q=o())&&typeof q.catch=="function"&&q.catch(function(){})}}catch(U){if(U&&ie&&typeof U.stack=="string")return[U.stack,ie.stack]}return[null,null]}};R.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var T=Object.getOwnPropertyDescriptor(R.DetermineComponentFrameRoot,"name");T&&T.configurable&&Object.defineProperty(R.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var N=R.DetermineComponentFrameRoot(),H=N[0],J=N[1];if(H&&J){var M=H.split(`
`),B=J.split(`
`);for(N=T=0;T<M.length&&!M[T].includes("DetermineComponentFrameRoot");)T++;for(;N<B.length&&!B[N].includes("DetermineComponentFrameRoot");)N++;if(T===M.length||N===B.length)for(T=M.length-1,N=B.length-1;1<=T&&0<=N&&M[T]!==B[N];)N--;for(;1<=T&&0<=N;T--,N--)if(M[T]!==B[N]){if(T!==1||N!==1)do if(T--,N--,0>N||M[T]!==B[N]){var ne=`
`+M[T].replace(" at new "," at ");return o.displayName&&ne.includes("<anonymous>")&&(ne=ne.replace("<anonymous>",o.displayName)),typeof o=="function"&&ge.set(o,ne),ne}while(1<=T&&0<=N);break}}}finally{pe=!1,G.H=D,a(),Error.prepareStackTrace=d}return M=(M=o?o.displayName||o.name:"")?l(M):"",typeof o=="function"&&ge.set(o,M),M}function g(o){if(o==null)return"";if(typeof o=="function"){var u=o.prototype;return c(o,!(!u||!u.isReactComponent))}if(typeof o=="string")return l(o);switch(o){case F:return l("Suspense");case $:return l("SuspenseList")}if(typeof o=="object")switch(o.$$typeof){case _:return o=c(o.render,!1),o;case O:return g(o.type);case de:u=o._payload,o=o._init;try{return g(o(u))}catch{}}return""}function m(){var o=G.A;return o===null?null:o.getOwner()}function S(o){if(Ve.call(o,"key")){var u=Object.getOwnPropertyDescriptor(o,"key").get;if(u&&u.isReactWarning)return!1}return o.key!==void 0}function E(o,u){function d(){Ue||(Ue=!0,console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",u))}d.isReactWarning=!0,Object.defineProperty(o,"key",{get:d,configurable:!0})}function C(){var o=n(this.type);return qe[o]||(qe[o]=!0,console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")),o=this.props.ref,o!==void 0?o:null}function y(o,u,d,D,R,T){return d=T.ref,o={$$typeof:j,type:o,key:u,props:T,_owner:R},(d!==void 0?d:null)!==null?Object.defineProperty(o,"ref",{enumerable:!1,get:C}):Object.defineProperty(o,"ref",{enumerable:!1,value:null}),o._store={},Object.defineProperty(o._store,"validated",{configurable:!1,enumerable:!1,writable:!0,value:0}),Object.defineProperty(o,"_debugInfo",{configurable:!1,enumerable:!1,writable:!0,value:null}),Object.freeze&&(Object.freeze(o.props),Object.freeze(o)),o}function k(o,u,d,D,R,T){if(typeof o=="string"||typeof o=="function"||o===I||o===W||o===z||o===F||o===$||o===vn||typeof o=="object"&&o!==null&&(o.$$typeof===de||o.$$typeof===O||o.$$typeof===V||o.$$typeof===L||o.$$typeof===_||o.$$typeof===yn||o.getModuleId!==void 0)){var N=u.children;if(N!==void 0)if(D)if(fe(N)){for(D=0;D<N.length;D++)f(N[D],o);Object.freeze&&Object.freeze(N)}else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");else f(N,o)}else N="",(o===void 0||typeof o=="object"&&o!==null&&Object.keys(o).length===0)&&(N+=" You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."),o===null?D="null":fe(o)?D="array":o!==void 0&&o.$$typeof===j?(D="<"+(n(o.type)||"Unknown")+" />",N=" Did you accidentally export a JSX literal instead of a component?"):D=typeof o,console.error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",D,N);if(Ve.call(u,"key")){N=n(o);var H=Object.keys(u).filter(function(M){return M!=="key"});D=0<H.length?"{key: someKey, "+H.join(": ..., ")+": ...}":"{key: someKey}",We[N+D]||(H=0<H.length?"{"+H.join(": ..., ")+": ...}":"{}",console.error(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,D,N,H,N),We[N+D]=!0)}if(N=null,d!==void 0&&(t(d),N=""+d),S(u)&&(t(u.key),N=""+u.key),"key"in u){d={};for(var J in u)J!=="key"&&(d[J]=u[J])}else d=u;return N&&E(d,typeof o=="function"?o.displayName||o.name||"Unknown":o),y(o,N,T,R,m(),d)}function f(o,u){if(typeof o=="object"&&o&&o.$$typeof!==wn){if(fe(o))for(var d=0;d<o.length;d++){var D=o[d];w(D)&&b(D,u)}else if(w(o))o._store&&(o._store.validated=1);else if(o===null||typeof o!="object"?d=null:(d=ke&&o[ke]||o["@@iterator"],d=typeof d=="function"?d:null),typeof d=="function"&&d!==o.entries&&(d=d.call(o),d!==o))for(;!(o=d.next()).done;)w(o.value)&&b(o.value,u)}}function w(o){return typeof o=="object"&&o!==null&&o.$$typeof===j}function b(o,u){if(o._store&&!o._store.validated&&o.key==null&&(o._store.validated=1,u=p(u),!Le[u])){Le[u]=!0;var d="";o&&o._owner!=null&&o._owner!==m()&&(d=null,typeof o._owner.tag=="number"?d=n(o._owner.type):typeof o._owner.name=="string"&&(d=o._owner.name),d=" It was passed a child from "+d+".");var D=G.getCurrentStack;G.getCurrentStack=function(){var R=g(o.type);return D&&(R+=D()||""),R},console.error('Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',u,d),G.getCurrentStack=D}}function p(o){var u="",d=m();return d&&(d=n(d.type))&&(u=`

Check the render method of \``+d+"`."),u||(o=n(o))&&(u=`

Check the top-level render call using <`+o+">."),u}var x=En(),j=Symbol.for("react.transitional.element"),P=Symbol.for("react.portal"),I=Symbol.for("react.fragment"),z=Symbol.for("react.strict_mode"),W=Symbol.for("react.profiler"),L=Symbol.for("react.consumer"),V=Symbol.for("react.context"),_=Symbol.for("react.forward_ref"),F=Symbol.for("react.suspense"),$=Symbol.for("react.suspense_list"),O=Symbol.for("react.memo"),de=Symbol.for("react.lazy"),vn=Symbol.for("react.offscreen"),ke=Symbol.iterator,Nn=Symbol.for("react.client.reference"),G=x.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ve=Object.prototype.hasOwnProperty,Y=Object.assign,yn=Symbol.for("react.client.reference"),fe=Array.isArray,ee=0,Re,Me,_e,Ae,ze,Fe,$e;r.__reactDisabledLog=!0;var me,He,pe=!1,ge=new(typeof WeakMap=="function"?WeakMap:Map),wn=Symbol.for("react.client.reference"),Ue,qe={},We={},Le={};te.Fragment=I,te.jsx=function(o,u,d,D,R){return k(o,u,d,!1,D,R)},te.jsxs=function(o,u,d,D,R){return k(o,u,d,!0,D,R)}}(),te}var Ye;function Sn(){return Ye||(Ye=1,he.exports=Pn()),he.exports}var On=Sn(),Be=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}(),be=function(){return Math.random().toString(36).substring(7).split("").join(".")},Xe={INIT:"@@redux/INIT"+be(),REPLACE:"@@redux/REPLACE"+be(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+be()}};function Cn(n){if(typeof n!="object"||n===null)return!1;for(var e=n;Object.getPrototypeOf(e)!==null;)e=Object.getPrototypeOf(e);return Object.getPrototypeOf(n)===e}function Tn(n){if(n===void 0)return"undefined";if(n===null)return"null";var e=typeof n;switch(e){case"boolean":case"string":case"number":case"symbol":case"function":return e}if(Array.isArray(n))return"array";if(Vn(n))return"date";if(kn(n))return"error";var t=In(n);switch(t){case"Symbol":case"Promise":case"WeakMap":case"WeakSet":case"Map":case"Set":return t}return e.slice(8,-1).toLowerCase().replace(/\s/g,"")}function In(n){return typeof n.constructor=="function"?n.constructor.name:null}function kn(n){return n instanceof Error||typeof n.message=="string"&&n.constructor&&typeof n.constructor.stackTraceLimit=="number"}function Vn(n){return n instanceof Date?!0:typeof n.toDateString=="function"&&typeof n.getDate=="function"&&typeof n.setDate=="function"}function K(n){var e=typeof n;return e=Tn(n),e}function ln(n,e,t){var r;if(typeof e=="function"&&typeof t=="function"||typeof t=="function"&&typeof arguments[3]=="function")throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");if(typeof e=="function"&&typeof t>"u"&&(t=e,e=void 0),typeof t<"u"){if(typeof t!="function")throw new Error("Expected the enhancer to be a function. Instead, received: '"+K(t)+"'");return t(ln)(n,e)}if(typeof n!="function")throw new Error("Expected the root reducer to be a function. Instead, received: '"+K(n)+"'");var i=n,a=e,l=[],c=l,g=!1;function m(){c===l&&(c=l.slice())}function S(){if(g)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return a}function E(f){if(typeof f!="function")throw new Error("Expected the listener to be a function. Instead, received: '"+K(f)+"'");if(g)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");var w=!0;return m(),c.push(f),function(){if(w){if(g)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");w=!1,m();var p=c.indexOf(f);c.splice(p,1),l=null}}}function C(f){if(!Cn(f))throw new Error("Actions must be plain objects. Instead, the actual type was: '"+K(f)+"'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");if(typeof f.type>"u")throw new Error('Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');if(g)throw new Error("Reducers may not dispatch actions.");try{g=!0,a=i(a,f)}finally{g=!1}for(var w=l=c,b=0;b<w.length;b++){var p=w[b];p()}return f}function y(f){if(typeof f!="function")throw new Error("Expected the nextReducer to be a function. Instead, received: '"+K(f));i=f,C({type:Xe.REPLACE})}function k(){var f,w=E;return f={subscribe:function(p){if(typeof p!="object"||p===null)throw new Error("Expected the observer to be an object. Instead, received: '"+K(p)+"'");function x(){p.next&&p.next(S())}x();var j=w(x);return{unsubscribe:j}}},f[Be]=function(){return this},f}return C({type:Xe.INIT}),r={dispatch:C,subscribe:E,getState:S,replaceReducer:y},r[Be]=k,r}function v(n,e,...t){if(!n){let r;if(e===void 0)r=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{let i=0;r=new Error(e.replace(/%s/g,function(){return t[i++]})),r.name="Invariant Violation"}throw r.framesToPop=1,r}}function Rn(n,e,t){return e.split(".").reduce((r,i)=>r&&r[i]?r[i]:t,n)}function Mn(n,e){return n.filter(t=>t!==e)}function cn(n){return typeof n=="object"}function _n(n,e){const t=new Map,r=a=>{t.set(a,t.has(a)?t.get(a)+1:1)};n.forEach(r),e.forEach(r);const i=[];return t.forEach((a,l)=>{a===1&&i.push(l)}),i}function An(n,e){return n.filter(t=>e.indexOf(t)>-1)}const Pe="dnd-core/INIT_COORDS",se="dnd-core/BEGIN_DRAG",Se="dnd-core/PUBLISH_DRAG_SOURCE",ae="dnd-core/HOVER",le="dnd-core/DROP",ce="dnd-core/END_DRAG";function Je(n,e){return{type:Pe,payload:{sourceClientOffset:e||null,clientOffset:n||null}}}const zn={type:Pe,payload:{clientOffset:null,sourceClientOffset:null}};function Fn(n){return function(t=[],r={publishSource:!0}){const{publishSource:i=!0,clientOffset:a,getSourceClientOffset:l}=r,c=n.getMonitor(),g=n.getRegistry();n.dispatch(Je(a)),$n(t,c,g);const m=qn(t,c);if(m==null){n.dispatch(zn);return}let S=null;if(a){if(!l)throw new Error("getSourceClientOffset must be defined");Hn(l),S=l(m)}n.dispatch(Je(a,S));const C=g.getSource(m).beginDrag(c,m);if(C==null)return;Un(C),g.pinSource(m);const y=g.getSourceType(m);return{type:se,payload:{itemType:y,item:C,sourceId:m,clientOffset:a||null,sourceClientOffset:S||null,isSourcePublic:!!i}}}}function $n(n,e,t){v(!e.isDragging(),"Cannot call beginDrag while dragging."),n.forEach(function(r){v(t.getSource(r),"Expected sourceIds to be registered.")})}function Hn(n){v(typeof n=="function","When clientOffset is provided, getSourceClientOffset must be a function.")}function Un(n){v(cn(n),"Item must be an object.")}function qn(n,e){let t=null;for(let r=n.length-1;r>=0;r--)if(e.canDragSource(n[r])){t=n[r];break}return t}function Wn(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function Ln(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable}))),r.forEach(function(i){Wn(n,i,t[i])})}return n}function Gn(n){return function(t={}){const r=n.getMonitor(),i=n.getRegistry();Yn(r),Jn(r).forEach((l,c)=>{const g=Bn(l,c,i,r),m={type:le,payload:{dropResult:Ln({},t,g)}};n.dispatch(m)})}}function Yn(n){v(n.isDragging(),"Cannot call drop while not dragging."),v(!n.didDrop(),"Cannot call drop twice during one drag operation.")}function Bn(n,e,t,r){const i=t.getTarget(n);let a=i?i.drop(r,n):void 0;return Xn(a),typeof a>"u"&&(a=e===0?{}:r.getDropResult()),a}function Xn(n){v(typeof n>"u"||cn(n),"Drop result must either be an object or undefined.")}function Jn(n){const e=n.getTargetIds().filter(n.canDropOnTarget,n);return e.reverse(),e}function Kn(n){return function(){const t=n.getMonitor(),r=n.getRegistry();Qn(t);const i=t.getSourceId();return i!=null&&(r.getSource(i,!0).endDrag(t,i),r.unpinSource()),{type:ce}}}function Qn(n){v(n.isDragging(),"Cannot call endDrag while not dragging.")}function we(n,e){return e===null?n===null:Array.isArray(n)?n.some(t=>t===e):n===e}function Zn(n){return function(t,{clientOffset:r}={}){et(t);const i=t.slice(0),a=n.getMonitor(),l=n.getRegistry(),c=a.getItemType();return tt(i,l,c),nt(i,a,l),rt(i,a,l),{type:ae,payload:{targetIds:i,clientOffset:r||null}}}}function et(n){v(Array.isArray(n),"Expected targetIds to be an array.")}function nt(n,e,t){v(e.isDragging(),"Cannot call hover while not dragging."),v(!e.didDrop(),"Cannot call hover after drop.");for(let r=0;r<n.length;r++){const i=n[r];v(n.lastIndexOf(i)===r,"Expected targetIds to be unique in the passed array.");const a=t.getTarget(i);v(a,"Expected targetIds to be registered.")}}function tt(n,e,t){for(let r=n.length-1;r>=0;r--){const i=n[r],a=e.getTargetType(i);we(a,t)||n.splice(r,1)}}function rt(n,e,t){n.forEach(function(r){t.getTarget(r).hover(e,r)})}function it(n){return function(){if(n.getMonitor().isDragging())return{type:Se}}}function ot(n){return{beginDrag:Fn(n),publishDragSource:it(n),hover:Zn(n),drop:Gn(n),endDrag:Kn(n)}}class st{receiveBackend(e){this.backend=e}getMonitor(){return this.monitor}getBackend(){return this.backend}getRegistry(){return this.monitor.registry}getActions(){const e=this,{dispatch:t}=this.store;function r(a){return(...l)=>{const c=a.apply(e,l);typeof c<"u"&&t(c)}}const i=ot(this);return Object.keys(i).reduce((a,l)=>{const c=i[l];return a[l]=r(c),a},{})}dispatch(e){this.store.dispatch(e)}constructor(e,t){this.isSetUp=!1,this.handleRefCountChange=()=>{const r=this.store.getState().refCount>0;this.backend&&(r&&!this.isSetUp?(this.backend.setup(),this.isSetUp=!0):!r&&this.isSetUp&&(this.backend.teardown(),this.isSetUp=!1))},this.store=e,this.monitor=t,e.subscribe(this.handleRefCountChange)}}function at(n,e){return{x:n.x+e.x,y:n.y+e.y}}function un(n,e){return{x:n.x-e.x,y:n.y-e.y}}function lt(n){const{clientOffset:e,initialClientOffset:t,initialSourceClientOffset:r}=n;return!e||!t||!r?null:un(at(e,r),t)}function ct(n){const{clientOffset:e,initialClientOffset:t}=n;return!e||!t?null:un(e,t)}const re=[],Oe=[];re.__IS_NONE__=!0;Oe.__IS_ALL__=!0;function ut(n,e){return n===re?!1:n===Oe||typeof e>"u"?!0:An(e,n).length>0}class dt{subscribeToStateChange(e,t={}){const{handlerIds:r}=t;v(typeof e=="function","listener must be a function."),v(typeof r>"u"||Array.isArray(r),"handlerIds, when specified, must be an array of strings.");let i=this.store.getState().stateId;const a=()=>{const l=this.store.getState(),c=l.stateId;try{c===i||c===i+1&&!ut(l.dirtyHandlerIds,r)||e()}finally{i=c}};return this.store.subscribe(a)}subscribeToOffsetChange(e){v(typeof e=="function","listener must be a function.");let t=this.store.getState().dragOffset;const r=()=>{const i=this.store.getState().dragOffset;i!==t&&(t=i,e())};return this.store.subscribe(r)}canDragSource(e){if(!e)return!1;const t=this.registry.getSource(e);return v(t,`Expected to find a valid source. sourceId=${e}`),this.isDragging()?!1:t.canDrag(this,e)}canDropOnTarget(e){if(!e)return!1;const t=this.registry.getTarget(e);if(v(t,`Expected to find a valid target. targetId=${e}`),!this.isDragging()||this.didDrop())return!1;const r=this.registry.getTargetType(e),i=this.getItemType();return we(r,i)&&t.canDrop(this,e)}isDragging(){return!!this.getItemType()}isDraggingSource(e){if(!e)return!1;const t=this.registry.getSource(e,!0);if(v(t,`Expected to find a valid source. sourceId=${e}`),!this.isDragging()||!this.isSourcePublic())return!1;const r=this.registry.getSourceType(e),i=this.getItemType();return r!==i?!1:t.isDragging(this,e)}isOverTarget(e,t={shallow:!1}){if(!e)return!1;const{shallow:r}=t;if(!this.isDragging())return!1;const i=this.registry.getTargetType(e),a=this.getItemType();if(a&&!we(i,a))return!1;const l=this.getTargetIds();if(!l.length)return!1;const c=l.indexOf(e);return r?c===l.length-1:c>-1}getItemType(){return this.store.getState().dragOperation.itemType}getItem(){return this.store.getState().dragOperation.item}getSourceId(){return this.store.getState().dragOperation.sourceId}getTargetIds(){return this.store.getState().dragOperation.targetIds}getDropResult(){return this.store.getState().dragOperation.dropResult}didDrop(){return this.store.getState().dragOperation.didDrop}isSourcePublic(){return!!this.store.getState().dragOperation.isSourcePublic}getInitialClientOffset(){return this.store.getState().dragOffset.initialClientOffset}getInitialSourceClientOffset(){return this.store.getState().dragOffset.initialSourceClientOffset}getClientOffset(){return this.store.getState().dragOffset.clientOffset}getSourceClientOffset(){return lt(this.store.getState().dragOffset)}getDifferenceFromInitialOffset(){return ct(this.store.getState().dragOffset)}constructor(e,t){this.store=e,this.registry=t}}const Ke=typeof global<"u"?global:self,dn=Ke.MutationObserver||Ke.WebKitMutationObserver;function fn(n){return function(){const t=setTimeout(i,0),r=setInterval(i,50);function i(){clearTimeout(t),clearInterval(r),n()}}}function ft(n){let e=1;const t=new dn(n),r=document.createTextNode("");return t.observe(r,{characterData:!0}),function(){e=-e,r.data=e}}const mt=typeof dn=="function"?ft:fn;class pt{enqueueTask(e){const{queue:t,requestFlush:r}=this;t.length||(r(),this.flushing=!0),t[t.length]=e}constructor(){this.queue=[],this.pendingErrors=[],this.flushing=!1,this.index=0,this.capacity=1024,this.flush=()=>{const{queue:e}=this;for(;this.index<e.length;){const t=this.index;if(this.index++,e[t].call(),this.index>this.capacity){for(let r=0,i=e.length-this.index;r<i;r++)e[r]=e[r+this.index];e.length-=this.index,this.index=0}}e.length=0,this.index=0,this.flushing=!1},this.registerPendingError=e=>{this.pendingErrors.push(e),this.requestErrorThrow()},this.requestFlush=mt(this.flush),this.requestErrorThrow=fn(()=>{if(this.pendingErrors.length)throw this.pendingErrors.shift()})}}class gt{call(){try{this.task&&this.task()}catch(e){this.onError(e)}finally{this.task=null,this.release(this)}}constructor(e,t){this.onError=e,this.release=t,this.task=null}}class ht{create(e){const t=this.freeTasks,r=t.length?t.pop():new gt(this.onError,i=>t[t.length]=i);return r.task=e,r}constructor(e){this.onError=e,this.freeTasks=[]}}const mn=new pt,bt=new ht(mn.registerPendingError);function xt(n){mn.enqueueTask(bt.create(n))}const Ce="dnd-core/ADD_SOURCE",Te="dnd-core/ADD_TARGET",Ie="dnd-core/REMOVE_SOURCE",ue="dnd-core/REMOVE_TARGET";function vt(n){return{type:Ce,payload:{sourceId:n}}}function Nt(n){return{type:Te,payload:{targetId:n}}}function yt(n){return{type:Ie,payload:{sourceId:n}}}function wt(n){return{type:ue,payload:{targetId:n}}}function Et(n){v(typeof n.canDrag=="function","Expected canDrag to be a function."),v(typeof n.beginDrag=="function","Expected beginDrag to be a function."),v(typeof n.endDrag=="function","Expected endDrag to be a function.")}function jt(n){v(typeof n.canDrop=="function","Expected canDrop to be a function."),v(typeof n.hover=="function","Expected hover to be a function."),v(typeof n.drop=="function","Expected beginDrag to be a function.")}function Ee(n,e){if(e&&Array.isArray(n)){n.forEach(t=>Ee(t,!1));return}v(typeof n=="string"||typeof n=="symbol",e?"Type can only be a string, a symbol, or an array of either.":"Type can only be a string or a symbol.")}var A;(function(n){n.SOURCE="SOURCE",n.TARGET="TARGET"})(A||(A={}));let Dt=0;function Pt(){return Dt++}function St(n){const e=Pt().toString();switch(n){case A.SOURCE:return`S${e}`;case A.TARGET:return`T${e}`;default:throw new Error(`Unknown Handler Role: ${n}`)}}function Qe(n){switch(n[0]){case"S":return A.SOURCE;case"T":return A.TARGET;default:throw new Error(`Cannot parse handler ID: ${n}`)}}function Ze(n,e){const t=n.entries();let r=!1;do{const{done:i,value:[,a]}=t.next();if(a===e)return!0;r=!!i}while(!r);return!1}class Ot{addSource(e,t){Ee(e),Et(t);const r=this.addHandler(A.SOURCE,e,t);return this.store.dispatch(vt(r)),r}addTarget(e,t){Ee(e,!0),jt(t);const r=this.addHandler(A.TARGET,e,t);return this.store.dispatch(Nt(r)),r}containsHandler(e){return Ze(this.dragSources,e)||Ze(this.dropTargets,e)}getSource(e,t=!1){return v(this.isSourceId(e),"Expected a valid source ID."),t&&e===this.pinnedSourceId?this.pinnedSource:this.dragSources.get(e)}getTarget(e){return v(this.isTargetId(e),"Expected a valid target ID."),this.dropTargets.get(e)}getSourceType(e){return v(this.isSourceId(e),"Expected a valid source ID."),this.types.get(e)}getTargetType(e){return v(this.isTargetId(e),"Expected a valid target ID."),this.types.get(e)}isSourceId(e){return Qe(e)===A.SOURCE}isTargetId(e){return Qe(e)===A.TARGET}removeSource(e){v(this.getSource(e),"Expected an existing source."),this.store.dispatch(yt(e)),xt(()=>{this.dragSources.delete(e),this.types.delete(e)})}removeTarget(e){v(this.getTarget(e),"Expected an existing target."),this.store.dispatch(wt(e)),this.dropTargets.delete(e),this.types.delete(e)}pinSource(e){const t=this.getSource(e);v(t,"Expected an existing source."),this.pinnedSourceId=e,this.pinnedSource=t}unpinSource(){v(this.pinnedSource,"No source is pinned at the time."),this.pinnedSourceId=null,this.pinnedSource=null}addHandler(e,t,r){const i=St(e);return this.types.set(i,t),e===A.SOURCE?this.dragSources.set(i,r):e===A.TARGET&&this.dropTargets.set(i,r),i}constructor(e){this.types=new Map,this.dragSources=new Map,this.dropTargets=new Map,this.pinnedSourceId=null,this.pinnedSource=null,this.store=e}}const Ct=(n,e)=>n===e;function Tt(n,e){return!n&&!e?!0:!n||!e?!1:n.x===e.x&&n.y===e.y}function It(n,e,t=Ct){if(n.length!==e.length)return!1;for(let r=0;r<n.length;++r)if(!t(n[r],e[r]))return!1;return!0}function kt(n=re,e){switch(e.type){case ae:break;case Ce:case Te:case ue:case Ie:return re;case se:case Se:case ce:case le:default:return Oe}const{targetIds:t=[],prevTargetIds:r=[]}=e.payload,i=_n(t,r);if(!(i.length>0||!It(t,r)))return re;const l=r[r.length-1],c=t[t.length-1];return l!==c&&(l&&i.push(l),c&&i.push(c)),i}function Vt(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function Rt(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable}))),r.forEach(function(i){Vt(n,i,t[i])})}return n}const en={initialSourceClientOffset:null,initialClientOffset:null,clientOffset:null};function Mt(n=en,e){const{payload:t}=e;switch(e.type){case Pe:case se:return{initialSourceClientOffset:t.sourceClientOffset,initialClientOffset:t.clientOffset,clientOffset:t.clientOffset};case ae:return Tt(n.clientOffset,t.clientOffset)?n:Rt({},n,{clientOffset:t.clientOffset});case ce:case le:return en;default:return n}}function _t(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function Q(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable}))),r.forEach(function(i){_t(n,i,t[i])})}return n}const At={itemType:null,item:null,sourceId:null,targetIds:[],dropResult:null,didDrop:!1,isSourcePublic:null};function zt(n=At,e){const{payload:t}=e;switch(e.type){case se:return Q({},n,{itemType:t.itemType,item:t.item,sourceId:t.sourceId,isSourcePublic:t.isSourcePublic,dropResult:null,didDrop:!1});case Se:return Q({},n,{isSourcePublic:!0});case ae:return Q({},n,{targetIds:t.targetIds});case ue:return n.targetIds.indexOf(t.targetId)===-1?n:Q({},n,{targetIds:Mn(n.targetIds,t.targetId)});case le:return Q({},n,{dropResult:t.dropResult,didDrop:!0,targetIds:[]});case ce:return Q({},n,{itemType:null,item:null,sourceId:null,dropResult:null,didDrop:!1,isSourcePublic:null,targetIds:[]});default:return n}}function Ft(n=0,e){switch(e.type){case Ce:case Te:return n+1;case Ie:case ue:return n-1;default:return n}}function $t(n=0){return n+1}function Ht(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function Ut(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable}))),r.forEach(function(i){Ht(n,i,t[i])})}return n}function qt(n={},e){return{dirtyHandlerIds:kt(n.dirtyHandlerIds,{type:e.type,payload:Ut({},e.payload,{prevTargetIds:Rn(n,"dragOperation.targetIds",[])})}),dragOffset:Mt(n.dragOffset,e),refCount:Ft(n.refCount,e),dragOperation:zt(n.dragOperation,e),stateId:$t(n.stateId)}}function Wt(n,e=void 0,t={},r=!1){const i=Lt(r),a=new dt(i,new Ot(i)),l=new st(i,a),c=n(l,e,t);return l.receiveBackend(c),l}function Lt(n){const e=typeof window<"u"&&window.__REDUX_DEVTOOLS_EXTENSION__;return ln(qt,n&&e&&e({name:"dnd-core",instanceId:"dnd-core"}))}function Gt(n,e){if(n==null)return{};var t=Yt(n,e),r,i;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(i=0;i<a.length;i++)r=a[i],!(e.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(n,r)&&(t[r]=n[r])}return t}function Yt(n,e){if(n==null)return{};var t={},r=Object.keys(n),i,a;for(a=0;a<r.length;a++)i=r[a],!(e.indexOf(i)>=0)&&(t[i]=n[i]);return t}let nn=0;const oe=Symbol.for("__REACT_DND_CONTEXT_INSTANCE__");var zr=h.memo(function(e){var{children:t}=e,r=Gt(e,["children"]);const[i,a]=Bt(r);return h.useEffect(()=>{if(a){const l=pn();return++nn,()=>{--nn===0&&(l[oe]=null)}}},[]),On.jsx(an.Provider,{value:i,children:t})});function Bt(n){if("manager"in n)return[{dragDropManager:n.manager},!1];const e=Xt(n.backend,n.context,n.options,n.debugMode),t=!n.context;return[e,t]}function Xt(n,e=pn(),t,r){const i=e;return i[oe]||(i[oe]={dragDropManager:Wt(n,e,t,r)}),i[oe]}function pn(){return typeof global<"u"?global:window}var xe,tn;function Jt(){return tn||(tn=1,xe=function n(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var r,i,a;if(Array.isArray(e)){if(r=e.length,r!=t.length)return!1;for(i=r;i--!==0;)if(!n(e[i],t[i]))return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();if(a=Object.keys(e),r=a.length,r!==Object.keys(t).length)return!1;for(i=r;i--!==0;)if(!Object.prototype.hasOwnProperty.call(t,a[i]))return!1;for(i=r;i--!==0;){var l=a[i];if(!n(e[l],t[l]))return!1}return!0}return e!==e&&t!==t}),xe}var Kt=Jt();const Qt=jn(Kt),X=typeof window<"u"?h.useLayoutEffect:h.useEffect;function Zt(n,e,t){const[r,i]=h.useState(()=>e(n)),a=h.useCallback(()=>{const l=e(n);Qt(r,l)||(i(l),t())},[r,n,t]);return X(a),[r,a]}function er(n,e,t){const[r,i]=Zt(n,e,t);return X(function(){const l=n.getHandlerId();if(l!=null)return n.subscribeToStateChange(i,{handlerIds:[l]})},[n,i]),r}function gn(n,e,t){return er(e,n||(()=>({})),()=>t.reconnect())}function hn(n,e){const t=[];return typeof n!="function"&&t.push(n),h.useMemo(()=>typeof n=="function"?n():n,t)}function nr(n){return h.useMemo(()=>n.hooks.dragSource(),[n])}function tr(n){return h.useMemo(()=>n.hooks.dragPreview(),[n])}let ve=!1,Ne=!1;class rr{receiveHandlerId(e){this.sourceId=e}getHandlerId(){return this.sourceId}canDrag(){v(!ve,"You may not call monitor.canDrag() inside your canDrag() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");try{return ve=!0,this.internalMonitor.canDragSource(this.sourceId)}finally{ve=!1}}isDragging(){if(!this.sourceId)return!1;v(!Ne,"You may not call monitor.isDragging() inside your isDragging() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");try{return Ne=!0,this.internalMonitor.isDraggingSource(this.sourceId)}finally{Ne=!1}}subscribeToStateChange(e,t){return this.internalMonitor.subscribeToStateChange(e,t)}isDraggingSource(e){return this.internalMonitor.isDraggingSource(e)}isOverTarget(e,t){return this.internalMonitor.isOverTarget(e,t)}getTargetIds(){return this.internalMonitor.getTargetIds()}isSourcePublic(){return this.internalMonitor.isSourcePublic()}getSourceId(){return this.internalMonitor.getSourceId()}subscribeToOffsetChange(e){return this.internalMonitor.subscribeToOffsetChange(e)}canDragSource(e){return this.internalMonitor.canDragSource(e)}canDropOnTarget(e){return this.internalMonitor.canDropOnTarget(e)}getItemType(){return this.internalMonitor.getItemType()}getItem(){return this.internalMonitor.getItem()}getDropResult(){return this.internalMonitor.getDropResult()}didDrop(){return this.internalMonitor.didDrop()}getInitialClientOffset(){return this.internalMonitor.getInitialClientOffset()}getInitialSourceClientOffset(){return this.internalMonitor.getInitialSourceClientOffset()}getSourceClientOffset(){return this.internalMonitor.getSourceClientOffset()}getClientOffset(){return this.internalMonitor.getClientOffset()}getDifferenceFromInitialOffset(){return this.internalMonitor.getDifferenceFromInitialOffset()}constructor(e){this.sourceId=null,this.internalMonitor=e.getMonitor()}}let ye=!1;class ir{receiveHandlerId(e){this.targetId=e}getHandlerId(){return this.targetId}subscribeToStateChange(e,t){return this.internalMonitor.subscribeToStateChange(e,t)}canDrop(){if(!this.targetId)return!1;v(!ye,"You may not call monitor.canDrop() inside your canDrop() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor");try{return ye=!0,this.internalMonitor.canDropOnTarget(this.targetId)}finally{ye=!1}}isOver(e){return this.targetId?this.internalMonitor.isOverTarget(this.targetId,e):!1}getItemType(){return this.internalMonitor.getItemType()}getItem(){return this.internalMonitor.getItem()}getDropResult(){return this.internalMonitor.getDropResult()}didDrop(){return this.internalMonitor.didDrop()}getInitialClientOffset(){return this.internalMonitor.getInitialClientOffset()}getInitialSourceClientOffset(){return this.internalMonitor.getInitialSourceClientOffset()}getSourceClientOffset(){return this.internalMonitor.getSourceClientOffset()}getClientOffset(){return this.internalMonitor.getClientOffset()}getDifferenceFromInitialOffset(){return this.internalMonitor.getDifferenceFromInitialOffset()}constructor(e){this.targetId=null,this.internalMonitor=e.getMonitor()}}function or(n,e,t){const r=t.getRegistry(),i=r.addTarget(n,e);return[i,()=>r.removeTarget(i)]}function sr(n,e,t){const r=t.getRegistry(),i=r.addSource(n,e);return[i,()=>r.removeSource(i)]}function je(n,e,t,r){let i;if(i!==void 0)return!!i;if(n===e)return!0;if(typeof n!="object"||!n||typeof e!="object"||!e)return!1;const a=Object.keys(n),l=Object.keys(e);if(a.length!==l.length)return!1;const c=Object.prototype.hasOwnProperty.bind(e);for(let g=0;g<a.length;g++){const m=a[g];if(!c(m))return!1;const S=n[m],E=e[m];if(i=void 0,i===!1||i===void 0&&S!==E)return!1}return!0}function De(n){return n!==null&&typeof n=="object"&&Object.prototype.hasOwnProperty.call(n,"current")}function ar(n){if(typeof n.type=="string")return;const e=n.type.displayName||n.type.name||"the component";throw new Error(`Only native element nodes can now be passed to React DnD connectors.You can either wrap ${e} into a <div>, or turn it into a drag source or a drop target itself.`)}function lr(n){return(e=null,t=null)=>{if(!h.isValidElement(e)){const a=e;return n(a,t),a}const r=e;return ar(r),cr(r,t?a=>n(a,t):n)}}function bn(n){const e={};return Object.keys(n).forEach(t=>{const r=n[t];if(t.endsWith("Ref"))e[t]=n[t];else{const i=lr(r);e[t]=()=>i}}),e}function rn(n,e){typeof n=="function"?n(e):n.current=e}function cr(n,e){const t=n.ref;return v(typeof t!="string","Cannot connect React DnD to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs"),t?h.cloneElement(n,{ref:r=>{rn(t,r),rn(e,r)}}):h.cloneElement(n,{ref:e})}class ur{receiveHandlerId(e){this.handlerId!==e&&(this.handlerId=e,this.reconnect())}get connectTarget(){return this.dragSource}get dragSourceOptions(){return this.dragSourceOptionsInternal}set dragSourceOptions(e){this.dragSourceOptionsInternal=e}get dragPreviewOptions(){return this.dragPreviewOptionsInternal}set dragPreviewOptions(e){this.dragPreviewOptionsInternal=e}reconnect(){const e=this.reconnectDragSource();this.reconnectDragPreview(e)}reconnectDragSource(){const e=this.dragSource,t=this.didHandlerIdChange()||this.didConnectedDragSourceChange()||this.didDragSourceOptionsChange();return t&&this.disconnectDragSource(),this.handlerId?e?(t&&(this.lastConnectedHandlerId=this.handlerId,this.lastConnectedDragSource=e,this.lastConnectedDragSourceOptions=this.dragSourceOptions,this.dragSourceUnsubscribe=this.backend.connectDragSource(this.handlerId,e,this.dragSourceOptions)),t):(this.lastConnectedDragSource=e,t):t}reconnectDragPreview(e=!1){const t=this.dragPreview,r=e||this.didHandlerIdChange()||this.didConnectedDragPreviewChange()||this.didDragPreviewOptionsChange();if(r&&this.disconnectDragPreview(),!!this.handlerId){if(!t){this.lastConnectedDragPreview=t;return}r&&(this.lastConnectedHandlerId=this.handlerId,this.lastConnectedDragPreview=t,this.lastConnectedDragPreviewOptions=this.dragPreviewOptions,this.dragPreviewUnsubscribe=this.backend.connectDragPreview(this.handlerId,t,this.dragPreviewOptions))}}didHandlerIdChange(){return this.lastConnectedHandlerId!==this.handlerId}didConnectedDragSourceChange(){return this.lastConnectedDragSource!==this.dragSource}didConnectedDragPreviewChange(){return this.lastConnectedDragPreview!==this.dragPreview}didDragSourceOptionsChange(){return!je(this.lastConnectedDragSourceOptions,this.dragSourceOptions)}didDragPreviewOptionsChange(){return!je(this.lastConnectedDragPreviewOptions,this.dragPreviewOptions)}disconnectDragSource(){this.dragSourceUnsubscribe&&(this.dragSourceUnsubscribe(),this.dragSourceUnsubscribe=void 0)}disconnectDragPreview(){this.dragPreviewUnsubscribe&&(this.dragPreviewUnsubscribe(),this.dragPreviewUnsubscribe=void 0,this.dragPreviewNode=null,this.dragPreviewRef=null)}get dragSource(){return this.dragSourceNode||this.dragSourceRef&&this.dragSourceRef.current}get dragPreview(){return this.dragPreviewNode||this.dragPreviewRef&&this.dragPreviewRef.current}clearDragSource(){this.dragSourceNode=null,this.dragSourceRef=null}clearDragPreview(){this.dragPreviewNode=null,this.dragPreviewRef=null}constructor(e){this.hooks=bn({dragSource:(t,r)=>{this.clearDragSource(),this.dragSourceOptions=r||null,De(t)?this.dragSourceRef=t:this.dragSourceNode=t,this.reconnectDragSource()},dragPreview:(t,r)=>{this.clearDragPreview(),this.dragPreviewOptions=r||null,De(t)?this.dragPreviewRef=t:this.dragPreviewNode=t,this.reconnectDragPreview()}}),this.handlerId=null,this.dragSourceRef=null,this.dragSourceOptionsInternal=null,this.dragPreviewRef=null,this.dragPreviewOptionsInternal=null,this.lastConnectedHandlerId=null,this.lastConnectedDragSource=null,this.lastConnectedDragSourceOptions=null,this.lastConnectedDragPreview=null,this.lastConnectedDragPreviewOptions=null,this.backend=e}}class dr{get connectTarget(){return this.dropTarget}reconnect(){const e=this.didHandlerIdChange()||this.didDropTargetChange()||this.didOptionsChange();e&&this.disconnectDropTarget();const t=this.dropTarget;if(this.handlerId){if(!t){this.lastConnectedDropTarget=t;return}e&&(this.lastConnectedHandlerId=this.handlerId,this.lastConnectedDropTarget=t,this.lastConnectedDropTargetOptions=this.dropTargetOptions,this.unsubscribeDropTarget=this.backend.connectDropTarget(this.handlerId,t,this.dropTargetOptions))}}receiveHandlerId(e){e!==this.handlerId&&(this.handlerId=e,this.reconnect())}get dropTargetOptions(){return this.dropTargetOptionsInternal}set dropTargetOptions(e){this.dropTargetOptionsInternal=e}didHandlerIdChange(){return this.lastConnectedHandlerId!==this.handlerId}didDropTargetChange(){return this.lastConnectedDropTarget!==this.dropTarget}didOptionsChange(){return!je(this.lastConnectedDropTargetOptions,this.dropTargetOptions)}disconnectDropTarget(){this.unsubscribeDropTarget&&(this.unsubscribeDropTarget(),this.unsubscribeDropTarget=void 0)}get dropTarget(){return this.dropTargetNode||this.dropTargetRef&&this.dropTargetRef.current}clearDropTarget(){this.dropTargetRef=null,this.dropTargetNode=null}constructor(e){this.hooks=bn({dropTarget:(t,r)=>{this.clearDropTarget(),this.dropTargetOptions=r,De(t)?this.dropTargetRef=t:this.dropTargetNode=t,this.reconnect()}}),this.handlerId=null,this.dropTargetRef=null,this.dropTargetOptionsInternal=null,this.lastConnectedHandlerId=null,this.lastConnectedDropTarget=null,this.lastConnectedDropTargetOptions=null,this.backend=e}}function Z(){const{dragDropManager:n}=h.useContext(an);return v(n!=null,"Expected drag drop context"),n}function fr(n,e){const t=Z(),r=h.useMemo(()=>new ur(t.getBackend()),[t]);return X(()=>(r.dragSourceOptions=n||null,r.reconnect(),()=>r.disconnectDragSource()),[r,n]),X(()=>(r.dragPreviewOptions=e||null,r.reconnect(),()=>r.disconnectDragPreview()),[r,e]),r}function mr(){const n=Z();return h.useMemo(()=>new rr(n),[n])}class pr{beginDrag(){const e=this.spec,t=this.monitor;let r=null;return typeof e.item=="object"?r=e.item:typeof e.item=="function"?r=e.item(t):r={},r??null}canDrag(){const e=this.spec,t=this.monitor;return typeof e.canDrag=="boolean"?e.canDrag:typeof e.canDrag=="function"?e.canDrag(t):!0}isDragging(e,t){const r=this.spec,i=this.monitor,{isDragging:a}=r;return a?a(i):t===e.getSourceId()}endDrag(){const e=this.spec,t=this.monitor,r=this.connector,{end:i}=e;i&&i(t.getItem(),t),r.reconnect()}constructor(e,t,r){this.spec=e,this.monitor=t,this.connector=r}}function gr(n,e,t){const r=h.useMemo(()=>new pr(n,e,t),[e,t]);return h.useEffect(()=>{r.spec=n},[n]),r}function hr(n){return h.useMemo(()=>{const e=n.type;return v(e!=null,"spec.type must be defined"),e},[n])}function br(n,e,t){const r=Z(),i=gr(n,e,t),a=hr(n);X(function(){if(a!=null){const[c,g]=sr(a,i,r);return e.receiveHandlerId(c),t.receiveHandlerId(c),g}},[r,e,t,i,a])}function xn(n,e){const t=hn(n);v(!t.begin,"useDrag::spec.begin was deprecated in v14. Replace spec.begin() with spec.item(). (see more here - https://react-dnd.github.io/react-dnd/docs/api/use-drag)");const r=mr(),i=fr(t.options,t.previewOptions);return br(t,r,i),[gn(t.collect,r,i),nr(i),tr(i)]}function xr(n){return h.useMemo(()=>n.hooks.dropTarget(),[n])}function vr(n){const e=Z(),t=h.useMemo(()=>new dr(e.getBackend()),[e]);return X(()=>(t.dropTargetOptions=n||null,t.reconnect(),()=>t.disconnectDropTarget()),[n]),t}function Nr(){const n=Z();return h.useMemo(()=>new ir(n),[n])}function yr(n){const{accept:e}=n;return h.useMemo(()=>(v(n.accept!=null,"accept must be defined"),Array.isArray(e)?e:[e]),[e])}class wr{canDrop(){const e=this.spec,t=this.monitor;return e.canDrop?e.canDrop(t.getItem(),t):!0}hover(){const e=this.spec,t=this.monitor;e.hover&&e.hover(t.getItem(),t)}drop(){const e=this.spec,t=this.monitor;if(e.drop)return e.drop(t.getItem(),t)}constructor(e,t){this.spec=e,this.monitor=t}}function Er(n,e){const t=h.useMemo(()=>new wr(n,e),[e]);return h.useEffect(()=>{t.spec=n},[n]),t}function jr(n,e,t){const r=Z(),i=Er(n,e),a=yr(n);X(function(){const[c,g]=or(a,i,r);return e.receiveHandlerId(c),t.receiveHandlerId(c),g},[r,e,i,t,a.map(l=>l.toString()).join("|")])}function Dr(n,e){const t=hn(n),r=Nr(),i=vr(t.options);return jr(t,r,i),[gn(t.collect,r,i),xr(i)]}function Pr(n){const[e,t]=h.useState({planning:null,classes:[],semaines:[],familles:[],affectations:[],permissions:{isAdmin:!1,canEdit:!1}}),[r,i]=h.useState(!0),[a,l]=h.useState(null),[c,g]=h.useState(()=>localStorage.getItem("adminSessionToken")),m=async b=>{try{const x=await(await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login",data:{token:n,password:b}})})).json();return x.success?(g(x.sessionToken),localStorage.setItem("adminSessionToken",x.sessionToken),await E(),{success:!0}):{success:!1,error:x.error}}catch{return{success:!1,error:"Erreur de connexion"}}},S=async()=>{try{c&&await fetch("/api/auth",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout",data:{sessionToken:c}})})}catch(b){console.error("Erreur lors de la déconnexion:",b)}finally{g(null),localStorage.removeItem("adminSessionToken"),await E()}},E=async()=>{if(!n){l("Token de planning requis"),i(!1);return}try{i(!0),l(null);const b={"Content-Type":"application/json"};c&&(b["X-Admin-Session"]=c);const p=await fetch(`/api/planning?token=${n}&type=full`,{method:"GET",headers:b});if(!p.ok){let j=null;try{j=await p.json()}catch{}const P=(j==null?void 0:j.error)||`Erreur HTTP: ${p.status}`;if(p.status===401||p.status===403){const I=P.toLowerCase();if(I.includes("token invalide")||I.includes("token manquant")||I.includes("planning inactif"))throw new Error(P);if(c)return g(null),localStorage.removeItem("adminSessionToken"),E();throw new Error(P)}throw new Error(P)}const x=await p.json();t(x)}catch(b){console.error("Erreur lors du chargement:",b),l(b.message)}finally{i(!1)}},C=async()=>{if(c)try{(await(await fetch(`/api/auth?action=check_session&session_token=${c}`)).json()).isAdmin||(g(null),localStorage.removeItem("adminSessionToken"))}catch(b){console.error("Erreur vérification session:",b),g(null),localStorage.removeItem("adminSessionToken")}},y=async(b,p,x,j="")=>{if(!e.permissions.canEdit)throw new Error("Permissions insuffisantes");try{const P=await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":c},body:JSON.stringify({token:n,type:"affectation",data:{familleId:b,classeId:p,semaineId:x,notes:j}})});if(!P.ok){const V=await P.json();throw new Error(V.error||"Erreur lors de la création")}const I=await P.json(),z=e.affectations.filter(V=>V.familleId===b),W=e.semaines.find(V=>V.id===x),L=z.filter(V=>{const _=e.semaines.find(F=>F.id===V.semaineId);return _&&new Date(_.debut)<=new Date(W.debut)}).length+1;return t(V=>{var _,F,$;return{...V,affectations:[...V.affectations,{id:I.id,familleId:b,classeId:p,semaineId:x,notes:j,familleNom:((_=V.familles.find(O=>O.id===b))==null?void 0:_.nom)||"Famille inconnue",classeNom:((F=V.classes.find(O=>O.id===p))==null?void 0:F.nom)||"Classe inconnue",classeCouleur:(($=V.classes.find(O=>O.id===p))==null?void 0:$.couleur)||"#ccc",numeroNettoyage:L}]}}),I}catch(P){throw P}},k=async b=>{if(!e.permissions.canEdit)throw new Error("Permissions insuffisantes");try{const p=await fetch("/api/planning",{method:"DELETE",headers:{"Content-Type":"application/json","X-Admin-Session":c},body:JSON.stringify({token:n,type:"affectation",id:b})});if(!p.ok){const x=await p.json();throw new Error(x.error||"Erreur lors de la suppression")}t(x=>({...x,affectations:x.affectations.filter(j=>j.id!==b)}))}catch(p){throw p}},f=async(b,p)=>{var x;if(!((x=e.permissions)!=null&&x.canEdit))throw new Error("Permissions insuffisantes");try{const j=await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":c},body:JSON.stringify({token:n,type:"publish_semaine",data:{semaineId:b,publish:p}})});if(!j.ok){const I=await j.json();throw new Error(I.error||"Erreur lors de la publication")}const P=await j.json();return t(I=>({...I,semaines:I.semaines.map(z=>z.id===b?{...z,is_published:p,published_at:p?new Date().toISOString():null}:z)})),P}catch(j){throw j}},w=async b=>{var p;if(!((p=e.permissions)!=null&&p.canEdit))throw new Error("Permissions insuffisantes");try{const x=await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":c},body:JSON.stringify({token:n,type:"auto_distribute",data:{semaineId:b}})});if(!x.ok){const P=await x.json();throw new Error(P.error||"Erreur lors de la distribution automatique")}const j=await x.json();return await E(),j}catch(x){throw x}};return h.useEffect(()=>{n&&C().then(()=>{E()})},[n]),h.useEffect(()=>{n&&E()},[c]),{data:e,loading:r,error:a,isAdmin:e.permissions.isAdmin,canEdit:e.permissions.canEdit,loginAdmin:m,logoutAdmin:S,createAffectation:y,deleteAffectation:k,toggleSemainePublication:f,autoDistributeWeek:w,refreshData:E,sessionToken:c}}function Sr({classes:n}){return s.jsxDEV("div",{className:"planning-header",children:[n.map(e=>s.jsxDEV("div",{className:"classe-header",style:{backgroundColor:e.couleur},children:[s.jsxDEV("div",{className:"classe-nom",children:e.nom},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningHeader.jsx",lineNumber:12,columnNumber:11},this),e.instructions_pdf_url&&s.jsxDEV("a",{href:e.instructions_pdf_url,target:"_blank",rel:"noopener noreferrer",className:"pdf-instructions",title:"Instructions de nettoyage (PDF)",children:"📄"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningHeader.jsx",lineNumber:14,columnNumber:13},this)]},e.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningHeader.jsx",lineNumber:7,columnNumber:9},this)),s.jsxDEV("style",{jsx:!0,children:`
        .planning-header {
          display: grid;
          grid-template-columns: repeat(${n.length}, minmax(150px, 1fr));
          gap: 1px;
          background: #ddd;
          border-radius: 6px 6px 0 0;
          overflow-x: auto;
          overflow-y: hidden;
          min-width: 100%;
        }

        .classe-header {
          padding: 8px 4px;
          color: #333;
          font-weight: 600;
          text-align: center;
          min-height: 70px;
          min-width: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
        }

        .classe-nom {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          line-height: 1.3;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .pdf-instructions {
          color: #333;
          text-decoration: none;
          font-size: 16px;
          opacity: 0.8;
          transition: all 0.2s;
          padding: 2px 4px;
          border-radius: 3px;
        }

        .pdf-instructions:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .classe-header {
            padding: 8px;
            min-height: 50px;
            font-size: 12px;
          }
          
          .pdf-instructions {
            font-size: 14px;
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningHeader.jsx",lineNumber:27,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningHeader.jsx",lineNumber:5,columnNumber:5},this)}function Or({classe:n,semaine:e,affectation:t,onMove:r,onFamilleDrop:i,onOverwriteRequest:a,isAdmin:l}){const[c,g]=h.useState(!1),[{isDragging:m},S]=xn(()=>({type:"affectation",item:{affectation:t,classe:n,semaine:e},canDrag:l&&t,collect:f=>({isDragging:f.isDragging()})})),[{isOver:E,canDrop:C},y]=Dr(()=>({accept:["affectation","famille"],drop:f=>{f.type==="famille"&&!t?i(f.id,n.id,e.id):f.type==="famille"&&t?a(f,t,n,e):t&&f.affectation&&r(f,{affectation:t,classe:n,semaine:e})},canDrop:f=>f.type==="famille"?l:l&&t&&f.affectation,collect:f=>({isOver:f.isOver(),canDrop:f.canDrop()})})),k=(f,w=20)=>{if(f.length<=w)return f;const b=f.lastIndexOf(" ",w);return b===-1?f.slice(0,w)+"...":f.slice(0,b)+"..."};return s.jsxDEV("div",{ref:f=>{l?S(y(f)):y(f)},className:`affectation-cell ${m?"dragging":""} ${E&&C?"drop-target":""} ${!t&&l?"droppable":""}`,style:{backgroundColor:n.couleur+"40",opacity:m?.5:1},"data-classe":`Partie ${n.id}`,children:[t&&s.jsxDEV(s.Fragment,{children:[s.jsxDEV("div",{className:"famille-nom",onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),children:k(t.familleNom||"Famille inconnue",window.innerWidth<=768?30:20)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AffectationCell.jsx",lineNumber:71,columnNumber:11},this),c&&window.innerWidth>768&&s.jsxDEV("div",{className:"famille-nom-tooltip",children:t.familleNom||"Famille inconnue"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AffectationCell.jsx",lineNumber:79,columnNumber:13},this),t.numeroNettoyage&&s.jsxDEV("div",{className:"nettoyage-numero",children:["#",t.numeroNettoyage]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AffectationCell.jsx",lineNumber:84,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AffectationCell.jsx",lineNumber:70,columnNumber:9},this),!t&&l&&s.jsxDEV("div",{className:"drop-placeholder",children:"Glisser une famille ici"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AffectationCell.jsx",lineNumber:91,columnNumber:9},this),s.jsxDEV("style",{jsx:!0,children:`
        .affectation-cell {
          min-height: 80px;
          min-width: 150px;
          background: white;
          border: none;
          border-radius: 0;
          padding: 6px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: all 0.2s;
          cursor: ${l&&t?"grab":"default"};
          box-sizing: border-box;
        }

        .affectation-cell.droppable {
          border-style: dashed;
          border-color: #007bff;
        }

        .affectation-cell.drop-target {
          border-color: #28a745;
          background-color: rgba(40, 167, 69, 0.1) !important;
          transform: scale(1.02);
        }

        .affectation-cell.dragging {
          transform: rotate(5deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .famille-nom {
          font-weight: 600;
          font-size: 11px;
          text-align: center;
          color: #333;
          margin-bottom: 4px;
          position: relative;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .famille-nom-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 10;
        }

        .nettoyage-numero {
          font-size: 10px;
          color: #666;
          font-weight: 500;
        }

        .drop-placeholder {
          color: #007bff;
          font-size: 11px;
          text-align: center;
          opacity: 0.7;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .affectation-cell {
            min-height: 70px;
            min-width: 120px;
            padding: 4px;
          }
          
          .famille-nom {
            font-size: 10px;
          }
          
          .nettoyage-numero {
            font-size: 8px;
          }

          .drop-placeholder {
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .affectation-cell {
            min-height: 60px;
            min-width: 90px;
            padding: 3px;
          }
          
          .famille-nom {
            font-size: 9px;
            line-height: 1.1;
          }
          
          .nettoyage-numero {
            font-size: 7px;
          }

          .drop-placeholder {
            font-size: 8px;
          }

          .famille-nom-tooltip {
            display: none; /* Masquer les tooltips sur très petit écran */
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AffectationCell.jsx",lineNumber:96,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AffectationCell.jsx",lineNumber:54,columnNumber:5},this)}const on=n=>{const e=new Date(n);return new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"short"}).format(e)};function Cr({semaine:n,classes:e,affectations:t,onAffectationMove:r,onFamilleDrop:i,onOverwriteRequest:a,isAdmin:l,canEdit:c,onAutoDistribute:g}){const m=n.is_published,[S,E]=h.useState(!1),C=new Set(t.map(w=>w.classeId)),y=e.filter(w=>!C.has(w.id)),k=c&&y.length>0,f=async()=>{if(!(!k||!g)){E(!0);try{await g(n.id)}catch(w){console.error("Erreur lors de la distribution automatique:",w)}finally{E(!1)}}};return s.jsxDEV("div",{className:`semaine-row ${m?"":"unpublished"}`,children:[s.jsxDEV("div",{className:"semaine-info",children:[s.jsxDEV("div",{className:"semaine-dates",children:[on(n.debut)," - ",on(n.fin)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:30,columnNumber:9},this),s.jsxDEV("div",{className:"semaine-meta",children:[n.type==="SPECIAL"&&s.jsxDEV("span",{className:"semaine-special",children:n.description},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:35,columnNumber:13},this),!m&&s.jsxDEV("span",{className:"unpublished-badge",children:"🔒 Non publiée"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:38,columnNumber:13},this),k&&s.jsxDEV("button",{onClick:f,disabled:S,className:"auto-distribute-btn",title:`Remplir automatiquement ${y.length} classe(s) disponible(s)`,children:[S?"⏳":"🎯"," Auto"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:41,columnNumber:13},this),y.length===0&&C.size>0&&s.jsxDEV("span",{className:"all-occupied",children:"✅ Complet"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:51,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:33,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:29,columnNumber:7},this),s.jsxDEV("div",{className:"semaine-affectations",children:e.map(w=>s.jsxDEV(Or,{classe:w,semaine:n,affectation:t.find(b=>b.classeId===w.id&&b.semaineId===n.id),onMove:r,onFamilleDrop:i,onOverwriteRequest:a,isAdmin:l},`${n.id}-${w.id}`,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:58,columnNumber:11},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:56,columnNumber:7},this),s.jsxDEV("style",{jsx:!0,children:`
        .semaine-row {
          display: flex;
          border-bottom: 1px solid #eee;
          min-height: 80px;
          transition: all 0.2s;
        }

        .semaine-row.unpublished {
          background: #fff9e6;
          border-left: 4px solid #ffc107;
        }

        .semaine-info {
          min-width: 180px;
          max-width: 180px;
          padding: 12px;
          background: #f8f9fa;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .semaine-dates {
          font-weight: 600;
          color: #333;
          font-size: 13px;
          line-height: 1.2;
        }

        .semaine-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .semaine-special {
          background: #e7f3ff;
          color: #0066cc;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .unpublished-badge {
          background: #ffc107;
          color: #212529;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .auto-distribute-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .auto-distribute-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
        }

        .auto-distribute-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        .all-occupied {
          background: #d4edda;
          color: #155724;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .semaine-affectations {
          display: grid;
          grid-template-columns: repeat(${e.length}, minmax(150px, 1fr));
          gap: 1px;
          flex: 1;
          background: #ddd;
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .semaine-info {
            min-width: 120px;
            max-width: 120px;
            padding: 8px;
          }

          .semaine-dates {
            font-size: 11px;
          }

          .semaine-affectations {
            grid-template-columns: repeat(${e.length}, minmax(120px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .semaine-row {
            flex-direction: row; /* Gardons le layout horizontal même sur mobile */
            min-height: 70px;
          }

          .semaine-info {
            min-width: 100px;
            max-width: 100px;
            padding: 6px;
            font-size: 10px;
          }

          .semaine-dates {
            font-size: 10px;
            line-height: 1.1;
          }

          .semaine-affectations {
            grid-template-columns: repeat(${e.length}, minmax(90px, 1fr));
            overflow-x: visible; /* Le scroll est géré par le parent */
          }

          .semaine-special,
          .unpublished-badge,
          .auto-distribute-btn,
          .all-occupied {
            font-size: 8px;
            padding: 1px 4px;
          }

          .auto-distribute-btn {
            padding: 2px 6px;
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:73,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekRow.jsx",lineNumber:28,columnNumber:5},this)}function Tr(n,e){const t=h.useMemo(()=>{let i=n.affectations;return e.search&&(i=i.filter(a=>(a.familleNom||"").toLowerCase().includes(e.search.toLowerCase()))),e.classe&&(i=i.filter(a=>a.classeId===e.classe)),i},[n.affectations,e]),r=h.useCallback((i,a)=>{},[]);return{filteredAffectations:t,moveAffectation:r}}function Ir({fromAffectation:n,toAffectation:e,onConfirm:t,onCancel:r}){return s.jsxDEV("div",{className:"popup-overlay",children:s.jsxDEV("div",{className:"popup-content",children:[s.jsxDEV("h3",{children:"Confirmer l'échange"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:7,columnNumber:9},this),s.jsxDEV("p",{children:"Voulez-vous échanger :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:8,columnNumber:9},this),s.jsxDEV("div",{className:"exchange-details",children:[s.jsxDEV("div",{className:"exchange-item",children:[s.jsxDEV("strong",{children:"De :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:11,columnNumber:13},this)," ",n.famille,s.jsxDEV("br",{},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:12,columnNumber:13},this),s.jsxDEV("small",{children:["Semaine du ",new Date(n.semaineId).toLocaleDateString("fr-FR")]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:13,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:10,columnNumber:11},this),s.jsxDEV("div",{className:"exchange-arrow",children:"↔️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:15,columnNumber:11},this),s.jsxDEV("div",{className:"exchange-item",children:[s.jsxDEV("strong",{children:"Avec :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:17,columnNumber:13},this)," ",e.famille,s.jsxDEV("br",{},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:18,columnNumber:13},this),s.jsxDEV("small",{children:["Semaine du ",new Date(e.semaineId).toLocaleDateString("fr-FR")]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:19,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:16,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:9,columnNumber:9},this),s.jsxDEV("div",{className:"popup-actions",children:[s.jsxDEV("button",{className:"btn-cancel",onClick:r,children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:23,columnNumber:11},this),s.jsxDEV("button",{className:"btn-confirm",onClick:t,children:"Confirmer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:24,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:22,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:6,columnNumber:7},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ConfirmationPopup.jsx",lineNumber:5,columnNumber:5},this)}function kr({isOpen:n,onClose:e,onConfirm:t,existingAffectation:r,newFamille:i,classe:a,semaine:l}){if(!n)return null;const c=()=>{t(),e()};return s.jsxDEV("div",{className:"modal-overlay",onClick:e,children:[s.jsxDEV("div",{className:"modal-content",onClick:g=>g.stopPropagation(),children:[s.jsxDEV("div",{className:"modal-header",children:[s.jsxDEV("h3",{children:"🔄 Remplacer l'affectation"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:23,columnNumber:11},this),s.jsxDEV("button",{className:"close-btn",onClick:e,children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:24,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:22,columnNumber:9},this),s.jsxDEV("div",{className:"modal-body",children:[s.jsxDEV("div",{className:"warning-icon",children:"⚠️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:28,columnNumber:11},this),s.jsxDEV("div",{className:"message",children:[s.jsxDEV("p",{children:"Cette cellule est déjà occupée. Voulez-vous remplacer l'affectation existante ?"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:32,columnNumber:13},this),s.jsxDEV("div",{className:"affectation-details",children:[s.jsxDEV("div",{className:"cell-info",children:[s.jsxDEV("strong",{children:"📍 Cellule :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:36,columnNumber:17},this)," ",a==null?void 0:a.nom," - Semaine du ",new Date(l==null?void 0:l.debut).toLocaleDateString("fr-FR")]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:35,columnNumber:15},this),s.jsxDEV("div",{className:"change-summary",children:[s.jsxDEV("div",{className:"current-affectation",children:[s.jsxDEV("span",{className:"label",children:"👤 Actuellement :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:41,columnNumber:19},this),s.jsxDEV("div",{className:"famille-info",children:[s.jsxDEV("strong",{children:r==null?void 0:r.familleNom},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:43,columnNumber:21},this),(r==null?void 0:r.numeroNettoyage)&&s.jsxDEV("span",{className:"nettoyage-badge",children:["#",r.numeroNettoyage]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:45,columnNumber:23},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:42,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:40,columnNumber:17},this),s.jsxDEV("div",{className:"arrow",children:"⬇️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:50,columnNumber:17},this),s.jsxDEV("div",{className:"new-affectation",children:[s.jsxDEV("span",{className:"label",children:"🔄 Remplacer par :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:53,columnNumber:19},this),s.jsxDEV("div",{className:"famille-info",children:[s.jsxDEV("strong",{children:i==null?void 0:i.nom},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:55,columnNumber:21},this),s.jsxDEV("span",{className:"new-badge",children:"Nouveau"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:56,columnNumber:21},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:54,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:52,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:39,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:34,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:31,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:27,columnNumber:9},this),s.jsxDEV("div",{className:"modal-footer",children:[s.jsxDEV("button",{className:"btn btn-secondary",onClick:e,children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:65,columnNumber:11},this),s.jsxDEV("button",{className:"btn btn-warning",onClick:c,children:"🔄 Remplacer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:71,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:64,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:21,columnNumber:7},this),s.jsxDEV("style",{jsx:!0,children:`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          max-width: 550px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #333;
        }

        .modal-body {
          padding: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .warning-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .message {
          flex: 1;
        }

        .message p {
          margin: 0 0 16px 0;
          color: #555;
          line-height: 1.5;
        }

        .affectation-details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
        }

        .cell-info {
          background: #e9ecef;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #495057;
        }

        .change-summary {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .current-affectation,
        .new-affectation {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }

        .current-affectation {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
        }

        .new-affectation {
          background: #d4edda;
          border: 1px solid #c3e6cb;
        }

        .label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .famille-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
        }

        .nettoyage-badge {
          background: #ffc107;
          color: #212529;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .new-badge {
          background: #28a745;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .arrow {
          font-size: 20px;
          color: #007bff;
        }

        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid #eee;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .btn-secondary:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn-warning:hover {
          background: #e0a800;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 20px;
            width: calc(100% - 40px);
          }
          
          .modal-body {
            padding: 20px;
          }
          
          .modal-footer {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:80,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/OverwriteConfirmModal.jsx",lineNumber:20,columnNumber:5},this)}function Vr({data:n,filters:e,isAdmin:t,canEdit:r,onCreateAffectation:i,onDeleteAffectation:a,onAutoDistribute:l}){const{filteredAffectations:c,moveAffectation:g}=Tr(n,e),[m,S]=h.useState(null),[E,C]=h.useState({isOpen:!1,newFamille:null,existingAffectation:null,classe:null,semaine:null}),y=(p,x)=>{S({from:p,to:x})},k=()=>{console.log("Échange confirmé:",m),S(null)},f=async(p,x,j)=>{if(r)try{await i(p,x,j)}catch(P){console.error("Erreur lors de l'affectation:",P)}},w=(p,x,j,P)=>{C({isOpen:!0,newFamille:p,existingAffectation:x,classe:j,semaine:P})},b=async()=>{const{newFamille:p,existingAffectation:x,classe:j,semaine:P}=E;try{await a(x.id),await i(p.id,j.id,P.id)}catch(I){console.error("Erreur lors du remplacement:",I)}};return s.jsxDEV("div",{className:"planning-body",children:[n.semaines.map(p=>s.jsxDEV(Cr,{semaine:p,classes:n.classes,affectations:c,onAffectationMove:y,onFamilleDrop:f,onOverwriteRequest:w,isAdmin:t,canEdit:r,onAutoDistribute:l},p.id,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningGrid.jsx",lineNumber:64,columnNumber:9},this)),m&&s.jsxDEV(Ir,{fromAffectation:m.from.affectation,toAffectation:m.to.affectation,onConfirm:k,onCancel:()=>S(null)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningGrid.jsx",lineNumber:79,columnNumber:9},this),s.jsxDEV(kr,{isOpen:E.isOpen,onClose:()=>C({isOpen:!1,newFamille:null,existingAffectation:null,classe:null,semaine:null}),onConfirm:b,existingAffectation:E.existingAffectation,newFamille:E.newFamille,classe:E.classe,semaine:E.semaine},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningGrid.jsx",lineNumber:88,columnNumber:7},this),s.jsxDEV("style",{jsx:!0,children:`
        .planning-body {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningGrid.jsx",lineNumber:98,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningGrid.jsx",lineNumber:62,columnNumber:5},this)}function Rr({filters:n,onFilterChange:e,data:t}){const[r,i]=h.useState(""),[a,l]=h.useState(!1),c=h.useMemo(()=>{const y=new Set(t.affectations.map(k=>k.famille));return Array.from(y).sort()},[t.affectations]),g=h.useMemo(()=>r?c.filter(y=>y.toLowerCase().includes(r.toLowerCase())):c,[c,r]),m=y=>{e({...n,search:y}),i(y),l(!1)},S=()=>{l(!0)},E=()=>{setTimeout(()=>l(!1),200)},C=()=>{e({...n,search:""}),i(""),l(!1)};return s.jsxDEV("div",{className:"view-selector",children:s.jsxDEV("div",{className:"family-filter",children:[s.jsxDEV("div",{className:"family-search-container",children:[s.jsxDEV("input",{type:"text",placeholder:"Rechercher votre famille...",value:r,onChange:y=>{i(y.target.value),l(!0)},onFocus:S,onBlur:E,className:"search-input"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ViewSelector.jsx",lineNumber:51,columnNumber:11},this),a&&r&&s.jsxDEV("div",{className:"family-suggestions",children:g.map(y=>s.jsxDEV("button",{className:`family-suggestion ${n.search===y?"active":""}`,onClick:()=>m(y),onMouseDown:k=>k.preventDefault(),children:y},y,!1,{fileName:"/home/david/Privé/git/planning/src/components/ViewSelector.jsx",lineNumber:66,columnNumber:17},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ViewSelector.jsx",lineNumber:64,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ViewSelector.jsx",lineNumber:50,columnNumber:9},this),n.search&&s.jsxDEV("button",{className:"clear-search",onClick:C,onMouseDown:y=>y.preventDefault(),children:"✕"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ViewSelector.jsx",lineNumber:79,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ViewSelector.jsx",lineNumber:49,columnNumber:7},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ViewSelector.jsx",lineNumber:48,columnNumber:5},this)}function sn({famille:n,isAdmin:e}){const[{isDragging:t},r]=xn({type:"famille",item:{id:n.id,nom:n.nom,type:"famille",telephone:n.telephone,preferences:n.classes_preferences||[]},canDrag:e,collect:i=>({isDragging:i.isDragging()})});return s.jsxDEV("div",{ref:e?r:null,className:`famille-item ${t?"dragging":""} ${e?"":"readonly"}`,style:{opacity:t?.5:1},children:[s.jsxDEV("div",{className:"famille-nom",children:n.nom},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:26,columnNumber:7},this),s.jsxDEV("div",{className:"famille-details",children:[s.jsxDEV("span",{className:"telephone",children:["📞 ",n.telephone]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:28,columnNumber:9},this),s.jsxDEV("span",{className:"nettoyages",children:["🔢 ",n.nb_nettoyage,"/an"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:29,columnNumber:9},this),s.jsxDEV("span",{className:"affectations",children:["📊 ",n.nb_affectations||0]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:30,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:27,columnNumber:7},this),n.preferences_noms&&n.preferences_noms.length>0&&s.jsxDEV("div",{className:"preferences",children:["💚 ",n.preferences_noms.join(", ")]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:33,columnNumber:9},this),e&&s.jsxDEV("div",{className:"drag-hint",children:"⬇️ Glisser vers une cellule"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:38,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:21,columnNumber:5},this)}function Mr({familles:n,isAdmin:e,filters:t,onFilterChange:r}){const[i,a]=h.useState(!1),l=n.filter(m=>m.is_active?t.search?m.nom.toLowerCase().includes(t.search.toLowerCase()):!0:!1),c=l.filter(m=>m.preferences_noms&&m.preferences_noms.length>0),g=l.filter(m=>!m.preferences_noms||m.preferences_noms.length===0);return s.jsxDEV("div",{className:`families-sidebar ${i?"collapsed":""}`,children:[s.jsxDEV("div",{className:"sidebar-header",children:[s.jsxDEV("h4",{children:["👨‍👩‍👧‍👦 Familles (",l.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:69,columnNumber:9},this),s.jsxDEV("button",{className:"collapse-btn",onClick:()=>a(!i),children:i?"→":"←"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:72,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:68,columnNumber:7},this),!i&&s.jsxDEV(s.Fragment,{children:[s.jsxDEV("div",{className:"search-bar",children:s.jsxDEV("input",{type:"text",placeholder:"Rechercher une famille...",value:t.search||"",onChange:m=>r({...t,search:m.target.value})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:84,columnNumber:13},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:83,columnNumber:11},this),e&&s.jsxDEV("div",{className:"drag-instructions",children:["🎯 ",s.jsxDEV("em",{children:"Glissez une famille vers une cellule du planning"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:94,columnNumber:18},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:93,columnNumber:13},this),s.jsxDEV("div",{className:"families-list",children:[c.length>0&&s.jsxDEV("div",{className:"families-group",children:[s.jsxDEV("h5",{children:["💚 Avec préférences (",c.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:102,columnNumber:17},this),c.map(m=>s.jsxDEV(sn,{famille:m,isAdmin:e},m.id,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:104,columnNumber:19},this))]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:101,columnNumber:15},this),g.length>0&&s.jsxDEV("div",{className:"families-group",children:[s.jsxDEV("h5",{children:["⚪ Sans préférences (",g.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:116,columnNumber:17},this),g.map(m=>s.jsxDEV(sn,{famille:m,isAdmin:e},m.id,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:118,columnNumber:19},this))]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:115,columnNumber:15},this),l.length===0&&s.jsxDEV("div",{className:"empty-families",children:[s.jsxDEV("p",{children:"Aucune famille trouvée"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:129,columnNumber:17},this),e&&s.jsxDEV("p",{children:"Utilisez l'interface d'administration pour ajouter des familles."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:131,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:128,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:98,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:81,columnNumber:9},this),s.jsxDEV("style",{jsx:!0,children:`
        .families-sidebar {
          width: 300px;
          background: white;
          border-right: 1px solid #ddd;
          height: 100vh;
          overflow-y: auto;
          position: sticky;
          top: 0;
          transition: width 0.3s ease;
        }

        .families-sidebar.collapsed {
          width: 50px;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h4 {
          margin: 0;
          color: #333;
          font-size: 14px;
        }

        .collapse-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .collapse-btn:hover {
          background: #e9ecef;
        }

        .search-bar {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .search-bar input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .drag-instructions {
          padding: 8px 12px;
          background: #e7f3ff;
          border-bottom: 1px solid #bee5eb;
          font-size: 12px;
          color: #0c5460;
        }

        .families-list {
          padding: 8px;
        }

        .families-group {
          margin-bottom: 16px;
        }

        .families-group h5 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .famille-item {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 6px;
          cursor: ${e?"grab":"default"};
          transition: all 0.2s;
        }

        .famille-item:hover {
          background: ${e?"#e9ecef":"#f8f9fa"};
          border-color: ${e?"#adb5bd":"#dee2e6"};
        }

        .famille-item.dragging {
          transform: rotate(5deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .famille-item.readonly {
          cursor: default;
          opacity: 0.8;
        }

        .famille-nom {
          font-weight: 600;
          color: #333;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .famille-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 10px;
          color: #666;
        }

        .preferences {
          font-size: 10px;
          color: #28a745;
          margin-top: 4px;
          font-weight: 500;
        }

        .drag-hint {
          font-size: 9px;
          color: #007bff;
          text-align: center;
          margin-top: 4px;
          opacity: 0.7;
        }

        .empty-families {
          text-align: center;
          color: #666;
          padding: 20px;
          font-size: 12px;
        }

        .empty-families p {
          margin: 4px 0;
        }

                 @media (max-width: 768px) {
           .families-sidebar {
             width: 100%;
             height: auto;
             max-height: 300px;
             position: relative;
             border-right: none;
             border-bottom: 1px solid #ddd;
             overflow-y: auto;
           }

           .families-sidebar.collapsed {
             width: 100%;
             height: 50px;
             max-height: 50px;
           }

           .families-list {
             max-height: 200px;
             overflow-y: auto;
           }

           .sidebar-header h4 {
             font-size: 12px;
           }

           .famille-item {
             padding: 6px;
             margin-bottom: 4px;
           }

           .famille-nom {
             font-size: 12px;
           }

           .famille-details {
             font-size: 9px;
           }
         }

         @media (max-width: 480px) {
           .families-sidebar {
             max-height: 250px;
           }

           .families-sidebar.collapsed {
             height: 40px;
             max-height: 40px;
           }

           .sidebar-header {
             padding: 12px;
           }

           .sidebar-header h4 {
             font-size: 11px;
           }

           .search-bar {
             padding: 8px;
           }

           .search-bar input {
             padding: 6px;
             font-size: 12px;
           }

           .drag-instructions {
             padding: 6px 8px;
             font-size: 10px;
           }

           .families-list {
             padding: 6px;
             max-height: 150px;
           }

           .famille-item {
             padding: 4px;
             margin-bottom: 3px;
           }

           .famille-nom {
             font-size: 11px;
           }

           .famille-details {
             font-size: 8px;
           }

           .preferences {
             font-size: 8px;
           }

           .drag-hint {
             font-size: 7px;
           }
         }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:139,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamiliesSidebar.jsx",lineNumber:67,columnNumber:5},this)}function Fr(){var W,L,V,_,F,$;const[n,e]=h.useState(()=>new URLSearchParams(window.location.search).get("token")||""),{data:t,loading:r,error:i,isAdmin:a,canEdit:l,loginAdmin:c,logoutAdmin:g,refreshData:m,createAffectation:S,deleteAffectation:E,toggleSemainePublication:C,autoDistributeWeek:y,sessionToken:k}=Pr(n),[f,w]=h.useState({search:""}),[b,p]=h.useState(window.innerWidth<=768),[x,j]=h.useState(!1),[P,I]=h.useState(n);h.useEffect(()=>{const O=()=>{p(window.innerWidth<=768)};return window.addEventListener("resize",O),()=>window.removeEventListener("resize",O)},[]),h.useEffect(()=>{if(n){const O=new URL(window.location);O.searchParams.set("token",n),window.history.replaceState({},"",O)}},[n]);const z=O=>{O.preventDefault(),P.trim()&&e(P.trim())};return n?r?s.jsxDEV("div",{className:"loading-container",children:[s.jsxDEV("div",{className:"spinner"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:176,columnNumber:7},this),s.jsxDEV("p",{children:"Chargement du planning..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:177,columnNumber:7},this),s.jsxDEV("style",{jsx:!0,children:`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 16px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:178,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:175,columnNumber:5},this):i?s.jsxDEV("div",{className:"error-container",children:[s.jsxDEV("h2",{children:"❌ Erreur d'accès"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:207,columnNumber:7},this),s.jsxDEV("p",{children:i},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:208,columnNumber:7},this),s.jsxDEV("button",{onClick:()=>e(""),className:"retry-btn",children:"🔄 Essayer un autre token"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:209,columnNumber:7},this),s.jsxDEV("style",{jsx:!0,children:`
        .error-container {
          text-align: center;
          padding: 40px;
          color: #721c24;
          background: #f8d7da;
          border-radius: 8px;
          margin: 20px;
        }
        
        .retry-btn {
          margin-top: 16px;
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:212,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:206,columnNumber:5},this):s.jsxDEV("div",{className:"planning",children:[s.jsxDEV("div",{className:"planning-header",children:[s.jsxDEV("div",{className:"planning-info",children:[s.jsxDEV("h1",{children:((W=t.planning)==null?void 0:W.name)||"Planning de Nettoyage"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:240,columnNumber:11},this),((L=t.planning)==null?void 0:L.description)&&s.jsxDEV("p",{className:"planning-description",children:t.planning.description},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:242,columnNumber:13},this),((V=t.planning)==null?void 0:V.year)&&s.jsxDEV("span",{className:"planning-year",children:["Année ",t.planning.year]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:245,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:239,columnNumber:9},this),s.jsxDEV("div",{className:"planning-controls",children:[s.jsxDEV("div",{className:"permissions-indicator",children:a?s.jsxDEV("span",{className:"admin-badge",children:"🔧 Administrateur"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:253,columnNumber:15},this):s.jsxDEV("span",{className:"public-badge",children:"👁️ Lecture seule"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:255,columnNumber:15},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:251,columnNumber:11},this),s.jsxDEV("button",{onClick:()=>j(!x),className:`admin-toggle ${x?"active":""}`,children:x?"🔧 Masquer Admin":"⚙️ Administration"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:260,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:249,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:238,columnNumber:7},this),x&&s.jsxDEV(Dn,{token:n,isAdmin:a,canEdit:l,loginAdmin:c,logoutAdmin:g,refreshData:m,toggleSemainePublication:C,planningData:t,sessionToken:k},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:271,columnNumber:9},this),s.jsxDEV(Rr,{filters:f,onFilterChange:w,data:t,isAdmin:a},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:285,columnNumber:7},this),b&&t.classes&&t.classes.length>0&&s.jsxDEV("div",{className:"mobile-legend",children:t.classes.map(O=>s.jsxDEV("div",{className:"legend-item",children:[s.jsxDEV("div",{className:"legend-color",style:{backgroundColor:O.couleur}},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:297,columnNumber:15},this),s.jsxDEV("div",{className:"legend-text",children:O.nom},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:301,columnNumber:15},this)]},O.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:296,columnNumber:13},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:294,columnNumber:9},this),s.jsxDEV("div",{className:"main-layout",children:[t.familles&&t.familles.length>0&&s.jsxDEV(Mr,{familles:t.familles,isAdmin:a,filters:f,onFilterChange:w},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:313,columnNumber:11},this),s.jsxDEV("div",{className:"planning-container",children:t.classes&&t.classes.length>0?s.jsxDEV(s.Fragment,{children:[s.jsxDEV("div",{className:"classes-indicator",children:[s.jsxDEV("span",{className:"classes-count",children:["🏠 ",t.classes.length," classe",t.classes.length>1?"s":""]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:327,columnNumber:17},this),t.classes.length>5&&s.jsxDEV("span",{className:"scroll-hint",children:"↔️ Faites défiler horizontalement"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:331,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:326,columnNumber:15},this),s.jsxDEV("div",{className:"planning-scroll-container",children:s.jsxDEV("div",{className:"planning-grid-wrapper",children:[s.jsxDEV(Sr,{classes:t.classes},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:339,columnNumber:19},this),s.jsxDEV(Vr,{data:t,filters:f,isAdmin:a,canEdit:l,onCreateAffectation:S,onDeleteAffectation:E,onAutoDistribute:y},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:340,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:338,columnNumber:17},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:337,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:324,columnNumber:13},this):s.jsxDEV("div",{className:"empty-planning",children:[s.jsxDEV("h3",{children:"📋 Planning vide"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:354,columnNumber:15},this),s.jsxDEV("p",{children:"Aucune classe ou semaine n'a été configurée pour ce planning."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:355,columnNumber:15},this),a&&s.jsxDEV("p",{children:"Utilisez l'interface d'administration pour configurer les classes et semaines."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:357,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:353,columnNumber:13},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:322,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:310,columnNumber:7},this),s.jsxDEV("style",{jsx:!0,children:`
        .planning {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .planning-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #eee;
        }

        .planning-info h1 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 28px;
        }

        .planning-description {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 16px;
        }

        .planning-year {
          background: #e9ecef;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          color: #495057;
        }

        .planning-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .permissions-indicator {
          font-size: 14px;
        }

        .admin-badge {
          background: #d4edda;
          color: #155724;
          padding: 6px 12px;
          border-radius: 16px;
          font-weight: 500;
        }

        .public-badge {
          background: #e2e3e5;
          color: #495057;
          padding: 6px 12px;
          border-radius: 16px;
          font-weight: 500;
        }

        .admin-toggle {
          padding: 10px 20px;
          border: 2px solid #007bff;
          background: white;
          color: #007bff;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .admin-toggle:hover,
        .admin-toggle.active {
          background: #007bff;
          color: white;
        }

        .mobile-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .legend-text {
          font-size: 12px;
          font-weight: 500;
        }

        .main-layout {
          display: flex;
          gap: 0;
          min-height: 60vh;
        }

        .planning-container {
          flex: 1;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .classes-indicator {
          background: #f8f9fa;
          padding: 8px 16px;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .classes-count {
          color: #495057;
          font-weight: 600;
        }

        .scroll-hint {
          color: #007bff;
          font-style: italic;
        }

        .planning-scroll-container {
          flex: 1;
          overflow-x: auto;
          overflow-y: visible;
          min-width: 0; /* Important pour le flexbox */
          scrollbar-width: thin;
          scrollbar-color: #007bff #f1f1f1;
        }

        .planning-scroll-container::-webkit-scrollbar {
          height: 8px;
        }

        .planning-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .planning-scroll-container::-webkit-scrollbar-thumb {
          background: #007bff;
          border-radius: 4px;
        }

        .planning-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #0056b3;
        }

        .planning-grid-wrapper {
          min-width: ${(_=t.classes)!=null&&_.length?t.classes.length*150+180:800}px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .main-layout {
            flex-direction: column;
          }

          .planning {
            padding: 12px;
            max-width: 100vw;
            overflow-x: hidden;
          }

          .planning-container {
            border-radius: 4px;
          }

          .planning-scroll-container {
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
          }

          .planning-grid-wrapper {
            min-width: ${(F=t.classes)!=null&&F.length?t.classes.length*120+120:600}px;
          }

          .classes-indicator {
            padding: 6px 12px;
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .planning {
            padding: 8px;
          }

          .planning-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .planning-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .planning-info h1 {
            font-size: 20px;
          }

          .planning-grid-wrapper {
            min-width: ${($=t.classes)!=null&&$.length?t.classes.length*100+100:500}px;
          }

          .scroll-hint {
            display: block;
          }
        }

        .empty-planning {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-planning h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .empty-planning p {
          margin: 8px 0;
        }

        @media (max-width: 768px) {
          .planning {
            padding: 12px;
          }

          .planning-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .planning-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .planning-info h1 {
            font-size: 24px;
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:364,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:236,columnNumber:5},this):s.jsxDEV("div",{className:"token-form",children:[s.jsxDEV("div",{className:"token-container",children:[s.jsxDEV("h1",{children:"🔒 Accès au Planning"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:70,columnNumber:11},this),s.jsxDEV("p",{children:"Entrez le token d'accès pour voir le planning :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:71,columnNumber:11},this),s.jsxDEV("form",{onSubmit:z,children:s.jsxDEV("div",{className:"input-group",children:[s.jsxDEV("input",{type:"text",value:P,onChange:O=>I(O.target.value),placeholder:"Token d'accès (ex: abc123...)",required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:75,columnNumber:15},this),s.jsxDEV("button",{type:"submit",children:"🔍 Accéder"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:82,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:74,columnNumber:13},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:73,columnNumber:11},this),s.jsxDEV("div",{className:"help-text",children:[s.jsxDEV("p",{children:"💡 Si vous êtes administrateur d'un planning, vous avez reçu un lien direct avec le token."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:89,columnNumber:13},this),s.jsxDEV("p",{children:"📞 Contactez l'administrateur si vous n'avez pas accès."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:90,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:88,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:69,columnNumber:9},this),s.jsxDEV("style",{jsx:!0,children:`
          .token-form {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .token-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }

          .token-container h1 {
            margin: 0 0 16px 0;
            color: #333;
          }

          .token-container p {
            margin: 0 0 24px 0;
            color: #666;
          }

          .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
          }

          .input-group input {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          }

          .input-group input:focus {
            outline: none;
            border-color: #667eea;
          }

          .input-group button {
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
          }

          .input-group button:hover {
            background: #5a6fd8;
          }

          .help-text {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 6px;
            text-align: left;
          }

          .help-text p {
            margin: 8px 0;
            font-size: 14px;
          }
        `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:94,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/Planning.jsx",lineNumber:68,columnNumber:7},this)}export{zr as D,Fr as P};
