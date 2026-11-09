import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const source=readFileSync(new URL('../js/una-chat.js',import.meta.url),'utf8');
function widget(fetch) {
  const dom=new JSDOM('<!doctype html><body><a class="back-to-top">Top</a></body>',{url:'https://www.unabikerental.com/',runScripts:'outside-only'});
  dom.window.fetch=fetch;
  dom.window.AbortController=AbortController;
  dom.window.eval(source);
  return dom;
}
const tick=()=>new Promise(resolve=>setTimeout(resolve,10));
function submit(dom,text) {
 const input=dom.window.document.querySelector('textarea');input.value=text;
 dom.window.document.querySelector('form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));
}

test('opens and closes with keyboard focus and never installs twice',()=>{
 const dom=widget();const doc=dom.window.document;
 const launch=doc.querySelector('.una-chat-launcher');const panel=doc.querySelector('[role=dialog]');
 assert.ok(panel.hidden);launch.click();assert.equal(panel.hidden,false);assert.equal(doc.activeElement.tagName,'TEXTAREA');
 doc.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'}));assert.ok(panel.hidden);assert.equal(doc.activeElement,launch);
 dom.window.eval(source);assert.equal(doc.querySelectorAll('#una-chat').length,1);dom.window.close();
});

test('sends model context, renders untrusted text safely and prepares a WhatsApp enquiry',async()=>{
 const dom=widget(async(url,options)=>{
  assert.equal(url,'/api/chat');assert.equal(JSON.parse(options.body).messages[0].content,'Yala for 2 people');
  return {ok:true,json:async()=>({reply:'<img src=x onerror=alert(1)> What date?'})};
 });
 submit(dom,'Yala for 2 people');await tick();
 const doc=dom.window.document;
 assert.equal(doc.querySelectorAll('.una-chat-messages img').length,0);
 assert.match(doc.querySelector('.una-chat-messages').textContent,/<img/);
 const url=new URL(doc.querySelector('.una-chat-whatsapp').href);
 assert.equal(url.host,'wa.me');assert.equal(url.pathname,'/94773132168');assert.match(url.searchParams.get('text'),/Yala for 2 people/);
 dom.window.close();
});

test('provider failure retains the WhatsApp enquiry and permits a clean retry',async()=>{
 let calls=0;
 const dom=widget(async(url,options)=>{
  calls++;const history=JSON.parse(options.body).messages;
  assert.equal(history.length,1);
  if(calls===1)throw new Error('offline');
  return {ok:true,json:async()=>({reply:'What dates?'})};
 });
 submit(dom,'Rent Yamaha');await tick();
 const doc=dom.window.document;assert.match(doc.querySelector('.una-chat-status').textContent,/Connection unavailable/);
 assert.match(decodeURIComponent(doc.querySelector('.una-chat-whatsapp').href),/Rent Yamaha/);
 assert.equal(doc.querySelector('textarea').disabled,false);
 submit(dom,'Rent Dio');await tick();assert.equal(calls,2);dom.window.close();
});

test('new chat discards the old request response and resets the enquiry',async()=>{
 let resolve;
 const dom=widget(()=>new Promise(r=>{resolve=r;}));
 submit(dom,'My old enquiry');
 dom.window.document.querySelector('.una-chat-reset').click();
 resolve({ok:true,json:async()=>({reply:'Stale reply'})});await tick();
 const doc=dom.window.document;
 assert.doesNotMatch(doc.querySelector('.una-chat-messages').textContent,/Stale reply|My old enquiry/);
 assert.doesNotMatch(decodeURIComponent(doc.querySelector('.una-chat-whatsapp').href),/My old enquiry/);
 assert.equal(doc.querySelector('textarea').disabled,false);dom.window.close();
});
