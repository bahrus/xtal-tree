import {og2tree} from '../og2tree.mjs';
import {tree2og} from '../tree2og.mjs';

const test1 = [1, 2, 3, 4, 5];

const tree = og2tree(test1);

console.log(JSON.stringify(tree, null, 2));

const og = tree2og(tree);

console.log(JSON.stringify(og, null, 2));