import { join } from "path";
import { DEFAULT_SD_PRESET_ID } from "../../../mainview/lib/sd/options";

export { DEFAULT_SD_PRESET_ID };

export function resolveProjectPath(path: string) {
    return join(import.meta.dir, "../../../", path).replaceAll("/", "\\");
}

export const DEFAULT_SD_CLI_PATH = resolveProjectPath("sd-master/sd-cli.exe");
export const SD_USER_CONFIG_PATH = resolveProjectPath("config/sd.json");
