import { ITree } from "./xtal-tree";

interface INodeState {
}

interface INodePosition {
    node: ITreeNode,
    position: number
}

export interface ITreeNode {
}

export interface XtalTreeProps{
    /**
     * Do a structural clone before doing any modifications on the data.
     * A bit of performance penalty, but can avoid unexpected side effects
     */
    clone: boolean;
    childrenFn: (tn: ITreeNode) => ITreeNode[];
    childrenPath: string;
    hasChildrenFn: (tn: ITreeNode) => boolean;
    hasChildrenPath: string;
    expandAll: boolean;
    isOpenFn: (tn: ITreeNode) => boolean;
    isOpenPath: string;
    idFn: (tn: ITreeNode) => string | number;
    idPath: string;
    nodes: ITreeNode[];
    searchString: string;
    testNodeFn: (tn: ITreeNode, search: string) => boolean;
    testNodePath: string;
    compareFn: (lhs: ITreeNode, rhs: ITreeNode) => number;
    comparePath: string;
    sorted: string;
    viewableNodes: ITreeNode[];
    toggleNodeFn: (tn: ITreeNode) => void;
    toggleNodePath: string;
    toggledNode: ITreeNode;
    toggledNodeId: string | number;
    openedNode: ITreeNode;
    closedNode: ITreeNode;
    levelPath: string;
    marginStylePath: string;
    levelSetterFn: (nodes: ITreeNode[], level: number) => string;
    nodesCopy: ITreeNode[];
    
}

export interface XtalTreeActions{
    //sort(self: this): void;
    defineIsOpenFn(self: this): {
        isOpenFn: (tn: ITreeNode) => boolean;
    }
    defineTestNodeFn(self: this): {
        testNodeFn: (tn: ITreeNode, search: string) => boolean;
    }
    defineIdFn(self: this): {
        idFn: (tn: ITreeNode) => string | number;
    }
    defineChildrenFn(self: this): {
        childrenFn: (tn: ITreeNode) => ITreeNode[];
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
    onToggledNodeId(self: this): {
        toggledNode: ITreeNode;
    }
    setLevels(self: this, nodes?: ITreeNode, level?: number): void;
}