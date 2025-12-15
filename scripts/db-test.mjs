// Simple CLI to test MongoDB connectivity using the official driver
// Usage: npm run db:test
import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

async function main() {
  if (!uri) {
    console.error("[db-test] Missing MONGODB_URI in .env");
    process.exit(2);
  }
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  const start = Date.now();
  try {
    await client.connect();
    // ping the admin DB
    const adminDb = client.db().admin();
    const result = await adminDb.ping();
    const ms = Date.now() - start;
    console.log(`[db-test] MongoDB ping ok in ${ms}ms:`, result);
    process.exit(0);
  } catch (err) {
    console.error("[db-test] MongoDB connection failed:", err?.message ?? err);
    process.exit(1);
  } finally {
    try {
      await client.close();
    } catch {}
  }
}

main();
