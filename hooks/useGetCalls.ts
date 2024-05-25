import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

/**
 * @name useGetCalls
 * @description returns upcoming, ended and recorded calls
 * 
 * @returns 
 */
export const useGetCalls = () => {
    const [callsList, setCallsList] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const client = useStreamVideoClient();
    const { user } = useUser();

    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !user?.id) return;

            setIsLoading(true);

            try {
                const { calls } = await client.queryCalls({
                    sort: [
                        { field: "starts_at", direction: -1 },
                    ],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { created_by_user_id: user.id },
                            { members: { $in: [user.id] } }
                        ]
                    }
                });

                setCallsList(calls);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        loadCalls();
    }, [client, user?.id]);

    const now = new Date();

    const endedCalls = callsList.filter(({ state: { startsAt, endedAt } }: Call) =>
        (startsAt && new Date(startsAt) < now || !!endedAt)
    );
    const upcomingCalls = callsList.filter(({ state: { startsAt, endedAt } }: Call) =>
        (startsAt && new Date(startsAt) > now)
    );

    return { endedCalls, upcomingCalls, callRecordings: callsList, isLoading };
}