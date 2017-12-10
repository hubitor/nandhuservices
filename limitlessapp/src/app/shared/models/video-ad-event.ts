import { AssignVideoAds } from "app/shared/models/assign-video-ads";

export class VideoAdEvent {
    id: number;
    channel_id: number;
    event_name: string;
    date: string;
    no_of_ads: number;
    start_time: string;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    assignVideoAds: AssignVideoAds[];
}
