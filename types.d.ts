export interface ITreeNode{
    children?: ITreeNode[];
    name: string;
    path: string;
    value: any;
    level?: number;
    asString?: string;
    type: TreeNodeType;
    parent?: ITreeNode;
    open?: boolean;
    hasChildren?: boolean;
    canHaveChildren?: boolean;
    marginStyle?: string;
    timeStamp?: number;
}

export type TreeNodeType = 'array' | 'object' | 'string' | 'number' | 'boolean';

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


    nodes: ITreeNode[];
    searchString: string;
    testNodePaths: string[];
    sort: 'asc' | 'desc' | 'none' | undefined;
    viewableNodes: ITreeNode[];
    toggledNode: ITreeNode;
    toggledNodePath: string | number;
    openedNode: ITreeNode;
    closedNode: ITreeNode;
    //levelPath: string;
    //marginStylePath: string;
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
    value: string
}

export interface XtalTreeActions{

    setHasChildren(self: this, tn: ITreeNode, recursive: boolean): void;

    calculateViewableNodes(self: this, nodes: ITreeNode[], acc: ITreeNode[]): ITreeNode[];
    updateViewableNodes(self: this, updateTimestamps: boolean): {
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