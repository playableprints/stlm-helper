import { ChangeEvent, InputHTMLAttributes, useCallback, useEffect, useState } from "react";
import Input, { InputProps } from "./Input";

const isValidRegex = (v: string) => {
    try {
        RegExp(v);
        return true;
    } catch (err) {
        return false;
    }
};

export default ({ value, onChange, ...props }: InputProps) => {
    const [cache, setCache] = useState(value);

    useEffect(() => {
        setCache(value);
    }, [value]);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const v = e.currentTarget.value;
            if (isValidRegex(v)) {
                e.currentTarget.setCustomValidity("");
                onChange && onChange(e);
            } else {
                e.currentTarget.setCustomValidity("Must be valid Regex");
            }
            setCache(v);
        },
        [onChange]
    );

    return <Input type={"text"} {...props} onChange={handleChange} value={cache} />;
};
