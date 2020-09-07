var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function s(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function a(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function d(){return f(" ")}function h(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function m(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function g(t,e){t.value=null==e?"":e}function $(t,e,n){t.classList[n?"add":"remove"](e)}let y;function w(t){y=t}function b(t){(function(){if(!y)throw new Error("Function called outside component initialization");return y})().$$.on_mount.push(t)}const v=[],_=[],x=[],k=[],S=Promise.resolve();let q=!1;function E(){q||(q=!0,S.then(O))}function A(t){x.push(t)}let C=!1;const N=new Set;function O(){if(!C){C=!0;do{for(let t=0;t<v.length;t+=1){const e=v[t];w(e),T(e.$$)}for(v.length=0;_.length;)_.pop()();for(let t=0;t<x.length;t+=1){const e=x[t];N.has(e)||(N.add(e),e())}x.length=0}while(v.length);for(;k.length;)k.pop()();q=!1,C=!1,N.clear()}}function T(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}const j=new Set;function I(l,c,u,s,a,f,d=[-1]){const h=y;w(l);const p=c.props||{},m=l.$$={fragment:null,ctx:null,props:f,update:t,not_equal:a,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:[]),callbacks:n(),dirty:d,skip_bound:!1};let g=!1;if(m.ctx=u?u(l,p,(t,e,...n)=>{const o=n.length?n[0]:e;return m.ctx&&a(m.ctx[t],m.ctx[t]=o)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](o),g&&function(t,e){-1===t.$$.dirty[0]&&(v.push(t),E(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}(l,t)),e}):[],m.update(),g=!0,o(m.before_update),m.fragment=!!s&&s(m.ctx),c.target){if(c.hydrate){const t=function(t){return Array.from(t.childNodes)}(c.target);m.fragment&&m.fragment.l(t),t.forEach(i)}else m.fragment&&m.fragment.c();c.intro&&(($=l.$$.fragment)&&$.i&&(j.delete($),$.i(b))),function(t,n,l){const{fragment:c,on_mount:u,on_destroy:i,after_update:s}=t.$$;c&&c.m(n,l),A(()=>{const n=u.map(e).filter(r);i?i.push(...n):o(n),t.$$.on_mount=[]}),s.forEach(A)}(l,c.target,c.anchor),O()}var $,b;w(h)}function M(t,e,n){const o=t.slice();return o[18]=e[n],o[20]=n,o}function D(t,e,n){const o=t.slice();return o[21]=e[n],o}function L(t){let e,n,o,r=t[4],l=[];for(let e=0;e<r.length;e+=1)l[e]=J(D(t,r,e));return{c(){e=a("h4"),e.textContent="High scores",n=d(),o=a("ol");for(let t=0;t<l.length;t+=1)l[t].c()},m(t,r){u(t,e,r),u(t,n,r),u(t,o,r);for(let t=0;t<l.length;t+=1)l[t].m(o,null)},p(t,e){if(16&e){let n;for(r=t[4],n=0;n<r.length;n+=1){const c=D(t,r,n);l[n]?l[n].p(c,e):(l[n]=J(c),l[n].c(),l[n].m(o,null))}for(;n<l.length;n+=1)l[n].d(1);l.length=r.length}},d(t){t&&i(e),t&&i(n),t&&i(o),s(l,t)}}}function J(t){let e,n,o,r=t[21]+"";return{c(){e=a("li"),n=f(r),o=d()},m(t,r){u(t,e,r),c(e,n),c(e,o)},p(t,e){16&e&&r!==(r=t[21]+"")&&m(n,r)},d(t){t&&i(e)}}}function z(t){let e,n,o,r=t[18]+"";return{c(){e=a("p"),n=f(r),o=d(),p(e,"class","word svelte-1b3bsq0"),$(e,"word--active",t[20]===t[2]),$(e,"word--incorrect",t[20]===t[2]&&t[6])},m(t,r){u(t,e,r),c(e,n),c(e,o)},p(t,o){32&o&&r!==(r=t[18]+"")&&m(n,r),4&o&&$(e,"word--active",t[20]===t[2]),68&o&&$(e,"word--incorrect",t[20]===t[2]&&t[6])},d(t){t&&i(e)}}}function B(t){let e,n,r;return{c(){e=a("input"),p(e,"id","input-text"),p(e,"autocomplete","off")},m(o,l){u(o,e,l),g(e,t[1]),n||(r=[h(e,"input",t[10]),h(e,"keydown",t[8])],n=!0)},p(t,n){2&n&&e.value!==t[1]&&g(e,t[1])},d(t){t&&i(e),n=!1,o(r)}}}function F(t){let e,n,o,r,l,s,p,g;return{c(){e=a("p"),n=f("You typed "),o=f(t[0]),r=f(" words in a minute!"),l=d(),s=a("button"),s.textContent="Go again"},m(i,a){u(i,e,a),c(e,n),c(e,o),c(e,r),u(i,l,a),u(i,s,a),p||(g=h(s,"click",t[9]),p=!0)},p(t,e){1&e&&m(o,t[0])},d(t){t&&i(e),t&&i(l),t&&i(s),p=!1,g()}}}function G(e){let n,o,r,l,h,g,$,y,w,b,v,_,x=e[4].length&&L(e),k=e[5],S=[];for(let t=0;t<k.length;t+=1)S[t]=z(M(e,k,t));let q=!e[3]&&B(e),E=e[3]&&F(e);return{c(){n=a("scores"),x&&x.c(),o=d(),r=a("main"),l=a("h1"),l.textContent="Typist",h=d(),g=a("p"),$=f(e[7]),y=d(),w=a("div"),b=a("div");for(let t=0;t<S.length;t+=1)S[t].c();v=d(),q&&q.c(),_=d(),E&&E.c(),p(l,"class","svelte-1b3bsq0"),p(b,"class","word-container__inner svelte-1b3bsq0"),p(w,"class","word-container svelte-1b3bsq0"),p(r,"class","svelte-1b3bsq0")},m(t,e){u(t,n,e),x&&x.m(n,null),u(t,o,e),u(t,r,e),c(r,l),c(r,h),c(r,g),c(g,$),c(r,y),c(r,w),c(w,b);for(let t=0;t<S.length;t+=1)S[t].m(b,null);c(r,v),q&&q.m(r,null),c(r,_),E&&E.m(r,null)},p(t,[e]){if(t[4].length?x?x.p(t,e):(x=L(t),x.c(),x.m(n,null)):x&&(x.d(1),x=null),128&e&&m($,t[7]),100&e){let n;for(k=t[5],n=0;n<k.length;n+=1){const o=M(t,k,n);S[n]?S[n].p(o,e):(S[n]=z(o),S[n].c(),S[n].m(b,null))}for(;n<S.length;n+=1)S[n].d(1);S.length=k.length}t[3]?q&&(q.d(1),q=null):q?q.p(t,e):(q=B(t),q.c(),q.m(r,_)),t[3]?E?E.p(t,e):(E=F(t),E.c(),E.m(r,null)):E&&(E.d(1),E=null)},i:t,o:t,d(t){t&&i(n),x&&x.d(),t&&i(o),t&&i(r),s(S,t),q&&q.d(),E&&E.d()}}}const H="typist__high-scores";function P(){const t=localStorage.getItem(H);return t&&t.length?JSON.parse(t):[]}function W(t,e,n){const o="a,about,all,also,and,as,at,be,because,but,by,can,come,could,day,do,even,find,first,for,from,get,give,go,have,he,her,here,him,his,how,I,if,in,into,it,its,just,know,like,look,make,man,many,me,more,my,new,no,not,now,of,on,one,only,or,other,our,out,people,say,see,she,so,some,take,tell,than,that,the,their,them,then,there,these,they,thing,think,this,those,time,to,two,up,use,very,want,way,we,well,what,when,which,who,will,with,would,year,you,your".split(",");let r,l,c=0,u="",i=0,s=0,a=!1,f=!1,d=P();const h=(t,e)=>Math.floor(Math.random()*(e-t+1))+t;let p,m,g=new Array(3e3).fill("").map(t=>o[h(0,99)]);function $(){const t=(new Date-r)/1e3;if(n(11,i=Math.round(t)),i>=10)return n(3,a=!0),clearTimeout(l),n(5,g=[]),document.querySelector("#input-text").blur(),function(t){if(0===t)return;let e=P();if(e.length>0){const n=e.findIndex(e=>e<t);n>-1&&(e[n]=t)}else e.push(t);localStorage.setItem(H,JSON.stringify(e.sort((t,e)=>e-t).slice(0,5)))}(c),void n(4,d=P());l=setTimeout($,500)}return b(()=>{document.querySelector("#input-text").focus()}),t.$$.update=()=>{38&t.$$.dirty&&n(6,p=u.length&&g.length&&!g[s].startsWith(u)),2048&t.$$.dirty&&n(7,m=60===i?"01:00":`00:${i<10?"0":""}${i.toString()}`)},[c,u,s,a,d,g,p,m,function(t){if(!a&&(f||(r=new Date,$(),f=!0)," "===t.key)){t.preventDefault();u===g[s]&&(n(0,c+=1),n(1,u=""),s===g.length&&n(2,s=0),n(5,g=g.slice(1)))}},async function(){f=!1,n(11,i=0),n(1,u=""),n(0,c=0),n(5,g=new Array(3e3).fill("").map(t=>o[h(0,99)])),n(3,a=!1),await(E(),S),document.querySelector("#input-text").focus(),r=null},function(){u=this.value,n(1,u)}]}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),I(this,t,W,G,l,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map