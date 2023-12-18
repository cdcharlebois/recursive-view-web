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
    console.log("tree>>>", { tree });
    const { nodes, association } = props;

    useEffect(() => {
        nodes.items?.forEach(item => {
            const parentId = association.get(item).value?.id;
            console.log({ parentId });
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
    }, [nodes]);
    // Why render a list when we already have the tree strcuture
    const renderChildren = (node: ILevel): ReactElement => {
        const self = nodes.items?.find(i => i.id === node.mxid);
        const children = tree.filter(i => i.parentId === node.mxid);
        return (
            <div>
                {self && props.content && (
                    <div>
                        <div>{props.content?.get(self) as ReactElement}</div>
                        <div style={{ paddingLeft: 10 }}>{children && children.map(c => renderChildren(c))}</div>
                    </div>
                )}
            </div>
        );
    };
    const root = tree.find(i => !i.parentId);
    return <div>{root && renderChildren(root)}</div>;
}
