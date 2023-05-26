import React, { Suspense, useRef, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';

import { Physics, RigidBody } from '@react-three/rapier';
import { Ground } from './Ground';
import { Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';





let yaw: any
let pitch: any


function Gun() {
  const gltf = useLoader(GLTFLoader, '/heavy_assault_rifle/scene.gltf');

  return (
    <primitive object={gltf.scene}  />
  );
}


function Game(props: any) {
  const ref = useRef<any>()
  const { camera } = useThree();
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
  const [mouseDown, setMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 });
  const [mouseSpeed, setMouseSpeed] = useState({ x: 0, y: 0 });

  const handleMouseDown = () => {
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
    
  };

  React.useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state, delta) => {
    const { x: mouseX, y: mouseY } = mousePosition;
    const { x: prevMouseX, y: prevMouseY } = prevMousePosition;
    const sensitivity = 0.01;
    

    if (mouseDown) {
      
      const deltaY = mouseX - prevMouseX;
      const deltaX = mouseY - prevMouseY;
      

      let yaw = deltaY * sensitivity;
      let Pitch = deltaX * sensitivity;
	  
      if (yaw < 0.0) {
        ref.current.rotation.y -= yaw
      } else {
        ref.current.rotation.y -= yaw
      }

      console.log(ref.current.rotation.y)

      if (Pitch < 0.0) {
        ref.current.rotation.x -= Pitch
      } else {
        ref.current.rotation.x -= Pitch
      }
      
      


      
      
      
      
      
      
      
      
      
      
      
      setPrevMousePosition({ x: mouseX, y: mouseY });


      
    }

    const cameraOffset = new Vector3(0, 0, 0);
    const movementVector = new Vector3(0, 0, 0);
    const newPosition = ref.current.position.clone().add(cameraOffset).add(movementVector);
    camera.position.copy(newPosition);
    camera.lookAt(ref.current.position);
  });

  useFrame((state, delta) => {
    const { forward, backward, left, right } = movement;
    
    
    const movementSpeed = 3;
    const distance = movementSpeed * delta;
    
    
    const moveX = (right ? 1 : 0) - (left ? 1 : 0);
    const moveY = (forward ? 1 : 0) - (backward ? 1 : 0);
    
    
    
    ref.current.position.x += moveX * distance;
    ref.current.position.z += moveY * distance;

    const cameraOffset = new Vector3(0, 0, 0);
    const movementVector = new Vector3(0.0, 0.0, 0.0);
    const newPosition = ref.current.position
    
    
      .clone()
      .add(cameraOffset)
      .add(movementVector);
    camera.position.copy(newPosition);
    
    camera.lookAt(ref.current.position);
    camera.rotation.copy(ref.current.rotation);
  });
  

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'w' || event.key === 'ArrowUp') {
      setMovement((prevState) => ({ ...prevState, forward: true }));
    } else if (event.key === 's' || event.key === 'ArrowDown') {
      setMovement((prevState) => ({ ...prevState, backward: true }));
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
      setMovement((prevState) => ({ ...prevState, left: true }));
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
      setMovement((prevState) => ({ ...prevState, right: true }));
    }
  };

  const handleKeyUp = (event: { key: string; }) => {
    if (event.key === 'w' || event.key === 'ArrowUp') {
      setMovement((prevState) => ({ ...prevState, forward: false }));
    } else if (event.key === 's' || event.key === 'ArrowDown') {
      setMovement((prevState) => ({ ...prevState, backward: false }));
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
      setMovement((prevState) => ({ ...prevState, left: false }));
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
      setMovement((prevState) => ({ ...prevState, right: false }));
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <mesh
      {...props}
      ref={ref}>
       
       

       <Gun />
      <meshStandardMaterial color={"orange"} />
    </mesh>
);
  
}






function Lights(){
  return(
    <>
    <ambientLight intensity={1.5} />
    <spotLight position={[119, 10, 10]} angle={0.15} penumbra={1} />
    
    </>

  )

}



function App(props: any) {
  return (
    <Suspense fallback={null}>
    <Canvas>
    
      
    
    
        <Physics debug>
          <RigidBody colliders={"hull"} restitution={2}>
          
          
          </RigidBody>
          <Game  />
          <Lights/>
          <Ground  />
         
          
        
        </Physics>
        
       
        <OrbitControls/>
      
      
        
    </Canvas>
    </Suspense>
  );
}

export default App;
