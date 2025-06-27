import { env } from "$env/dynamic/private";
import { COOKIE_UM_STATE } from "$lib/models/common/cookies";
import { nanoid } from "nanoid";


export const load = async ({ cookies }) => {
	const params = new URLSearchParams();
	const state = nanoid();

	params.append("client_id", env.UM_COMBINE_CLIENT_ID);
	params.append("response_type", "code");
	params.append("redirect_uri", `${env.UM_BASE_URL}/auth/callback`);
	params.append("scope", "character_read");
	params.append("access_type", "offline");
	params.append("renew_previously_granted", "yes");
	params.append("state", state);

	const url = `https://www.swcombine.com/ws/oauth2/auth/?${params.toString()}`;

	cookies.set(COOKIE_UM_STATE, state, {
		path: "/",
		secure: env.NODE_ENV === "production",
	});

	return {
		url: url,
	};
};
