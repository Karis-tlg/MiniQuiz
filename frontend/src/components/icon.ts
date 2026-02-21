import { LitElement, html, type PropertyValues } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { unsafeSVG } from "lit/directives/unsafe-svg.js"

@customElement("element-icon")
export class ElementIcon extends LitElement {
    @property({ type: String }) icon: string = ""
    @property({ type: Number }) size: number = 5
    @state() src!: any

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected update(changedProperties: PropertyValues): void {
        super.update(changedProperties)
        if (changedProperties.has("icon")) {
            this.src = undefined
            import(`../assets/icons/${this.icon}.svg?raw`).then(module => this.src = module.default)
        }
    }

    render() {
        return html`
            <i class="fill-current stroke-current inline-block align-text-bottom" style="width: ${this.size*0.25}rem; height: ${this.size*0.25}rem;">
                ${unsafeSVG(this.src)}
            </i>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-icon": ElementIcon
    }
}