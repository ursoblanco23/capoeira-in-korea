import { useEffect, useState } from 'react';
import dojangService from "../services/api/services/dojangService.ts";
import type {Dojang} from "@/types/dojang.ts";


function useDojang() {
    const [dojangs, setDojangs] = useState<Dojang[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await dojangService.getDojangs();
            setDojangs(data);
            setLoading(false);
        })();
    }, []);

    return { dojangs, loading };
}

export default useDojang;