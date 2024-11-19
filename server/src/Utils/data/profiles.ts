import { Profile } from "@prisma/client";

export const profiles: Profile[] = [
    { pf_id: 1, pf_name: 'Admin Mhee', pf_age: 20, pf_tel: '0949999999', pf_address: 'Chonburi, Thailand', pf_us_id: 1, pf_im_id: null },
    { pf_id: 2, pf_name: 'John Doe', pf_age: 25, pf_tel: '1234567890', pf_address: 'Bangkok, Thailand', pf_us_id: 2, pf_im_id: null },
    { pf_id: 3, pf_name: 'Jame Smith', pf_age: 30, pf_tel: '0987654321', pf_address: 'Chiang Mai, Thailand', pf_us_id: 3, pf_im_id: 1 },
    { pf_id: 4, pf_name: 'Michael Johnson', pf_age: 28, pf_tel: '1122334455', pf_address: 'Phuket, Thailand', pf_us_id: 4, pf_im_id: null },
    { pf_id: 5, pf_name: 'Emily Davis', pf_age: 32, pf_tel: '6677889900', pf_address: 'Pattaya, Thailand', pf_us_id: 5, pf_im_id: null },
    { pf_id: 6, pf_name: 'David Wilson', pf_age: 29, pf_tel: '5566778899', pf_address: 'Hat Yai, Thailand', pf_us_id: 6, pf_im_id: null },
    { pf_id: 7, pf_name: 'Sophia Taylor', pf_age: 35, pf_tel: '4455667788', pf_address: 'Korat, Thailand', pf_us_id: 7, pf_im_id: null },
    { pf_id: 8, pf_name: 'Jack Danial', pf_age: 27, pf_tel: '3344556677', pf_address: 'Khon Kaen, Thailand', pf_us_id: 8, pf_im_id: null },
];
