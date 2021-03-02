import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "src/generated/graphqa"

export  const useIsAuth = () => {
    const { data, loading } = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if (!loading && !data?.currentUser) {
            router.replace('/login?next=' + router.pathname);
        }
    }, [loading, data, router])
}