import { usePostQuery } from "src/generated/graphqa";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
    const intId = useGetIntId();
    return usePostQuery({
        skip: intId === -1,
        variables: {
            id: intId
        }
    })
}