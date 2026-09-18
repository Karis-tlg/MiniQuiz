import { LitElement } from "lit"

export class ElementEditorBase extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    export_json() {
        return {}
    }
}