import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('element-tab-explore')
export class ElementTabExplore extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    render() {
        return html`
            <div class="flex flex-col items-center justify-center h-screen">
                <h1 class="text-6xl font-bold text-default-primary">Page đang được xây dựng</h1>
                <p class="text-default-text-sub">Vui lòng quay lại sau.</p>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-tab-explore": ElementTabExplore
    }
}