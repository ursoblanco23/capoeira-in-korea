export const PHONE_REGIONS = [
    {
        regionCode: 'KR',
        callingCode: '+82',
        label: '대한민국',
    },

    // 아직 미지원 국가
    /*{
        regionCode: 'US',
        callingCode: '+1',
        label: 'United States',
    },
    {
        regionCode: 'BR',
        callingCode: '+55',
        label: 'Brasil',
    },
    {
        regionCode: 'JP',
        callingCode: '+81',
        label: '日本',
    },*/
] as const;

export type PhoneRegionCode =
    typeof PHONE_REGIONS[number]['regionCode'];
