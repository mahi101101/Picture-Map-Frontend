import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Cube from "../../places/pages/Cube";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import "./MapFun.css";

const MapFun = (props) => {
  const [showCube, setShowCube] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 28.6436846, lng: 76.7635778 });
  const [searchQuery, setSearchQuery] = useState("");
  
  const openCubeHandler = () => setShowCube(true);
  const closeCubeHandler = () => setShowCube(false);

  const searchLocation = async () => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`);
      const data = await response.json();
      if (data.results && data.results[0] && data.results[0].geometry && data.results[0].geometry.location) {
        setCoordinates(data.results[0].geometry.location);
      }
    } catch (error) {
      console.error("Error fetching location: ", error);
    }
  }

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <React.Fragment>
      <Modal
        show={showCube}
        onCancel={closeCubeHandler}
        header="CUBE WITH MAP TEXTURE APPLIED"
        content-class="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeCubeHandler}>CLOSE</Button>}
      >
        <Cube center={coordinates}/>
      </Modal >
      <li className="place-fitem">
        <Card className="place-item__content">
          <div className="place-item__info">
            <h2>Search for Place</h2>
          </div>
          <div id="search-bar">
            <input
              className="search"
              id="search-input"
              type="text"
              placeholder="Search for location..."
              onChange={handleInputChange}
            />
            <Button onClick={searchLocation}>Search</Button>
          </div>
          <div className="map-container1" id="map">
            <Map center={coordinates} zoom={14} />
          </div>
          <div className="btt">
            <Button inverse onClick={openCubeHandler}>
              VIEW ON CUBE
            </Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default MapFun;