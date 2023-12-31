import { ObjectItem, ValueStatus } from "mendix";
import { ReactElement, createElement, useEffect, useState } from "react";
import { RecursiveViewContainerProps } from "typings/RecursiveViewProps";
import "./ui/RecursiveView.css";

export interface ILevel {
    mxid: string;
    parentId?: string;
    level: number;
}

export function RecursiveView(props: RecursiveViewContainerProps): ReactElement {
    const [tree, setTree] = useState<ILevel[]>([]);
    const [loading, setLoading] = useState(true); // when loading, don't render any children
    const [clickedNode, setClickedNode] = useState("");
    // console.log("tree>>>", { tree });
    const { nodes, association } = props;

    useEffect(() => {
        setLoading(true);
        nodes.items?.forEach(item => {
            const parentId = association.get(item).value?.id;
            // console.log({ parentId });
            const existingParent = tree.find(i => i.mxid === parentId);
            const existingItem = tree.find(i => i.mxid === item.id);
            if (existingParent) {
                // add this item at level + 1
                if (existingItem) {
                    // do nothing
                } else {
                    setTree(prev => [...prev, { mxid: item.id, parentId, level: existingParent.level + 1 }]);
                }
                // console.log(`parent for item ${item.id} exists: ${parentId}`);
            } else if (existingItem) {
                // do nothihng
            } else {
                // add this item at level 0
                // console.log(`parent for item ${item.id} doesn't exist. Adding at level 0`);
                setTree(prev => [...prev, { mxid: item.id, level: 0 } as ILevel]);
            }
        });
        setTree(prev => prev.filter(li => nodes.items?.find(ni => ni.id === li.mxid)));
        setLoading(false);
    }, [nodes.items]);
    useEffect(() => {
        if (nodes.status === ValueStatus.Available) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [nodes, nodes.status]);
    // Why render a list when we already have the tree strcuture
    const getObjectItemWithId = (id: string): ObjectItem | undefined => {
        return nodes.items?.find(i => i.id === id);
    };
    const renderChildren = (node: ILevel): ReactElement => {
        const self = nodes.items?.find(i => i.id === node.mxid);
        const children = tree
            .filter(i => i.parentId === node.mxid)
            .sort((tia, tib) => {
                const itemA = getObjectItemWithId(tia.mxid);
                const itemB = getObjectItemWithId(tib.mxid);
                if (itemA && itemB) {
                    const itemAValue = props.attribute.get(itemA).value;
                    const itemBValue = props.attribute.get(itemB).value;
                    return ("" + itemAValue).localeCompare("" + itemBValue);
                }
                return 0;
            });
        return (
            <div onClickCapture={() => setClickedNode(node.mxid)}>
                {self && props.content && (
                    <div>
                        <div>{props.content?.get(self) as ReactElement}</div>
                        <div style={{ paddingLeft: 10 }}>
                            {loading && clickedNode === node.mxid
                                ? props.loadingContent
                                : children.map(c => renderChildren(c))}
                        </div>
                    </div>
                )}
            </div>
        );
    };
    const root = tree.find(i => !i.parentId);
    return (
        <div>
            {props.devMode && (
                <pre>
                    Loading: {loading ? "true" : "false"} <br />
                    Tree: {tree.map(ti => ti.mxid).join(", ")} <br />
                    nodes.items.length: {nodes.items?.length} <br />
                    Clicked Node: {clickedNode}
                </pre>
            )}

            {root && renderChildren(root)}
        </div>
    );
}
