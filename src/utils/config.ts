import { endpoints as endpointTemp } from "./endpoints";
export const TOKEN = "token";
// Misleading name kept for backward compatibility with existing localStorage data —
// this is the storage key for the *refresh* token, not an access token.
export const REFRESH_TOKEN = "accessToken";
export const PROJECT_NAME =  " مكانك";
export const REDIRECT_AFTER_AUTH = "/dashboard";
export const endpoints = endpointTemp;
export const currency = "EGP ";