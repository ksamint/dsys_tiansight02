// One-time source-bound migration; source inputs are retained in archive after consolidation.
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');process.chdir(root);
const historical={
 'SalesDeck.dc.html':'templates/sales-deck/SalesDeck.dc.html',
 'TiansightDeck-Exhibit.dc.html':'deliverables/exhibit-design/src/TiansightDeck-Exhibit.dc.html',
 'slide-catalog.js':'content/slide-catalog.js',
 'vals.json':'deliverables/company-intro-v3/gen/vals.json'
};
const read=p=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):execFileSync('git',['show','3bd4d2d:'+historical[path.basename(p)]],{encoding:'utf8'}), json=p=>JSON.parse(read(p));
const write=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');};
const locate=(a,b)=>fs.existsSync(a)?a:b;
const introDir=locate('docs/claude-design-system/templates/company-intro','archive/claude-design-system-v13/templates/company-intro');
const salesFile=locate('templates/sales-deck/SalesDeck.dc.html','.build/migration/sources/SalesDeck.dc.html');
const exhibitFile=locate('deliverables/exhibit-design/src/TiansightDeck-Exhibit.dc.html','.build/migration/sources/TiansightDeck-Exhibit.dc.html');
const registryFile=locate('content/slide-catalog.js','.build/migration/sources/slide-catalog.js');
const valsFile=locate('deliverables/company-intro-v3/gen/vals.json','.build/migration/sources/vals.json');
const team=json('content/team.json'),contact=json('content/contact.json');
const window={TIANSIGHT_TEAM:team,TIANSIGHT_CONTACT:contact,TIANSIGHTDesignSystem_e0a760:{SlideFrame:()=>{},SlideTitle:()=>{}}};
const sandbox={window,React:{createElement:(type,props,...children)=>({$element:{type,props:{...props,...(children.length?{children:children.length===1?children[0]:children}:{})}}})},DCLogic:class{constructor(){this.props={};}},setTimeout:()=>{}};
vm.createContext(sandbox);vm.runInContext(read(registryFile),sandbox);const registry=window.TIANSIGHT_SLIDE_CATALOG.DECKS;
function logic(code){return vm.runInContext('(function(){'+code+';return new Component().renderVals();})()',sandbox);}
function decode(t){return t.replace(/&#10;/g,'\n').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');}
function expr(s,c){return Function(...Object.keys(c),'return ('+s+')')(...Object.values(c));}
function template(html,ctx){
 html=html.replace(/<sc-for\b([^>]*)>([\s\S]*?)<\/sc-for>/g,(_,attrs,body)=>{let list=attrs.match(/list="{{\s*(.*?)\s*}}"/)[1],as=attrs.match(/as="(.*?)"/)[1];return expr(list,ctx).map(x=>templateExpand(body,{...ctx,[as]:x})).join('');});
 return parseSections(templateExpand(html,ctx),ctx);
}
function templateExpand(html,c){return html.replace(/<sc-if\b[^>]*>([\s\S]*?)<\/sc-if>/g,'$1').replace(/{{\s*(.*?)\s*}}/g,(_,e)=>'__JSON__'+Buffer.from(JSON.stringify(expr(e,c))).toString('base64')+'__END__');}
function value(s){const m=s.match(/^__JSON__(.*?)__END__$/);return m?JSON.parse(Buffer.from(m[1],'base64').toString()):decode(s);}
function parseSections(html){return [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)].map(m=>{const label=value(m[1].match(/data-label="([^"]*)"/)[1]);const tag=m[2].match(/<x-import\b([^>]*)>/)[1];const a=Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],value(x[2])]));const props={...(a['dc-props']||{})};for(const[k,v]of Object.entries(a))if(!['component-from-global-scope','hint-size','dc-props'].includes(k))props[k]=v;return{label,component:a['component-from-global-scope'].split('.').pop(),props};});}
const introCode=read(introDir+'/CompanyIntro.dc.js').replace(/const PEOPLE = \[[\s\S]*?\n    \];/,'const PEOPLE = window.TIANSIGHT_TEAM.people;');
const originalVals=logic(introCode), approved=json(valsFile),diffs=[];
function diff(a,b,p){if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p+'.'+k);}else diffs.push({path:p,source:a,approved:b});}
for(const k of Object.keys(approved))diff(originalVals[k],approved[k],k);
const intro=template(read(introDir+'/CompanyIntro.dc.html'),{...originalVals,...approved});
const salesHTML=read(salesFile),sales=template(salesHTML,logic(salesHTML.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1]));
const exhibitHTML=read(exhibitFile),exhibitCode=exhibitHTML.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
// Store raw strings; the manifest applies the original wrapping transform at build time.
const exhibit=logic(exhibitCode.replace('Object.assign(deep(s.props),','Object.assign(s.props,')).slides.map(s=>({label:s.label,component:s.comp.startsWith('EXH.')?'ext:'+s.comp.split('.').pop():s.comp.split('.').pop(),props:s.props}));
const ext=exhibitCode.slice(exhibitCode.indexOf('const h ='),exhibitCode.indexOf('// 设计系统就绪后再注册'));
fs.mkdirSync('content/extensions',{recursive:true});fs.writeFileSync('content/extensions/exhibit.js','// Source-bound exhibit components.\n(function(){\n'+ext+'\nwindow.TIANSIGHT_EXT=window.TIANSIGHT_EXT||{};window.TIANSIGHT_EXT.exhibit={PhotoPoints,zoneChart};\n})();\n');
const pathsFile='.build/migration/asset-paths.json',assetPaths=fs.existsSync(pathsFile)?json(pathsFile):{};
Object.assign(assetPaths,fs.existsSync('assets/path-map.json')?json('assets/path-map.json').runtime:{});
const assetKeys=new Set(['image','photo','logo','src','qr']);
function assets(x,k){if(Array.isArray(x))return x.map(v=>assets(v,k));if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([a,b])=>[a,assets(b,a)]));if(typeof x==='string'&&assetKeys.has(k)&&/\.(png|jpe?g|webp|svg)$/i.test(x)){let target=assetPaths[x]||assetPaths[x.replace(/^\.\//,'')]||assetPaths[x.replace(/^logos\//,'partners/')];return target?{$asset:target}:x;}return x;}
const clean=p=>{const v=JSON.parse(JSON.stringify(p));delete v.page;return v;};
const uuid5=name=>{const ns=Buffer.from('6ba7b8119dad11d180b400c04fd430c8','hex'),b=crypto.createHash('sha1').update(ns).update(name).digest().subarray(0,16);b[6]=(b[6]&15)|80;b[8]=(b[8]&63)|128;const h=b.toString('hex');return`${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;};
const library=new Map();
for(const[deck,data]of Object.entries(registry))for(const s of data.slides)if(!library.has(s.id))library.set(s.id,{...s,owner:deck,status:'planned'});
const byLabel=deck=>new Map(registry[deck].slides.map(s=>[s.label,s]));
const introMap=byLabel('intro');
const aliases={'节首 · 服务模块':'节首 · 一','团队 · 总览':'团队'};
for(const [source,target] of Object.entries(aliases))introMap.set(source,introMap.get(target));
for(let i=0;i<approved.cases.length;i++){const r=registry.intro.slides.find(s=>s.label.startsWith('案例 '+String(i+1).padStart(2,'0')+' ·'));introMap.set(approved.cases[i].label,r);}
function assign(record,slide){Object.assign(record,{component:slide.component,props:assets(clean(slide.props)),status:'maintained'});}
for(const slide of intro){const r=introMap.get(slide.label);if(!r)throw Error('Intro registry missing '+slide.label);assign(library.get(r.id),slide);}
for(const label of ['四个阶段','服务模式','样张为证','图谱','伙伴案例']){const r=introMap.get(label),s=sales.find(x=>x.label===label);assign(library.get(r.id),s);}
const exhibitMap=byLabel('exhibit');for(const s of exhibit){const r=exhibitMap.get(s.label);if(!r)throw Error('Exhibit registry missing '+s.label);if(library.get(r.id).status==='planned')assign(library.get(r.id),s);}
const salesIDs=[];for(const s of sales){let label=s.label==='创始团队'?'团队':s.label;let r=['创始团队','伙伴背书','联系','伙伴案例','四个阶段','服务模式','样张为证','图谱'].includes(s.label)?introMap.get(label):null;if(!r){r={id:uuid5('tiansight:sales:'+s.label),label:s.label,owner:'sales',cat:'service',type:'cards',tags:[],publish:'web',purpose:s.label,status:'maintained'};assign(r,s);library.set(r.id,r);}salesIDs.push(r.id);}
const cases=[];for(let i=0;i<approved.cases.length;i++){const c=approved.cases[i],id='case-'+String(i+1).padStart(2,'0'),summary=assets(clean(c.props));const gallery=exhibit.filter(x=>x.label.includes('游园')&&id==='case-06').map(x=>({label:x.label,component:x.component,props:assets(clean(x.props))}));const record={id,name:c.props.name,summary,gallery,assets:[],approval:{by:'owner',date:'2026-10-21',record:'docs/component-runtime.md'}};function collect(x){if(x&&typeof x==='object'){if(x.$asset)record.assets.push(x.$asset);Object.values(x).forEach(collect);}}collect(summary);collect(gallery);record.assets=[...new Set(record.assets)];cases.push(record);write('content/cases/'+id+'.json',record);const r=library.get(introMap.get(c.label).id);r.props={$case:id};}
for(const [i,s]of exhibit.filter(x=>x.label.includes('游园')).entries()){const r=library.get(exhibitMap.get(s.label).id);r.owner='intro';r.props={$case:'case-06',$view:'gallery:'+i};}
const indexRecord=library.get(introMap.get('伙伴案例 · 索引').id);indexRecord.props.items=cases.map(c=>({$case:c.id,$view:'index'}));
const partners={title:intro.find(x=>x.label==='伙伴背书').props.title,logos:assets(approved.partnerLogos),columns:5};write('content/partners.json',partners);
for(const filename of fs.readdirSync('content/slides').filter(x=>x.endsWith('.json')))if(!library.has(filename.slice(0,-5)))fs.unlinkSync('content/slides/'+filename);
for(const r of library.values()){if(r.status!=='maintained')continue;if(r.component==='ProfileSlide'){r.owner='intro';r.props={$team:r.props.name,eyebrow:r.props.eyebrow};}if(r.component==='ContactSlide'){r.owner='intro';r.props={$contact:true};}if(r.label==='伙伴背书'){r.owner='intro';r.props={$partners:true};}if(r.label==='团队'){r.owner='intro';r.props={...r.props,experts:team.people.map(x=>({$team:x.name,$view:'seat'}))};}write('content/slides/'+r.id+'.json',r);}
for(const r of library.values())if(r.status==='planned')write('content/slides/'+r.id+'.json',r);
const profiles={internal:{publish:['web','banner','internal','hold']},client:{publish:['web','banner']},web:{publish:['web']}};
for(const[id,d]of Object.entries(registry))write('content/decks/'+id+'.json',{id,title:d.title,canonicalSource:id==='intro'?'guidelines/company-intro-v3.md':null,slides:d.slides.map(s=>s.id),params:{date:{default:'2026-10',editor:'text'}},profiles,transforms:id==='exhibit'?['keep-words']:[],...(id==='exhibit'?{footer:'侍天 TIANSIGHT · 餐饮展陈与厨房设计'}:{}),status:id==='kitchen'?'planned':'maintained'});
write('content/decks/sales.json',{id:'sales',title:'侍天 TIANSIGHT 销售提案',slides:salesIDs,params:{date:{default:'2026-10',editor:'text'}},profiles,transforms:[],status:'maintained'});
write('.build/migration/props-differences.json',diffs);write('.build/migration/source-slides.json',{intro,exhibit,sales});write('.build/migration/report.json',{uniqueSlides:library.size,maintained:[...library.values()].filter(x=>x.status==='maintained').length,planned:[...library.values()].filter(x=>x.status==='planned').length,introSourceSlides:intro.length,exhibitSourceSlides:exhibit.length,introClient:registry.intro.slides.filter(x=>profiles.client.publish.includes(x.publish)).length,approvedDifferences:diffs.length,assetMappingApplied:Object.keys(assetPaths).length});
for(const f of [salesFile,exhibitFile,registryFile,valsFile]){const to='.build/migration/sources/'+path.basename(f);fs.mkdirSync(path.dirname(to),{recursive:true});if(f!==to)fs.writeFileSync(to,read(f));}
console.log(read('.build/migration/report.json'));
