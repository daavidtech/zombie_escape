import React, { Suspense, useRef, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';

import { Physics, RigidBody } from '@react-three/rapier';
import { Ground } from './Ground';
import { Euler, Mesh, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Gun() {
	const gltf = useLoader(GLTFLoader, '/heavy_assault_rifle/scene.gltf');

	return (
		<primitive object={gltf.scene} />

	);
}


function Game(props: any) {
	const ref = useRef<Mesh>()
	const { camera } = useThree();
	const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
	const [mouseDown, setMouseDown] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

	const lastMousePosition = useRef<{
		x: number
		y: number
	}>({
		x: 0,
		y: 0
	})

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
		// playerRotation.current.yaw += 0.005

		// if (playerRotation.current.rota === 1) {
		// 	playerRotation.current.pitch += 0.005

		// 	if (playerRotation.current.pitch > 0.7) {
		// 		playerRotation.current.rota = 0
		// 	}
		// } else {
		// 	playerRotation.current.pitch -= 0.005

		// 	if (playerRotation.current.pitch < -0.8) {
		// 		playerRotation.current.rota = 1
		// 	}
		// }

		const { x: mouseX, y: mouseY } = mousePosition;

		const deltaX = mouseX - lastMousePosition.current.x
		const deltaY = mouseY - lastMousePosition.current.y

		lastMousePosition.current.x = mouseX
		lastMousePosition.current.y = mouseY

		playerRotation.current.yaw += -deltaX * 0.01
		playerRotation.current.pitch += -deltaY * 0.01


		// window.

		// 
		// const movementSpeed = 0.008;

		if (!ref.current) {
			return
		}

		// // if (mouseDown) {
		// const deltaX = mouseX - window.innerWidth / 2;
		// const deltaY = mouseY - window.innerHeight / 2;

		// console.log("mouse delta", deltaX, deltaY)

		// const lookDirection = new Vector3()

		// ref.current.getWorldDirection(lookDirection)

		// lookDirection.x += deltaX * movementSpeed * delta
		// lookDirection.y += deltaY * movementSpeed * delta

		// ref.current.lookAt(lookDirection)

		// const rotDirection = new Vector3(1, 1, 0)

		// ref.current.rotateOnAxis(rotDirection, 0.005)

		const rot = new Euler(playerRotation.current.pitch, playerRotation.current.yaw, 0, "YXZ")

		ref.current.setRotationFromEuler(rot)
		camera.setRotationFromEuler(rot)

		// outerRef.current.rotateY(0.005)
		// outerRef.current.rotateX(0.005)

		// console.log("looking at", lookDirection)

		// ref.current.rotateY(-deltaX * movementSpeed * delta)
		// ref.current.rotateX(-deltaY * movementSpeed * delta)


		//   ref.current.rotation.x -= deltaY * movementSpeed * delta;
		//   ref.current.rotation.y -= deltaX * movementSpeed * delta;


		//}

		// const cameraOffset = new Vector3(0, 0, 2);
		// const movementVector = new Vector3(0, 0, 0);
		// const newPosition = ref.current.position.clone().add(cameraOffset).add(movementVector);
		// camera.position.copy(newPosition);
		// camera.lookAt(ref.current.position);

		//camera.position.copy(outerRef.current.position)

		// const rot = new Vector3()
		// rot.copy(outerRef.current.rotation)

		// const rot = outerRef.current.rotation.clone()
		// rot.x = innerRef.current.rotation.x

		// camera.rotation.copy(rot)

		//camera.rotation.copy(innerRef.current.rotation)

		// camera.rotation.y = playerRotation.current.yaw
		// camera.rotation.x = playerRotation.current.pitch
	});

	//   useFrame((state, delta) => {
	// 	const { forward, backward, left, right } = movement;


	// 	const movementSpeed = 3;
	// 	const distance = movementSpeed * delta;


	// 	const moveX = (right ? 1 : 0) - (left ? 1 : 0);
	// 	const moveY = (forward ? 1 : 0) - (backward ? 1 : 0);

	// 	if (!ref.current) {
	// 	  return
	// 	}

	// 	ref.current.position.x += moveX * distance;
	// 	ref.current.position.z += moveY * distance;

	// 	// const cameraOffset = new Vector3(0, 0, 0);
	// 	// const movementVector = new Vector3(-0.2, 0.3, 0.2);
	// 	// const newPosition = ref.current.position


	// 	//   .clone()
	// 	// //   .add(cameraOffset)
	// 	// //   .add(movementVector);
	// 	// camera.position.copy(newPosition);

	// 	// camera.lookAt(ref.current.position);
	// 	// camera.rotation.copy(ref.current.rotation);
	//   });


	const handleKeyDown = (event: { key: string; }) => {
		if (event.key === 'w' || event.key === 'ArrowUp') {
			setMovement((prevState) => ({ ...prevState, forswward: true }));
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






function Lights() {
	return (
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
					<Game />
					<Lights />
					<Ground />
				</Physics>
				<OrbitControls />
			</Canvas>
		</Suspense>
	);
}

export default App;
