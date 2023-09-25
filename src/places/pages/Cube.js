import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
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
  const auth = useContext(AuthContext);
  const boxRef = useRef(null);
  const [img, setUrlData] = useState(null);
  const { sendRequest } = useHttpClient();
  const center = props.center;
  console.log(center + "In react");
 // eslint-disable-next-line 
  useEffect(
    // eslint-disable-next-line 
    useCallback(() => {
      const fetchUrl = async () => {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/map/cap/location?lat=${center.lat}&lng=${center.lng}`,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          setUrlData(responseData.img);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUrl();
      setUrlData(img);
    
    }),
    []
  );

  // eslint-disable-next-line 
  useEffect(
    // eslint-disable-next-line 
    useCallback(() => {
      if (!img) return; 

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

      const texture = new Texture(img, scene); 
      boxRef.current.material.diffuseTexture = texture;

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });

      return () => {
        // window.removeEventListener("resize", engine.resize);
        engine.dispose(); 
      };
    }),
    [img]
  ); 

  return (
    <Card className="place-item__content">
      <canvas id="renderCanvas" className="canvas-cube"></canvas>
    </Card>
  );
};

export default Cube;
