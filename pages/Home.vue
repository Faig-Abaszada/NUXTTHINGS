<template>
    <div>
        <TableComponent :is-static-mode="true" :columns="defineTableColumns" :rows="rows" :simple-pagination="false"
            :page-options="pageOptions" :tooltip-signs="['', '']" :is-hide-paging="false" :is-total-on-top="true"
            :max-height="285" />
    </div>
</template>

<script>
import TableComponent from '@/components/TableComponent.vue'
export default {
    name: 'Home',
    components: {
        TableComponent
    },
    data() {
        return {
            defineTableColumns: [
                {
                    label: "№",
                    field: "order",
                    width: "70px",
                    sortable: false,
                    resizable: false,
                    isKey: true
                },
                {
                    label: "Campaign name",
                    field: "name",
                    width: "200px",
                    sortable: true,
                    resizable: true,
                    isKey: true
                },
                {
                    label: "Impressions",
                    field: "impressions",
                    width: "140px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "Clicks",
                    field: "clicks",
                    width: "140px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "Cost",
                    field: "cost",
                    width: "140px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "Reach (Display)",
                    field: "display_reach",
                    width: "140px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "Reach (Video)",
                    field: "video_reach",
                    width: "140px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "Reach (Social)",
                    field: "social_reach",
                    width: "70px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "CPM",
                    field: "CPM",
                    width: "70px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "CPC",
                    field: "CPC",
                    width: "70px",
                    sortable: true,
                    resizable: true
                },
                {
                    label: "Conversion",
                    field: "conversion",
                    width: "70px",
                    sortable: true,
                    resizable: true
                }
            ],
            pageOptions: [
                {
                    value: 6,
                    text: 6
                },
                {
                    value: 12,
                    text: 12
                }
            ],
            rows: [
                {
                    campaign_id: 2134,
                    display_reach: 766523,
                    video_reach: 352647,
                    social_reach: "-",
                    name: "TCCC_Coca-Cola_Coke&Meal_Omnichannel_February'24",
                    impressions: "5,768,068",
                    cost: "4,060.43 $",
                    clicks: "13,273",
                    CPM: "0.70 $",
                    CPC: "0.30 $",
                    conversion: "0",
                    order: 1
                },
                {
                    campaign_id: 2133,
                    display_reach: "-",
                    video_reach: "-",
                    social_reach: "-",
                    name: "TCCC_Coca-Cola_Coke&Meal_IG (story)_Plov_February'24",
                    impressions: "823,339",
                    cost: "311.35 $",
                    clicks: "536",
                    CPM: "0.37 $",
                    CPC: "0.58 $",
                    conversion: "0",
                    order: 2
                },
                {
                    campaign_id: 2132,
                    display_reach: "-",
                    video_reach: "-",
                    social_reach: "-",
                    name: "TCCC_Coca-Cola_Coke&Meal_IG (story)_Shashlik_February'24",
                    impressions: "941,350",
                    cost: "310.75 $",
                    clicks: "744",
                    CPM: "0.33 $",
                    CPC: "0.41 $",
                    conversion: "0",
                    order: 3
                },
                {
                    campaign_id: 2131,
                    display_reach: "-",
                    video_reach: "-",
                    social_reach: "-",
                    name: "TCCC_Coca-Cola_Coke&Meal_IG (story)_Pizza_February'24",
                    impressions: "875,790",
                    cost: "310.13 $",
                    clicks: "490",
                    CPM: "0.35 $",
                    CPC: "0.63 $",
                    conversion: "0",
                    order: 4
                },

            ]

        }
    }
}
</script>

<style scoped>
/* Add your custom styles here */
</style>