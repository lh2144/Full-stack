import { validate } from "graphql";
import { NavBar } from "./navbar";
import { Wrapper } from "./wrapper";

interface LayOutProps {
    variant?: "small" | "regular";
}

export const Layout: React.FC<LayOutProps> = ({ children, variant }) => {
    return (
        <>
            <NavBar></NavBar>
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};
