export interface VkAccessInterface {
    access_token: string;
    access_token_id: string;
    user_id: number;
    additional_signup_required: boolean;
    is_partial: boolean;
    is_service: boolean;
    source: number;
    source_description: string;
    expires_in: number;
}

export interface VkUserInterface {
    id: number;
    home_town: string;
    status: string;
    photo_200: string;
    is_service_account: false;
    bdate: string;
    verification_status: string;
    first_name: string;
    last_name: string;
    bdate_visibility: number;
    phone: string;
    relation: number;
    screen_name: string;
    sex: number;
}
