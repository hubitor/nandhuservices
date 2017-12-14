import {AppSettings} from '../api/api-settings'

export class AppConfig  { 

//Delete stream target
public static delete_streamTarget="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static create_streamTarget="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static get_streamTarget="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static get_streamTarget_suddi="http://journal2.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static create_streamTarget_suddi="http://journal2.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static delete_streamTarget_suddi="http://journal2.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static get_channel_active="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

//Journal Active List

public static get_journal_active="http://journal2.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";
//ka-mob-prajaa/instances

// Journal Destination Stream


public static get_streamTarget_journal="http://journal2.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static create_streamTarget_journal="http://journal2.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";

public static delete_streamTarget_journal="http://journal2.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/";


  // Application Config   
  public static get_Appl=AppSettings.API_ENDPOINT +"application";
  public static new_Appl=AppSettings.API_ENDPOINT +"new";
  public static amend_Appl=AppSettings.API_ENDPOINT +"update";
  
  //Category Config
  public static get_Category=AppSettings.API_ENDPOINT +"product/category/all";//should be pass "all" as to server
  public static new_Category=AppSettings.API_ENDPOINT +"product/category/new"; //to pass "new"" as to server
  public static amend_Category=AppSettings.API_ENDPOINT +"product/category/live"; // to pass "live" as to server
  public static getid_category=AppSettings.API_ENDPOINT +"product/category/get"; // to pass "live" as to server
  
  //Sub-Category Config
  public static get_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/all/";
  public static new_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/new";
  public static get_subcategory_by_id = AppSettings.API_ENDPOINT + "product/subcategory/get/";
  public static amend_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/update";

  //Product Config
  public static get_Products=AppSettings.API_ENDPOINT +"product/all";
  public static get_ProductById=AppSettings.API_ENDPOINT +"product/get/";
  public static new_Product=AppSettings.API_ENDPOINT +"new";
  public static amend_Product=AppSettings.API_ENDPOINT +"update";

  //Broadcasters Config
  public static get_BroadcasterDest=AppSettings.API_ENDPOINT +"broadcaster/destination/all";
  public static get_BroadcasterChannelDest=AppSettings.API_ENDPOINT +"broadcaster/destination/all/";
   public static get_Broadcasters=AppSettings.API_ENDPOINT +"broadcaster/all";
   public static get_BroadcastersById=AppSettings.API_ENDPOINT +"broadcaster/get/";
   public static get_BroadcastersByCategoryId=AppSettings.API_ENDPOINT +"broadcaster/get/";
   public static update_BroadcasterytVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterytVideo/update"; //to pass "new"" as to server
   public static update_BroadcasterfbVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterfbVideo/update"; //to pass "new"" as to server
   public static update_BroadcasterhaVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterhaVideo/update"; //to pass "new"" as to server
   public static update_BroadcasterpsVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterpsVideo/update"; //to pass "new"" as to server


   public static new_BroadcasterVideokey=AppSettings.API_ENDPOINT +"broadcaster/broadcasterVideo/new"; //to pass "new"" as to server
   public static new_BroadcasterOnBoard=AppSettings.API_ENDPOINT +"broadcaster/broadcasterwithchannel/create"; //to pass "new"" as to server
   public static get_BroadcasterChannel=AppSettings.API_ENDPOINT +"broadcaster/broadcasterchannel/all"; //to pass "new"" as to server
   public static get_ChannelCategory=AppSettings.API_ENDPOINT +"broadcaster/broadcastercategory/all"; //to pass "new"" as to server
   public static get_BroadcasterChannelByID=AppSettings.API_ENDPOINT +"broadcaster/broadcasterchannel/broadcaster/"; //to pass "new"" as to server
   //Document Type Config
   
   public static get_DocumentType=AppSettings.API_ENDPOINT +"document/all"; //to pass "new"" as to server

   
  //Common Config
   public static get_country=AppSettings.API_ENDPOINT +"common/country/all"; //to get all countries
   public static get_state=AppSettings.API_ENDPOINT +"common/state/all/"; //to get all state
   public static get_city=AppSettings.API_ENDPOINT +"common/city/all/"; //to get all city
   public static get_rank=AppSettings.API_ENDPOINT +"common/rank/all/"; //to get all ranks
   public static get_application=AppSettings.API_ENDPOINT +"applications/app/all/"; //to get all ranks
   public static get_language=AppSettings.API_ENDPOINT +"common/lang/all"; //to get all ranks

   //User

   public static new_user=AppSettings.API_ENDPOINT +"user/register"; //to get all ranks
   public static user_roleAll=AppSettings.API_ENDPOINT +"applications/app/role/all"; //to get all ranks

   //Shop
   public static get_shop=AppSettings.API_ENDPOINT +"user/shop/all"; 
   public static new_shop=AppSettings.API_ENDPOINT +"user/shop/new"; 

  //File Uploader 

  
   public static ul_video_url=AppSettings.API_ENDPOINT +"upload/video/entertainment/content/"; //to get all ranks
   public static ul_videoq_url=AppSettings.API_ENDPOINT +"upload/video/queue/";
   
   
 //Notification Template
 public static stop_stream_url=AppSettings.API_ENDPOINT +"notificationtemplate/stopbroadcasting/mail/"; //to pass id as Template Id,Img_id as destination Type Id and b_id as broadcaster Id
 public static start_stream_url=AppSettings.API_ENDPOINT +"notificationtemplate/startbroadcasting/mail/"; //to pass id as Template Id,Img_id as destination Type Id and b_id as broadcaster Id


 //Journal List
 public static journal_list_url=AppSettings.API_ENDPOINT +"journal/list/channel/"; //to pass channel id
 public static journal_all_list_url=AppSettings.API_ENDPOINT +"journal/journallist/all"; //to get all journal list
 public static new_Journal=AppSettings.API_ENDPOINT +"journal/new";
 public static amend_Journal=AppSettings.API_ENDPOINT +"update";

// Journal Device
public static jdevices_all=AppSettings.API_ENDPOINT +"journal/device/all"; //to get all journalDevice
public static new_JournalDevice=AppSettings.API_ENDPOINT +"journal/update";

// Journal Setting
public static getJournalsByChannel=AppSettings.API_ENDPOINT +"journal/list/channel/"; // to pass channel id
public static getJournalSettingByJournalId=AppSettings.API_ENDPOINT +"journal/get/settings/";  // to pass journal id
public static getJournalDeviceBySettingsId=AppSettings.API_ENDPOINT +"journal/get/setting-device/"; // to pass setting id
public static createNewJournalSettingAndDevice=AppSettings.API_ENDPOINT +"journal/setting/new";
public static getjournalandSettingBychannelId=AppSettings.API_ENDPOINT+"journal/journalandsetting/"; //to pass channel id


// Broadcaster Destination 
public static create_Destination=AppSettings.API_ENDPOINT +"broadcaster/destination/new";
public static get_DestinationImages=AppSettings.API_ENDPOINT+"broadcaster/destination/getImg/"; //to pass channel id and d_id

// Broadcaster-channel videos

public static getPrimaryChannelVideos=AppSettings.API_ENDPOINT +"broadcaster/videos/list/pcv/";  //to pass broadcasterid
public static createNewChannel=AppSettings.API_ENDPOINT +"broadcaster/broadcasterchannel/new"; 
public static  getChannelVideos=AppSettings.API_ENDPOINT +"broadcaster/videos/list/channel/";   //to pass channelid
public static  getLiveChannelVideos=AppSettings.API_ENDPOINT +"broadcaster/videos/live/";  // to pass channel id

};
