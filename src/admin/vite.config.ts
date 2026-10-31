import { mergeConfig, type UserConfig } from "vite";

export default (config: UserConfig) => {
  return mergeConfig(config, {
    server: {
      allowedHosts: [
        "api.feminaforce.com",
        "api.educandle.com"
      ],
    },
  });
};
