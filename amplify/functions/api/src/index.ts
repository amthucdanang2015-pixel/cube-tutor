import { route } from "./router";
import type { ApiEvent, ApiResponse } from "./lib/types";

/** Lambda entry. All REST paths flow through the internal router (router.ts). */
export const handler = async (event: ApiEvent): Promise<ApiResponse> => route(event);
