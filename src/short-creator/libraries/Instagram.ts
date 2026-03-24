import { logger } from "../../logger";
import google from "googlethis";
import ytDlp from "yt-dlp-exec";
import path from "path";
import fs from "fs-extra";
import cuid from "cuid";
import { Config } from "../../config";
import { OrientationEnum } from "../../types/shorts";

export class InstagramAPI {
    constructor(private config: Config) { }

    public async findVideo(
        searchTerms: string[],
        minDuration: number,
        excludeVideoIds: string[],
        orientation: OrientationEnum,
        outputPath: string
    ): Promise<{ id: string; url: string; citation: string }> {
        logger.debug({ searchTerms }, "Searching for vertical meme video");

        try {
            // Because Instagram blocks headless unauthenticated downloads almost globally,
            // we use yt-dlp's native ytsearch on YouTube Shorts to retrieve
            // the exact same trending cross-posted vertical memes effortlessly.
            const query = `ytsearch1:"${searchTerms.join(" ")}" meme shorts`;

            logger.debug({ query }, `Fetching meme via yt-dlp to ${outputPath}`);

            // We use dump-json to get the title and uploader, then download
            const metadata = await ytDlp(query, {
                dumpJson: true,
                noPlaylist: true,
            }) as any;

            const id = metadata.id || cuid();
            const url = metadata.webpage_url || `https://youtube.com/shorts/${id}`;
            const citation = metadata.uploader ? `@${metadata.uploader}` : "@meme_creator";

            logger.debug({ url, citation }, "Found Meme Video URL. Downloading...");

            await ytDlp(url, {
                output: outputPath,
                format: "mp4",
                noPlaylist: true,
            });

            return {
                id,
                url: url,
                citation
            };

        } catch (error) {
            logger.error(error, "Error fetching meme video");
            throw error;
        }
    }
}
