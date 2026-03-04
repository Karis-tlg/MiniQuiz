
export async function waitCloudflareTurnstile(timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {  
        if (turnstile) return resolve()

        const interval = setInterval(() => {
            if (turnstile) {
                clearInterval(interval)
                resolve()
            }
        }, 100)

        setTimeout(() => {
            clearInterval(interval)
            reject(new Error("Cloudflare Turnstile failed to load within the specified timeout"))
        }, timeout)
    })
}

declare const turnstile: any