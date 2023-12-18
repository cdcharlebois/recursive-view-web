import { ReactElement, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";

export function preview(): ReactElement {
    return <HelloWorldSample sampleText={"Hello World"} />;
}

export function getPreviewCss(): string {
    return require("./ui/RecursiveView.css");
}
