import { join } from "path";
import { Utils } from "electrobun/bun";
import { DEFAULT_SD_PRESET_ID } from "../../../mainview/lib/sd/options";

export { DEFAULT_SD_PRESET_ID };

const APP_DATA_DIR = Utils.paths.userData;

export function resolveProjectPath(path: string) {
    return join(import.meta.dir, "../../../", path);
}

export const DEFAULT_SD_CLI_PATH = resolveProjectPath("sd-master/sd-cli.exe");
export const SD_USER_CONFIG_PATH = join(APP_DATA_DIR, "config", "sd.json");
