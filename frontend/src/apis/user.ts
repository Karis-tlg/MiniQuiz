
export async function registerUser(username: string, email: string, password: string, turnstile_token: string) {
    // Encode the message as a Uint8Array (UTF-8 is recommended)
    const msgBuffer = new TextEncoder().encode(email.toLocaleLowerCase())

    // Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

    // Convert the ArrayBuffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
  
    return await fetch(`/api/user/register?turnstile_token=${turnstile_token}`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password, avatar: `https://0.gravatar.com/avatar/${hashHex}` }) }).then(res => res.json())
}

export async function loginUser(email: string, password: string, turnstile_token: string) {
    return await fetch(`/api/user/login?turnstile_token=${turnstile_token}`, { method: "POST", credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, turnstile_token }) }).then(res => res.json())
}

export async function forgotpasswordUser(email: string, turnstile_token: string) {
    return await fetch(`/api/user/forgot-password?turnstile_token=${turnstile_token}&email=${email}`, { method: "POST" }).then(res => res.json())
}

export async function resetpasswordUser(password: string, token: string, turnstile_token: string) {
    return await fetch(`/api/user/reset-password?token=${token}&password=${password}&turnstile_token=${turnstile_token}`, { method: "POST"}).then(res => res.json())
}

export async function logoutUser() {
    return await fetch(`/api/user/logout`, { method: "POST", credentials: 'include' }).then(res => res.json())
}

export async function getUserData(): Promise<User | null> {
    const response = await fetch(`/api/user`, { method: "GET", credentials: "include" })
    if (!response.ok) return null
    return await response.json() as User
}

export async function hasUserLogged() {
    const response = await fetch(`/api/user/logged-in`, { method: "GET", credentials: "include" })
    if (!response.ok) return false
    const data = await response.json()
    return data.logged_in as boolean
}

export async function deleteUser() {
    return await fetch(`/api/user/delete`, { method: "DELETE" }).then(res => res.json())
}