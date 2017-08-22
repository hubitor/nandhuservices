import {Category} from '../models/category';
import {SubCategory} from '../models/sub-category';
import {Product} from '../models/product';

export class Shop{
    id: number;
    application_id: number;
    seller_shop_name: string;
    about_shop: string;
    shop_code: string;
    seller_location_latitude: number;
    seller_location_longitude: number;
    seller_kyc_doc_type: string;
    seller_kyc_doc_value: string;
    is_deleted: boolean;
    created_by: string;
    updated_by: string;
    category: Category;
    sub_category: SubCategory;
    product: Product;
}
