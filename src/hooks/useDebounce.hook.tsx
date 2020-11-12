import React, {useEffect, useState} from "react"

const useDebounce = (value: string | unknown, delay: number) => {
    const [debounceValue, setDebounceValue] = useState<string | unknown>(value)

    useEffect(() => {
        const handleTimeOut = setTimeout(() => {
            setDebounceValue(value)
        }, delay)
        return () => {
            clearTimeout(handleTimeOut)
        }
    }, [value])

    return debounceValue;
}

export default useDebounce;