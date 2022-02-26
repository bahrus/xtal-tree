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
    childrenFn: (tn: ITreeNode) => ITreeNode[];
    childrenPath: string;
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
    calculateViewableNodes(self: this, nodes: ITreeNode[], acc: ITreeNode[]): ITreeNode[];
    updateViewableNodes(self: this): {
        viewableNodes: ITreeNode[];
    };
    toggleNode(self: this): void;
    openNode(self: this): void;
    onToggledNodeId(self: this): void;

}