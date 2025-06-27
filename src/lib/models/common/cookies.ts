/**
 * Session cookie used for authentication to the Unnamed Market API.
 */
export const COOKIE_UM_SESSION = "um_session";

/**
 * State cookie used for the OAuth2 flow with the SW Combine API to
 * prevent CSRF attacks.
 */
export const COOKIE_UM_STATE = "um_auth_state";

/**
 * Encrypted cookie that holds the access_token to be able to interface
 * with the SW Combine API.
 */
export const COOKIE_UM_COMBINE_ACCESS_TOKEN = "um_combine_access_token";

/**
 * Encrypted cookie that holds the refresh_token to be able to refresh
 * the access_token to interface with the SW Combine API.
 *
 * @see {@link COOKIE_UM_COMBINE_ACCESS_TOKEN}
 */
export const COOKIE_UM_COMBINE_REFRESH_TOKEN = "um_combine_refresh_token";
