
//ตัวแปรค่าคงที่,Path และ Icon สำหรับ Menu 
export const menuList = [
    { link: "/admin/dashboard/overview", text: "Dashboard", icon: "browse" },
    { link: "/admin/employees", text: "Employees", icon: "manage_accounts" },
    { link: "/admin/settings/patrol-preset", text: "Settings", icon: "manufacturing" },
]

//ตัวแปรค่าคงที่,Path และ Icon สำหรับ SubMenu 
export const subMenuList = [
    {
        group: "patrol",
        items: [
            { link: "/patrol/${id}/detail", text: "Detail", icon: "data_info_alert" },
            { link: "/patrol/${id}/report", text: "Report", icon: "Campaign" },
        ]
    },
    {
        group: "admin/dashboard",
        items: [
            { link: "/admin/dashboard/overview", text: "Overview", icon: "layers" },
            { link: "/admin/dashboard/heat-map", text: "Heat Map", icon: "map" },
        ]
    },
    {
        group: "admin/settings",
        items: [
            { link: "/admin/settings/patrol-preset/${id}", text: "Patrol Preset", icon: "deployed_code" },
            { link: "/admin/settings/patrol-checklist/${id}", text: "Patrol Checklist", icon: "checklist" },
            { link: "/admin/settings/location-&-zone", text: "Location & Zone", icon: "location_on" },
        ]
    },
]