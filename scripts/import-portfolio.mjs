import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const sourcePath=process.argv[2];
if(!sourcePath)throw Error('Usage: node scripts/import-portfolio.mjs path/to/portfolio/index.html');
const source=fs.readFileSync(sourcePath,'utf8');
const start=source.indexOf('const NEEDS =');const end=source.indexOf('</script>',start);
const data=JSON.parse(vm.runInNewContext(source.slice(start,end)+'\nJSON.stringify({profile,services,processPhases,skillGroups,home,experience,projects,objects})',{}, {timeout:1000}));
const images=JSON.parse(source.match(/const IMG = (\{[^\n]+\});/)[1]);
const models=JSON.parse(source.match(/window\.OBJ_HTML = (\{[^\n]+\});/)[1]);
fs.mkdirSync('public/portfolio/images',{recursive:true});fs.mkdirSync('public/portfolio/models',{recursive:true});fs.mkdirSync('src/content',{recursive:true});
const paths={};
for(const [name,url]of Object.entries(images)){
 const match=url.match(/^data:([^;,]+);base64,(.*)$/s);if(!match)throw Error(`Unknown asset ${name}`);
 const ext=({'image/svg+xml':'.svg','image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp'})[match[1]];if(!ext)throw Error(`Unknown mime ${match[1]}`);
 const filename=path.parse(name).name+ext;fs.writeFileSync('public/portfolio/images/'+filename,Buffer.from(match[2],'base64'));paths[name]='/portfolio/images/'+filename;
}
function mapImages(value){if(typeof value==='string')return paths[value]||value;if(Array.isArray(value))return value.map(mapImages);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,mapImages(v)]));return value}
for(const[name,html]of Object.entries(models)){if(!/^obj-[a-z0-9-]+$/.test(name))throw Error('Invalid model name');fs.writeFileSync(`public/portfolio/models/${name}.html`,html)}
const faStart=source.indexOf('const FA = {');const faEnd=source.indexOf('const FA_RX',faStart);
const fa=JSON.parse(vm.runInNewContext(source.slice(faStart,faEnd)+'\nJSON.stringify(FA)',{}, {timeout:1000}));
fs.writeFileSync('src/content/portfolio-source.json',JSON.stringify(mapImages(data),null,2)+'\n');
fs.writeFileSync('src/content/portfolio-fa.json',JSON.stringify(fa,null,2)+'\n');
fs.writeFileSync('docs/migration/portfolio-asset-manifest.json',JSON.stringify({source:'https://github.com/archvanta/portfolio',projectCount:data.projects.length,imageCount:Object.keys(images).length,modelCount:Object.keys(models).length,assets:paths},null,2)+'\n');
console.log(JSON.stringify({projects:data.projects.length,images:Object.keys(images).length,models:Object.keys(models).length,translations:Object.keys(fa).length}));
