import React, { Suspense, useRef, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

import { Physics, RigidBody } from '@react-three/rapier';
import { Ground } from './Ground';
import { Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';






function Game(props: any) {
  const ref = useRef<any>()
  const { camera } = useThree();
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });

  useFrame((state, delta) => {
    const { forward, backward, left, right } = movement;
    
    
    const movementSpeed = 3;
    const distance = movementSpeed * delta;
    
    
    const moveX = (right ? 1 : 0) - (left ? 1 : 0);
    const moveY = (forward ? 1 : 0) - (backward ? 1 : 0);
    
   
    ref.current.rotation.y += moveX * distance;
    ref.current.position.x += moveY * distance;

    const cameraOffset = new Vector3(0, 2, 5);
    const movementVector = new Vector3(0, 0, 0);
    const newPosition = ref.current.position
      .clone()
      .add(cameraOffset)
      .add(movementVector);
    camera.position.copy(newPosition);
    camera.lookAt(ref.current.position);
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
       
       

      <boxGeometry args={[1, 1, 1]}  />
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
          <Game/>
          <Lights/>
          <Ground />
         
          
        
        </Physics>
        
       
        <OrbitControls/>
      
      
        
    </Canvas>
    </Suspense>
  );
}

export default App;
