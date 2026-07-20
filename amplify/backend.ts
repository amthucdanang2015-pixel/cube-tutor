import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { storage } from "./storage/resource";
import { apiFunction } from "./functions/api/resource";

import { Stack } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import {
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

/**
 * Backend wiring:
 *  - Cognito auth (identity)
 *  - S3 storage (showcase media; CloudFront in front, set in console)
 *  - One DynamoDB table (on-demand, single-table)
 *  - One Lambda router fronted by an HTTP API with a catch-all proxy route
 */
const backend = defineBackend({
  auth,
  storage,
  apiFunction,
});

const apiStack = backend.createStack("api-stack");

// --- DynamoDB: single table, on-demand, with two GSIs ---
const table = new Table(apiStack, "AppTable", {
  partitionKey: { name: "PK", type: AttributeType.STRING },
  sortKey: { name: "SK", type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});
// GSI1: category / leadtype / status access patterns
table.addGlobalSecondaryIndex({
  indexName: "GSI1",
  partitionKey: { name: "GSI1PK", type: AttributeType.STRING },
  sortKey: { name: "GSI1SK", type: AttributeType.STRING },
});
// GSI2: list-by-type + featured-rank access patterns
table.addGlobalSecondaryIndex({
  indexName: "GSI2",
  partitionKey: { name: "GSI2PK", type: AttributeType.STRING },
  sortKey: { name: "GSI2SK", type: AttributeType.STRING },
});

const fn = backend.apiFunction.resources.lambda;
table.grantReadWriteData(fn);
fn.addEnvironment("VTR_TABLE_NAME", table.tableName);
// Admin key for staff endpoints — set the real value as a secret in the console/CI.
fn.addEnvironment("ADMIN_API_KEY", process.env.ADMIN_API_KEY ?? "change-me-in-console");
// S3 assets bucket (uploads/screenshots), served via CloudFront.
const bucket = backend.storage.resources.bucket;
bucket.grantReadWrite(fn);
fn.addEnvironment("ASSETS_BUCKET", bucket.bucketName);

// --- HTTP API: catch-all proxy to the single Lambda router ---
const httpApi = new HttpApi(apiStack, "HttpApi", {
  apiName: "vibetoreal-api",
  corsPreflight: {
    allowOrigins: ["*"],
    allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST, CorsHttpMethod.OPTIONS],
    allowHeaders: ["content-type", "authorization", "x-user-sub"],
  },
});

httpApi.addRoutes({
  path: "/{proxy+}",
  methods: [HttpMethod.GET, HttpMethod.POST],
  integration: new HttpLambdaIntegration("ApiIntegration", fn),
});

backend.addOutput({
  custom: {
    apiUrl: httpApi.apiEndpoint,
    region: Stack.of(apiStack).region,
  },
});
