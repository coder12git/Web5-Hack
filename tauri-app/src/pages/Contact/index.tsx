import "./index.css";
import React, { FC, useState } from "react";

interface RowProp {
  name: String;
  address: String;
  rating: String
}

const RowComponent: FC<RowProp> = ({ name, address, rating}) => {
  return (
    <div className="row-container">
      <div>
        <h3>{name}</h3>
      </div>
      <div>
        <h3>{address}</h3>
      </div>
      <div>
        <h3>{rating}</h3>
      </div>
    </div>
  );
};

//@ts-ignore
const index: FC = ({find, places}) => {
  // const [fetchedLocations, setFetchedLocations] = useState<RowProp[]>([
  //   {
  //     name: "Hopsital",
  //     address: "No 4 Dress road",
  //     city: "Kumkubaga",
  //     distance: '47',
  //   },
  //   {
  //     name: "Hopsital",
  //     address: "No 4 Dress road",
  //     city: "Kumkubaga",
  //     distance: '47',
  //   },
  //   {
  //     name: "Hopsital",
  //     address: "No 4 Dress road",
  //     city: "Kumkubaga",
  //     distance: '47',
  //   },
  // ]);
  return (
    <div className="locate-container">
      <div className="header">
        <h1>Find Hospitals/Drs. Near You.</h1>
        <button className="find" onClick={find}>Find</button>
      </div>
      <div className="locations-container">
        <div className="row-container">
          <div>
            <h3>Hospital/Dr. name</h3>
          </div>
          <div>
            <h3>Address</h3>
          </div>
          <div>
            <h3>Ratings</h3>
          </div>
        </div>

        {/* @ts-ignore */}
        {places?.map((place) => {
          return (
            <RowComponent
              name={place.name}
              address={place.vicinity}
              rating={place.rating}
            />
          );
        })}
      </div>
    </div>
  );
};

export default index;
