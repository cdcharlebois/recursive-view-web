/**
 * This file was generated from RecursiveView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ListValue, ListAttributeValue, ListReferenceValue, ListWidgetValue } from "mendix";

export interface RecursiveViewContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    nodes: ListValue;
    parents: ListValue;
    content?: ListWidgetValue;
    association: ListReferenceValue;
    attribute: ListAttributeValue<string>;
}

export interface RecursiveViewPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    nodes: {} | { caption: string } | { type: string } | null;
    parents: {} | { caption: string } | { type: string } | null;
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    association: string;
    attribute: string;
}
