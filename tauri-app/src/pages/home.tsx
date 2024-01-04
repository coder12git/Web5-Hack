// import React from "react";
import useWeb5Store from "@/stores/useWeb5Store";

function Home (){
    const did = useWeb5Store((state) => state.did);
    return (
        <div>{did}</div>
    )
}

export default Home;