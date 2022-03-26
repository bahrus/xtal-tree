import {og2tree} from '../og2tree.mjs';
import {getTreeNodeFromPath} from '../getTreeNodeFromPath.mjs';
import {} from '../getOGFromPath.mjs';

const test1 = [1, 2, 3, 4, 5];

const tree1 = og2tree(test1);

//console.log(JSON.stringify(tree, null, 2));

const testPath1 = getTreeNodeFromPath(tree1, '[1]');



//console.log(JSON.stringify(testPath1, null, 2));

const test2 = {
    "string":"foo",
    "number":5,
    "array":[
        1,2,3,4,5
    ],
    "object":{
        "property":"value",
        "subobj":{
            "arr":["foo","ha"],
            "numero":1
        }
    }
};

//console.log(JSON.stringify(og2tree(test2), null, 2));

const tree2 = og2tree(test2);

const testPath2 = getTreeNodeFromPath(tree2, 'object.subobj.arr[1]');

console.log(JSON.stringify(testPath2, null, 2));