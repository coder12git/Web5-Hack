import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store from "@/stores/useWeb5Store";
// import { fetch, ResponseType } from '@tauri-apps/api/http';
// import axios from 'axios'

const accessToken = "AIzaSyCfqty5e_JIBd-2RrdbB0W5ykv3D4noYNg"

const Doctors: FunctionComponent = () => {
    const { web5 } = useWeb5Store((state) => ({ web5: state.web5!, connect: state.connect }));
    const [places, setPlaces] = useState<any[]>([]);

    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const response = await fetch(
                  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=22.572645%2C88.363892&radius=1500&keyword=hospital&key=${accessToken}`
                );
        
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
        
                const result = await response.json();
                console.log(result.results)
                setPlaces(result.results);
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
        {places?.map((place)=>(
          <div key={place.place_id}>
            <ul>
               <li className="font-bold">Name: {place.name}</li>
               <li>Address: {place.vicinity}</li>
               <li>Rating: {place.rating}</li>
            </ul>
          </div>
        ))}
    </div>
  )
}

export default Doctors