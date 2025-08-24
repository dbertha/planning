import{r as Ve,g as ke}from"./react-vendor-B3V0GjXe.js";var he={exports:{}},ge={},Se;function Ce(){if(Se)return ge;Se=1;/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */return function(){function l(n){if(n==null)return null;if(typeof n=="function")return n.$$typeof===r?null:n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case I:return"Fragment";case V:return"Portal";case B:return"Profiler";case L:return"StrictMode";case A:return"Suspense";case Y:return"SuspenseList"}if(typeof n=="object")switch(typeof n.tag=="number"&&console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."),n.$$typeof){case _:return(n.displayName||"Context")+".Provider";case o:return(n._context.displayName||"Context")+".Consumer";case W:var g=n.render;return n=n.displayName,n||(n=g.displayName||g.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case t:return g=n.displayName||null,g!==null?g:l(n.type)||"Memo";case F:g=n._payload,n=n._init;try{return l(n(g))}catch{}}return null}function k(n){return""+n}function T(n){try{k(n);var g=!1}catch{g=!0}if(g){g=console;var h=g.error,O=typeof Symbol=="function"&&Symbol.toStringTag&&n[Symbol.toStringTag]||n.constructor.name||"Object";return h.call(g,"The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",O),k(n)}}function E(){}function S(){if(re===0){i=console.log,P=console.info,R=console.warn,K=console.error,Q=console.group,ie=console.groupCollapsed,Z=console.groupEnd;var n={configurable:!0,enumerable:!0,value:E,writable:!0};Object.defineProperties(console,{info:n,log:n,warn:n,error:n,group:n,groupCollapsed:n,groupEnd:n})}re++}function j(){if(re--,re===0){var n={configurable:!0,enumerable:!0,writable:!0};Object.defineProperties(console,{log:U({},n,{value:i}),info:U({},n,{value:P}),warn:U({},n,{value:R}),error:U({},n,{value:K}),group:U({},n,{value:Q}),groupCollapsed:U({},n,{value:ie}),groupEnd:U({},n,{value:Z})})}0>re&&console.error("disabledDepth fell below zero. This is a bug in React. Please file an issue.")}function x(n){if(me===void 0)try{throw Error()}catch(h){var g=h.stack.trim().match(/\n( *(at )?)/);me=g&&g[1]||"",ce=-1<h.stack.indexOf(`
    at`)?" (<anonymous>)":-1<h.stack.indexOf("@")?"@unknown:0:0":""}return`
`+me+n+ce}function u(n,g){if(!n||se)return"";var h=ue.get(n);if(h!==void 0)return h;se=!0,h=Error.prepareStackTrace,Error.prepareStackTrace=void 0;var O=null;O=w.H,w.H=null,S();try{var H={DetermineComponentFrameRoot:function(){try{if(g){var ae=function(){throw Error()};if(Object.defineProperty(ae.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(ae,[])}catch(ne){var pe=ne}Reflect.construct(n,[],ae)}else{try{ae.call()}catch(ne){pe=ne}n.call(ae.prototype)}}else{try{throw Error()}catch(ne){pe=ne}(ae=n())&&typeof ae.catch=="function"&&ae.catch(function(){})}}catch(ne){if(ne&&pe&&typeof ne.stack=="string")return[ne.stack,pe.stack]}return[null,null]}};H.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var $=Object.getOwnPropertyDescriptor(H.DetermineComponentFrameRoot,"name");$&&$.configurable&&Object.defineProperty(H.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var D=H.DetermineComponentFrameRoot(),ee=D[0],oe=D[1];if(ee&&oe){var G=ee.split(`
`),le=oe.split(`
`);for(D=$=0;$<G.length&&!G[$].includes("DetermineComponentFrameRoot");)$++;for(;D<le.length&&!le[D].includes("DetermineComponentFrameRoot");)D++;if($===G.length||D===le.length)for($=G.length-1,D=le.length-1;1<=$&&0<=D&&G[$]!==le[D];)D--;for(;1<=$&&0<=D;$--,D--)if(G[$]!==le[D]){if($!==1||D!==1)do if($--,D--,0>D||G[$]!==le[D]){var fe=`
`+G[$].replace(" at new "," at ");return n.displayName&&fe.includes("<anonymous>")&&(fe=fe.replace("<anonymous>",n.displayName)),typeof n=="function"&&ue.set(n,fe),fe}while(1<=$&&0<=D);break}}}finally{se=!1,w.H=O,j(),Error.prepareStackTrace=h}return G=(G=n?n.displayName||n.name:"")?x(G):"",typeof n=="function"&&ue.set(n,G),G}function f(n){if(n==null)return"";if(typeof n=="function"){var g=n.prototype;return u(n,!(!g||!g.isReactComponent))}if(typeof n=="string")return x(n);switch(n){case A:return x("Suspense");case Y:return x("SuspenseList")}if(typeof n=="object")switch(n.$$typeof){case W:return n=u(n.render,!1),n;case t:return f(n.type);case F:g=n._payload,n=n._init;try{return f(n(g))}catch{}}return""}function s(){var n=w.A;return n===null?null:n.getOwner()}function C(n){if(q.call(n,"key")){var g=Object.getOwnPropertyDescriptor(n,"key").get;if(g&&g.isReactWarning)return!1}return n.key!==void 0}function c(n,g){function h(){Ne||(Ne=!0,console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",g))}h.isReactWarning=!0,Object.defineProperty(n,"key",{get:h,configurable:!0})}function y(){var n=l(this.type);return xe[n]||(xe[n]=!0,console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")),n=this.props.ref,n!==void 0?n:null}function b(n,g,h,O,H,$){return h=$.ref,n={$$typeof:N,type:n,key:g,props:$,_owner:H},(h!==void 0?h:null)!==null?Object.defineProperty(n,"ref",{enumerable:!1,get:y}):Object.defineProperty(n,"ref",{enumerable:!1,value:null}),n._store={},Object.defineProperty(n._store,"validated",{configurable:!1,enumerable:!1,writable:!0,value:0}),Object.defineProperty(n,"_debugInfo",{configurable:!1,enumerable:!1,writable:!0,value:null}),Object.freeze&&(Object.freeze(n.props),Object.freeze(n)),n}function M(n,g,h,O,H,$){if(typeof n=="string"||typeof n=="function"||n===I||n===B||n===L||n===A||n===Y||n===J||typeof n=="object"&&n!==null&&(n.$$typeof===F||n.$$typeof===t||n.$$typeof===_||n.$$typeof===o||n.$$typeof===W||n.$$typeof===te||n.getModuleId!==void 0)){var D=g.children;if(D!==void 0)if(O)if(de(D)){for(O=0;O<D.length;O++)z(D[O],n);Object.freeze&&Object.freeze(D)}else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");else z(D,n)}else D="",(n===void 0||typeof n=="object"&&n!==null&&Object.keys(n).length===0)&&(D+=" You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."),n===null?O="null":de(n)?O="array":n!==void 0&&n.$$typeof===N?(O="<"+(l(n.type)||"Unknown")+" />",D=" Did you accidentally export a JSX literal instead of a component?"):O=typeof n,console.error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",O,D);if(q.call(g,"key")){D=l(n);var ee=Object.keys(g).filter(function(G){return G!=="key"});O=0<ee.length?"{key: someKey, "+ee.join(": ..., ")+": ...}":"{key: someKey}",ve[D+O]||(ee=0<ee.length?"{"+ee.join(": ..., ")+": ...}":"{}",console.error(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,O,D,ee,D),ve[D+O]=!0)}if(D=null,h!==void 0&&(T(h),D=""+h),C(g)&&(T(g.key),D=""+g.key),"key"in g){h={};for(var oe in g)oe!=="key"&&(h[oe]=g[oe])}else h=g;return D&&c(h,typeof n=="function"?n.displayName||n.name||"Unknown":n),b(n,D,$,H,s(),h)}function z(n,g){if(typeof n=="object"&&n&&n.$$typeof!==we){if(de(n))for(var h=0;h<n.length;h++){var O=n[h];a(O)&&p(O,g)}else if(a(n))n._store&&(n._store.validated=1);else if(n===null||typeof n!="object"?h=null:(h=X&&n[X]||n["@@iterator"],h=typeof h=="function"?h:null),typeof h=="function"&&h!==n.entries&&(h=h.call(n),h!==n))for(;!(n=h.next()).done;)a(n.value)&&p(n.value,g)}}function a(n){return typeof n=="object"&&n!==null&&n.$$typeof===N}function p(n,g){if(n._store&&!n._store.validated&&n.key==null&&(n._store.validated=1,g=v(g),!je[g])){je[g]=!0;var h="";n&&n._owner!=null&&n._owner!==s()&&(h=null,typeof n._owner.tag=="number"?h=l(n._owner.type):typeof n._owner.name=="string"&&(h=n._owner.name),h=" It was passed a child from "+h+".");var O=w.getCurrentStack;w.getCurrentStack=function(){var H=f(n.type);return O&&(H+=O()||""),H},console.error('Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',g,h),w.getCurrentStack=O}}function v(n){var g="",h=s();return h&&(h=l(h.type))&&(g=`

Check the render method of \``+h+"`."),g||(n=l(n))&&(g=`

Check the top-level render call using <`+n+">."),g}var d=Ve(),N=Symbol.for("react.transitional.element"),V=Symbol.for("react.portal"),I=Symbol.for("react.fragment"),L=Symbol.for("react.strict_mode"),B=Symbol.for("react.profiler"),o=Symbol.for("react.consumer"),_=Symbol.for("react.context"),W=Symbol.for("react.forward_ref"),A=Symbol.for("react.suspense"),Y=Symbol.for("react.suspense_list"),t=Symbol.for("react.memo"),F=Symbol.for("react.lazy"),J=Symbol.for("react.offscreen"),X=Symbol.iterator,r=Symbol.for("react.client.reference"),w=d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q=Object.prototype.hasOwnProperty,U=Object.assign,te=Symbol.for("react.client.reference"),de=Array.isArray,re=0,i,P,R,K,Q,ie,Z;E.__reactDisabledLog=!0;var me,ce,se=!1,ue=new(typeof WeakMap=="function"?WeakMap:Map),we=Symbol.for("react.client.reference"),Ne,xe={},ve={},je={};ge.Fragment=I,ge.jsxDEV=function(n,g,h,O,H,$){return M(n,g,h,O,H,$)}}(),ge}var Ee;function _e(){return Ee||(Ee=1,he.exports=Ce()),he.exports}var e=_e(),m=Ve();const Le=ke(m),be=({familleId:l,familleName:k,planningToken:T,onClose:E})=>{const[S,j]=m.useState([]),[x,u]=m.useState(!0),[f,s]=m.useState({date_debut:"",date_fin:"",type:"indisponibilite",notes:""}),C=[{value:"indisponibilite",label:"🚫 Indisponibilité",color:"#dc3545"},{value:"vacances",label:"🏖️ Vacances",color:"#007bff"},{value:"maladie",label:"🏥 Maladie",color:"#fd7e14"},{value:"autre",label:"❓ Autre",color:"#6c757d"}];m.useEffect(()=>{c()},[l]);const c=async()=>{try{u(!0);const a=await fetch(`/api/familles?token=${T}&action=get_exclusions&famille_id=${l}`);if(a.ok){const p=await a.json();j(p)}else console.error("Erreur lors du chargement des exclusions")}catch(a){console.error("Erreur:",a)}finally{u(!1)}},y=async a=>{if(a.preventDefault(),!f.date_debut||!f.date_fin){alert("Veuillez remplir les dates de début et fin");return}if(new Date(f.date_debut)>new Date(f.date_fin)){alert("La date de début doit être antérieure à la date de fin");return}try{const p=await fetch(`/api/familles?token=${T}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"add_exclusion",famille_id:l,...f})});if(p.ok)await c(),s({date_debut:"",date_fin:"",type:"indisponibilite",notes:""});else{const v=await p.json();alert(`Erreur: ${v.error}`)}}catch(p){console.error("Erreur:",p),alert("Erreur lors de l'ajout de l'exclusion")}},b=async a=>{if(confirm("Êtes-vous sûr de vouloir supprimer cette exclusion ?"))try{const p=await fetch(`/api/familles/${a}?token=${T}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete_exclusion"})});if(p.ok)await c();else{const v=await p.json();alert(`Erreur: ${v.error}`)}}catch(p){console.error("Erreur:",p),alert("Erreur lors de la suppression")}},M=a=>new Date(a).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"}),z=a=>C.find(p=>p.value===a)||C[0];return x?e.jsxDEV("div",{className:"exclusions-manager",children:e.jsxDEV("div",{className:"exclusions-header",children:[e.jsxDEV("h3",{children:"⏳ Chargement..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:123,columnNumber:11},void 0),e.jsxDEV("button",{onClick:E,className:"btn btn-sm",children:"✕"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:124,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:122,columnNumber:9},void 0)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:121,columnNumber:7},void 0):e.jsxDEV("div",{className:"exclusions-manager",children:[e.jsxDEV("div",{className:"exclusions-header",children:[e.jsxDEV("h3",{children:["🚫 Contraintes - ",k]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:133,columnNumber:9},void 0),e.jsxDEV("button",{onClick:E,className:"btn btn-sm",children:"✕"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:134,columnNumber:9},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:132,columnNumber:7},void 0),e.jsxDEV("form",{onSubmit:y,className:"exclusion-form",children:[e.jsxDEV("h4",{children:"➕ Ajouter une contrainte"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:139,columnNumber:9},void 0),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Date début :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:143,columnNumber:13},void 0),e.jsxDEV("input",{type:"date",value:f.date_debut,onChange:a=>s(p=>({...p,date_debut:a.target.value})),required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:144,columnNumber:13},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:142,columnNumber:11},void 0),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Date fin :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:153,columnNumber:13},void 0),e.jsxDEV("input",{type:"date",value:f.date_fin,onChange:a=>s(p=>({...p,date_fin:a.target.value})),required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:154,columnNumber:13},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:152,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:141,columnNumber:9},void 0),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Type :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:164,columnNumber:11},void 0),e.jsxDEV("select",{value:f.type,onChange:a=>s(p=>({...p,type:a.target.value})),children:C.map(a=>e.jsxDEV("option",{value:a.value,children:a.label},a.value,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:170,columnNumber:15},void 0))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:165,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:163,columnNumber:9},void 0),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Notes (optionnel) :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:178,columnNumber:11},void 0),e.jsxDEV("textarea",{value:f.notes,onChange:a=>s(p=>({...p,notes:a.target.value})),placeholder:"Précisions sur la contrainte...",rows:"2"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:179,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:177,columnNumber:9},void 0),e.jsxDEV("button",{type:"submit",className:"btn btn-primary",children:"➕ Ajouter la contrainte"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:187,columnNumber:9},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:138,columnNumber:7},void 0),e.jsxDEV("div",{className:"exclusions-list",children:[e.jsxDEV("h4",{children:["📋 Contraintes existantes (",S.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:194,columnNumber:9},void 0),S.length===0?e.jsxDEV("div",{className:"no-exclusions",children:"✅ Aucune contrainte définie pour cette famille"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:197,columnNumber:11},void 0):e.jsxDEV("div",{className:"exclusions-items",children:S.map(a=>{const p=z(a.type);return e.jsxDEV("div",{className:"exclusion-item",children:[e.jsxDEV("div",{className:"exclusion-info",children:[e.jsxDEV("div",{className:"exclusion-type",style:{color:p.color},children:p.label},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:207,columnNumber:21},void 0),e.jsxDEV("div",{className:"exclusion-dates",children:["📅 Du ",M(a.date_debut)," au ",M(a.date_fin)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:210,columnNumber:21},void 0),a.notes&&e.jsxDEV("div",{className:"exclusion-notes",children:["💬 ",a.notes]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:214,columnNumber:23},void 0),e.jsxDEV("div",{className:"exclusion-meta",children:["Créée le ",M(a.created_at)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:218,columnNumber:21},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:206,columnNumber:19},void 0),e.jsxDEV("button",{onClick:()=>b(a.id),className:"btn btn-danger btn-sm",title:"Supprimer cette contrainte",children:"🗑️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:222,columnNumber:19},void 0)]},a.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:205,columnNumber:17},void 0)})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:201,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:193,columnNumber:7},void 0),e.jsxDEV("style",{jsx:!0,children:`
        .exclusions-manager {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1000;
        }

        .exclusions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #ddd;
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .exclusions-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .exclusion-form {
          padding: 20px;
          border-bottom: 1px solid #eee;
          background: #f9f9f9;
        }

        .exclusion-form h4 {
          margin: 0 0 16px 0;
          color: #007bff;
          font-size: 16px;
        }

        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          flex: 1;
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #555;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 60px;
        }

        .exclusions-list {
          padding: 20px;
        }

        .exclusions-list h4 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 16px;
        }

        .no-exclusions {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          font-style: italic;
        }

        .exclusions-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .exclusion-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }

        .exclusion-info {
          flex: 1;
        }

        .exclusion-type {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .exclusion-dates {
          color: #333;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .exclusion-notes {
          color: #666;
          font-size: 13px;
          margin-bottom: 4px;
          font-style: italic;
        }

        .exclusion-meta {
          color: #999;
          font-size: 12px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .exclusions-manager {
            width: 95%;
            max-height: 90vh;
          }

          .form-row {
            flex-direction: column;
          }

          .exclusion-item {
            flex-direction: column;
            gap: 12px;
          }

          .exclusions-header {
            padding: 12px 16px;
          }

          .exclusion-form, .exclusions-list {
            padding: 16px;
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:236,columnNumber:7},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ExclusionsManager.jsx",lineNumber:131,columnNumber:5},void 0)};function Me({token:l,canEdit:k,refreshData:T,sessionToken:E}){const[S,j]=m.useState([]),[x,u]=m.useState([]),[f,s]=m.useState(!1),[C,c]=m.useState(""),[y,b]=m.useState(!1),[M,z]=m.useState(null),[a,p]=m.useState(null),[v,d]=m.useState(null),[N,V]=m.useState(null),[I,L]=m.useState(!1),[B,o]=m.useState(null),[_,W]=m.useState(""),[A,Y]=m.useState({nom:"",email:"",telephone:"",nb_nettoyage:3,classes_preferences:[],notes:""});m.useEffect(()=>{t(),F()},[l]);const t=async()=>{try{s(!0);const i=await fetch(`/api/familles?token=${l}&action=list`,{headers:{"X-Admin-Session":localStorage.getItem("adminSessionToken")}});if(!i.ok)throw new Error("Erreur lors du chargement des familles");const P=await i.json();j(P)}catch(i){c(i.message)}finally{s(!1)}},F=async()=>{try{const i=await fetch(`/api/planning?token=${l}&type=classes`);if(!i.ok)throw new Error("Erreur lors du chargement des classes");const P=await i.json();u(P)}catch(i){console.error("Erreur chargement classes:",i)}},J=async i=>{if(i.preventDefault(),!A.nom.trim()||!A.telephone.trim()){c("Nom et téléphone sont obligatoires");return}try{s(!0);const P=await fetch("/api/familles",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,action:"create",data:A})});if(!P.ok){const R=await P.json();throw new Error(R.error||"Erreur lors de la création")}Y({nom:"",email:"",telephone:"",nb_nettoyage:3,classes_preferences:[],notes:""}),b(!1),await t()}catch(P){c(P.message)}finally{s(!1)}},X=async()=>{if(!M){c("Veuillez sélectionner un fichier");return}try{s(!0),p(null);const P=(await M.text()).split(`
`).filter(Z=>Z.trim());if(P.length<2)throw new Error("Le fichier doit contenir au moins une ligne d'en-tête et une ligne de données");const R=P[0].split(",").map(Z=>Z.trim().replace(/"/g,"")),K=P.slice(1).map(Z=>{const me=Z.split(",").map(se=>se.trim().replace(/"/g,"")),ce={};return R.forEach((se,ue)=>{ce[se]=me[ue]||""}),ce}),Q=await fetch("/api/familles",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,action:"import",data:{familles:K,filename:M.name}})});if(!Q.ok){const Z=await Q.json();throw new Error(Z.error||"Erreur lors de l'import")}const ie=await Q.json();p(ie),z(null),await t()}catch(i){c(i.message)}finally{s(!1)}},r=async()=>{try{const i=await fetch(`/api/familles?token=${l}&action=template`);if(!i.ok)throw new Error("Erreur lors du téléchargement du template");const P=await i.json(),R=[P.headers.join(","),P.example.map(Z=>`"${Z}"`).join(",")].join(`
`),K=new Blob([R],{type:"text/csv"}),Q=URL.createObjectURL(K),ie=document.createElement("a");ie.href=Q,ie.download="template_familles.csv",ie.click(),URL.revokeObjectURL(Q)}catch(i){c(i.message)}},w=i=>{const P=[...A.classes_preferences],R=P.indexOf(i);R>-1?P.splice(R,1):P.push(i),Y({...A,classes_preferences:P})},q=async i=>{const P=S.find(R=>R.id===i);if(confirm(`Archiver la famille "${P==null?void 0:P.nom}" ?

Les affectations existantes seront conservées mais la famille ne pourra plus être assignée à de nouvelles tâches.`))try{s(!0);const R=await fetch("/api/familles",{method:"PUT",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,id:i,data:{is_active:!1}})});if(!R.ok){const K=await R.json();throw new Error(K.error||"Erreur lors de l'archivage")}await t()}catch(R){c(R.message)}finally{s(!1)}},U=async i=>{try{s(!0);const P=await fetch("/api/familles",{method:"PUT",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,id:i,data:{is_active:!0}})});if(!P.ok){const R=await P.json();throw new Error(R.error||"Erreur lors de la restauration")}await t()}catch(P){c(P.message)}finally{s(!1)}},te=i=>{o(i),W(`Bonjour ${i.nom}, `),L(!0)},de=async()=>{if(!_.trim()){c("Le message SMS ne peut pas être vide");return}try{V(B.id);const i=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":E},body:JSON.stringify({token:l,action:"send_to_famille",data:{famille_id:B.id,template_key:"personnalise",message_personnalise:_,template_data:{nom_famille:B.nom,planning_name:"Planning"}}})}),P=await i.json();if(!i.ok||!P.success)throw new Error(P.error||"Erreur lors de l'envoi du SMS");alert(`SMS envoyé avec succès à ${B.nom} !`),L(!1),W(""),o(null)}catch(i){c(i.message)}finally{V(null)}},re=async()=>{const i=S.filter(R=>R.is_active);if(i.length===0){c("Aucune famille active à contacter");return}const P=prompt(`Envoyer un SMS à ${i.length} familles actives.
Message:`);if(P&&window.confirm(`Confirmer l'envoi du SMS à ${i.length} familles ?`))try{s(!0);const R=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":E},body:JSON.stringify({token:l,action:"send_bulk",data:{template_key:"personnalise",message_personnalise:P,template_data:{planning_name:"Planning"}}})}),K=await R.json();if(!R.ok||!K.success)throw new Error(K.error||"Erreur lors de l'envoi en masse");alert(`SMS envoyés avec succès !
Envoyés: ${K.sent}
Erreurs: ${K.errors}`)}catch(R){c(R.message)}finally{s(!1)}};return e.jsxDEV("div",{className:"familles-manager",children:[e.jsxDEV("div",{className:"manager-header",children:[e.jsxDEV("h3",{children:"👥 Gestion des Familles"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:379,columnNumber:9},this),e.jsxDEV("div",{className:"header-actions",children:[e.jsxDEV("button",{onClick:r,className:"btn btn-secondary",children:"📥 Télécharger Template"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:381,columnNumber:11},this),e.jsxDEV("button",{onClick:()=>b(!y),className:"btn btn-primary",children:"➕ Ajouter Famille"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:384,columnNumber:11},this),e.jsxDEV("button",{onClick:re,className:"btn btn-sms",disabled:!k||!E,title:"Envoyer un SMS à toutes les familles actives",children:"📱 SMS Global"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:387,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:380,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:378,columnNumber:7},this),C&&e.jsxDEV("div",{className:"error-message",children:["⚠️ ",C,e.jsxDEV("button",{onClick:()=>c(""),children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:401,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:399,columnNumber:9},this),e.jsxDEV("div",{className:"import-section",children:[e.jsxDEV("h4",{children:"📊 Import Excel/CSV"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:407,columnNumber:9},this),e.jsxDEV("div",{className:"import-controls",children:[e.jsxDEV("input",{type:"file",accept:".csv,.xlsx,.xls",onChange:i=>z(i.target.files[0]),disabled:f},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:409,columnNumber:11},this),e.jsxDEV("button",{onClick:X,disabled:!M||f,className:"btn btn-success",children:f?"Import...":"Importer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:415,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:408,columnNumber:9},this),a&&e.jsxDEV("div",{className:"import-result",children:[e.jsxDEV("h5",{children:"Résultat de l'import :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:426,columnNumber:13},this),e.jsxDEV("div",{className:"result-stats",children:[e.jsxDEV("span",{className:"stat",children:["📊 Total: ",a.total_lines]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:428,columnNumber:15},this),e.jsxDEV("span",{className:"stat success",children:["✅ Réussis: ",a.success]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:429,columnNumber:15},this),e.jsxDEV("span",{className:"stat error",children:["❌ Erreurs: ",a.errors]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:430,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:427,columnNumber:13},this),a.error_details&&a.error_details.length>0&&e.jsxDEV("div",{className:"error-details",children:[e.jsxDEV("h6",{children:"Détails des erreurs :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:434,columnNumber:17},this),a.error_details.map((i,P)=>e.jsxDEV("div",{className:"error-item",children:["Ligne ",i.ligne," (",i.famille,"): ",i.erreur]},P,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:436,columnNumber:19},this))]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:433,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:425,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:406,columnNumber:7},this),y&&e.jsxDEV("div",{className:"add-form",children:[e.jsxDEV("h4",{children:"➕ Nouvelle Famille"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:449,columnNumber:11},this),e.jsxDEV("form",{onSubmit:J,children:[e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Nom famille *"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:453,columnNumber:17},this),e.jsxDEV("input",{type:"text",value:A.nom,onChange:i=>Y({...A,nom:i.target.value}),required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:454,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:452,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Téléphone *"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:462,columnNumber:17},this),e.jsxDEV("input",{type:"tel",value:A.telephone,onChange:i=>Y({...A,telephone:i.target.value}),required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:463,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:461,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:451,columnNumber:13},this),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Email"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:474,columnNumber:17},this),e.jsxDEV("input",{type:"email",value:A.email,onChange:i=>Y({...A,email:i.target.value})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:475,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:473,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Nb nettoyages/an"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:482,columnNumber:17},this),e.jsxDEV("input",{type:"number",min:"1",max:"10",value:A.nb_nettoyage,onChange:i=>Y({...A,nb_nettoyage:parseInt(i.target.value)})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:483,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:481,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:472,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Classes préférées"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:494,columnNumber:15},this),e.jsxDEV("div",{className:"classes-grid",children:x.map(i=>e.jsxDEV("label",{className:"classe-option",children:[e.jsxDEV("input",{type:"checkbox",checked:A.classes_preferences.includes(i.id),onChange:()=>w(i.id)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:498,columnNumber:21},this),e.jsxDEV("span",{style:{color:i.couleur},children:[i.id," - ",i.nom]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:503,columnNumber:21},this)]},i.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:497,columnNumber:19},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:495,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:493,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Notes"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:512,columnNumber:15},this),e.jsxDEV("textarea",{value:A.notes,onChange:i=>Y({...A,notes:i.target.value}),rows:"3"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:513,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:511,columnNumber:13},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"button",onClick:()=>b(!1),children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:521,columnNumber:15},this),e.jsxDEV("button",{type:"submit",disabled:f,children:f?"Création...":"Créer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:524,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:520,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:450,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:448,columnNumber:9},this),e.jsxDEV("div",{className:"familles-list",children:[e.jsxDEV("h4",{children:["👨‍👩‍👧‍👦 Familles (",S.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:534,columnNumber:9},this),f?e.jsxDEV("div",{className:"loading",children:"Chargement..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:536,columnNumber:11},this):e.jsxDEV("div",{className:"families-grid",children:S.map(i=>e.jsxDEV("div",{className:`famille-card ${i.is_active?"":"archived"}`,children:[e.jsxDEV("div",{className:"famille-header",children:[e.jsxDEV("h5",{children:i.nom},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:542,columnNumber:19},this),e.jsxDEV("div",{className:"famille-actions",children:[e.jsxDEV("button",{onClick:()=>te(i),className:"sms-btn",disabled:!k||!E||N===i.id,title:"Envoyer un SMS à cette famille",children:N===i.id?"⏳":"📱"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:544,columnNumber:21},this),e.jsxDEV("button",{onClick:()=>d(i),className:"exclusions-btn",title:"Gérer les contraintes (dates d'indisponibilité)",children:"🚫"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:552,columnNumber:21},this),i.is_active?e.jsxDEV("button",{onClick:()=>q(i.id),className:"archive-btn",title:"Archiver (conserve les affectations)",children:"📦"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:560,columnNumber:23},this):e.jsxDEV("button",{onClick:()=>U(i.id),className:"restore-btn",title:"Restaurer",children:"↩️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:568,columnNumber:23},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:543,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:541,columnNumber:17},this),e.jsxDEV("div",{className:"famille-info",children:[e.jsxDEV("span",{children:["📞 ",i.telephone]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:580,columnNumber:19},this),i.email&&e.jsxDEV("span",{children:["📧 ",i.email]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:581,columnNumber:37},this),e.jsxDEV("span",{children:["🔢 ",i.nb_nettoyage," nettoyages/an"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:582,columnNumber:19},this),e.jsxDEV("span",{children:["📊 ",i.nb_affectations||0," affectations"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:583,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:579,columnNumber:17},this),i.preferences_noms&&i.preferences_noms.length>0&&e.jsxDEV("div",{className:"preferences",children:[e.jsxDEV("strong",{children:"Préférences:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:587,columnNumber:21},this)," ",i.preferences_noms.join(", ")]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:586,columnNumber:19},this),i.notes&&e.jsxDEV("div",{className:"notes",children:[e.jsxDEV("strong",{children:"Notes:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:592,columnNumber:21},this)," ",i.notes]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:591,columnNumber:19},this),!i.is_active&&e.jsxDEV("div",{className:"archived-badge",children:"📦 Famille archivée"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:596,columnNumber:19},this)]},i.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:540,columnNumber:15},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:538,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:533,columnNumber:7},this),v&&e.jsxDEV(e.Fragment,{children:[e.jsxDEV("div",{className:"modal-overlay",onClick:()=>d(null)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:609,columnNumber:11},this),e.jsxDEV(be,{familleId:v.id,familleName:v.nom,planningToken:l,onClose:()=>d(null)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:610,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:608,columnNumber:9},this),I&&B&&e.jsxDEV("div",{className:"modal-overlay",onClick:()=>L(!1),children:e.jsxDEV("div",{className:"sms-modal",onClick:i=>i.stopPropagation(),children:[e.jsxDEV("div",{className:"modal-header",children:[e.jsxDEV("h4",{children:["📱 Envoyer SMS à ",B.nom]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:624,columnNumber:15},this),e.jsxDEV("button",{onClick:()=>L(!1),className:"close-btn",children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:625,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:623,columnNumber:13},this),e.jsxDEV("div",{className:"modal-content",children:[e.jsxDEV("div",{className:"famille-contact-info",children:[e.jsxDEV("p",{children:[e.jsxDEV("strong",{children:"📞 Téléphone:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:634,columnNumber:20},this)," ",B.telephone]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:634,columnNumber:17},this),B.email&&e.jsxDEV("p",{children:[e.jsxDEV("strong",{children:"📧 Email:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:636,columnNumber:22},this)," ",B.email]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:636,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:633,columnNumber:15},this),e.jsxDEV("textarea",{value:_,onChange:i=>W(i.target.value),placeholder:"Tapez votre message SMS...",rows:4,maxLength:160,className:"sms-textarea"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:639,columnNumber:15},this),e.jsxDEV("div",{className:"sms-info",children:e.jsxDEV("span",{children:[_.length,"/160 caractères"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:648,columnNumber:17},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:647,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:632,columnNumber:13},this),e.jsxDEV("div",{className:"modal-actions",children:[e.jsxDEV("button",{onClick:()=>L(!1),className:"btn btn-secondary",children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:652,columnNumber:15},this),e.jsxDEV("button",{onClick:de,className:"btn btn-primary",disabled:!_.trim()||N,children:N?"⏳ Envoi...":"📱 Envoyer SMS"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:658,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:651,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:622,columnNumber:11},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:621,columnNumber:9},this),e.jsxDEV("style",{jsx:!0,children:`
        .familles-manager {
          max-width: 1200px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .manager-header h3 {
          margin: 0;
          color: #333;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .import-section {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .import-section h4 {
          margin: 0 0 12px 0;
          color: #333;
        }

        .import-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 12px;
        }

        .import-result {
          background: white;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .result-stats {
          display: flex;
          gap: 15px;
          margin: 8px 0;
        }

        .stat {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .stat.success {
          background: #d4edda;
          color: #155724;
        }

        .stat.error {
          background: #f8d7da;
          color: #721c24;
        }

        .error-details {
          margin-top: 10px;
          font-size: 12px;
        }

        .error-item {
          padding: 2px 0;
          color: #721c24;
        }

        .add-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .add-form h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }

        .classe-option {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .families-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .famille-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 16px;
        }

        .famille-card.archived {
          opacity: 0.7;
          background: #f8f9fa;
          border-color: #adb5bd;
        }

        .famille-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .famille-actions {
          display: flex;
          gap: 8px;
        }

        .archive-btn, .restore-btn, .exclusions-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .archive-btn:hover {
          background: #fff3cd;
        }

        .restore-btn:hover {
          background: #d4edda;
        }

        .exclusions-btn:hover {
          background: #f8d7da;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .archived-badge {
          background: #6c757d;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          margin-top: 8px;
          text-align: center;
        }

        .famille-card h5 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .famille-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .preferences,
        .notes {
          font-size: 12px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #eee;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-sms {
          background: #17a2b8;
          color: white;
        }

        .sms-btn {
          background: #17a2b8;
          color: white;
          padding: 4px 8px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }

        .sms-btn:hover:not(:disabled) {
          background: #138496;
        }

        .sms-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sms-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 8px;
          padding: 0;
          min-width: 400px;
          max-width: 500px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h4 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .close-btn:hover {
          background: #f0f0f0;
        }

        .modal-content {
          padding: 20px;
        }

        .famille-contact-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 15px;
        }

        .famille-contact-info p {
          margin: 5px 0;
          font-size: 14px;
        }

        .sms-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
        }

        .sms-info {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
          text-align: right;
        }

        .modal-actions {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:670,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/FamillesManager.jsx",lineNumber:377,columnNumber:5},this)}function Pe({token:l,canEdit:k,refreshData:T}){const[E,S]=m.useState([]),[j,x]=m.useState(!1),[u,f]=m.useState(""),[s,C]=m.useState(!1),[c,y]=m.useState({id:"",nom:"",couleur:"#ffcccb",ordre:0,description:"",instructions_pdf_url:""}),b=["#ffcccb","#ffd700","#90ee90","#ff6961","#87ceeb","#dda0dd","#98fb98","#f0e68c","#ff7f50","#20b2aa"];m.useEffect(()=>{M()},[l]);const M=async()=>{try{x(!0);const d=await fetch(`/api/planning?token=${l}&type=classes`);if(!d.ok)throw new Error("Erreur lors du chargement des classes");const N=await d.json();S(N)}catch(d){f(d.message)}finally{x(!1)}},z=async d=>{if(d.preventDefault(),!c.id.trim()||!c.nom.trim()){f("ID et nom sont obligatoires");return}if(E.some(N=>N.id===c.id)){f("Cet ID de classe existe déjà");return}try{x(!0);const N=await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,type:"classe",data:c})});if(!N.ok){const V=await N.json();throw new Error(V.error||"Erreur lors de la création")}y({id:"",nom:"",couleur:"#ffcccb",ordre:0,description:"",instructions_pdf_url:""}),C(!1),await M()}catch(N){f(N.message)}finally{x(!1)}},a=async d=>{if(confirm(`Êtes-vous sûr de vouloir supprimer la classe ${d} ?`))try{x(!0);const N=await fetch("/api/planning",{method:"DELETE",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,type:"classe",id:d})});if(!N.ok){const V=await N.json();throw new Error(V.error||"Erreur lors de la suppression")}await M()}catch(N){f(N.message)}finally{x(!1)}},p=()=>{S([{id:"A",nom:"Partie A - Rez-de-chaussée",couleur:"#ffcccb",ordre:1},{id:"B",nom:"Partie B - Cuisine",couleur:"#ffd700",ordre:2},{id:"C",nom:"Partie C - 1er étage",couleur:"#90ee90",ordre:3},{id:"D",nom:"Partie D - 2ème étage",couleur:"#ff6961",ordre:4},{id:"E",nom:"Partie E - Extérieur",couleur:"#87ceeb",ordre:5}]),C(!1)},v=async()=>{try{x(!0);for(const d of E)if(d.id)try{await fetch("/api/planning",{method:"DELETE",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,type:"classe",id:d.id})})}catch{}for(const d of E)await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,type:"classe",data:d})});await M()}catch(d){f(d.message)}finally{x(!1)}};return e.jsxDEV("div",{className:"classes-manager",children:[e.jsxDEV("div",{className:"manager-header",children:[e.jsxDEV("h3",{children:"🏠 Gestion des Classes"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:196,columnNumber:9},this),e.jsxDEV("div",{className:"header-actions",children:[e.jsxDEV("button",{onClick:p,className:"btn btn-secondary",children:"📋 Template Standard"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:198,columnNumber:11},this),e.jsxDEV("button",{onClick:()=>C(!s),className:"btn btn-primary",children:"➕ Ajouter Classe"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:201,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:197,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:195,columnNumber:7},this),u&&e.jsxDEV("div",{className:"error-message",children:["⚠️ ",u,e.jsxDEV("button",{onClick:()=>f(""),children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:210,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:208,columnNumber:9},this),s&&e.jsxDEV("div",{className:"add-form",children:[e.jsxDEV("h4",{children:"➕ Nouvelle Classe"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:217,columnNumber:11},this),e.jsxDEV("form",{onSubmit:z,children:[e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"ID classe *"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:221,columnNumber:17},this),e.jsxDEV("input",{type:"text",value:c.id,onChange:d=>y({...c,id:d.target.value.toUpperCase()}),placeholder:"A, B, C...",maxLength:"10",required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:222,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:220,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Ordre d'affichage"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:232,columnNumber:17},this),e.jsxDEV("input",{type:"number",value:c.ordre,onChange:d=>y({...c,ordre:parseInt(d.target.value)}),min:"0"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:233,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:231,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:219,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Nom de la classe *"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:243,columnNumber:15},this),e.jsxDEV("input",{type:"text",value:c.nom,onChange:d=>y({...c,nom:d.target.value}),placeholder:"Partie A - Rez-de-chaussée",required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:244,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:242,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Couleur"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:254,columnNumber:15},this),e.jsxDEV("div",{className:"color-selection",children:[e.jsxDEV("input",{type:"color",value:c.couleur,onChange:d=>y({...c,couleur:d.target.value})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:256,columnNumber:17},this),e.jsxDEV("div",{className:"predefined-colors",children:b.map(d=>e.jsxDEV("button",{type:"button",className:`color-btn ${c.couleur===d?"active":""}`,style:{backgroundColor:d},onClick:()=>y({...c,couleur:d})},d,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:263,columnNumber:21},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:261,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:255,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:253,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Description"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:276,columnNumber:15},this),e.jsxDEV("textarea",{value:c.description,onChange:d=>y({...c,description:d.target.value}),rows:"3",placeholder:"Description détaillée de la zone..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:277,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:275,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"📄 Instructions PDF (URL)"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:286,columnNumber:15},this),e.jsxDEV("input",{type:"url",value:c.instructions_pdf_url,onChange:d=>y({...c,instructions_pdf_url:d.target.value}),placeholder:"https://example.com/instructions-classe-A.pdf"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:287,columnNumber:15},this),e.jsxDEV("small",{children:"URL vers un PDF avec les instructions de nettoyage pour cette classe"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:293,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:285,columnNumber:13},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"button",onClick:()=>C(!1),children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:297,columnNumber:15},this),e.jsxDEV("button",{type:"submit",disabled:j,children:j?"Création...":"Créer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:300,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:296,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:218,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:216,columnNumber:9},this),e.jsxDEV("div",{className:"classes-list",children:[e.jsxDEV("div",{className:"list-header",children:[e.jsxDEV("h4",{children:["🏗️ Classes (",E.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:311,columnNumber:11},this),E.length>0&&e.jsxDEV("button",{onClick:v,className:"btn btn-success",disabled:j,children:"💾 Sauvegarder tout"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:313,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:310,columnNumber:9},this),j?e.jsxDEV("div",{className:"loading",children:"Chargement..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:320,columnNumber:11},this):e.jsxDEV("div",{className:"classes-grid",children:E.map((d,N)=>e.jsxDEV("div",{className:"classe-card",children:[e.jsxDEV("div",{className:"classe-header",children:[e.jsxDEV("div",{className:"classe-id",style:{backgroundColor:d.couleur},children:d.id},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:326,columnNumber:19},this),e.jsxDEV("div",{className:"classe-info",children:[e.jsxDEV("h5",{children:d.nom},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:330,columnNumber:21},this),e.jsxDEV("span",{className:"ordre",children:["Ordre: ",d.ordre]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:331,columnNumber:21},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:329,columnNumber:19},this),e.jsxDEV("button",{onClick:()=>a(d.id),className:"delete-btn",title:"Supprimer",children:"🗑️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:333,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:325,columnNumber:17},this),d.description&&e.jsxDEV("div",{className:"classe-description",children:d.description},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:343,columnNumber:19},this),d.instructions_pdf_url&&e.jsxDEV("div",{className:"classe-pdf",children:e.jsxDEV("a",{href:d.instructions_pdf_url,target:"_blank",rel:"noopener noreferrer",className:"pdf-link",children:"📄 Instructions PDF"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:350,columnNumber:21},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:349,columnNumber:19},this),e.jsxDEV("div",{className:"classe-meta",children:[e.jsxDEV("span",{style:{color:d.couleur},children:"●"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:362,columnNumber:19},this),e.jsxDEV("span",{children:["Couleur: ",d.couleur]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:363,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:361,columnNumber:17},this)]},d.id||N,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:324,columnNumber:15},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:322,columnNumber:11},this),E.length===0&&!j&&e.jsxDEV("div",{className:"empty-state",children:[e.jsxDEV("p",{children:"Aucune classe définie"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:372,columnNumber:13},this),e.jsxDEV("p",{children:"Utilisez le template standard ou créez vos propres classes."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:373,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:371,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:309,columnNumber:7},this),e.jsxDEV("style",{jsx:!0,children:`
        .classes-manager {
          max-width: 1200px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .manager-header h3 {
          margin: 0;
          color: #333;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .add-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .add-form h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .color-selection {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .predefined-colors {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .color-btn {
          width: 24px;
          height: 24px;
          border: 2px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-btn.active,
        .color-btn:hover {
          border-color: #007bff;
          transform: scale(1.1);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .list-header h4 {
          margin: 0;
          color: #333;
        }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .classe-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 16px;
        }

        .classe-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .classe-id {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #333;
          flex-shrink: 0;
        }

        .classe-info {
          flex: 1;
        }

        .classe-info h5 {
          margin: 0 0 4px 0;
          color: #333;
        }

        .ordre {
          font-size: 12px;
          color: #666;
        }

        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .delete-btn:hover {
          background: #f8d7da;
        }

        .classe-description {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .classe-pdf {
          margin-bottom: 8px;
        }

        .pdf-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #007bff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
          border: 1px solid #007bff;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .pdf-link:hover {
          background: #007bff;
          color: white;
        }

        .classe-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px 20px;
        }

        .empty-state p {
          margin: 8px 0;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:378,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ClassesManager.jsx",lineNumber:194,columnNumber:5},this)}function Fe({isOpen:l,onClose:k,onConfirm:T,title:E="Confirmer la suppression",message:S,itemName:j,confirmText:x="Supprimer",cancelText:u="Annuler",danger:f=!0}){if(!l)return null;const s=()=>{T(),k()};return e.jsxDEV("div",{className:"modal-overlay",onClick:k,children:[e.jsxDEV("div",{className:"modal-content",onClick:C=>C.stopPropagation(),children:[e.jsxDEV("div",{className:"modal-header",children:[e.jsxDEV("h3",{children:E},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:25,columnNumber:11},this),e.jsxDEV("button",{className:"close-btn",onClick:k,children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:26,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:24,columnNumber:9},this),e.jsxDEV("div",{className:"modal-body",children:[e.jsxDEV("div",{className:"warning-icon",children:"⚠️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:30,columnNumber:11},this),e.jsxDEV("div",{className:"message",children:[e.jsxDEV("p",{children:S},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:34,columnNumber:13},this),j&&e.jsxDEV("div",{className:"item-highlight",children:e.jsxDEV("strong",{children:j},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:37,columnNumber:17},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:36,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:33,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:29,columnNumber:9},this),e.jsxDEV("div",{className:"modal-footer",children:[e.jsxDEV("button",{className:"btn btn-secondary",onClick:k,children:u},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:44,columnNumber:11},this),e.jsxDEV("button",{className:`btn ${f?"btn-danger":"btn-primary"}`,onClick:s,children:x},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:50,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:43,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:23,columnNumber:7},this),e.jsxDEV("style",{jsx:!0,children:`
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
          max-width: 500px;
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
          margin: 0 0 12px 0;
          color: #555;
          line-height: 1.5;
        }

        .item-highlight {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 8px 12px;
          font-family: 'Courier New', monospace;
          color: #495057;
          font-size: 14px;
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
          min-width: 80px;
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

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
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
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:59,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/DeleteConfirmModal.jsx",lineNumber:22,columnNumber:5},this)}function De({token:l,canEdit:k,refreshData:T,toggleSemainePublication:E}){const[S,j]=m.useState([]),[x,u]=m.useState(!1),[f,s]=m.useState(""),[C,c]=m.useState(!1),[y,b]=m.useState(!1),[M,z]=m.useState({isOpen:!1,semaineId:null,semaineName:null}),[a,p]=m.useState({id:"",debut:"",fin:"",type:"nettoyage",description:"",is_published:!1}),[v,d]=m.useState({start_date:"",end_date:"",type:"nettoyage",exclude_holidays:!0,custom_weeks:[]});m.useEffect(()=>{N()},[l]);const N=async()=>{try{u(!0);const t=await fetch(`/api/planning?token=${l}&type=semaines`,{headers:{"X-Admin-Session":localStorage.getItem("adminSessionToken")}});if(!t.ok)throw new Error("Erreur lors du chargement des semaines");const F=await t.json();j(F)}catch(t){s(t.message)}finally{u(!1)}},V=async t=>{if(t.preventDefault(),!a.id.trim()||!a.debut||!a.fin){s("ID, date de début et fin sont obligatoires");return}if(S.some(F=>F.id===a.id)){s("Cet ID de semaine existe déjà");return}if(new Date(a.fin)<=new Date(a.debut)){s("La date de fin doit être après la date de début");return}try{u(!0);const F=await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,type:"semaine",data:a})});if(!F.ok){const J=await F.json();throw new Error(J.error||"Erreur lors de la création")}p({id:"",debut:"",fin:"",type:"nettoyage",description:"",is_published:!1}),c(!1),await N()}catch(F){s(F.message)}finally{u(!1)}},I=async(t,F)=>{try{u(!0),await E(t,!F)}catch(J){s(J.message)}finally{u(!1)}},L=async t=>{const F=S.find(J=>J.id===t);z({isOpen:!0,semaineId:t,semaineName:`${t} (${F==null?void 0:F.debut} - ${F==null?void 0:F.fin})`})},B=async()=>{const t=M.semaineId;try{u(!0);const F=await fetch("/api/planning",{method:"DELETE",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,type:"semaine",id:t})});if(!F.ok){const J=await F.json();throw new Error(J.error||"Erreur lors de la suppression")}await N()}catch(F){s(F.message)}finally{u(!1)}},o=t=>{const F=new Date(t),J=F.getFullYear(),X=String(F.getMonth()+1).padStart(2,"0"),r=String(F.getDate()).padStart(2,"0");return`${J}-${X}-${r}`},_=()=>{if(!v.start_date||!v.end_date){s("Dates de début et fin requises pour la génération en lot");return}const t=new Date(v.start_date),F=new Date(v.end_date),J=[];let X=new Date(t);for(;X.getDay()!==1;)X.setDate(X.getDate()+1);for(;X<=F;){const r=new Date(X),w=new Date(X);w.setDate(w.getDate()+6);const q=o(r);S.some(U=>U.id===q)||J.push({id:q,debut:r.toISOString().split("T")[0],fin:w.toISOString().split("T")[0],type:v.type,description:`Semaine du ${r.toLocaleDateString("fr-FR")}`,is_published:!1}),X.setDate(X.getDate()+7)}d({...v,custom_weeks:J})},W=async()=>{try{u(!0);for(const t of v.custom_weeks)await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":localStorage.getItem("adminSessionToken")},body:JSON.stringify({token:l,type:"semaine",data:t})});d({start_date:"",end_date:"",type:"nettoyage",exclude_holidays:!0,custom_weeks:[]}),b(!1),await N()}catch(t){s(t.message)}finally{u(!1)}},A=S.filter(t=>t.is_published).length,Y=S.length-A;return e.jsxDEV("div",{className:"semaines-manager",children:[e.jsxDEV("div",{className:"manager-header",children:[e.jsxDEV("h3",{children:"📅 Gestion des Semaines"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:257,columnNumber:9},this),e.jsxDEV("div",{className:"header-actions",children:[e.jsxDEV("button",{onClick:()=>b(!y),className:"btn btn-secondary",children:"📋 Génération en lot"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:259,columnNumber:11},this),e.jsxDEV("button",{onClick:()=>c(!C),className:"btn btn-primary",children:"➕ Ajouter Semaine"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:262,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:258,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:256,columnNumber:7},this),f&&e.jsxDEV("div",{className:"error-message",children:["⚠️ ",f,e.jsxDEV("button",{onClick:()=>s(""),children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:271,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:269,columnNumber:9},this),e.jsxDEV("div",{className:"stats-bar",children:[e.jsxDEV("div",{className:"stat",children:["📊 Total: ",S.length]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:277,columnNumber:9},this),e.jsxDEV("div",{className:"stat published",children:["✅ Publiées: ",A]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:280,columnNumber:9},this),e.jsxDEV("div",{className:"stat unpublished",children:["🔒 Non publiées: ",Y]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:283,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:276,columnNumber:7},this),y&&e.jsxDEV("div",{className:"bulk-form",children:[e.jsxDEV("h4",{children:"📋 Génération en lot"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:291,columnNumber:11},this),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Date début"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:294,columnNumber:15},this),e.jsxDEV("input",{type:"date",value:v.start_date,onChange:t=>d({...v,start_date:t.target.value})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:295,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:293,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Date fin"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:302,columnNumber:15},this),e.jsxDEV("input",{type:"date",value:v.end_date,onChange:t=>d({...v,end_date:t.target.value})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:303,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:301,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Type"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:310,columnNumber:15},this),e.jsxDEV("select",{value:v.type,onChange:t=>d({...v,type:t.target.value}),children:[e.jsxDEV("option",{value:"nettoyage",children:"Nettoyage"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:315,columnNumber:17},this),e.jsxDEV("option",{value:"vacances",children:"Vacances"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:316,columnNumber:17},this),e.jsxDEV("option",{value:"special",children:"Spécial"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:317,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:311,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:309,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:292,columnNumber:11},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"button",onClick:()=>b(!1),children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:323,columnNumber:13},this),e.jsxDEV("button",{onClick:_,disabled:x,children:"🔍 Prévisualiser"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:326,columnNumber:13},this),v.custom_weeks.length>0&&e.jsxDEV("button",{onClick:W,disabled:x,className:"btn-success",children:["💾 Créer ",v.custom_weeks.length," semaines"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:330,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:322,columnNumber:11},this),v.custom_weeks.length>0&&e.jsxDEV("div",{className:"preview",children:[e.jsxDEV("h5",{children:["Prévisualisation (",v.custom_weeks.length," semaines) :"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:338,columnNumber:15},this),e.jsxDEV("div",{className:"preview-list",children:[v.custom_weeks.slice(0,5).map(t=>e.jsxDEV("div",{className:"preview-item",children:[t.id,": ",t.debut," → ",t.fin]},t.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:341,columnNumber:19},this)),v.custom_weeks.length>5&&e.jsxDEV("div",{className:"preview-item",children:["... et ",v.custom_weeks.length-5," autres"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:346,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:339,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:337,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:290,columnNumber:9},this),C&&e.jsxDEV("div",{className:"add-form",children:[e.jsxDEV("h4",{children:"➕ Nouvelle Semaine"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:357,columnNumber:11},this),e.jsxDEV("form",{onSubmit:V,children:[e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"ID semaine *"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:361,columnNumber:17},this),e.jsxDEV("input",{type:"text",value:a.id,onChange:t=>p({...a,id:t.target.value}),placeholder:"2024-01-15",required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:362,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:360,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Type"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:371,columnNumber:17},this),e.jsxDEV("select",{value:a.type,onChange:t=>p({...a,type:t.target.value}),children:[e.jsxDEV("option",{value:"nettoyage",children:"Nettoyage"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:376,columnNumber:19},this),e.jsxDEV("option",{value:"vacances",children:"Vacances"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:377,columnNumber:19},this),e.jsxDEV("option",{value:"special",children:"Spécial"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:378,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:372,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:370,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:359,columnNumber:13},this),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Date début *"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:385,columnNumber:17},this),e.jsxDEV("input",{type:"date",value:a.debut,onChange:t=>{p({...a,debut:t.target.value,id:o(t.target.value)})},required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:386,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:384,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Date fin *"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:400,columnNumber:17},this),e.jsxDEV("input",{type:"date",value:a.fin,onChange:t=>p({...a,fin:t.target.value}),required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:401,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:399,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:383,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Description"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:411,columnNumber:15},this),e.jsxDEV("input",{type:"text",value:a.description,onChange:t=>p({...a,description:t.target.value}),placeholder:"Semaine de nettoyage du..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:412,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:410,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:e.jsxDEV("label",{className:"checkbox-label",children:[e.jsxDEV("input",{type:"checkbox",checked:a.is_published,onChange:t=>p({...a,is_published:t.target.checked})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:422,columnNumber:17},this),"Publier immédiatement"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:421,columnNumber:15},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:420,columnNumber:13},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"button",onClick:()=>c(!1),children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:432,columnNumber:15},this),e.jsxDEV("button",{type:"submit",disabled:x,children:x?"Création...":"Créer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:435,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:431,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:358,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:356,columnNumber:9},this),e.jsxDEV("div",{className:"semaines-list",children:[e.jsxDEV("h4",{children:["📋 Semaines (",S.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:445,columnNumber:9},this),x?e.jsxDEV("div",{className:"loading",children:"Chargement..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:447,columnNumber:11},this):e.jsxDEV("div",{className:"semaines-grid",children:S.map(t=>e.jsxDEV("div",{className:`semaine-card ${t.is_published?"published":"unpublished"}`,children:[e.jsxDEV("div",{className:"semaine-header",children:[e.jsxDEV("div",{className:"semaine-id",children:t.id},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:453,columnNumber:19},this),e.jsxDEV("div",{className:"semaine-status",children:t.is_published?"✅ Publiée":"🔒 Privée"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:456,columnNumber:19},this),e.jsxDEV("button",{onClick:()=>L(t.id),className:"delete-btn",title:"Supprimer",children:"🗑️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:459,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:452,columnNumber:17},this),e.jsxDEV("div",{className:"semaine-dates",children:["Du ",new Date(t.debut).toLocaleDateString("fr-FR"),"au ",new Date(t.fin).toLocaleDateString("fr-FR")]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:468,columnNumber:17},this),e.jsxDEV("div",{className:"semaine-type",children:["Type: ",t.type]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:473,columnNumber:17},this),t.description&&e.jsxDEV("div",{className:"semaine-description",children:t.description},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:478,columnNumber:19},this),t.published_at&&e.jsxDEV("div",{className:"published-at",children:["Publiée le: ",new Date(t.published_at).toLocaleDateString("fr-FR")]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:484,columnNumber:19},this),e.jsxDEV("div",{className:"semaine-actions",children:e.jsxDEV("button",{onClick:()=>I(t.id,t.is_published),className:`btn ${t.is_published?"btn-warning":"btn-success"}`,disabled:x,children:t.is_published?"🔒 Dépublier":"✅ Publier"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:490,columnNumber:19},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:489,columnNumber:17},this)]},t.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:451,columnNumber:15},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:449,columnNumber:11},this),S.length===0&&!x&&e.jsxDEV("div",{className:"empty-state",children:[e.jsxDEV("p",{children:"Aucune semaine définie"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:505,columnNumber:13},this),e.jsxDEV("p",{children:"Utilisez la génération en lot ou créez des semaines individuellement."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:506,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:504,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:444,columnNumber:7},this),e.jsxDEV(Fe,{isOpen:M.isOpen,onClose:()=>z({isOpen:!1,semaineId:null,semaineName:null}),onConfirm:B,title:"Supprimer la semaine",message:"Êtes-vous sûr de vouloir supprimer cette semaine ? Cette action est irréversible.",itemName:M.semaineName,confirmText:"Supprimer la semaine",cancelText:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:512,columnNumber:7},this),e.jsxDEV("style",{jsx:!0,children:`
        .semaines-manager {
          max-width: 1200px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .manager-header h3 {
          margin: 0;
          color: #333;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .stats-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .stat {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
        }

        .stat.published {
          background: #d4edda;
          color: #155724;
        }

        .stat.unpublished {
          background: #f8d7da;
          color: #721c24;
        }

        .bulk-form,
        .add-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .bulk-form h4,
        .add-form h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #333;
        }

        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .preview {
          margin-top: 16px;
          padding: 12px;
          background: white;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .preview h5 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .preview-list {
          font-size: 12px;
          color: #666;
        }

        .preview-item {
          padding: 2px 0;
        }

        .semaines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .semaine-card {
          background: white;
          border: 2px solid #ddd;
          border-radius: 6px;
          padding: 16px;
          transition: all 0.2s;
        }

        .semaine-card.published {
          border-color: #28a745;
          background: #f8fff9;
        }

        .semaine-card.unpublished {
          border-color: #ffc107;
          background: #fffef8;
        }

        .semaine-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .semaine-id {
          font-weight: bold;
          color: #333;
        }

        .semaine-status {
          font-size: 12px;
          font-weight: 500;
        }

        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .delete-btn:hover {
          background: #f8d7da;
        }

        .semaine-dates {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
        }

        .semaine-type {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .semaine-description {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          font-style: italic;
        }

        .published-at {
          font-size: 11px;
          color: #999;
          margin-bottom: 12px;
        }

        .semaine-actions {
          display: flex;
          gap: 8px;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px 20px;
        }

        .empty-state p {
          margin: 8px 0;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:523,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SemainesManager.jsx",lineNumber:255,columnNumber:5},this)}function Te({onLogin:l,onClose:k}){const[T,E]=m.useState(""),[S,j]=m.useState(!1),[x,u]=m.useState(""),f=async s=>{if(s.preventDefault(),!T.trim()){u("Mot de passe requis");return}j(!0),u("");try{const C=await l(T);C.success||u(C.error||"Erreur de connexion")}catch{u("Erreur de connexion")}finally{j(!1)}};return e.jsxDEV("div",{className:"modal-overlay",onClick:k,children:e.jsxDEV("div",{className:"modal-content",onClick:s=>s.stopPropagation(),children:[e.jsxDEV("div",{className:"modal-header",children:[e.jsxDEV("h3",{children:"🔑 Connexion Administrateur"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:34,columnNumber:11},this),e.jsxDEV("button",{onClick:k,className:"close-btn",children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:35,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:33,columnNumber:9},this),e.jsxDEV("form",{onSubmit:f,className:"login-form",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"password",children:"Mot de passe admin :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:40,columnNumber:13},this),e.jsxDEV("input",{type:"password",id:"password",value:T,onChange:s=>E(s.target.value),placeholder:"Entrez le mot de passe administrateur",disabled:S,autoFocus:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:41,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:39,columnNumber:11},this),x&&e.jsxDEV("div",{className:"error-message",children:["⚠️ ",x]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:53,columnNumber:13},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"button",onClick:k,disabled:S,children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:59,columnNumber:13},this),e.jsxDEV("button",{type:"submit",disabled:S||!T.trim(),children:S?"Connexion...":"Se connecter"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:62,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:58,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:38,columnNumber:9},this),e.jsxDEV("style",{jsx:!0,children:`
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
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
            max-height: 90vh;
            overflow: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
          }

          .modal-header h3 {
            margin: 0;
            color: #333;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-btn:hover {
            color: #333;
          }

          .login-form {
            padding: 20px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #333;
          }

          .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
          }

          .form-group input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          .form-group input:disabled {
            background: #f8f9fa;
            color: #6c757d;
          }

          .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 16px;
            font-size: 14px;
          }

          .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }

          .form-actions button {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
          }

          .form-actions button[type="button"] {
            background: #f8f9fa;
            color: #333;
          }

          .form-actions button[type="button"]:hover:not(:disabled) {
            background: #e9ecef;
          }

          .form-actions button[type="submit"] {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .form-actions button[type="submit"]:hover:not(:disabled) {
            background: #0056b3;
            border-color: #0056b3;
          }

          .form-actions button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:68,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:32,columnNumber:7},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/LoginModal.jsx",lineNumber:31,columnNumber:5},this)}function Ae({currentPlanning:l,isAdmin:k,onSwitchPlanning:T}){const[E,S]=m.useState(!1),[j,x]=m.useState(!1),[u,f]=m.useState({name:"",description:"",year:new Date().getFullYear(),adminPassword:"",customToken:""}),[s,C]=m.useState(""),[c,y]=m.useState(!1),[b,M]=m.useState(""),[z,a]=m.useState(""),p=async N=>{N.preventDefault(),y(!0),M(""),a("");try{const V=await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"create_planning",data:u})}),I=await V.json();if(!V.ok)throw new Error(I.error||"Erreur lors de la création");a(`Planning "${I.planning.name}" créé avec succès !`),f({name:"",description:"",year:new Date().getFullYear(),adminPassword:"",customToken:""}),S(!1),window.confirm("Planning créé ! Voulez-vous basculer vers ce nouveau planning ?")&&(window.location.href=`?token=${I.planning.token}`)}catch(V){M(V.message)}finally{y(!1)}},v=async N=>{N.preventDefault(),y(!0),M("");try{const V=await fetch(`/api/auth?action=planning_info&token=${s}`),I=await V.json();if(!V.ok)throw new Error(I.error||"Token invalide");window.location.href=`?token=${s}`}catch(V){M(V.message)}finally{y(!1)}},d=()=>{const N="abcdefghijklmnopqrstuvwxyz0123456789";let V="";for(let I=0;I<12;I++)V+=N.charAt(Math.floor(Math.random()*N.length));f(I=>({...I,customToken:V}))};return e.jsxDEV("div",{className:"planning-manager",children:[e.jsxDEV("div",{className:"current-planning-info",children:[e.jsxDEV("h3",{children:"📋 Planning Actuel"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:97,columnNumber:9},this),e.jsxDEV("div",{className:"planning-details",children:[e.jsxDEV("div",{className:"planning-name",children:(l==null?void 0:l.name)||"Planning sans nom"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:99,columnNumber:11},this),(l==null?void 0:l.description)&&e.jsxDEV("div",{className:"planning-description",children:l.description},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:101,columnNumber:13},this),e.jsxDEV("div",{className:"planning-meta",children:[e.jsxDEV("span",{className:"planning-year",children:["📅 Année: ",(l==null?void 0:l.year)||"Non définie"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:104,columnNumber:13},this),e.jsxDEV("span",{className:"planning-token",children:["🔑 Token: ",(l==null?void 0:l.token)||"Non défini"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:105,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:103,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:98,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:96,columnNumber:7},this),e.jsxDEV("div",{className:"planning-actions",children:[e.jsxDEV("button",{onClick:()=>x(!j),className:"switch-btn",children:"🔄 Basculer vers un autre planning"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:111,columnNumber:9},this),e.jsxDEV("button",{onClick:()=>S(!E),className:"create-btn",children:"➕ Créer un nouveau planning"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:118,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:110,columnNumber:7},this),j&&e.jsxDEV("div",{className:"switch-form",children:[e.jsxDEV("h4",{children:"🔄 Basculer vers un autre planning"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:129,columnNumber:11},this),e.jsxDEV("form",{onSubmit:v,children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Token du planning :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:132,columnNumber:15},this),e.jsxDEV("input",{type:"text",value:s,onChange:N=>C(N.target.value),placeholder:"Entrez le token du planning",required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:133,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:131,columnNumber:13},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"submit",disabled:c,children:c?"⏳ Vérification...":"🔄 Basculer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:142,columnNumber:15},this),e.jsxDEV("button",{type:"button",onClick:()=>x(!1),children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:145,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:141,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:130,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:128,columnNumber:9},this),E&&e.jsxDEV("div",{className:"create-form",children:[e.jsxDEV("h4",{children:"➕ Créer un nouveau planning"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:156,columnNumber:11},this),e.jsxDEV("form",{onSubmit:p,children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Nom du planning * :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:159,columnNumber:15},this),e.jsxDEV("input",{type:"text",value:u.name,onChange:N=>f(V=>({...V,name:N.target.value})),placeholder:"Ex: Planning École Primaire 2024-2025",required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:160,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:158,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Description :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:170,columnNumber:15},this),e.jsxDEV("textarea",{value:u.description,onChange:N=>f(V=>({...V,description:N.target.value})),placeholder:"Description optionnelle du planning",rows:"2"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:171,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:169,columnNumber:13},this),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Année scolaire :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:181,columnNumber:17},this),e.jsxDEV("input",{type:"number",value:u.year,onChange:N=>f(V=>({...V,year:parseInt(N.target.value)})),min:"2020",max:"2030"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:182,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:180,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Mot de passe admin :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:192,columnNumber:17},this),e.jsxDEV("input",{type:"password",value:u.adminPassword,onChange:N=>f(V=>({...V,adminPassword:N.target.value})),placeholder:"Mot de passe administrateur"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:193,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:191,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:179,columnNumber:13},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Token personnalisé (optionnel) :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:203,columnNumber:15},this),e.jsxDEV("div",{className:"token-input",children:[e.jsxDEV("input",{type:"text",value:u.customToken,onChange:N=>f(V=>({...V,customToken:N.target.value})),placeholder:"Laissez vide pour un token automatique"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:205,columnNumber:17},this),e.jsxDEV("button",{type:"button",onClick:d,className:"generate-btn",children:"🎲 Générer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:211,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:204,columnNumber:15},this),e.jsxDEV("small",{children:"Utilisez des lettres minuscules et chiffres uniquement"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:215,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:202,columnNumber:13},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"submit",disabled:c,children:c?"⏳ Création...":"➕ Créer le planning"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:219,columnNumber:15},this),e.jsxDEV("button",{type:"button",onClick:()=>S(!1),children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:222,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:218,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:157,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:155,columnNumber:9},this),b&&e.jsxDEV("div",{className:"error-message",children:["❌ ",b]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:231,columnNumber:17},this),z&&e.jsxDEV("div",{className:"success-message",children:["✅ ",z]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:232,columnNumber:19},this),e.jsxDEV("style",{jsx:!0,children:`
        .planning-manager {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .current-planning-info {
          margin-bottom: 20px;
        }

        .current-planning-info h3 {
          margin: 0 0 12px 0;
          color: #333;
        }

        .planning-details {
          background: white;
          padding: 16px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }

        .planning-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .planning-description {
          color: #666;
          margin-bottom: 8px;
        }

        .planning-meta {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #666;
        }

        .planning-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .switch-btn, .create-btn {
          padding: 10px 16px;
          border: 2px solid;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .switch-btn {
          background: white;
          color: #007bff;
          border-color: #007bff;
        }

        .switch-btn:hover {
          background: #007bff;
          color: white;
        }

        .create-btn {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .create-btn:hover {
          background: #218838;
          border-color: #218838;
        }

        .switch-form, .create-form {
          background: white;
          padding: 20px;
          border-radius: 6px;
          border: 1px solid #ddd;
          margin-bottom: 16px;
        }

        .switch-form h4, .create-form h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .token-input {
          display: flex;
          gap: 8px;
        }

        .token-input input {
          flex: 1;
        }

        .generate-btn {
          padding: 8px 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .generate-btn:hover {
          background: #5a6268;
        }

        .form-group small {
          color: #666;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .form-actions button {
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .form-actions button[type="submit"] {
          background: #007bff;
          color: white;
        }

        .form-actions button[type="submit"]:hover:not(:disabled) {
          background: #0056b3;
        }

        .form-actions button[type="submit"]:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .form-actions button[type="button"] {
          background: #6c757d;
          color: white;
        }

        .form-actions button[type="button"]:hover {
          background: #5a6268;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-top: 16px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 4px;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .planning-actions {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .planning-meta {
            flex-direction: column;
            gap: 8px;
          }

          .token-input {
            flex-direction: column;
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:234,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/PlanningManager.jsx",lineNumber:95,columnNumber:5},this)}function ze({token:l,isAdmin:k,sessionToken:T,onWeekCreated:E}){const[S,j]=m.useState(!1),[x,u]=m.useState(""),[f,s]=m.useState(""),C=async()=>{if(!k||!T){u("Permissions administrateur requises");return}j(!0),u(""),s("");try{const y=await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":T},body:JSON.stringify({token:l,type:"create_next_week",data:{}})}),b=await y.json();if(!y.ok)throw new Error(b.error||"Erreur lors de la création");s(b.message),E&&E(b.semaine)}catch(y){u(y.message)}finally{j(!1)}},c=async()=>{if(!k||!T){u("Permissions administrateur requises");return}if(window.confirm(`Êtes-vous sûr de vouloir créer plusieurs semaines d'affilée ? Cela créera jusqu'à 40 semaines consécutives de type "nettoyage".`)){j(!0),u(""),s("");try{let b=0;const M=45;for(let z=0;z<M;z++){try{const a=await fetch("/api/planning",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":T},body:JSON.stringify({token:l,type:"create_next_week",data:{}})}),p=await a.json();if(a.ok)b++;else{if(p.error==="Cette semaine existe déjà")continue;break}}catch(a){console.warn("Erreur création semaine:",a);break}await new Promise(a=>setTimeout(a,100))}s(`${b} semaine(s) créée(s) automatiquement`),E&&E()}catch(b){u(b.message)}finally{j(!1)}}};return k?e.jsxDEV("div",{className:"week-creator",children:[e.jsxDEV("div",{className:"creator-header",children:[e.jsxDEV("h4",{children:"📅 Création Rapide de Semaines"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:132,columnNumber:9},this),e.jsxDEV("p",{children:"Créez facilement les semaines suivantes (lundi à dimanche)"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:133,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:131,columnNumber:7},this),e.jsxDEV("div",{className:"creator-actions",children:[e.jsxDEV("button",{onClick:C,disabled:S,className:"next-week-btn",children:S?"⏳ Création...":"➕ Créer la semaine suivante"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:137,columnNumber:9},this),e.jsxDEV("button",{onClick:c,disabled:S,className:"school-year-btn",children:S?"⏳ Création...":"📚 Créer plusieurs semaines d'affilée"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:145,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:136,columnNumber:7},this),e.jsxDEV("div",{className:"creator-info",children:[e.jsxDEV("div",{className:"info-item",children:[e.jsxDEV("span",{className:"info-icon",children:"🗓️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:156,columnNumber:11},this),e.jsxDEV("span",{children:"Semaines créées : Lundi à Dimanche"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:157,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:155,columnNumber:9},this),e.jsxDEV("div",{className:"info-item",children:[e.jsxDEV("span",{className:"info-icon",children:"✏️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:160,columnNumber:11},this),e.jsxDEV("span",{children:"Type/vacances : Modifiables manuellement après création"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:161,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:159,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:154,columnNumber:7},this),x&&e.jsxDEV("div",{className:"error-message",children:["❌ ",x]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:166,columnNumber:17},this),f&&e.jsxDEV("div",{className:"success-message",children:["✅ ",f]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:167,columnNumber:19},this),e.jsxDEV("style",{jsx:!0,children:`
        .week-creator {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid #17a2b8;
        }

        .creator-header h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .creator-header p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }

        .creator-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .next-week-btn, .school-year-btn {
          padding: 12px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .next-week-btn {
          background: #28a745;
          color: white;
        }

        .next-week-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
        }

        .school-year-btn {
          background: #17a2b8;
          color: white;
        }

        .school-year-btn:hover:not(:disabled) {
          background: #138496;
          transform: translateY(-1px);
        }

        .next-week-btn:disabled,
        .school-year-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        .creator-info {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .info-icon {
          font-size: 16px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-top: 12px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 4px;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .creator-actions {
            flex-direction: column;
          }

          .creator-info {
            flex-direction: column;
            gap: 8px;
          }
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:169,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/WeekCreator.jsx",lineNumber:130,columnNumber:5},this):null}const Oe=({currentPlanning:l,adminSession:k,semaines:T=[],familles:E=[],onClose:S})=>{const[j,x]=m.useState("individual"),[u,f]=m.useState({}),[s,C]=m.useState(""),[c,y]=m.useState(""),[b,M]=m.useState(""),[z,a]=m.useState(""),[p,v]=m.useState([]),[d,N]=m.useState(null),[V,I]=m.useState(!1),[L,B]=m.useState(null),[o,_]=m.useState("");m.useEffect(()=>{W(),A()},[]),m.useEffect(()=>{Y()},[s,c,b,z,u]);const W=async()=>{try{const r=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":k},body:JSON.stringify({token:l.token,action:"test_config"})});if(r.ok){const w=await r.json();N(w)}}catch(r){console.error("Erreur chargement config SMS:",r)}},A=async()=>{try{const r=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:l.token,action:"get_templates"})});if(r.ok){const w=await r.json();f(w.templates);const q=Object.keys(w.templates)[0];q&&C(q)}}catch(r){console.error("Erreur chargement templates:",r)}},Y=()=>{if(s==="personnalise"){_(c);return}if(!u[s]){_("");return}let r=u[s].template;if(r=r.replace("{planning_name}",l.name||"Planning"),j==="individual"&&b){const w=E.find(q=>q.id.toString()===b);w&&(r=r.replace("{nom_famille}",w.nom))}if(z){const w=T.find(q=>q.id===z);w&&(r=r.replace("{date_debut}",new Date(w.debut).toLocaleDateString("fr-FR")),r=r.replace("{date_fin}",new Date(w.fin).toLocaleDateString("fr-FR")))}r=r.replace(/{[^}]+}/g,"[...]"),_(r)},t=async()=>{if(!(!l||!k)){I(!0),B(null);try{let r,w={};switch(j){case"individual":if(!b)throw new Error("Veuillez sélectionner une famille");r="send_to_famille",w={famille_id:parseInt(b),...s==="personnalise"?{message_personnalise:c}:{template_key:s}};break;case"affectations":if(!z)throw new Error("Veuillez sélectionner une semaine");r="send_to_affectations",w={semaine_id:z,template_key:s};break;case"bulk":r="send_bulk",w={...p.length>0?{famille_ids:p.map(te=>parseInt(te))}:{},...s==="personnalise"?{message_personnalise:c}:{template_key:s}};break;default:throw new Error("Type d'envoi non valide")}const q=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":k},body:JSON.stringify({token:l.token,action:r,data:w})}),U=await q.json();if(!q.ok)throw new Error(U.error||"Erreur envoi SMS");B(U)}catch(r){console.error("Erreur envoi SMS:",r),B({success:!1,error:r.message})}finally{I(!1)}}},F=(r,w)=>{v(w?q=>[...q,r]:q=>q.filter(U=>U!==r))},J=()=>{v(E.map(r=>r.id.toString()))},X=()=>{v([])};return d?d.success?e.jsxDEV("div",{className:"modal-overlay",children:e.jsxDEV("div",{className:"modal",style:{maxWidth:"800px",width:"90%"},children:[e.jsxDEV("div",{className:"modal-header",children:[e.jsxDEV("h3",{children:"📱 Envoi de SMS"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:270,columnNumber:11},void 0),e.jsxDEV("button",{onClick:S,className:"modal-close",children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:271,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:269,columnNumber:9},void 0),e.jsxDEV("div",{style:{background:d.config.testMode?"#fff3cd":"#d1edff",border:`1px solid ${d.config.testMode?"#ffeaa7":"#74b9ff"}`,borderRadius:"8px",padding:"0.75rem",marginBottom:"1rem",fontSize:"0.9rem"},children:[e.jsxDEV("strong",{children:d.config.testMode?"🧪 Mode Test":"📡 Mode Production"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:283,columnNumber:11},void 0),d.config.testMode&&e.jsxDEV("span",{style:{marginLeft:"0.5rem"},children:"- Les SMS ne seront pas réellement envoyés"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:287,columnNumber:13},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:275,columnNumber:9},void 0),e.jsxDEV("div",{className:"tabs",style:{marginBottom:"1rem"},children:[e.jsxDEV("button",{className:`tab ${j==="individual"?"active":""}`,onClick:()=>x("individual"),children:"👤 Famille individuelle"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:295,columnNumber:11},void 0),e.jsxDEV("button",{className:`tab ${j==="affectations"?"active":""}`,onClick:()=>x("affectations"),children:"📅 Affectations d'une semaine"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:301,columnNumber:11},void 0),e.jsxDEV("button",{className:`tab ${j==="bulk"?"active":""}`,onClick:()=>x("bulk"),children:"📤 Envoi en masse"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:307,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:294,columnNumber:9},void 0),e.jsxDEV("div",{className:"modal-body",children:[j==="individual"&&e.jsxDEV("div",{children:[e.jsxDEV("h4",{children:"Envoyer à une famille"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:319,columnNumber:15},void 0),e.jsxDEV("div",{style:{marginBottom:"1rem"},children:[e.jsxDEV("label",{children:"Famille :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:321,columnNumber:17},void 0),e.jsxDEV("select",{value:b,onChange:r=>M(r.target.value),style:{width:"100%",padding:"0.5rem",marginTop:"0.25rem"},children:[e.jsxDEV("option",{value:"",children:"Sélectionner une famille..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:327,columnNumber:19},void 0),E.map(r=>e.jsxDEV("option",{value:r.id,children:[r.nom," ",r.telephone?`(${r.telephone})`:"⚠️ Pas de téléphone"]},r.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:329,columnNumber:21},void 0))]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:322,columnNumber:17},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:320,columnNumber:15},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:318,columnNumber:13},void 0),j==="affectations"&&e.jsxDEV("div",{children:[e.jsxDEV("h4",{children:"Envoyer aux familles affectées"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:340,columnNumber:15},void 0),e.jsxDEV("div",{style:{marginBottom:"1rem"},children:[e.jsxDEV("label",{children:"Semaine :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:342,columnNumber:17},void 0),e.jsxDEV("select",{value:z,onChange:r=>a(r.target.value),style:{width:"100%",padding:"0.5rem",marginTop:"0.25rem"},children:[e.jsxDEV("option",{value:"",children:"Sélectionner une semaine..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:348,columnNumber:19},void 0),T.filter(r=>r.is_published).map(r=>e.jsxDEV("option",{value:r.id,children:[r.description," (",new Date(r.debut).toLocaleDateString()," - ",new Date(r.fin).toLocaleDateString(),")"]},r.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:350,columnNumber:21},void 0))]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:343,columnNumber:17},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:341,columnNumber:15},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:339,columnNumber:13},void 0),j==="bulk"&&e.jsxDEV("div",{children:[e.jsxDEV("h4",{children:"Envoi en masse"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:361,columnNumber:15},void 0),e.jsxDEV("div",{style:{marginBottom:"1rem"},children:[e.jsxDEV("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"0.5rem"},children:[e.jsxDEV("button",{onClick:J,className:"btn btn-sm btn-outline",children:"Tout sélectionner"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:364,columnNumber:19},void 0),e.jsxDEV("button",{onClick:X,className:"btn btn-sm btn-outline",children:"Tout désélectionner"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:370,columnNumber:19},void 0),e.jsxDEV("span",{style:{alignSelf:"center",fontSize:"0.9rem",color:"#666"},children:[p.length," famille(s) sélectionnée(s)"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:376,columnNumber:19},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:363,columnNumber:17},void 0),e.jsxDEV("div",{style:{maxHeight:"200px",overflowY:"auto",border:"1px solid #ddd",borderRadius:"4px",padding:"0.5rem"},children:E.map(r=>e.jsxDEV("label",{style:{display:"block",padding:"0.25rem 0",cursor:"pointer"},children:[e.jsxDEV("input",{type:"checkbox",checked:p.includes(r.id.toString()),onChange:w=>F(r.id.toString(),w.target.checked),style:{marginRight:"0.5rem"}},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:394,columnNumber:23},void 0),r.nom,r.telephone?e.jsxDEV("span",{style:{color:"#666",fontSize:"0.9rem"},children:[" (",r.telephone,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:402,columnNumber:25},void 0):e.jsxDEV("span",{style:{color:"#dc3545",fontSize:"0.9rem"},children:" ⚠️ Pas de téléphone"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:403,columnNumber:25},void 0)]},r.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:389,columnNumber:21},void 0))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:381,columnNumber:17},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:362,columnNumber:15},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:360,columnNumber:13},void 0),e.jsxDEV("div",{style:{marginBottom:"1rem"},children:[e.jsxDEV("label",{children:"Template de message :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:414,columnNumber:13},void 0),e.jsxDEV("select",{value:s,onChange:r=>C(r.target.value),style:{width:"100%",padding:"0.5rem",marginTop:"0.25rem"},children:Object.entries(u).map(([r,w])=>e.jsxDEV("option",{value:r,children:w.name},r,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:421,columnNumber:17},void 0))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:415,columnNumber:13},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:413,columnNumber:11},void 0),s==="personnalise"&&e.jsxDEV("div",{style:{marginBottom:"1rem"},children:[e.jsxDEV("label",{children:"Message personnalisé :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:431,columnNumber:15},void 0),e.jsxDEV("textarea",{value:c,onChange:r=>y(r.target.value),placeholder:"Tapez votre message... (Variables disponibles: {nom_famille}, {planning_name})",style:{width:"100%",minHeight:"100px",padding:"0.5rem",marginTop:"0.25rem",resize:"vertical"},maxLength:1600},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:432,columnNumber:15},void 0),e.jsxDEV("div",{style:{fontSize:"0.8rem",color:"#666",textAlign:"right"},children:[c.length,"/1600 caractères"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:445,columnNumber:15},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:430,columnNumber:13},void 0),o&&e.jsxDEV("div",{style:{marginBottom:"1rem"},children:[e.jsxDEV("label",{children:"Aperçu du message :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:454,columnNumber:15},void 0),e.jsxDEV("div",{style:{background:"#f8f9fa",border:"1px solid #dee2e6",borderRadius:"4px",padding:"0.75rem",marginTop:"0.25rem",fontFamily:"monospace",whiteSpace:"pre-wrap",fontSize:"0.9rem"},children:o},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:455,columnNumber:15},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:453,columnNumber:13},void 0),L&&e.jsxDEV("div",{style:{marginBottom:"1rem"},children:e.jsxDEV("div",{style:{background:L.success?"#d4edda":"#f8d7da",border:`1px solid ${L.success?"#c3e6cb":"#f5c6cb"}`,borderRadius:"4px",padding:"0.75rem",color:L.success?"#155724":"#721c24"},children:L.success?e.jsxDEV("div",{children:[e.jsxDEV("strong",{children:"✅ SMS envoyé avec succès !"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:482,columnNumber:21},void 0),e.jsxDEV("div",{style:{marginTop:"0.5rem",fontSize:"0.9rem"},children:["• ",L.sent," message(s) envoyé(s)",L.errors>0&&e.jsxDEV("span",{children:[" • ",L.errors," erreur(s)"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:486,columnNumber:25},void 0),L.results&&L.results.length>0&&e.jsxDEV("details",{style:{marginTop:"0.5rem"},children:[e.jsxDEV("summary",{children:"Détails"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:490,columnNumber:27},void 0),e.jsxDEV("div",{style:{maxHeight:"150px",overflowY:"auto",marginTop:"0.5rem"},children:L.results.map((r,w)=>e.jsxDEV("div",{style:{fontSize:"0.8rem",color:r.success?"#155724":"#721c24",marginTop:"0.25rem"},children:[r.success?"✅":"❌"," ",r.famille_nom||"Famille inconnue",r.success&&r.testMode&&" (TEST)",!r.success&&` - ${r.error}`]},w,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:493,columnNumber:31},void 0))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:491,columnNumber:27},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:489,columnNumber:25},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:483,columnNumber:21},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:481,columnNumber:19},void 0):e.jsxDEV("div",{children:[e.jsxDEV("strong",{children:"❌ Erreur lors de l'envoi"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:510,columnNumber:21},void 0),e.jsxDEV("div",{style:{marginTop:"0.5rem",fontSize:"0.9rem"},children:L.error},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:511,columnNumber:21},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:509,columnNumber:19},void 0)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:473,columnNumber:15},void 0)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:472,columnNumber:13},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:315,columnNumber:9},void 0),e.jsxDEV("div",{className:"modal-footer",children:[e.jsxDEV("button",{onClick:S,className:"btn btn-secondary",children:"Fermer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:522,columnNumber:11},void 0),e.jsxDEV("button",{onClick:t,disabled:V||!s||j==="individual"&&!b||j==="affectations"&&!z||s==="personnalise"&&!c.trim(),className:"btn btn-primary",children:V?"📤 Envoi...":"📱 Envoyer SMS"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:528,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:521,columnNumber:9},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:268,columnNumber:7},void 0)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:267,columnNumber:5},void 0):e.jsxDEV("div",{className:"modal-overlay",children:e.jsxDEV("div",{className:"modal",children:[e.jsxDEV("h3",{children:"📱 Configuration SMS"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:239,columnNumber:11},void 0),e.jsxDEV("div",{style:{textAlign:"center",padding:"2rem"},children:[e.jsxDEV("div",{style:{color:"#dc3545",marginBottom:"1rem"},children:"⚠️ Service SMS non configuré"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:241,columnNumber:13},void 0),e.jsxDEV("p",{children:d.error},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:244,columnNumber:13},void 0),e.jsxDEV("div",{style:{background:"#f8f9fa",padding:"1rem",borderRadius:"8px",marginTop:"1rem"},children:[e.jsxDEV("strong",{children:"Configuration requise :"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:246,columnNumber:15},void 0),e.jsxDEV("ul",{style:{textAlign:"left",marginTop:"0.5rem"},children:[e.jsxDEV("li",{children:["Variable ",e.jsxDEV("code",{children:"SPRYNG_API_KEY"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:248,columnNumber:30},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:248,columnNumber:17},void 0),e.jsxDEV("li",{children:["Variable ",e.jsxDEV("code",{children:"SMS_ENABLED=true"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:249,columnNumber:30},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:249,columnNumber:17},void 0),e.jsxDEV("li",{children:["Variable ",e.jsxDEV("code",{children:"SMS_SENDER"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:250,columnNumber:30},void 0)," (optionnel)"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:250,columnNumber:17},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:247,columnNumber:15},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:245,columnNumber:13},void 0),e.jsxDEV("button",{onClick:S,className:"btn btn-secondary",style:{marginTop:"1rem"},children:"Fermer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:253,columnNumber:13},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:240,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:238,columnNumber:9},void 0)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:237,columnNumber:7},void 0):e.jsxDEV("div",{className:"modal-overlay",children:e.jsxDEV("div",{className:"modal",children:[e.jsxDEV("h3",{children:"📱 Gestion SMS"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:225,columnNumber:11},void 0),e.jsxDEV("div",{style:{textAlign:"center",padding:"2rem"},children:e.jsxDEV("div",{className:"loading",children:"Chargement de la configuration SMS..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:227,columnNumber:13},void 0)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:226,columnNumber:11},void 0)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:224,columnNumber:9},void 0)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/SMSManager.jsx",lineNumber:223,columnNumber:7},void 0)};function ye({token:l,sessionToken:k,canEdit:T}){const[E,S]=m.useState([]),[j,x]=m.useState(!1),[u,f]=m.useState(""),[s,C]=m.useState(!1),[c,y]=m.useState(null),[b,M]=m.useState({name:"",description:"",message_template:"",day_of_week:2,hour:10,minute:0,target_type:"current_week",is_active:!0}),z=[{value:0,label:"Dimanche"},{value:1,label:"Lundi"},{value:2,label:"Mardi"},{value:3,label:"Mercredi"},{value:4,label:"Jeudi"},{value:5,label:"Vendredi"},{value:6,label:"Samedi"}],a=[{value:"current_week",label:"Familles avec nettoyage cette semaine"},{value:"all_active",label:"Toutes les familles actives"}];m.useEffect(()=>{l&&p()},[l]);const p=async()=>{try{x(!0);const o=await fetch(`/api/sms?token=${l}&action=list_scheduled`,{headers:{"X-Admin-Session":k}}),_=await o.json();if(!o.ok||!_.success)throw new Error(_.error||"Erreur lors du chargement");S(_.data)}catch(o){f(o.message)}finally{x(!1)}},v=()=>{M({name:"",description:"",message_template:"",day_of_week:2,hour:10,minute:0,target_type:"current_week",is_active:!0}),y(null),C(!1)},d=async o=>{if(o.preventDefault(),!b.name.trim()||!b.message_template.trim()){f("Nom et message sont obligatoires");return}try{x(!0);const A=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":k},body:JSON.stringify({token:l,action:c?"update_scheduled":"create_scheduled",data:c?{...b,id:c.id}:b})}),Y=await A.json();if(!A.ok||!Y.success)throw new Error(Y.error||"Erreur lors de la sauvegarde");await p(),v(),f("")}catch(_){f(_.message)}finally{x(!1)}},N=o=>{M({name:o.name,description:o.description||"",message_template:o.message_template,day_of_week:o.day_of_week,hour:o.hour,minute:o.minute,target_type:o.target_type,is_active:o.is_active}),y(o),C(!0)},V=async o=>{if(window.confirm("Supprimer ce SMS planifié ?"))try{x(!0);const _=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":k},body:JSON.stringify({token:l,action:"delete_scheduled",data:{id:o}})}),W=await _.json();if(!_.ok||!W.success)throw new Error(W.error||"Erreur lors de la suppression");await p()}catch(_){f(_.message)}finally{x(!1)}},I=async o=>{try{x(!0);const _=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Session":k},body:JSON.stringify({token:l,action:"update_scheduled",data:{...o,is_active:!o.is_active}})}),W=await _.json();if(!_.ok||!W.success)throw new Error(W.error||"Erreur lors de la modification");await p()}catch(_){f(_.message)}finally{x(!1)}},L=(o,_)=>`${o.toString().padStart(2,"0")}:${_.toString().padStart(2,"0")}`,B=()=>{M({name:"Code boîte à clés",description:"SMS automatique envoyé le mardi à 10h pour donner le code de la boîte à clés aux familles avec nettoyage cette semaine",message_template:"Bonjour {nom_famille}, vous avez un nettoyage cette semaine ({classe_nom}). Le code de la boîte à clés est: 1234. Merci ! - {planning_name}",day_of_week:2,hour:10,minute:0,target_type:"current_week",is_active:!0}),C(!0)};return T?e.jsxDEV("div",{className:"scheduled-sms-manager",children:[e.jsxDEV("div",{className:"manager-header",children:[e.jsxDEV("h3",{children:"📅 SMS Planifiés"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:231,columnNumber:9},this),e.jsxDEV("div",{className:"header-actions",children:[e.jsxDEV("button",{onClick:B,className:"btn btn-secondary",disabled:j,children:"🗝️ Créer SMS Code Boîte"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:233,columnNumber:11},this),e.jsxDEV("button",{onClick:()=>C(!s),className:"btn btn-primary",disabled:j,children:["➕ ",s?"Annuler":"Nouveau SMS"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:240,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:232,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:230,columnNumber:7},this),u&&e.jsxDEV("div",{className:"error-message",children:["⚠️ ",u,e.jsxDEV("button",{onClick:()=>f(""),children:"×"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:253,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:251,columnNumber:9},this),s&&e.jsxDEV("div",{className:"create-form",children:[e.jsxDEV("h4",{children:[c?"Modifier":"Créer"," un SMS planifié"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:260,columnNumber:11},this),e.jsxDEV("form",{onSubmit:d,children:[e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("input",{type:"text",placeholder:"Nom du SMS planifié",value:b.name,onChange:o=>M({...b,name:o.target.value}),required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:263,columnNumber:15},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:262,columnNumber:13},this),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("textarea",{placeholder:"Description (optionnel)",value:b.description,onChange:o=>M({...b,description:o.target.value}),rows:2},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:273,columnNumber:15},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:272,columnNumber:13},this),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("textarea",{placeholder:"Message SMS (utilisez {nom_famille}, {classe_nom}, {planning_name})",value:b.message_template,onChange:o=>M({...b,message_template:o.target.value}),rows:3,required:!0},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:282,columnNumber:15},this),e.jsxDEV("small",{children:["Variables: ","{nom_famille}",", ","{classe_nom}",", ","{date_debut}",", ","{date_fin}",", ","{planning_name}"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:289,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:281,columnNumber:13},this),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Jour de la semaine:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:294,columnNumber:17},this),e.jsxDEV("select",{value:b.day_of_week,onChange:o=>M({...b,day_of_week:parseInt(o.target.value)}),children:z.map(o=>e.jsxDEV("option",{value:o.value,children:o.label},o.value,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:300,columnNumber:21},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:295,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:293,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Heure:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:306,columnNumber:17},this),e.jsxDEV("input",{type:"number",min:"0",max:"23",value:b.hour,onChange:o=>M({...b,hour:parseInt(o.target.value)})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:307,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:305,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Minutes:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:317,columnNumber:17},this),e.jsxDEV("input",{type:"number",min:"0",max:"59",value:b.minute,onChange:o=>M({...b,minute:parseInt(o.target.value)})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:318,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:316,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:292,columnNumber:13},this),e.jsxDEV("div",{className:"form-row",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Destinataires:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:330,columnNumber:17},this),e.jsxDEV("select",{value:b.target_type,onChange:o=>M({...b,target_type:o.target.value}),children:a.map(o=>e.jsxDEV("option",{value:o.value,children:o.label},o.value,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:336,columnNumber:21},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:331,columnNumber:17},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:329,columnNumber:15},this),e.jsxDEV("div",{className:"form-group",children:e.jsxDEV("label",{children:[e.jsxDEV("input",{type:"checkbox",checked:b.is_active,onChange:o=>M({...b,is_active:o.target.checked})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:343,columnNumber:19},this),"Actif"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:342,columnNumber:17},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:341,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:328,columnNumber:13},this),e.jsxDEV("div",{className:"form-actions",children:[e.jsxDEV("button",{type:"button",onClick:v,className:"btn btn-secondary",children:"Annuler"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:354,columnNumber:15},this),e.jsxDEV("button",{type:"submit",className:"btn btn-primary",disabled:j,children:j?"Sauvegarde...":c?"Modifier":"Créer"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:357,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:353,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:261,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:259,columnNumber:9},this),e.jsxDEV("div",{className:"scheduled-list",children:[e.jsxDEV("h4",{children:["SMS Planifiés (",E.length,")"]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:367,columnNumber:9},this),j&&!s?e.jsxDEV("div",{className:"loading",children:"Chargement..."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:370,columnNumber:11},this):E.length===0?e.jsxDEV("div",{className:"empty-state",children:[e.jsxDEV("p",{children:"Aucun SMS planifié configuré."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:373,columnNumber:13},this),e.jsxDEV("p",{children:"Créez votre premier SMS automatique pour le code de la boîte à clés !"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:374,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:372,columnNumber:11},this):e.jsxDEV("div",{className:"sms-grid",children:E.map(o=>{var _,W;return e.jsxDEV("div",{className:`sms-card ${o.is_active?"":"inactive"}`,children:[e.jsxDEV("div",{className:"sms-header",children:[e.jsxDEV("h5",{children:o.name},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:381,columnNumber:19},this),e.jsxDEV("div",{className:"sms-actions",children:[e.jsxDEV("button",{onClick:()=>I(o),className:`toggle-btn ${o.is_active?"active":"inactive"}`,title:o.is_active?"Désactiver":"Activer",children:o.is_active?"🟢":"🔴"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:383,columnNumber:21},this),e.jsxDEV("button",{onClick:()=>N(o),className:"edit-btn",title:"Modifier",children:"✏️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:390,columnNumber:21},this),e.jsxDEV("button",{onClick:()=>V(o.id),className:"delete-btn",title:"Supprimer",children:"🗑️"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:397,columnNumber:21},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:382,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:380,columnNumber:17},this),o.description&&e.jsxDEV("p",{className:"sms-description",children:o.description},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:408,columnNumber:19},this),e.jsxDEV("div",{className:"sms-schedule",children:[e.jsxDEV("span",{className:"schedule-time",children:["📅 ",(_=z.find(A=>A.value===o.day_of_week))==null?void 0:_.label," à ",L(o.hour,o.minute)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:412,columnNumber:19},this),e.jsxDEV("span",{className:"schedule-target",children:["👥 ",(W=a.find(A=>A.value===o.target_type))==null?void 0:W.label]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:415,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:411,columnNumber:17},this),e.jsxDEV("div",{className:"sms-message",children:[e.jsxDEV("strong",{children:"Message:"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:421,columnNumber:19},this),e.jsxDEV("p",{children:o.message_template},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:422,columnNumber:19},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:420,columnNumber:17},this),!o.is_active&&e.jsxDEV("div",{className:"inactive-badge",children:"⏸️ Inactif"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:426,columnNumber:19},this)]},o.id,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:379,columnNumber:15},this)})},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:377,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:366,columnNumber:7},this),e.jsxDEV("style",{jsx:!0,children:`
        .scheduled-sms-manager {
          max-width: 1200px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .create-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .form-row {
          margin-bottom: 15px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .form-group {
          flex: 1;
          min-width: 150px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-row input,
        .form-row textarea,
        .form-row select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-row textarea {
          resize: vertical;
          font-family: inherit;
        }

        .form-row small {
          color: #666;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .scheduled-list h4 {
          margin-bottom: 15px;
        }

        .sms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .sms-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          transition: box-shadow 0.2s;
        }

        .sms-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sms-card.inactive {
          opacity: 0.7;
          background: #f8f9fa;
        }

        .sms-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .sms-header h5 {
          margin: 0;
          color: #333;
        }

        .sms-actions {
          display: flex;
          gap: 5px;
        }

        .sms-actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 3px;
          font-size: 16px;
        }

        .sms-actions button:hover {
          background: #f0f0f0;
        }

        .sms-description {
          font-size: 13px;
          color: #666;
          margin-bottom: 10px;
          font-style: italic;
        }

        .sms-schedule {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .schedule-time {
          color: #007bff;
          font-weight: 500;
        }

        .schedule-target {
          color: #666;
        }

        .sms-message {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }

        .sms-message strong {
          font-size: 13px;
          color: #333;
        }

        .sms-message p {
          font-size: 12px;
          color: #666;
          margin: 5px 0 0 0;
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          font-family: monospace;
        }

        .inactive-badge {
          background: #6c757d;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          text-align: center;
          margin-top: 10px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px 20px;
        }

        .empty-state p {
          margin: 10px 0;
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:436,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:229,columnNumber:5},this):e.jsxDEV("div",{className:"scheduled-sms-manager",children:e.jsxDEV("p",{children:"Accès administrateur requis pour gérer les SMS planifiés."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:223,columnNumber:9},this)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/ScheduledSMSManager.jsx",lineNumber:222,columnNumber:7},this)}function $e({token:l,isAdmin:k,canEdit:T,loginAdmin:E,logoutAdmin:S,refreshData:j,toggleSemainePublication:x,planningData:u,sessionToken:f}){var p;const[s,C]=m.useState("planning"),[c,y]=m.useState(!1),[b,M]=m.useState(!1),z=async v=>{const d=await E(v);return d.success&&y(!1),d},a=[{id:"planning",label:"📋 Plannings",component:"PlanningTab"},{id:"familles",label:"👥 Familles",component:Me},{id:"classes",label:"🏠 Classes",component:Pe},{id:"semaines",label:"📅 Semaines",component:De},{id:"exclusions",label:"🚫 Exclusions",component:be},{id:"sms",label:"📱 SMS",component:"SMSTab"},{id:"scheduled-sms",label:"⏰ SMS Planifiés",component:ye}];return k?((p=a.find(v=>v.id===s))==null||p.component,e.jsxDEV("div",{className:"admin-panel",children:[e.jsxDEV("div",{className:"admin-header",children:[e.jsxDEV("h2",{children:"🔧 Administration"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:63,columnNumber:9},this),e.jsxDEV("div",{className:"admin-controls",children:[e.jsxDEV("span",{className:"admin-status",children:"✅ Connecté en tant qu'admin"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:65,columnNumber:11},this),e.jsxDEV("button",{onClick:S,className:"btn btn-secondary",children:"🚪 Déconnexion"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:66,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:64,columnNumber:9},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:62,columnNumber:7},this),e.jsxDEV("div",{className:"admin-tabs",children:a.map(v=>e.jsxDEV("button",{onClick:()=>C(v.id),className:`tab ${s===v.id?"active":""}`,children:v.label},v.id,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:77,columnNumber:11},this))},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:75,columnNumber:7},this),e.jsxDEV("div",{className:"admin-content",children:[s==="planning"&&e.jsxDEV(e.Fragment,{children:[e.jsxDEV(Ae,{currentPlanning:u==null?void 0:u.planning,isAdmin:k},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:90,columnNumber:13},this),e.jsxDEV(ze,{token:l,isAdmin:k,sessionToken:f,onWeekCreated:j},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:94,columnNumber:13},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:89,columnNumber:11},this),s==="familles"&&e.jsxDEV(Me,{token:l,canEdit:T,refreshData:j,sessionToken:f},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:103,columnNumber:11},this),s==="classes"&&e.jsxDEV(Pe,{token:l,canEdit:T,refreshData:j},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:111,columnNumber:11},this),s==="semaines"&&e.jsxDEV(De,{token:l,canEdit:T,refreshData:j,toggleSemainePublication:x},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:118,columnNumber:11},this),s==="exclusions"&&e.jsxDEV(be,{token:l,canEdit:T,refreshData:j},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:126,columnNumber:11},this),s==="sms"&&e.jsxDEV("div",{className:"sms-tab",children:[e.jsxDEV("div",{className:"tab-header",children:[e.jsxDEV("h3",{children:"📱 Communication SMS"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:135,columnNumber:15},this),e.jsxDEV("p",{children:"Envoyez des SMS aux familles pour les informer des affectations et rappels."},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:136,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:134,columnNumber:13},this),e.jsxDEV("button",{onClick:()=>M(!0),className:"btn btn-primary",style:{marginTop:"1rem"},children:"📱 Ouvrir le gestionnaire SMS"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:138,columnNumber:13},this),b&&e.jsxDEV(Oe,{currentPlanning:u==null?void 0:u.planning,adminSession:f,semaines:(u==null?void 0:u.semaines)||[],familles:(u==null?void 0:u.familles)||[],onClose:()=>M(!1)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:147,columnNumber:15},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:133,columnNumber:11},this),s==="scheduled-sms"&&e.jsxDEV(ye,{token:l,sessionToken:f,canEdit:T},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:158,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:87,columnNumber:7},this),e.jsxDEV("style",{jsx:!0,children:`
        .admin-panel {
          margin: 20px 0;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f0f0f0;
          border-bottom: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
        }

        .admin-header h2 {
          margin: 0;
          color: #333;
        }

        .admin-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-status {
          color: #28a745;
          font-weight: 500;
        }

        .admin-tabs {
          display: flex;
          background: #fff;
          border-bottom: 1px solid #ddd;
        }

        .tab {
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab:hover {
          background: #f8f9fa;
        }

        .tab.active {
          background: #fff;
          border-bottom-color: #007bff;
          color: #007bff;
        }

        .admin-content {
          padding: 20px;
          background: #fff;
          border-radius: 0 0 8px 8px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }
      `},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:166,columnNumber:7},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:61,columnNumber:5},this)):e.jsxDEV("div",{className:"admin-panel",children:[e.jsxDEV("div",{className:"admin-header",children:[e.jsxDEV("h2",{children:"Administration"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:39,columnNumber:11},this),e.jsxDEV("button",{onClick:()=>y(!0),className:"btn btn-primary",children:"🔑 Connexion Admin"},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:40,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:38,columnNumber:9},this),c&&e.jsxDEV(Te,{onLogin:z,onClose:()=>y(!1)},void 0,!1,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:49,columnNumber:11},this)]},void 0,!0,{fileName:"/home/david/Privé/git/planning/src/components/AdminPanel.jsx",lineNumber:37,columnNumber:7},this)}export{$e as A,Le as R,e as j,m as r};
