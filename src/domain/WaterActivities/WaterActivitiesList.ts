export interface WaterActivitiesList {
    user_id: string,
    filtrer_id: string,
    water_activities_list: {
        water_activity: string,
        percentage: number
    }[]
}