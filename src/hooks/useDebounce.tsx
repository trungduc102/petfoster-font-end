import { useState, useEffect } from 'react';

const useDebounce = (value: string, delay: number) => {
    const [valueDebounce, setValueDebounce] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setValueDebounce(value);
        }, delay);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return valueDebounce;
};

export default useDebounce;
