export {}

declare global {
    interface User {
        username: string
        email: string
        avatar: string
        disabled: boolean
    }
}