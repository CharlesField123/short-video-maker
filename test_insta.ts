import { Config } from "./src/config";
import { InstagramAPI } from "./src/short-creator/libraries/Instagram";
import path from "path";
import fs from "fs-extra";

async function test() {
    const config = new Config();
    const api = new InstagramAPI(config);
    try {
        const outputPath = path.join(config.tempDirPath, "test_insta.mp4");
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }
        console.log("Searching and downloading to:", outputPath);
        const res = await api.findVideo(["dog"], 10, [], "portrait" as any, outputPath);
        console.log("Test Successful! Result payload:");
        console.log(res);

        const stats = fs.statSync(outputPath);
        console.log(`Downloaded File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (e) {
        console.error("Test Failed: ", e);
    }
}
test();
