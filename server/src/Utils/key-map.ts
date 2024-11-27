export const keyMap: Record<string, string> = {
    us_id: 'id',
    us_username: 'username',
    us_email: 'email',
    us_password: 'password',
    us_role: 'role',
    us_department: 'department',
    us_created_at: 'createdAt',
    df_id: 'id',
    df_name: 'name',
    df_description: 'description',
    df_type: 'type',
    df_status: 'status',
    df_timestamp: 'timestamp',
    df_us_id: 'userId',
    df_pr_id: 'patrolResultId',
    nt_id: 'id',
    nt_message: 'message',
    nt_read: 'read',
    nt_timestamp: 'timestamp',
    nt_type: 'type',
    nt_url: 'url',
    nt_us_id: 'userId',
    pf_id: 'id',
    pf_name: 'name',
    pf_age: 'age',
    pf_tel: 'tel',
    pf_address: 'address',
    pf_us_id: 'userId',
    pf_im_id: 'imageId',
    pt_id: 'id',
    pt_date: 'date',
    pt_start_time: 'startTime',
    pt_end_time: 'endTime',
    pt_duration: 'duration',
    pt_status: 'status',
    pt_ps_id: 'presetId',
    ptcl_id: 'id',
    ptcl_pt_id: 'patrolId',
    ptcl_cl_id: 'checklistId',
    ptcl_us_id: 'userId',
    ps_id: 'id',
    ps_title: 'title',
    ps_description: 'description',
    ps_version: 'version',
    ps_latest: 'latest',
    ps_update_at: 'updatedAt',
    ps_update_by: 'updatedBy',
    pscl_ps_id: 'presetId',
    pscl_cl_id: 'checklistId',
    cl_id: 'id',
    cl_title: 'title',
    cl_version: 'version',
    cl_latest: 'latest',
    cl_update_at: 'updatedAt',
    cl_update_by: 'updatedBy',
    pr_id: 'id',
    pr_status: 'status',
    pr_itze_it_id: 'itemId',
    pr_itze_ze_id: 'zoneId',
    pr_pt_id: 'patrolId',
    item_zone: 'itemZone',
    it_id: 'id',
    it_name: 'name',
    it_type: 'type',
    it_cl_id: 'checklistId',
    ze_id: 'id',
    ze_name: 'name',
    ze_lt_id: 'locationId',
    ze_us_id: 'userId',
    itze_it_id: 'itemId',
    itze_ze_id: 'zoneId',
    lt_id: 'id',
    lt_name: 'name',
    cm_id: 'id',
    cm_message: 'message',
    cm_timestamp: 'timestamp',
    cm_us_id: 'userId',
    cm_pr_id: 'patrolResultId',
    im_id: 'id',
    im_path: 'path',
    im_timestamp: 'timestamp',
    im_update_by: 'updatedBy',
    dfim_df_id: 'defectId',
    dfim_im_id: 'imageId',
};

// สร้างรายการคีย์ที่เป็นข้อมูลสำคัญ (Sensitive Keys)
const sensitiveValues = new Set(['password', 'secretKey', 'apiKey']);
const sensitiveKeys = Object.entries(keyMap)
    .filter(([key, value]) => sensitiveValues.has(value))
    .map(([key, value]) => key)
    .concat(Array.from(sensitiveValues))

export default function transformKeys<T>(data: T, keyMap: Record<string, string>): any {
    data = removeSensitiveData(data); 

    if (Array.isArray(data)) {
        return data.map(item => transformKeys(item, keyMap));
    } else if (typeof data === 'object' && data !== null) {
        return Object.entries(data).reduce((acc, [key, value]) => {
            const newKey = keyMap[key] || key;
            if (value instanceof Date) {
                acc[newKey] = value.toISOString();
            } else {
                acc[newKey] = Array.isArray(value) || (typeof value === 'object' && value !== null)
                    ? transformKeys(value, keyMap)
                    : value;
            }
            return acc;
        }, {} as Record<string, any>);
    }
    return data;
}

function removeSensitiveData(data: any): any {
    if (data instanceof Date) {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item => removeSensitiveData(item));
    } else if (typeof data === 'object' && data !== null) {
        const filteredData = { ...data };
        // ลบคีย์ที่เป็นข้อมูลสำคัญ
        for (const key of sensitiveKeys) {
            if (key in filteredData) {
                delete filteredData[key];
            }
        }
        // วนลูปสำหรับ nested objects
        for (const key in filteredData) {
            filteredData[key] = removeSensitiveData(filteredData[key]);
        }
        return filteredData;
    }
    return data;
}