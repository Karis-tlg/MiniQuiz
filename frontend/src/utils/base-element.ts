import { TailwindSheet } from "./tailwind-sheet"
import { LitElement } from "lit"

export class BaseElement extends LitElement {
    static styles = [TailwindSheet]
}