// Browser-side capture shared by exporter and rendering regression tests.
export function captureSlide(el){
   const b=el.getBoundingClientRect(),clipped=[],rendered=[];
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
   while(node=walker.nextNode()){
    if(!node.textContent.trim()||['SCRIPT','STYLE'].includes(node.parentElement.tagName))continue;
    const style=getComputedStyle(node.parentElement);if(style.visibility==='hidden'||style.display==='none')continue;
    const range=document.createRange();range.selectNodeContents(node);
    if([...range.getClientRects()].some(r=>r.width&&r.height)){
     const lang=node.parentElement.closest('[lang]')?.lang||document.documentElement.lang||undefined;
     let text=node.textContent;
     if(style.textTransform==='uppercase')text=text.toLocaleUpperCase(lang);
     else if(style.textTransform==='lowercase')text=text.toLocaleLowerCase(lang);
     else if(style.textTransform==='capitalize')text=text.replace(/(^|[^\p{L}\p{N}])(\p{L})/gu,(_,prefix,letter)=>prefix+letter.toLocaleUpperCase(lang));
     rendered.push(text);
    }
    if([...range.getClientRects()].some(r=>r.width&&r.height&&(r.left<b.left-2||r.right>b.right+2||r.top<b.top-2||r.bottom>b.bottom+2)))clipped.push(node.textContent.trim());
   }
   const numericRanges=[];
   const textWalker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let textNode;
   while(textNode=textWalker.nextNode()){
    if(['SCRIPT','STYLE'].includes(textNode.parentElement.tagName))continue;
    const style=getComputedStyle(textNode.parentElement);if(style.visibility==='hidden'||style.display==='none')continue;
    const positions=[];let clean='';textNode.textContent.split('').forEach((c,i)=>{if(c==='\u2060')return;for(const n of c.normalize('NFKC')){positions.push(i);clean+=n;}});
    for(const match of clean.matchAll(/[+−-]?\d+(?:[.,]\d+)*(?:%|\+(?!\d))?/g)){
     const range=document.createRange();range.setStart(textNode,positions[match.index]);range.setEnd(textNode,positions[match.index+match[0].length-1]+1);
     const rects=[...range.getClientRects()].filter(r=>r.width&&r.height).map(r=>[r.left-b.left,r.top-b.top,r.right-b.left,r.bottom-b.top]);
     if(rects.length)numericRanges.push({text:match[0],rects});
    }
   }
   return {id:el.dataset.slideId,text:rendered.join('').replace(/\u2060/g,''),clipped,numericRanges};
}
