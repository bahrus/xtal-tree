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
    expandAll: boolean;
    isOpenFn: (tn: ITreeNode) => boolean;
    nodes: ITreeNode[];
    searchString: string;
    testNodeFn: (tn: ITreeNode, search: string) => boolean;
    compareFn: (lhs: ITreeNode, rhs: ITreeNode) => number;
    sorted: string;
    viewableNodes: ITreeNode[];
    toggleNodeFn: (tn: ITreeNode) => void;
    toggledNode: ITreeNode;
    
}

export interface XtalTreeProps{
    sort(self: this): void;
    calculateViewableNodes(nodes: ITreeNode, acc: ITreeNode[]): ITreeNode[];
    updateViewableNodes(self: this): void;

}