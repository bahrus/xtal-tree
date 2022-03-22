export function og2tree(obj, ancestors = []) {
    const nodes = [];
    if (Array.isArray(obj)) {
        let count = 0;
        for (const value of obj) {
            let type = typeof value;
            if (Array.isArray(value))
                type = 'array';
            const name = '[' + count.toString() + ']';
            const node = {
                name,
                path: ancestors.join('.') + name,
                type,
                value,
            };
            if (typeof value === 'object') {
                ancestors.push(name);
                node.children = og2tree(value, ancestors);
                ancestors.pop();
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
            const node = {
                name,
                type,
                value,
                path: ancestors.join('.') + name,
            };
            if (typeof value === 'object') {
                ancestors.push(name);
                node.children = og2tree(value, ancestors);
                ancestors.pop();
            }
            else {
                node.asString = value.toString();
            }
            nodes.push(node);
        }
    }
    return nodes;
}