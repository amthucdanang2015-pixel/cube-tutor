/** Shared types for the API Lambda router. */

export interface ApiEvent {
  requestContext: { http: { method: string; path: string } };
  rawPath?: string;
  body?: string | null;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  pathParameters?: Record<string, string | undefined> | null;
}

export interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export type Json = Record<string, unknown>;

export interface RouteContext {
  method: string;
  path: string;
  params: Record<string, string>; // matched path params, e.g. :slug
  query: Record<string, string>;
  body: Json;
  headers: Record<string, string>;
}

export type RouteHandler = (ctx: RouteContext) => Promise<ApiResponse>;

/** Single-table entity envelope (PK/SK + GSIs + common fields). */
export interface Entity {
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;
  GSI2PK?: string;
  GSI2SK?: string;
  id: string;
  type: string;
  slug?: string;
  title?: string;
  description?: string;
  status?: string;
  tags?: string[];
  searchableText?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
