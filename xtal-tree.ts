import {XtalTreeProps, XtalTreeActions, ITreeNode, IStandardTreeNode, NodeTypes} from './types';
import {XE, PropInfoExt} from 'xtal-element/src/XE.js';
declare function structuredClone<T>(inp: T): T;

export class XtalTree extends HTMLElement implements XtalTreeActions{
    #idToNodeLookup: {[id: string | number]: ITreeNode} = {};
    #openNode: {[path: string]: boolean} = {};
    onNodes({nodes, cloneNodes}: this){
        const nodesCopy = cloneNodes ? structuredClone(nodes) : nodes;
        return {
            nodesCopy,
        }
    }
    calculateViewableNodes({isOpenFn, testNodeFn, childrenFn, idFn, searchString, parentPath}: this, nodesCopy: ITreeNode[], acc: ITreeNode[]) {
        if (!nodesCopy) return acc;
        nodesCopy.forEach(node => {
            if (searchString) {
                if (!isOpenFn(node) && !testNodeFn(node, this.searchString)) return;
            }
            this.#idToNodeLookup[idFn(node)] = node;
            acc.push(node);
            if (isOpenFn(node)) {
                const children = childrenFn(node);
                if (children) {
                    for(const child of children){
                        (<any>child)[parentPath] = node;
                    }
                    this.calculateViewableNodes(this, children, acc);
                }
                
            }
        });
        return acc;
    }

    defineIsOpenFn({isOpenPath}: this) {
        return {
            isOpenFn: (tn: ITreeNode) => {
                const stn = tn as IStandardTreeNode;
                if(stn.path && this.#openNode[stn.path]) return true;
                //TODO:  resolve redundancy
                return (<any>tn)[isOpenPath]
            }
        }
    }
    defineChildrenFn({childrenPath}: this){
        return {
            childrenFn: (tn: ITreeNode) => (<any>tn)[childrenPath]
        }
    }
    defineCompareFn({comparePath, sort}: this) {
        let multiplier = 1;
        switch(sort){
            case 'none':
            case undefined:
                return {
                    compareFn: undefined,
                }
            case 'desc':
                multiplier = -1;
                break;
        }
        return {
            compareFn: (lhs: ITreeNode, rhs: ITreeNode) => {
                const lhsVal = (<any>lhs)[comparePath];
                const rhsVal = (<any>rhs)[comparePath];
                if(lhsVal === undefined && rhsVal === undefined) return 0;
                if(lhsVal === undefined) return -1 * multiplier;
                if(rhsVal === undefined) return 1 * multiplier;
                return (lhsVal > rhsVal ? 1 : lhsVal < rhsVal ? -1 : 0) * multiplier;
            }
        }
    }
    setHasChildren({childrenFn, hasChildrenPath}: this, tn: ITreeNode, recursive: boolean){
        const children = childrenFn(tn);
        const hasChildren = children !== undefined && children.length > 0;
        (<any>tn)[hasChildrenPath] = hasChildren;
        if(recursive){
            for(const child of children){
                this.setHasChildren(this, child, true);
            }
        }
    }
    defineTestNodeFn({testNodePath}: this) {
        return {
            testNodeFn: (tn: ITreeNode, searchString: string) => (<any>tn)[testNodePath].toLowerCase().includes(searchString.toLowerCase())
        }
    }
    defineParentFn({parentPath}: this){
        return {
            parentFn: (tn: ITreeNode) => (<any>tn)[parentPath]
        }
    }
    defineIdFn({idPath}: this) {
        return {
            idFn: (tn: ITreeNode) => (<any>tn)[idPath],
        }
    }
    updateViewableNodes({nodesCopy}: this){
        return {
            viewableNodes: this.calculateViewableNodes(this, nodesCopy, [])
        };
    }
    toggleNode({toggledNode, childrenFn, toggleNodeFn, isOpenFn}: this){
        if(!childrenFn(toggledNode)) return;
        toggleNodeFn(toggledNode);
        const path = (toggledNode as IStandardTreeNode).path
        this.#openNode[path] = !this.#openNode[path];
        return this.updateViewableNodes(this);
    }
    openNode({openedNode, isOpenFn}: this){
        if(!isOpenFn(openedNode)){
            this.toggledNode = openedNode;
            this.#openNode[openedNode.path] = true;
        }else{
            this.#openNode[openedNode.path] = false;
        }
    }
    closeNode({closedNode, isOpenFn}: this){
        if(isOpenFn(closedNode)){
            return {
                toggledNode: closedNode
            }
        }
    }
    onToggledNodePath({toggledNodePath}: this){
        const toggledNode = this.#idToNodeLookup[toggledNodePath];
        return {toggledNode};
    }
    defineToggledNodeFn({toggleNodePath}: this){
        return {
            toggleNodeFn: (tn: ITreeNode) => (<any>tn)[toggleNodePath] = !(<any>tn)[toggleNodePath]
        }
    }
    setLevels({nodesCopy, levelPath, marginStylePath, childrenFn}: this, passedInNodes?: ITreeNode[], level?: number): void {
        if(passedInNodes === undefined) passedInNodes = nodesCopy;
        if(level === undefined) level = 0;
        for(const node of passedInNodes){
            this.setHasChildren(this, node, false);
            (<any>node)[levelPath] = level;
            (<any>node)[marginStylePath] = "margin-left:" + level * 18 + "px";
            const children = childrenFn(node);
            if(children === undefined) continue;
            this.setLevels(this, children, level + 1);
        }
    }

    search({nodesCopy, testNodeFn, searchString, isOpenFn, toggleNodeFn, childrenFn}: this, passedInNodes?: ITreeNode[], passedInParent?: ITreeNode){
        //if(passedInNodes === undefined) this.onCollapseAll(this);
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
             
            if(testNodeFn(node, searchString)){
                if(!isOpenFn(node)){
                    toggleNodeFn(node);
                }
            }else{
                const children = childrenFn(node);
                if(children !== undefined){
                    this.search(this, children, node);
                    if(passedInParent && isOpenFn(node) && !isOpenFn(passedInParent)){
                        toggleNodeFn(passedInParent)
                    }
                }
            }
            
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this);
    }

    onCollapseAll({nodesCopy, isOpenFn, toggleNodeFn, childrenFn}: this, passedInNodes?: ITreeNode[]){
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if(isOpenFn(node)) toggleNodeFn(node);
            const children = childrenFn(node);
            if(children !== undefined) this.onCollapseAll(this, children);
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this);
    }

    onExpandAll({nodesCopy, isOpenFn, toggleNodeFn, childrenFn}: this, passedInNodes?: ITreeNode[]){
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if(!isOpenFn(node)) toggleNodeFn(node);
            const children = childrenFn(node);
            if(children !== undefined) this.onExpandAll(this, children);
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this);
    }

    onSort({nodesCopy, compareFn, childrenFn}: this, passedInNodes?: ITreeNode[]){
        const nodes = passedInNodes || nodesCopy;
        nodes.sort(compareFn);
        nodes.forEach(node => {
            const children = childrenFn(node);
            if(children !== undefined) this.onSort(this, children);
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this);
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
        
        const {updateOGFromPath} = await import('./updateOGFromPath.mjs');
        updateOGFromPath(objectGraph, name, value);
        this.updateCount++;
    }

    synchNodesCopyOrObjectGraph({nodes, cloneNodes, objectGraph}: this){
        if(objectGraph === undefined) return;
        const objectGraphCopy = Array.isArray(objectGraph) ? [...objectGraph] : {...objectGraph};
        return {
            objectGraph: objectGraphCopy,
        };
    }
    async onNewNode({newNode, objectGraph}: this){
        const {addPropToOG} = await import('./addPropToOG.mjs');
        addPropToOG(objectGraph, newNode.name, newNode.value as NodeTypes, this, (og) => {
            this.#openNode[newNode.name] = true;
            this.updateCount++;
        });
        
    }

    async onDeleteNode({deleteNode, objectGraph}: this){
        const {deleteOGNodeFromPath} = await import('./deleteOGNodeFromPath.mjs');
        deleteOGNodeFromPath(objectGraph, deleteNode.name);
        delete this.#openNode[deleteNode.name];
        this.updateCount++;
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
            childrenPath: 'children',
            isOpenPath: 'open',
            testNodePath: 'name',
            idPath: 'id',
            parentPath: 'parent',
            toggleNodePath: 'open',
            marginStylePath: 'marginStyle',
            levelPath: 'level',
            hasChildrenPath: 'hasChildren',
            collapseAll: false,
            expandAll: false,
            sort: 'none',
            comparePath: 'name',
            updateCount: 0,
            updateCountEcho: 0,
            cloneNodes: false,
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
            updateCount:{
                notify:{
                    echoDelay: 200,
                    echoTo: 'updateCountEcho',
                }
            }
        },
        actions: {
            defineIsOpenFn: 'isOpenPath',
            defineIdFn: 'idPath',
            defineChildrenFn: 'childrenPath',
            defineTestNodeFn: 'testNodePath',
            defineToggledNodeFn: 'toggleNodePath',
            defineCompareFn:{
                ifAllOf:['sort', 'comparePath']
            },
            onSort:'compareFn',
            toggleNode: {
                ifAllOf: ['toggledNode', 'childrenFn', 'toggleNodeFn', 'idFn']
            },
            updateViewableNodes:{
                ifAllOf: ['nodesCopy', 'idFn']
            },
            onToggledNodePath: 'toggledNodePath',
            setLevels:{
                ifAllOf:['nodesCopy', 'levelPath', 'marginStylePath', 'childrenFn']
            },
            onCollapseAll: 'collapseAll',
            onExpandAll: 'expandAll',
            search:'searchString',
            onNodes: 'nodes',
            onObjectGraph: 'objectGraph',
            onEditedNode: 'editedNode',
            synchNodesCopyOrObjectGraph:{
                ifEquals:['updateCount', 'updateCountEcho'],
                //ifAllOf:['updateCount', 'updateCountEcho', 'objectGraph']
            },
            onNewNode: 'newNode',
            onDeleteNode: 'deleteNode',
        },
    },
    superclass: XtalTree,
});