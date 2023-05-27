import React, { Suspense, useRef, useState } from 'react';
import './App.css';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';

import { Physics, RigidBody } from '@react-three/rapier';
import { Ground } from './Ground';
import { Euler, Vector3 } from 'three';
import { PointerLockControls, Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


function Gun() {
	const gltf = useLoader(GLTFLoader, '/heavy_assault_rifle/scene.gltf');

	return (
		<primitive object={gltf.scene} />

	);
}

function rotateVec(x: number, y: number, theta: number): [number, number] {
	const cosTheta = Math.cos(theta);
	const sinTheta = Math.sin(theta);
  
	const newX = cosTheta * x - sinTheta * y;
	const newY = sinTheta * x + cosTheta * y;
  
	return [newX, newY];
} 

function Game(props: {
	inputLocked: boolean
}) {
	const ref = useRef<any>()
	const camera = useThree(state => state.camera);
	const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
	const [, setMouseDown] = useState(false);
	const mouseDelta = useRef<{
		x: number,
		y: number
	}>({
		x: 0,
		y: 0
	})

	const handleMouseDown = () => {
		setMouseDown(true);
	};


	const handleMouseUp = () => {
		setMouseDown(false);
	};

	const handleMouseMove = (event: { movementX: number; movementY: number }) => {
		mouseDelta.current.x = event.movementX
		mouseDelta.current.y = event.movementY
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

	const playerRotation = useRef<{
		yaw: number
		pitch: number
		rota: number
	}>({
		yaw: 0,
		pitch: 0,
		rota: 1
	})

	useFrame((state, delta) => {
		if (!props.inputLocked) {
			return
		}

		if (mouseDelta.current.x) {
			playerRotation.current.yaw += -mouseDelta.current.x * 0.01
			mouseDelta.current.x = 0
		}

		if (mouseDelta.current.y) {
			playerRotation.current.pitch += -mouseDelta.current.y * 0.01
			mouseDelta.current.y = 0
		}

		if (!ref.current) {
			return
		}

		const rot = new Euler(playerRotation.current.pitch, playerRotation.current.yaw, 0, "YXZ")

		ref.current.setRotationFromEuler(rot)
		camera.setRotationFromEuler(rot)
	});

	  useFrame((state, delta) => {
		const { forward, backward, left, right } = movement;


		const movementSpeed = 3;
		const distance = movementSpeed * delta;


		const moveX = (right ? 1 : 0) - (left ? 1 : 0);
		const moveY = (forward ? 1 : 0) - (backward ? 1 : 0);

		if (!ref.current) {
		  return
		}

		const newRot = rotateVec(
			moveX, 
			moveY, 
			playerRotation.current.yaw
		);
  
		ref.current.position.x += newRot[1] * distance;
		ref.current.position.z += newRot[0] * distance;

		const cameraOffset = new Vector3(0, 0, 0);
		
		const newPosition = ref.current.position


		  .clone()
		  .add(cameraOffset)
		  
		camera.position.copy(newPosition);

		camera.lookAt(ref.current.position);
		camera.rotation.copy(ref.current.rotation);
	});

	const handleKeyDown = (event: { key: string; }) => {
		if (event.key === 'd' || event.key === 'ArrowUp') {
			setMovement((prevState) => ({ ...prevState, forward: true }));
		} else if (event.key === 'a' || event.key === 'ArrowDown') {
			setMovement((prevState) => ({ ...prevState, backward: true }));
		} else if (event.key === 'w' || event.key === 'ArrowLeft') {
			setMovement((prevState) => ({ ...prevState, left: true }));
		} else if (event.key === 's' || event.key === 'ArrowRight') {
			setMovement((prevState) => ({ ...prevState, right: true }));
		}
	};
	

	const handleKeyUp = (event: { key: string; }) => {
		if (event.key === 'd' || event.key === 'ArrowUp') {
			setMovement((prevState) => ({ ...prevState, forward: false }));
		} else if (event.key === 'a' || event.key === 'ArrowDown') {
			setMovement((prevState) => ({ ...prevState, backward: false }));
		} else if (event.key === 'w' || event.key === 'ArrowLeft') {
			setMovement((prevState) => ({ ...prevState, left: false }));
		} else if (event.key === 's' || event.key === 'ArrowRight') {
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
		<mesh ref={ref}>
			<PointerLockControls />	
			<Gun />
			<meshStandardMaterial color={"orange"} />
		</mesh>
	);

}

function Lights() {
	return (
		<>
			<ambientLight intensity={1.5} />
			<spotLight position={[119, 10, 10]} angle={0.15} penumbra={1} />
		</>
	)
}

function App(props: any) {
	const [inputLocked, setInputLocked] = useState(false)

	return (
		<Suspense fallback={null}>
			<Canvas>			
				<Physics debug>
					<RigidBody colliders={"hull"} restitution={2}>
					</RigidBody>
					<Game 
						inputLocked={inputLocked}
					/>
					<Lights />
					<Ground />
				</Physics>
				<PointerLockControls
					onLock={() => {
						setInputLocked(true)
					}}
					onUnlock={() => {
						setInputLocked(false)
					}}
				/>
				<Stats />
			</Canvas>
		</Suspense>
	);
}

export default App;
