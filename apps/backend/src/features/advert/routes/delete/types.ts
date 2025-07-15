import type { types } from "@grovine/api";

export namespace Request {
	export type Path = { id: string };
}

export namespace Response {
	type Endpoint = "/ads/{id}";

	export type Response =
		types.paths[Endpoint]["delete"]["responses"][keyof types.paths[Endpoint]["delete"]["responses"]]["content"]["application/json"];

	export type Success = Extract<Response, { code: "ADVERTISEMENT_DELETED" }>;
	export type Error = Exclude<Response, Success>;
}
