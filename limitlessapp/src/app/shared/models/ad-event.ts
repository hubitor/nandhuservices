import { AssignLogoAds } from "app/shared/models/assign-logo-ads";

export class AdEvent {
    id: number;
    channel_id: number;
    event_name: string;
    event_type: string;
    duration: string;
    date: string;
    start_time: string;
    end_time: string;
    ad_window_time_pa: number;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    assignLogoAds: AssignLogoAds[];
}