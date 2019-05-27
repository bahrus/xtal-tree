const fs = require('fs');
const dirS = fs.readFileSync('demo/directory.json').toString();
const dir = JSON.parse(dirS);
const html = generateNode(dir);
fs.writeFileSync('demo/lazyDirectory.html', html);
function generateNode(node){
    let returnStr = '';
    if(!node) return returnStr;
    node.forEach(child =>{
        if(child.children){
            returnStr += /* html */`<details>
    <summary>${child.name}</summary>
    <laissez-dom style="margin-left:20px"><template>
        ${generateNode(child.children)}
    </template></laissez-dom>
</details>
`;
        }else{
            returnStr += /* html */`<div>${child.name}</div>`
        }

        
    })
    return returnStr;
}