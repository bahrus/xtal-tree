interface INodeState{
    
}

export interface ITreeNode{
    //children?: ITreeNode[];
    __memo?: INodeState;
}

export interface IXtalTreeProperties{
    childrenFn: (tn: ITreeNode) => ITreeNode[];
    keyFn: (tn: ITreeNode) => boolean;
    isOpenFn: (tn: ITreeNode) => boolean;
    nodes: ITreeNode[];

    
}

(function () {
    class XtalTree extends HTMLElement implements IXtalTreeProperties{

        _childrenFn : (tn: ITreeNode) => ITreeNode[];
        get childrenFn (){
            return this._childrenFn;
        }
        set childrenFn(val){
            this._childrenFn = val;
        }

        _keyFn: (tn: ITreeNode) => boolean;
        get keyFn(){
            return this._keyFn;
        }
        set keyFn(val){
            this._keyFn = val;
        }

        _isOpenFn: (tn: ITreeNode) => boolean;
        get isOpenFn(){
            return this._isOpenFn;
        }
        set isOpenFn(val){
            this._isOpenFn = val;
        }

        _nodes: ITreeNode[];
        get nodes(){
            return this._nodes;
        }

        set nodes(val){
            this._nodes = val;
        }
    }
})();