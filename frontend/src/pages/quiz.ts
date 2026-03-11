import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import { ref, type Ref, createRef } from "lit/directives/ref.js"
import "../components/navbar"
import { hasUserLogged } from "../apis/user"
import { getQuizData } from "../apis/quiz"

@customElement("page-quiz")
export class PageQuiz extends LitElement {
    private quizData: any
    private loadingRef: Ref<HTMLElement> = createRef()

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    async connectedCallback() {
        super.connectedCallback()
        if (!await hasUserLogged()) window.location.href = "/auth"

        window.addEventListener("beforeunload", (e) => e.preventDefault())
    }

    async firstUpdated() {
        const quizId = new URLSearchParams(window.location.search).get("quiz")
        if (!quizId) window.location.href = "/dashboard"

        this.quizData = await getQuizData(quizId!)
        if (!this.quizData) window.location.href = "/dashboard"

        this.requestUpdate()
        this.loadingRef.value!.classList.replace("flex", "hidden")
    }

    render() {
        return html`
            <div ${ref(this.loadingRef)} class="fixed top-0 left-0 z-250 flex items-center justify-center w-full h-screen bg-black/75 text-default-text">
                <element-icon icon="loading" size="10" class="animate-spin"></element-icon>
            </div>

            <element-navbar href="#"></element-navbar>

            
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "page-quiz": PageQuiz
    }
}