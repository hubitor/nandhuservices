import { BroadcasterChannel } from "../models/broadcaster-channel";
import { BroadcasterVideos } from "../models/broadcasterVideos";

export class BroadcasterOnBoardRequest {
    rank:number;
    is_active:boolean;
    broadcaster_name:string; 
    broadcaster_channel_name:string;
    category_id:number;
    broadcaster_email:string;
    broadcaster_description:string; 
    broadcaster_website:string;
    broadcaster_image:string;
    broadcaster_tags:string;
    broadcast_loc_lattitude:number;
    broadcast_loc_longtitude:number;
    broadcast_kyc_doc_type:string;
    broadcast_kyc_doc_value:string;
    broadcaster_total_videos:number;
    createdby:string;
    updated_by:string;
    server_pu_dns_name:string;
    server_pr_dns_name:string;
    mapped_domain_name:string;
    w_application_name:string;
    primary_channel_id:number;
    country_code:string;
    state_code:string;
    city_code:string;
    broadcaster_channels:BroadcasterChannel;
    broadcaster_videos:BroadcasterVideos; 
}