export class BroadcasterVideos
{
    
    broadcaster_channel_id:number;
    video_name:string;
    rank:number;
    video_thumbnail:string;
    video_description:string;
    url:string; 
    duration:number=0;
    is_active:boolean; 
    is_live:boolean;
    is_youtube:boolean;
    live_ads:boolean=false;
    p160:boolean=false;
    p360:boolean=false;
    p720:boolean=false;
    p1080:boolean=false;
    p_uhd:boolean=false;
    video_type:string;    
    yt_streamkey:string;
    fb_streamkey:string;
    ha_streamkey:string;
    created_by:string; 
    updated_by:string;
    
}