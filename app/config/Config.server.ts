function getConfig(configName: string) {
  const config = process.env[configName];

  if (config === undefined) {
    throw new Error(`Missing config ${configName}`);
  }

  return config;
}

export const config = {
  supabase_url: getConfig("SUPABASE_URL"),
  supabase_token: getConfig("SUPABASE_TOKEN"),
  timezone: getConfig("TIMEZONE"),
};
