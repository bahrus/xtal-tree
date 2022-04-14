
interface INodeState {
}

interface INodePosition {
    node: IStandardTreeNode,
    position: number
}



export interface IStandardTreeNode{
    children?: IStandardTreeNode[];
    name: string;
    path: string;
    value: any;
    asString?: string;
    type: string;
    parent?: IStandardTreeNode;
    open?: boolean;
}

export interface INodeRef{
    //baseValue: any;
    prop?: string;
    idx?: number;
    node?: IStandardTreeNode;
}

export interface IOGRef{
    prop?: string;
    idx?: number;
    baseValue: any;
}

export interface XtalTreeProps{
    /**
     * Do a structural clone before doing any modifications on the data.
     * A bit of performance penalty, but can avoid unexpected side effects
     */
    clone: boolean;
    childrenFn: (tn: IStandardTreeNode) => IStandardTreeNode[];
    childrenPath: string;
    hasChildrenFn: (tn: IStandardTreeNode) => boolean;
    hasChildrenPath: string;
    isOpenFn: (tn: IStandardTreeNode) => boolean;
    isOpenPath: string;
    idFn: (tn: IStandardTreeNode) => string | number;
    idPath: string;
    nodes: IStandardTreeNode[];
    searchString: string;
    testNodeFn: (tn: IStandardTreeNode, search: string) => boolean;
    testNodePaths: string[];
    compareFn: (lhs: IStandardTreeNode, rhs: IStandardTreeNode) => number;
    comparePath: string;
    parentFn: (tn: IStandardTreeNode) => IStandardTreeNode;
    parentPath: string;
    sort: 'asc' | 'desc' | 'none' | undefined;
    viewableNodes: IStandardTreeNode[];
    toggleNodeFn: (tn: IStandardTreeNode) => void;
    toggleNodePath: string;
    toggledNode: IStandardTreeNode;
    toggledNodePath: string | number;
    openedNode: IStandardTreeNode;
    closedNode: IStandardTreeNode;
    levelPath: string;
    marginStylePath: string;
    levelSetterFn: (nodes: IStandardTreeNode[], level: number) => string;
    nodesCopy: IStandardTreeNode[];
    expandAll: boolean;
    collapseAll: boolean;
    cloneNodes: boolean;
    objectGraph: any;
    editedNode: XtalTreeFormElement;
    updateCount: number;
    updateCountEcho: number;
    newNode: XtalTreeFormElement;
    deleteNode: XtalTreeFormElement;
    copyNodeToClipboard: XtalTreeFormElement;
    expandAllNode: XtalTreeFormElement;
    collapseAllNode: XtalTreeFormElement;
    indentFactor: number;
    downloadHref: string;
}

export interface XtalTreeFormElement {
    name: string,
    value: string,
}

export interface XtalTreeActions{
    //sort(self: this): void;
    defineIsOpenFn(self: this): {
        isOpenFn: (tn: IStandardTreeNode) => boolean;
    }
    defineTestNodeFn(self: this): {
        testNodeFn: (tn: IStandardTreeNode, search: string) => boolean;
    }
    defineParentFn(self: this): {
        parentFn: (tn: IStandardTreeNode) => IStandardTreeNode;
    }
    defineIdFn(self: this): {
        idFn: (tn: IStandardTreeNode) => string | number;
    }
    defineChildrenFn(self: this): {
        childrenFn: (tn: IStandardTreeNode) => IStandardTreeNode[];
    }
    setHasChildren(self: this, tn: IStandardTreeNode, recursive: boolean): void;
    defineToggledNodeFn(self: this): {
        toggleNodeFn: (tn: IStandardTreeNode) => void;
    }
    calculateViewableNodes(self: this, nodes: IStandardTreeNode[], acc: IStandardTreeNode[]): IStandardTreeNode[];
    updateViewableNodes(self: this): {
        viewableNodes: IStandardTreeNode[];
    };
    toggleNode(self: this): void;
    openNode(self: this): void;
    onToggledNodePath(self: this): {
        toggledNode: IStandardTreeNode;
    }
    setLevels(self: this, nodes?: IStandardTreeNode[], level?: number): void;
    onCollapseAll(self: this, passedInNodes?: IStandardTreeNode[]): {
        viewableNodes: IStandardTreeNode[],
    } | void;
    onExpandAll(self: this, passedInNodes?: IStandardTreeNode[]): {
        viewableNodes: IStandardTreeNode[],
    } | void;
    search(self: this): void;
    defineCompareFn(self: this): {
        compareFn: ((lhs: IStandardTreeNode, rhs: IStandardTreeNode) => number) | undefined;
    }
    onSort(self: this, passedInNodes?: IStandardTreeNode[]): {
        viewableNodes: IStandardTreeNode[],
    } | void;
    onNodes(self: this): {
        nodesCopy: IStandardTreeNode[],
    }
    onObjectGraph(self: this): Promise<{
        nodes: IStandardTreeNode[],
    }>
    onEditedNode(self: this): void;

    synchNodesCopyOrObjectGraph(self: this): void;

    onNewNode(self: this): void;

    onDeleteNode(self: this): void;

    onCopyNodeToClipboard(self: this): void;

    onExpandAllNode(self: this): void;

    onCollapseAllNode(self: this): void;

    makeDownloadBlob(self: this): void;
}

export type NodeTypes = 'string' | 'number' | 'object' | 'arr' | 'boolean';