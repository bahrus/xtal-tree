export interface ITreeNode{
    children?: ITreeNode[];
    name: string;
    path: string;
    value: any;
    asString?: string;
    type: string;
    parent?: ITreeNode;
    open?: boolean;
    hasChildren?: boolean;
}

export interface INodeRef{
    prop?: string;
    idx?: number;
    node?: ITreeNode;
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

    idFn: (tn: ITreeNode) => string | number;
    idPath: string;
    nodes: ITreeNode[];
    searchString: string;
    testNodePaths: string[];
    sort: 'asc' | 'desc' | 'none' | undefined;
    viewableNodes: ITreeNode[];
    toggleNodeFn: (tn: ITreeNode) => void;
    toggleNodePath: string;
    toggledNode: ITreeNode;
    toggledNodePath: string | number;
    openedNode: ITreeNode;
    closedNode: ITreeNode;
    levelPath: string;
    marginStylePath: string;
    levelSetterFn: (nodes: ITreeNode[], level: number) => string;
    nodesCopy: ITreeNode[];
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


    // defineParentFn(self: this): {
    //     parentFn: (tn: ITreeNode) => ITreeNode;
    // }
    defineIdFn(self: this): {
        idFn: (tn: ITreeNode) => string | number;
    }

    setHasChildren(self: this, tn: ITreeNode, recursive: boolean): void;
    defineToggledNodeFn(self: this): {
        toggleNodeFn: (tn: ITreeNode) => void;
    }
    calculateViewableNodes(self: this, nodes: ITreeNode[], acc: ITreeNode[]): ITreeNode[];
    updateViewableNodes(self: this): {
        viewableNodes: ITreeNode[];
    };
    toggleNode(self: this): void;
    openNode(self: this): void;
    onToggledNodePath(self: this): {
        toggledNode: ITreeNode;
    }
    setLevels(self: this, nodes?: ITreeNode[], level?: number): void;
    onCollapseAll(self: this, passedInNodes?: ITreeNode[]): {
        viewableNodes: ITreeNode[],
    } | void;
    onExpandAll(self: this, passedInNodes?: ITreeNode[]): {
        viewableNodes: ITreeNode[],
    } | void;
    search(self: this): void;

    onSort(self: this, passedInNodes?: ITreeNode[]): {
        viewableNodes: ITreeNode[],
    } | void;
    onNodes(self: this): {
        nodesCopy: ITreeNode[],
    }
    onObjectGraph(self: this): Promise<{
        nodes: ITreeNode[],
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