import { BroadcasterChannel } from "../models/broadcaster-channel";
import { BroadcasterVideos } from "../models/broadcasterVideos";

export class BroadcasterOnBoardRequest {
    rank:number;
    is_active:boolean;
    broadcaster_name:string; 
    broadcaster_channel_name:string;
    category_id:number;
    seller_id:number;
    broadcaster_email:string;
    broadcaster_description:string; 
    broadcaster_website:string;
    broadcaster_image:string;
    broadcaster_tags:string;
    broadcaster_loc_latitude:number;
    broadcaster_loc_longitude:number;
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