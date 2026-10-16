import ts from "typescript";
import { createHash } from "node:crypto";
import { readFile, writeFile, readdir } from "node:fs/promises";

// Register visible copy as stable, React-rendered fields. No HTML is accepted.
const excluded = new Set(["main.tsx","guest-pages.tsx",""]);
const entityData = new Set(["rooms-data.tsx","travel-data.tsx","food-menu-data.tsx","guest-faq-data.ts"]);
const manifest = JSON.parse(await readFile("cms/manifest.json","utf8"));
const fields = new Map(manifest.contentFields.map(field=>[field.id,field]));
const decode = text => text.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[\da-f]+);/gi,entity=>({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":"\"","&apos;":"'","&nbsp;":"\u00a0"}[entity] ?? String.fromCodePoint(entity[2].toLowerCase()==="x" ? parseInt(entity.slice(3,-1),16) : parseInt(entity.slice(2,-1),10))));
function cleanJSX(text) {
  const lines=text.split(/\r\n|\n|\r/); let last=0;
  for(let i=0;i<lines.length;i++) if(/[^\t ]/.test(lines[i]))last=i;
  return decode(lines.map((line,i)=>{let value=line.replace(/\t/g," ");if(i!==0)value=value.replace(/^ +/,"");if(i!==lines.length-1)value=value.replace(/ +$/,"");return value+(value&&i!==last?" ":"");}).join(""));
}
for(const filename of await readdir("app")) {
  if(!/\.tsx?$/.test(filename)||excluded.has(filename)||filename.startsWith("guest-policy-data"))continue;
  const path=`app/${filename}`;const source=await readFile(path,"utf8");
  const file=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,filename.endsWith("tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);const edits=[];
  function register(node,value,jsx=false) {
    if(!value.trim()||value.trim().length<2)return;
    const id=filename.replace(/\.[^.]+$/,"")+":"+createHash("sha256").update(value).digest("hex").slice(0,12);
    fields.set(id,{id,source:filename,label:value.trim().slice(0,85),defaultValue:value});
    edits.push({start:node.getStart(file),end:node.end,text:`${jsx?"{":""}cmsText(${JSON.stringify(id)}, ${JSON.stringify(value)})${jsx?"}":""}`});
  }
  function visit(node) {
    if(ts.isCallExpression(node)&&node.expression.getText(file)==="cmsText")return;
    if(ts.isJsxText(node))register(node,cleanJSX(node.getText(file)),true);
    else if(ts.isStringLiteral(node)&&ts.isJsxAttribute(node.parent)&&["title","description","eyebrow","label"].includes(node.parent.name.getText(file))&&node.text.trim().length>2) register(node,node.text,true);
    else if(ts.isStringLiteral(node)&&!entityData.has(filename)) {
      const parent=node.parent;
      const key=ts.isPropertyAssignment(parent)?parent.name.getText(file).replace(/["']/g,""):"";
      if(["title","description","intro","overview","caption","question","answer","concept","detail"].includes(key)&&node.text.length>12) register(node,node.text);
    }
    ts.forEachChild(node,visit);
  }
  visit(file);
  if(edits.length){let result=source;for(const edit of edits.sort((a,b)=>b.start-a.start))result=result.slice(0,edit.start)+edit.text+result.slice(edit.end);if(!source.includes('import { cmsText'))result='import { cmsText } from "../cms/client";\n'+result;await writeFile(path,result);}
}
// Policy paragraphs remain text-only and use the same editor, including arrays.
const policyPath="app/guest-policy-data.ts";
let policy=await readFile(policyPath,"utf8");
if(!policy.includes('import { cmsText')){
 const file=ts.createSourceFile(policyPath,policy,ts.ScriptTarget.Latest,true);const edits=[];
 function visit(node){if(ts.isStringLiteral(node)&&!(ts.isPropertyAssignment(node.parent)&&node.parent.name===node)&&node.text.length>28&&node.text.includes(" ")){const id="guest-policy-data:"+createHash("sha256").update(node.text).digest("hex").slice(0,12);fields.set(id,{id,source:"guest-policy-data.ts",label:node.text.slice(0,85),defaultValue:node.text});edits.push({start:node.getStart(file),end:node.end,text:`cmsText(${JSON.stringify(id)}, ${JSON.stringify(node.text)})`});}ts.forEachChild(node,visit);}visit(file);
 for(const edit of edits.sort((a,b)=>b.start-a.start))policy=policy.slice(0,edit.start)+edit.text+policy.slice(edit.end);
 await writeFile(policyPath,'import { cmsText } from "../cms/client";\n'+policy);
}
manifest.contentFields=[...fields.values()];await writeFile("cms/manifest.json",JSON.stringify(manifest,null,2));
console.log(`Registered ${fields.size} editable content fields.`);
