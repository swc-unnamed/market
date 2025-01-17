export interface HandleCheckResponse {
	version: '2.0';
	timestamp: number;
	resource: string;
	request: string;
	swcapi: HandleCheckResult | HandleCheckErrorResult;
}

interface HandleCheckResult {
	character: HandleCheckCharacter;
}

interface HandleCheckCharacter {
	uid: string;
	handle: string;
}

interface HandleCheckErrorResult {
	error_code: number;
	error_message: string;
}
