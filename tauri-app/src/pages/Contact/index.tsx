import "./index.css";
import React, { FC, useState } from "react";

interface RowProp {
  name: String;
  address: String;
  city: String;
  distance: Number;
}

const RowComponent: FC<RowProp> = ({ name, address, city, distance }) => {
  return (
    <div className="row-container">
      <div>
        <h3>{name}</h3>
      </div>
      <div>
        <h3>{address}</h3>
      </div>
      <div>
        <h3>{city}</h3>
      </div>
      <div>
        <h3>{distance}</h3>
      </div>
    </div>
  );
};

const index: FC = () => {
  const [fetchedLocations, setFetchedLocations] = useState<RowProp[]>([
    {
      name: "Hopsital",
      address: "No 4 Dress road",
      city: "Kumkubaga",
      distance: 47,
    },
    {
      name: "Hopsital",
      address: "No 4 Dress road",
      city: "Kumkubaga",
      distance: 47,
    },
    {
      name: "Hopsital",
      address: "No 4 Dress road",
      city: "Kumkubaga",
      distance: 47,
    },
  ]);
  return (
    <div className="locate-container">
      <div className="header">
        <h1>Find Hospitals/Drs. Near You.</h1>
        <button>locate</button>
      </div>
      <div className="locations-container">
        <RowComponent
          name={"Hospital/Dr. name"}
          address={"Address"}
          city={"City"}
          distance={"Distance"}
        />
        {fetchedLocations.map((location) => {
          return (
            <RowComponent
              name={location.name}
              address={location.address}
              city={location.city}
              distance={location.distance}
            />
          );
        })}
      </div>
    </div>
  );
};

export default index;
