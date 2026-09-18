import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"

@customElement("element-notify")
export class ElementNotify extends LitElement {
    @property() message: string = ""
    @property() type: "error" | "warning" | "success" | "info" = "info"
    @property({ type: Number }) duration: number = 0 // in seconds

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected firstUpdated() {
        if (this.duration > 0) {
            setTimeout(() => {
                this.remove()
            }, this.duration * 1000)
        }
    }

    get_color() {
        switch (this.type) {
            case "error":
                return "bg-red-500/50"
            case "warning":
                return "bg-yellow-500/50"
            case "success":
                return "bg-green-500/50"
            default:
                return "bg-blue-500/50"
        }
    }


    get_icon() {
        switch (this.type) {
            case "error":
                return "alert-circle"
            case "warning":
                return "warning"
            case "success":
                return "checkmark-circle"
            default:
                return "infomation-circle"
        }
    }

    render() {
        return html`
            <div class="relative flex items-center justify-between rounded-lg px-4 py-2 ${this.get_color()} backdrop-blur-lg ${this.duration > 0 ? 'animate-[fade-out_var(--duration)_linear_forwards]' : ''}" style="--duration: ${this.duration}s">
                <div class="flex items-center gap-x-3">
                    <element-icon icon="${this.get_icon()}"></element-icon>
                    <p>${this.message}</p>
                </div>
                <button @click="${() => this.remove()}" class="hover:text-white/25"><element-icon icon="close"></element-icon></button>
                <div class="w-full h-0.5 bg-gray-300 absolute left-0 bottom-0 ${this.duration > 0 ? 'animate-[countdown_var(--duration)_linear_forwards]' : 'hidden'}" style="--duration: ${this.duration}s"></div>
            </div>
        `
    }
}

@customElement("element-notify-container")
export class ElementNotifyContainer extends LitElement {
    private notifyContainerRef: Ref<HTMLDivElement> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected firstUpdated() {
        const UrlParams = new URLSearchParams(window.location.search)
        const message = UrlParams.get("message")
        const type = (UrlParams.get("type") || "info") as "error" | "warning" | "success" | "info"
        const duration = parseInt(UrlParams.get("duration") || "0")
        if (message) this.addnotify(message, type, duration)

        window.addEventListener("page-notify", (e: Event) => {
            const data = (e as CustomEvent).detail as any
            this.addnotify(data.message, data.type, data.duration)
        })
    }

    addnotify(message: string, type: "error" | "warning" | "success" | "info" = "info", duration: number = 0) {
        const notify = document.createElement("element-notify")
        notify.message = message
        notify.type = type
        notify.duration = duration
        this.notifyContainerRef.value?.appendChild(notify)
    }

    render() {
        return html`
            <div ${ref(this.notifyContainerRef)} class="w-full px-4 flex flex-col gap-y-3"></div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "element-notify": ElementNotify,
        "element-notify-container": ElementNotifyContainer
    }
}