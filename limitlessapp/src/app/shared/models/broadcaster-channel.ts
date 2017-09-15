import { BroadcasterVideos } from '../models/broadcasterVideos';
export class BroadcasterChannel {
    id: number;
    application_id: number;
    broadcaster_id: number;
    lang_id: number;
    category_id: number;
    channel_name: string;
    channel_description: string;
    yt_streamtarget_name: string;
    fb_streamtarget_name: string;
    ha_streamtarget_name: string;
    channel_image: string;
    ha_channel_image: string;
    image_file_name: string;
    rank: number;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    is_hd: boolean = false;
    ha_rank: number = 1;
    ha_is_active: boolean = true;
    deprecated: boolean = false;
    videos: BroadcasterVideos[];
}

