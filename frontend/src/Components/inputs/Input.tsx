import { faClose } from "@fortawesome/free-solid-svg-icons";
import {
    ChangeEvent,
    ForwardedRef,
    forwardRef,
    InputHTMLAttributes,
    useCallback,
    useState,
} from "react";
import styled from "styled-components";
import IconButton from "../buttons/IconButton";

const Wrapper = styled.div`
    display: inline-flex;
    flex: 1 1 auto;
    background: #222;
    padding: 0.125rem 0.25rem;
    border: 1px solid #666;
    border-radius: 0.25rem;
    font-family: monospace;
    &:focus-within {
        border-color: #999;
    }
    &.invalid {
        border-color: #c66;
    }
    &.disabled {
        border-color: #666;
        background-color: #333;
        color: #aaa;
    }
    &:focus-within.invalid {
        border-color: #f99;
    }
`;

const Inner = styled.input`
    flex: 1 1 auto;
    font-family: monospace;
    padding-inline: 0.125rem;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

export type InputProps = {
    onClear?: () => void;
    inputClass?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default forwardRef(
    (
        { className, onClear, onChange, disabled, inputClass, ...props }: InputProps,
        fRef: ForwardedRef<HTMLInputElement>
    ) => {
        const [invalid, setInvalid] = useState(false);
        const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                onChange && onChange(e);
                setInvalid(!e.currentTarget.validity.valid);
            },
            [onChange]
        );

        return (
            <Wrapper
                className={`${className ?? ""} ${disabled ? "disabled" : ""} ${
                    invalid ? "invalid" : ""
                }`}
            >
                <Inner
                    ref={fRef}
                    {...props}
                    disabled={disabled}
                    className={inputClass}
                    onChange={handleChange}
                />
                {onClear && (
                    <IconButton
                        tabIndex={-1}
                        className={"danger"}
                        disabled={disabled}
                        onClick={() => {
                            onClear();
                        }}
                        icon={faClose}
                    />
                )}
            </Wrapper>
        );
    }
);
