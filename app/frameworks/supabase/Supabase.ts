import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { config } from "~/config/Config.server";

let supaClient: SupabaseClient;

declare global {
  var __supaClient: SupabaseClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  supaClient = createClient(config.supabase_url, config.supabase_token);
} else {
  if (!global.__supaClient) {
    global.__supaClient = createClient(
      config.supabase_url,
      config.supabase_token
    );
  }
  supaClient = global.__supaClient;
}

export { supaClient };
