/** Centralized, validated environment access. */

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  get tableName() {
    return required("VTR_TABLE_NAME");
  },
  get adminKey() {
    return process.env.ADMIN_API_KEY ?? "";
  },
  get assetsBucket() {
    return process.env.ASSETS_BUCKET ?? "";
  },
  get region() {
    return process.env.AWS_REGION ?? "us-east-1";
  },
};
