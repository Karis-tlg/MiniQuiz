import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import "../components/icon"
import "../components/navbar"
import "../components/avatar"
import questionsIllustration from "../assets/question.svg"

@customElement("page-index")
export class PageIndex extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected render() {
        return html`
            <element-navbar></element-navbar>

            <main id="hero-card" class="grid max-w-7xl mx-auto text-center md:text-start px-6 py-24 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h1 class="text-4xl md:text-5xl mx-auto font-extrabold leading-tight">Tạo & Làm câu hỏi ngắn với <span class="text-indigo-400">MiniQuiz</span></h1>
                    <p class="mt-6 text-default-text-sub text-lg">Nền tảng tạo quiz nhỏ gọn, hiện đại và thú vị. Phù hợp cho học tập và ôn luyện kiến thức.</p>
                    <div class="mt-10 flex gap-4 justify-center md:justify-start">
                        <a href="/auth" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium">Bắt đầu ngay</a>
                        <a href="#features" class="px-6 py-3 rounded-xl border border-gray-700 hover:border-indigo-500">Xem tính năng</a>
                    </div>
                </div>
                <img class="max-w-lg mx-auto hidden md:block pointer-events-none" src="${questionsIllustration}" alt="Questions Illustration">
            </main>

            <section id="features" role="region" class="max-w-7xl mx-auto px-6 py-24">
                <h2 class="text-3xl font-bold text-center mb-16">Tính năng nổi bật</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-card p-6 rounded-2xl border border-gray-800">
                        <h3 class="text-xl font-semibold mb-2 text-indigo-400"><element-icon icon="flash"></element-icon> Tạo Nhanh & nhẹ</h3>
                        <p class="text-gray-400">Thiết kế tối giản, load nhanh trên mọi thiết bị.</p>
                    </div>
                    <div class="bg-card p-6 rounded-2xl border border-gray-800">
                        <h3 class="text-xl font-semibold mb-2 text-indigo-400"><element-icon icon="crop"></element-icon> Tập trung học tập</h3>
                        <p class="text-gray-400">Không quảng cáo, không xao nhãng.</p>
                    </div>
                    <div class="bg-card p-6 rounded-2xl border border-gray-800">
                        <h3 class="text-xl font-semibold mb-2 text-indigo-400"><element-icon icon="leaf"></element-icon> Tạo Quiz nhanh</h3>
                        <p class="text-gray-400">Tạo quiz đơn giản, nhanh chóng.</p>
                    </div>
                </div>
            </section>

            <section id="start" role="region" class="max-w-7xl mx-auto px-6 py-24 text-center">
                <div class="bg-linear-to-br from-indigo-600/20 to-indigo-400/5 border border-indigo-500/30 rounded-3xl p-16">
                    <h2 class="text-3xl font-bold mb-6">Sẵn sàng thử MiniQuiz?</h2>
                    <p class="text-gray-400 mb-10">Bắt đầu tạo quiz đầu tiên của bạn chỉ trong vài phút.</p>
                    <div class="relative group">
                        <a href="/auth" class="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                            <span class="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-400 via-blue-500 to-violet-500 p-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                            <span class="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                                <div class="relative z-10 flex items-center space-x-2">
                                    <span class="transition-all duration-500 group-hover:translate-x-1">Bắt đầu ngay</span>
                                    <element-icon icon="arrow-forward" class="transition-transform duration-500 group-hover:translate-x-2"></element-icon>
                                </div>
                            </span>
                        </a>
                    </div>
                </div>
            </section>

            <footer role="contentinfo" class="border-t border-gray-700 py-8 text-center text-sm text-gray-400">
                <p class="mt-4 text-center">
                    <a href="/legal" class="hover:text-gray-200 transition">Terms of Service</a>
                    <span class="mx-2">·</span>
                    <a href="/legal" class="hover:text-gray-200 transition">Privacy Policy</a>
                </p>
                © 2026 MiniQuiz. All rights reserved.
            </footer>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "page-index": PageIndex
    }
}