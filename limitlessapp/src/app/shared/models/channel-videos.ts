import { BroadcasterVideos } from "app/shared/models/broadcasterVideos";

export class ChannelVideos {
    id: number;
    application_id: number;
    broadcaster_id: number;
    lang_id: number;
    channel_name: string;
    channel_image: string;
    videos: BroadcasterVideos;
}