import styled from "styled-components";
import { LinkProps, NavLink } from "react-router-dom";
import { HTMLAttributes } from "react";
import IconButton from "../buttons/IconButton";
import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

const Spacer = styled.div`
    flex: 1 1 auto;
`;

const Socials = styled((props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props}>
            <IconButton
                icon={faDiscord}
                title={"Discord"}
                onClick={() => {
                    BrowserOpenURL("https://discord.gg/QGaxXnuuqE");
                }}
            />
            <IconButton
                icon={faGithub}
                title={"github.com/hyperrationaltech/stlm-helper"}
                onClick={() => {
                    BrowserOpenURL("https://github.com/hyperrationaltech/stlm-helper");
                }}
            />
        </div>
    );
})`
    font-size: 1.25rem;
    color: #666;
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 0.25rem;
    margin-top: 0.5rem;
`;

const Branding = styled(NavLink)`
    color: #ccc;
    font-size: 1.5rem;
    font-variant: small-caps;
    display: flex;
    justify-content: center;
    text-decoration: none;
    :hover,
    :focus-visible {
        color: #fff;
    }
    transition: color 0.3s, background-color 0.3s;
    border-bottom: 1px solid #666;
    margin-right: 0.5rem;
    margin-bottom: 0.25rem;
`;

const Menu = styled(({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props}>
            <Branding to={"/"}>Euler</Branding>
            {children}
            <Spacer />
            <Link to={"/docs"}>Documentation</Link>
            <Link to={"/logs"}>Event Log</Link>
            <Socials />
        </div>
    );
})`
    background: #333;
    color: white;
    padding: 0.5rem;
    padding-right: 0;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
`;

const Link = styled(({ className, ...props }: LinkProps) => {
    return (
        <NavLink
            {...props}
            className={({ isActive }) => `${isActive ? "current" : ""} ${className}`}
        />
    );
})`
    color: #ccc;
    text-decoration: none;
    font-variant: small-caps;
    font-size: 1.125rem;
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
    display: flex;
    &.current {
        background-color: #222;
        margin-right: 0;
        padding-right: 1rem;
    }
    :hover,
    :focus-visible {
        color: white;
        background-color: #fff1;
    }
    &.current:hover,
    &.current:focus-visible {
        background-color: #444;
    }
    transition: color 0.3s, background-color 0.3s, margin-right 0.3s, padding-right 0.3s;
`;

export default {
    Menu,
    Link,
};
