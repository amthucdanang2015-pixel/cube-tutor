import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ok } from "../lib/response";
import { unprocessable } from "../lib/errors";
import { str } from "../services/validation";
import { env } from "../lib/env";
import { newId } from "../services/slug";
import type { RouteHandler } from "../lib/types";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const s3 = new S3Client({ region: env.region });

/**
 * POST /uploads/presign  { contentType, kind } -> { uploadUrl, key, publicUrl }
 * Client PUTs the file directly to S3; serve via CloudFront (CDN_BASE).
 */
export const presign: RouteHandler = async (ctx) => {
  const contentType = str(ctx.body, "contentType", { required: true });
  if (!ALLOWED.has(contentType)) throw unprocessable("unsupported_type", "Only PNG/JPEG/WebP/GIF allowed");
  const kind = str(ctx.body, "kind") || "audit-screenshot";
  const ext = contentType.split("/")[1].replace("jpeg", "jpg");
  const key = `uploads/${kind}/${newId()}.${ext}`;

  const command = new PutObjectCommand({ Bucket: env.assetsBucket, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const cdn = process.env.CDN_BASE;
  const publicUrl = cdn ? `${cdn}/${key}` : `https://${env.assetsBucket}.s3.amazonaws.com/${key}`;
  return ok({ uploadUrl, key, publicUrl });
};
