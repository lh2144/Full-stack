import React from "react";
import { NavBar } from "src/components/navbar";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "src/utils/createUrqlClient";


const Index = () => (
    <>
        <NavBar />
        <div>Hello worl</div>
    </>
);

export default withUrqlClient(createUrqlClient)(Index);
