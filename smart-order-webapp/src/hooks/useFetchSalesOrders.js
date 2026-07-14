import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSmartOrderList, setTotalRecords } from "../redux/reducers/appReducer";
import fnServiceRequest from "../utility/fnServiceRequest";


export const useFetchSalesOrders = (payload, enabled = true) => {
    const dispatch = useDispatch();

    const query = useQuery({
        queryKey: ['salesOrders', payload],
        queryFn: async () => {
            const sUrl = "/JavaServices_Oauth/api/salesOrder/getSmartOrders";
            return new Promise((resolve, reject) => {
                fnServiceRequest(
                    sUrl,
                    "POST",
                    (response) => resolve(response),
                    (error) => reject(error),
                    payload
                );
            });
        },
        enabled: enabled,
        staleTime: 0, // Always refetch on mount
        gcTime: 1000 * 10,
        refetchInterval: 1000*60, // Poll every 60 seconds
        refetchOnMount: true, // here it is set to true becoz after modifying in detail Screen and coming back to list screen we want to refetch the data (it will not add anything extra if stale timw is 0)
        refetchOnWindowFocus: true,
    });

    // Handle side effects when data changes
    useEffect(() => {
        if (query.data) {
            dispatch(setSmartOrderList(query.data?.data || []));
            dispatch(setTotalRecords(query.data?.totalRecords || 0));
        }
    }, [query.data, dispatch]);

    useEffect(() => {
        if (query.error) {
            console.error("Error fetching sales orders:", query.error);
        }
    }, [query.error]);

    return {
        ...query,
        // Provide a simple refetch function for manual refresh
        fetchSalesOrders: () => {
            query.refetch();
        }
    };
};
