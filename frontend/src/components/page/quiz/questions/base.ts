import { LitElement } from "lit"

export class ElementQuizBase extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    export_json() {
        return {}
    }
}