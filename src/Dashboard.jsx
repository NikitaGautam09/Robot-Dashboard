import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { MapContainer, TileLayer, Marker, Popup, useMap,ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import IMAGE from './map.png';
import L from 'leaflet';
const Dashboard = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, theta: 0 });
  const containerRef = useRef();
  const initializedRef = useRef(false);
  const textureRef = useRef();
  const [mission,setCurrentMission]  = useState()

//   useEffect(() => {
//     if (!initializedRef.current) {
//       const scene = new THREE.Scene();

//       // Load image dimensions dynamically
//       const img = new Image();
//       img.src = IMAGE;
//       img.onload = () => {
//         const { naturalWidth, naturalHeight } = img;

//         const camera = new THREE.OrthographicCamera(
//           -naturalWidth / 2,
//           naturalWidth / 2,
//           naturalHeight / 2,
//           -naturalHeight / 2,
//           0.5,
//           1000
//         );

//         const renderer = new THREE.WebGLRenderer();

//         renderer.setSize(naturalWidth, naturalHeight);
//         containerRef.current.appendChild(renderer.domElement);

//         const geometry = new THREE.PlaneGeometry(naturalWidth, naturalHeight, 32, 32);

//         textureRef.current = new THREE.TextureLoader().load(IMAGE);
//         const material = new THREE.MeshBasicMaterial({ map: textureRef.current });

//         const plane = new THREE.Mesh(geometry, material);
//         scene.add(plane);

//         camera.position.z = 5;

//         const animate = () => {
//           requestAnimationFrame(animate);

//           // Add any animations or updates here

//           renderer.render(scene, camera);
//         };

//         animate();

//         initializedRef.current = true;
//       };
//     }
//   }, []);

  const RobotMarker = () => {
    const map = useMap();

    // Convert 3D coordinates to 2D leaflet coordinates
    const leafletCoords = map.latLngToLayerPoint([coordinates.y, coordinates.x]);

    

    return (
      <Marker position={map.layerPointToLatLng(leafletCoords)}>
        <Popup>{coordinates}</Popup>
      </Marker>
    );
  };

  const handleMissionClick = (missionNumber) => {
    setCurrentMission(missionNumber);

    axios.post('http://localhost:8000/add-mission/', { missionNumber })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    const socket = new WebSocket(`ws://localhost:8765`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCoordinates(data);
    };
  };

  return (
    <div>
      {/* <div ref={containerRef} style={{ width: '100%', height: '30%', marginLeft: '50%' }} /> */}
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '50%' }}>
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <ImageOverlay
          url={IMAGE}  // Path to your custom image file
          bounds={[
            [-90, -180],  // South West coordinates of the image
            [90, 180],    // North East coordinates of the image
          ]}
        />
        {coordinates && <RobotMarker />}
      </MapContainer>
      <p>Current State of Robot: {JSON.stringify(coordinates)}</p>
      <div>
        <button onClick={() => handleMissionClick(1)} style={{ color: 'blue' }}>Mission 1</button>
        <button onClick={() => handleMissionClick(2)} style={{ color: 'blue' }}>Mission 2</button>
        <button style={{ color: 'blue' }} onClick={() => handleMissionClick(3)}>Mission 3</button>
        <p>Current State of Robot: {JSON.stringify(coordinates)}</p>
      </div>
    </div>
  );
};

export default Dashboard;
