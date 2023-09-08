import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Texture,
  StandardMaterial,
} from "babylonjs";

import "./Cube.css";

const Cube = (props) => {
  const boxRef = useRef(null);
  const [img, setUrlData] = useState(null);
  const { sendRequest } = useHttpClient();
  const placeId = props.placeId;

  // Fetch the image URL
  useEffect(
    useCallback(() => {
      const fetchUrl = async () => {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}/capmap`,
            "GET"
          );
          setUrlData(responseData.img);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUrl();
      setUrlData(
        img
      );
    }),
    []
  );

  // Setup the BabylonJS scene and cube
  useEffect(
    useCallback(() => {
      if (!img) return; // If imgUrl is not available yet, do nothing

      const engine = new Engine(document.getElementById("renderCanvas"), true);
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2,
        5,
        new Vector3(0, 0, 0),
        scene
      );
      camera.attachControl(document.getElementById("renderCanvas"), true);

      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      const box = MeshBuilder.CreateBox("box", {}, scene);
      const material = new StandardMaterial("boxMat", scene);
      box.material = material;
      boxRef.current = box;

      const texture = new Texture(img, scene); // Use scene directly
      boxRef.current.material.diffuseTexture = texture;

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });

      return () => {
        // window.removeEventListener("resize", engine.resize);
        engine.dispose(); // Ensure proper cleanup of resources
      };
    }),
    [img]
  ); // this useEffect will re-run once imgUrl changes

  return (
    <Card className="place-item__content">
      <canvas id="renderCanvas" className="canvas-cube"></canvas>
    </Card>
  );
};

export default Cube;
