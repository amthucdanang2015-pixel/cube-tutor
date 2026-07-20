import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { env } from "../lib/env";
import type { Entity } from "../lib/types";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: env.region }), {
  marshallOptions: { removeUndefinedValues: true },
});

/** Put a single item. */
export async function put(item: Entity): Promise<Entity> {
  await client.send(new PutCommand({ TableName: env.tableName, Item: item }));
  return item;
}

/** Get one item by PK/SK. */
export async function get<T = Entity>(PK: string, SK = "META"): Promise<T | undefined> {
  const res = await client.send(new GetCommand({ TableName: env.tableName, Key: { PK, SK } }));
  return res.Item as T | undefined;
}

/** Query a GSI partition (e.g. all PATTERNs by TYPE#PATTERN, or leads by LEADTYPE#x). */
export async function queryGsi<T = Entity>(opts: {
  index: "GSI1" | "GSI2";
  pk: string;
  limit?: number;
  scanForward?: boolean;
}): Promise<T[]> {
  const pkName = `${opts.index}PK`;
  const res = await client.send(
    new QueryCommand({
      TableName: env.tableName,
      IndexName: opts.index,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": pkName },
      ExpressionAttributeValues: { ":pk": opts.pk },
      ScanIndexForward: opts.scanForward ?? false,
      Limit: opts.limit ?? 100,
    }),
  );
  return (res.Items ?? []) as T[];
}

/** Set a single attribute (used by webhooks/admin). */
export async function setAttr(PK: string, SK: string, attr: string, value: unknown): Promise<void> {
  await client.send(
    new UpdateCommand({
      TableName: env.tableName,
      Key: { PK, SK },
      UpdateExpression: "SET #a = :v, updatedAt = :u",
      ExpressionAttributeNames: { "#a": attr },
      ExpressionAttributeValues: { ":v": value, ":u": new Date().toISOString() },
    }),
  );
}
