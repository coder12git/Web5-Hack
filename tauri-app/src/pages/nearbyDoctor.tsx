import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store from "@/stores/useWeb5Store";

const accessToken = "AIzaSyCfqty5e_JIBd-2RrdbB0W5ykv3D4noYNg"

const Doctors: FunctionComponent = () => {
  const { web5 } = useWeb5Store((state) => ({ web5: state.web5!, connect: state.connect }));
  const [places, setPlaces] = useState<any[]>([]);
  const [lat, setlat] = useState<number>();
  const [long, setlong] = useState<number>();

  const findHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const long = position.coords.longitude
        setlat(lat);
        setlong(long);
      })
    } else {
      console.log('Geolocation is not supported')
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${long}&radius=1500&keyword=hospital&key=${accessToken}`
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
  }
  // if(navigator.geolocation){
  //   navigator.geolocation.getCurrentPosition((position)=>{
  //     const lat = position.coords.latitude
  //     const long = position.coords.longitude
  //     setlat(lat);
  //     setlong(long);
  //   })
  // } else {
  //   console.log('Geolocation is not supported')
  // }

  // useEffect(()=>{
  //     const fetchData = async()=>{
  //         try {
  //             const response = await fetch(
  //               `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${long}&radius=1500&keyword=hospital&key=${accessToken}`
  //             );

  //             if (!response.ok) {
  //               throw new Error('Network response was not ok');
  //             }

  //             const result = await response.json();
  //             console.log(result.results)
  //             setPlaces(result.results);
  //           } catch (error) {
  //             console.error('Error fetching data:', error);
  //           }
  //         };
  //     if (web5) {
  //         fetchData()
  //       }
  // },[web5])
  return (
    <div>
      <button onClick={findHospitals}>Find Hospitals</button>
      {places?.map((place) => (
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