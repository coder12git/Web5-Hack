import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store from "@/stores/useWeb5Store";
import { fetch, ResponseType } from '@tauri-apps/api/http';
import axios from 'axios'

const accessToken = 'AIzaSyCfqty5e_JIBd-2RrdbB0W5ykv3D4noYNg'

const Doctors: FunctionComponent = () => {
    const { web5 } = useWeb5Store((state) => ({ web5: state.web5!, connect: state.connect }));
    const [places, setPlaces] = useState(null);

    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const response = await axios.get(
                  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=1500&keyword=hospital&key=${accessToken}`,
                );
        
                if (!response.data.ok) {
                  throw new Error('Network response was not ok');
                }
        
                // const result = response.data;
                // console.log(result);
                setPlaces(response.data.json);
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
        if (web5) {
            fetchData()
          }
    },[web5])
  return (
    <div>
        {places}
    </div>
  )
}

export default Doctors