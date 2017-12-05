import { JournalSetting } from '../models/journal-setting';
export class JournalAndSetting{ 
    id: number;
    channel_id: number;
    email: string;
    password: string;
    emp_id: string;
    first_name: string;
    last_name: string;
    mobile: string;
    is_active: boolean;
    is_deleted: boolean;
    created_by: string;
    updated_by: string;
    journal_id: number;
    language_id: number;
    appln_name: string;
    host_url: string;
    host_port: string;
    suname: string;
    spwd: string;
    rep_mac_addr: string;
    output_url_hls: string;
    output_url_rtsp: string;
    is_record: boolean;
    is_upload: boolean;
    ftp_host: string;
    ftp_port: number;
    ftp_uname: string;
    ftp_passwd: string;
    ftp_path: string;
    ha_ftp_host: string;
    ha_ftp_port: number;
    ha_ftp_uname: string;
    ha_ftp_passwd: string;
    ha_ftp_path: string;
    mac_id: string;
    stream_name: string;
    journal_settings: JournalSetting[];
}