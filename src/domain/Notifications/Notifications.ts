import * as z from "zod/v4"; 

export const NotificationsSchema = z.object({
    id_notification: z.string(),
    user_id: z.string(),
    filtrer_id: z.string(),
    notification_type_id: z.string(),
    timestamp: z.string().datetime(),
});

export type Notifications = z.infer<typeof NotificationsSchema>;