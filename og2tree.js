export function og2tree(obj, ancestors = []) {
    const nodes = [];
    if (Array.isArray(obj)) {
        let count = 0;
        for (const val of obj) {
            let type = typeof val;
            if (Array.isArray(val))
                type = 'array';
            const name = '[' + count.toString() + ']';
            const node = {
                name,
                path: ancestors.join('.') + name,
                type,
                val,
            };
            ancestors.push(name);
            node.children = og2tree(val, ancestors);
            ancestors.pop();
            nodes.push(node);
            count++;
        }
    }
    else {
        for (const name in obj) {
            const val = obj[name];
            let type = typeof val;
            if (Array.isArray(val))
                type = 'array';
            const node = {
                name,
                type,
                val,
                path: ancestors.join('.') + name,
            };
            switch (typeof val) {
                case 'object':
                    ancestors.push(name);
                    node.children = og2tree(val, ancestors);
                    ancestors.pop();
                    break;
            }
            nodes.push(node);
        }
    }
    return nodes;
}
