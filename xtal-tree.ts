import {XtalTreeProps, XtalTreeActions, ITreeNode, NodeTypes} from './types';
import {XE, PropInfoExt} from 'xtal-element/src/XE.js';
declare function structuredClone<T>(inp: T): T;

export class XtalTree extends HTMLElement implements XtalTreeActions{
    #idToNodeLookup: {[id: string | number]: ITreeNode} = {};
    #openNode: {[path: string]: boolean} = {};
    #timestamp = 0;
    onNodes({nodes, cloneNodes}: this){
        const nodesCopy = cloneNodes ? structuredClone(nodes) : nodes;
        return {
            nodesCopy,
        }
    }
    calculateViewableNodes({searchString}: this, nodesCopy: ITreeNode[], acc: ITreeNode[]) {
        if (!nodesCopy) return acc;
        nodesCopy.forEach(node => {
            if(this.#openNode[node.path]){
                this.#updateNode(node, 'open', true);
            }
            if (searchString) {
                if (!this.isOpen(node) && !this.matchesSearch(node)) return;
            }
            this.#idToNodeLookup[node.path] = node;
            acc.push(node);
            if (this.isOpen(node)) {
                const children = node.children;
                if (children) {
                    for(const child of children){
                        this.#updateNode(child, 'parent', node);
                    }
                    this.calculateViewableNodes(this, children as ITreeNode[], acc);
                }
                
            }
        });
        return acc;
    }

    isOpen(tn: ITreeNode){
        return tn.open || this.#openNode[tn.path];
    }


    compare(lhs: ITreeNode, rhs: ITreeNode): number{
        const {sort} = this;
        let multiplier = 1;
        switch(sort){
            case 'none':
            case undefined:
                return 0;
            case 'desc':
                multiplier = -1;
                break;
        }
        const lhsVal = lhs.value || lhs.name;
        const rhsVal = rhs.value || rhs.name;
        if(lhsVal === undefined && rhsVal === undefined) return 0;
        if(lhsVal === undefined) return -1 * multiplier;
        if(rhsVal === undefined) return 1 * multiplier;
        return (lhsVal > rhsVal ? 1 : lhsVal < rhsVal ? -1 : 0) * multiplier;  
    }
    setHasChildren({}: this, tn: ITreeNode, recursive: boolean){
        const {children} = tn;
        const hasChildren = children !== undefined && children.length > 0;
        this.#updateNode(tn, 'hasChildren', hasChildren);
        this.#updateNode(tn, 'canHaveChildren', tn.type === 'array' || tn.type === 'object');
        if(recursive && hasChildren){
            for(const child of children){
                this.setHasChildren(this, child, true);
            }
        }
    }
    matchesSearch(node: ITreeNode){
        const {testNodePaths, searchString} = this;
        if(!searchString) return false;
        for(const path of testNodePaths){
            const val = (<any>node)[path];
            if(typeof val != 'string') continue;
            if(val.toLowerCase().includes(searchString.toLowerCase())) return true;
        }
        return false;
    }


    updateViewableNodes({nodesCopy}: this, updateTimestamps: boolean){
        const viewableNodes = this.calculateViewableNodes(this, nodesCopy, []);
        if(updateTimestamps){
            for(const node of viewableNodes){
                node.timeStamp = this.#timestamp++;
            }
        }

        return {
            viewableNodes 
        };
    }
    toggleNode({toggledNode}: this){
        if(!toggledNode.children) return;
        this.doToggleNode(toggledNode);
        const path = (toggledNode as ITreeNode).path
        this.#openNode[path] = !this.#openNode[path];
        return this.updateViewableNodes(this, !toggledNode.open);
    }
    openNode({openedNode}: this){
        if(!this.isOpen(openedNode)){
            this.toggledNode = openedNode;
            this.#openNode[openedNode.path] = true;
        }else{
            this.#openNode[openedNode.path] = false;
        }
    }
    closeNode({closedNode}: this){
        if(this.isOpen(closedNode)){
            return {
                toggledNode: closedNode
            }
        }
    }
    onToggledNodePath({toggledNodePath}: this){
        const toggledNode = this.#idToNodeLookup[toggledNodePath];
        return {toggledNode};
    }

    doToggleNode(tn: ITreeNode){
        this.#updateNode(tn, 'open', !tn.open);
    }
    setLevels({nodesCopy, indentFactor}: this, passedInNodes?: ITreeNode[], level?: number): void {
        if(passedInNodes === undefined) passedInNodes = nodesCopy;
        if(level === undefined) level = 0;
        for(const node of passedInNodes){
            this.setHasChildren(this, node, false);
            this.#updateNode(node, 'level', level);
            this.#updateNode(node, 'marginStyle', "margin-left:" + level * indentFactor + "px");
            const children = node.children;
            if(children === undefined) continue;
            this.setLevels(this, children, level + 1);
        }
    }


    search({nodesCopy, searchString}: this, passedInNodes?: ITreeNode[], passedInParent?: ITreeNode){
        if(passedInNodes === undefined) this.onCollapseAll(this);
        let foundMatch = false;
        const nodes = passedInNodes || nodesCopy;
        for(const node of nodes){
            if(this.matchesSearch(node)){
                foundMatch = true;
                if(!this.isOpen(node)){
                    this.doToggleNode(node);
                }
            }else{
                const children = node.children;
                if(children !== undefined){
                    const foundChildMatch = this.search(this, children, node);
                    if(foundChildMatch) foundMatch = true;
                    if(passedInParent && this.isOpen(node) && !this.isOpen(passedInParent)){
                        this.doToggleNode(passedInParent)
                    }
                }
            }
            
        };
        if(foundMatch && passedInParent && !this.isOpen(passedInParent)){
            this.doToggleNode(passedInParent);
        }
        if(passedInNodes === undefined) {
            this.viewableNodes = this.updateViewableNodes(this, true).viewableNodes;
        }
        return foundMatch;
    }

    onCollapseAll({nodesCopy}: this, passedInNodes?: ITreeNode[]){
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if(this.isOpen(node)) this.doToggleNode(node);
            this.#openNode[node.path] = false;
            const children = node.children;
            if(children !== undefined) this.onCollapseAll(this, children);
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this, true);
    }

    onExpandAll({nodesCopy}: this, passedInNodes?: ITreeNode[]){
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if(!this.isOpen(node)) this.doToggleNode(node);
            this.#openNode[node.path] = true;
            const children = node.children;
            if(children !== undefined) this.onExpandAll(this, children);
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this, false);
    }

    onSort({nodesCopy}: this, passedInNodes?: ITreeNode[]){
        const nodes = passedInNodes || nodesCopy;
        nodes.sort(this.compare);
        nodes.forEach(node => {
            const children = node.children;
            if(children !== undefined) this.onSort(this, children);
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this, true);
    }

    async onObjectGraph({objectGraph}: this)  {
        const {og2tree} = await import('./og2tree.mjs');
        return {
            nodes: og2tree(objectGraph),
        };
    }

    async onEditedNode({editedNode, nodes, objectGraph}: this) {
        if(objectGraph === undefined) return;
        const {name, value} = editedNode;
        let val: any = value;
        if(editedNode instanceof HTMLInputElement){
            const {type, checked, valueAsNumber} = editedNode;
            switch(type){
                case 'checkbox':
                    val = checked;
                    break;
                case 'number':
                    val = valueAsNumber;
                    break;
            }
        }
        const {updateOGFromPath} = await import('./updateOGFromPath.mjs');
        updateOGFromPath(objectGraph, name, val);
        this.updateCount++;
    }

    synchNodesCopyOrObjectGraph({nodes, cloneNodes, objectGraph}: this){
        if(objectGraph === undefined) return;
        const objectGraphCopy = Array.isArray(objectGraph) ? [...objectGraph] : {...objectGraph};
        return {
            objectGraph: objectGraphCopy,
        };
    }
    #addedName: string = '';
    async onNewNode({newNode, objectGraph}: this){
        const {addPropToOG} = await import('./addPropToOG.mjs');
        this.#addedName = newNode.name;
        addPropToOG(objectGraph, this.#addedName, newNode.value as NodeTypes, this, async (og) => {
            const name = this.#addedName;
            console.log(this.#addedName);
            this.#openNode[name] = true;
            if(name !== ''){
                const {getTreeNodeFromPath} = await import('./getTreeNodeFromPath.mjs');
                const ref = getTreeNodeFromPath(this.nodesCopy as ITreeNode[], name) as ITreeNode;
                (<any>ref).node.open = true;
            }
            this.updateCount++;
        });
        
    }

    async onDeleteNode({deleteNode, objectGraph}: this){
        const {deleteOGNodeFromPath} = await import('./deleteOGNodeFromPath.mjs');
        await deleteOGNodeFromPath(objectGraph, deleteNode.name);
        this.updateCount++;
    }

    async onCopyNodeToClipboard({copyNodeToClipboard, objectGraph}: this){
        const {copyOGNodeToClipboard} = await import('./copyOGNodeToClipboard.mjs');
        copyOGNodeToClipboard(objectGraph, copyNodeToClipboard.name);
    }

    async onExpandAllNode({expandAllNode, nodesCopy}: this) {
        const {getTreeNodeFromPath} = await import('./getTreeNodeFromPath.mjs');
        const node = getTreeNodeFromPath(nodesCopy as ITreeNode[], expandAllNode.name);
        this.onExpandAll(this, [node.node!]);
        return this.updateViewableNodes(this, false);
    }

    async onCollapseAllNode({collapseAllNode, nodesCopy}: this) {
        const {getTreeNodeFromPath} = await import('./getTreeNodeFromPath.mjs');
        const node = getTreeNodeFromPath(nodesCopy as ITreeNode[], collapseAllNode.name);
        this.onCollapseAll(this, [node.node!]);
        return this.updateViewableNodes(this, true);
    }

    makeDownloadBlob({objectGraph}: this){
        const file = new Blob([JSON.stringify(objectGraph, null, 2)], {type: 'text/json'});
        this.downloadHref = URL.createObjectURL(file);
    }

    #updateNode(node: ITreeNode, prop: keyof ITreeNode, val: any){
        if(node[prop] === val) return;
        (node as any)[prop] = val;
        node.timeStamp = this.#timestamp++;
    }

}

export interface XtalTree extends XtalTreeProps{}


const dispatch = {
    notify:{
        dispatch: true
    }
};

const noDry: PropInfoExt ={
    dry: false
}

const noDryNoP: PropInfoExt = {
    dry: false,
    parse: false,
}

const xe = new XE<XtalTreeProps, XtalTreeActions>({
    config:{
        tagName: 'xtal-tree',
        propDefaults: {
            testNodePaths: ['name', 'value'],
            //marginStylePath: 'marginStyle',
            //levelPath: 'level',
            collapseAll: false,
            expandAll: false,
            sort: 'none',
            updateCount: 0,
            updateCountEcho: 0,
            cloneNodes: false,
            indentFactor: 25,
        },
        propInfo: {
            toggledNode:{
                notify:{
                    dispatch: true
                },
                dry: false,
            },
            newNode:noDryNoP,
            toggledNodePath:noDry,
            editedNode:noDryNoP,
            viewableNodes:dispatch,
            collapseAll:noDry,
            expandAll:noDry,
            expandAllNode:noDryNoP,
            collapseAllNode:noDryNoP,
            updateCount:{
                notify:{
                    echoDelay: 200,
                    echoTo: 'updateCountEcho',
                }
            },
            copyNodeToClipboard: noDryNoP,
            downloadHref: noDryNoP,
        },
        actions: {

            toggleNode: {
                ifAllOf: ['toggledNode']
            },
            updateViewableNodes:{
                ifAllOf: ['nodesCopy']
            },
            onToggledNodePath: 'toggledNodePath',
            setLevels:{
                ifAllOf:['nodesCopy']
            },
            onCollapseAll: 'collapseAll',
            onExpandAll: 'expandAll',
            search:{
                ifKeyIn:['searchString'],
            },
            onNodes: 'nodes',
            onObjectGraph: 'objectGraph',
            onEditedNode: 'editedNode',
            synchNodesCopyOrObjectGraph:{
                ifEquals:['updateCount', 'updateCountEcho'],
            },
            onNewNode: 'newNode',
            onDeleteNode: 'deleteNode',
            onCopyNodeToClipboard: 'copyNodeToClipboard',
            onExpandAllNode: 'expandAllNode',
            onCollapseAllNode: 'collapseAllNode',
            makeDownloadBlob: {
                ifAllOf: ['objectGraph'],
                ifKeyIn: ['updateCount', 'updateCountEcho'],
                ifEquals: ['updateCount', 'updateCountEcho'],
            }
        },
    },
    superclass: XtalTree,
});