import { ChangeEvent, InputHTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
import Input, { InputProps } from "./Input";

const isValidRegex = (v: string) => {
  try {
    RegExp(v);
    return true;
  } catch (err) {
    return false;
  }
};

export default ({ value, onClear, onChange, ...props }: InputProps) => {
  const [cache, setCache] = useState(value);

  useEffect(() => {
    setCache(value);
  }, [value]);

  const validate = useCallback((value: string) => {
    if (isValidRegex(value)) {
      return "";
    }
    return "Must be a valid Regex";
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value;
      const valid = validate(v);
      if (valid === "") {
        onChange && onChange(e);
      }
      setCache(v);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
      setCache("");
    }
  }, [onClear]);

  const ref = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={ref}
      type={"text"}
      {...props}
      onChange={handleChange}
      onClear={onClear ? handleClear : undefined}
      onValidate={validate}
      value={cache}
    />
  );
};
