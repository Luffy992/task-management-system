export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    const session = localStorage.getItem('guestSession');

    return Boolean(session);
}

export function logout(): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.removeItem('guestSession');
}