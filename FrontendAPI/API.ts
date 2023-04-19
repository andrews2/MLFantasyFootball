export const API_ENDPOINTS = {
    ALL_PLAYERS: '/api/allplayers',
    PLAYER_DATA: '/api/playerData',
    ALL_USERS: '/api/allUsers',
};

export async function apiRequest(endpoint: string, callback: (arg0: unknown) => void, method = 'GET', body: string | null = null) {
    const req = await fetch(endpoint, {
        method,
        body,
        headers: { "Content-Type": "application/json" },
    });

    req.json().then(callback); 
}