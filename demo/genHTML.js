const fs = require('fs');
const dirS = fs.readFileSync('demo/directory.json').toString();
const dir = JSON.parse(dirS);
const html = generateNode(dir);
fs.writeFileSync('demo/directory.html', html);
function generateNode(node){
    let returnStr = '';
    if(!node) return returnStr;
    node.forEach(child =>{
        returnStr += /* html */`<details>
    <summary>${child.name}</summary>
    <div style="margin-left:20px">
        ${generateNode(child.children)}
    </div>
</details>
`;
        
    })
    return returnStr;
}