import * as SecureStore from "expo-secure-store"; // Oficialni modul Expo, umoznuje ukladat data bezpecne do zarizeni (napriklad JWT), narozdil od AsyncStorage to ulozi bezpecne (u iphonu do KeyChain, u androidu do Keystore)
import { api } from "./api"; // Import HTTP Clienta.

const TOKEN_KEY = "auth_token";

// POST /api/register
export async function register(name: string, email: string, password: string) {
    const res = await api.post("/api/register", { name, email, password });
    return res.data; // vracime data, aby ui (Frontend) vedelo.
}

// POST /api/login 
export async function login(email: string, password: string) {
    const res = await api.post("/api/login", { email, password });
    const { token } = res.data || {}; // pokud backend vratil token, ulozime ho.
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token); // Token ulozime do SecureStore, pod klic auth_token.
    return res.data; // vracime data, aby ui (frontend) Vedelo.
}

/*

Endpoint protection
Tohle je interceptor axiosu – funkce, která se spustí před každým requestem.
Vytáhne token ze SecureStore (await SecureStore.getItemAsync(TOKEN_KEY)).
Pokud token existuje, přidá ho do HTTP hlaviček (Authorization: Bearer <token>).
Tím pádem nemusíme token přidávat ručně u každého requestu.
Jakmile backend chrání endpoint pomocí JWT (např. /api/user/me), 
tenhle interceptor se automaticky postará o poslání správné hlavičky.

*/
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


// vymaze token.
export async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}
