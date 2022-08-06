export function og2tree(obj, xt, ancestors = []) {
    const nodes = [];
    if (Array.isArray(obj)) {
        let count = 0;
        for (const value of obj) {
            let type = typeof value;
            if (Array.isArray(value))
                type = 'array';
            const name = '[' + count.toString() + ']';
            const dlim = ancestors.length === 0 ? '' : '.';
            const node = {
                name,
                path: ancestors.join('.') + dlim + name,
                type,
                value,
            };
            xt.ts(node);
            if (typeof value === 'object') {
                ancestors.push(name);
                node.children = og2tree(value, xt, ancestors);
                ancestors.pop();
                node.asString = toString(value, 75);
            }
            else {
                node.asString = value.toString();
            }
            nodes.push(node);
            count++;
        }
    }
    else {
        for (const name in obj) {
            const value = obj[name];
            let type = typeof value;
            if (Array.isArray(value))
                type = 'array';
            const dlim = ancestors.length === 0 ? '' : '.';
            const node = {
                name,
                type,
                value,
                path: ancestors.join('.') + dlim + name,
            };
            if (typeof value === 'object') {
                ancestors.push(name);
                node.children = og2tree(value, xt, ancestors);
                ancestors.pop();
                node.asString = toString(value, 75);
            }
            else {
                node.asString = value.toString();
            }
            nodes.push(node);
        }
    }
    return nodes;
}
function toString(obj, max) {
    let ret = JSON.stringify(obj);
    if (ret.length > max * 2) {
        ret = ret.substring(0, max) + '...' + ret.substring(ret.length - max);
    }
    return ret;
}
