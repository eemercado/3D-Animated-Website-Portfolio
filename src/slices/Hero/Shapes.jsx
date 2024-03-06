"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Shapes(){
    return(
        <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas className="z-0" shadows gl={{antialias: false}} dpr={[1, 1.5]} camera={{position: [0, 0, 25], 
                fov: 30, near: 1, far: 40}}>
                <Suspense fallback={null}>
                    <ContactShadows position={[0, -3.5, 0]} opacity={0.65} scale={40} blur={1} far={9} />
                    <Environment preset="studio"/>
                    <Geometries />
                </Suspense>
            </Canvas>
        </div>
    )
};

function Geometries() {
    const geometries = [
        {
            position: [0,0,0],
            r: 0.3,
            geometry: new THREE.IcosahedronGeometry(3) // Gem - Middle
        },
        {
            position: [-1.4,2,-4],
            r: 0.4,
            geometry: new THREE.OctahedronGeometry(0.9) // Bottom Right
        },
        {
            position: [1,-0.75,4],
            r: 0.6,
            geometry: new THREE.OctahedronGeometry(1.2) // Top Left
        },
        {
            position: [-0.8,-0.75,5],
            r: 0.5,
            geometry: new THREE.OctahedronGeometry(0.8) // Bottom Left
        },
        {
            position: [1.6,1.6,-4],
            r: 0.7,
            geometry: new THREE.OctahedronGeometry(1.5) // Bottom Right
        },
    ];

    const materials = [
        new THREE.MeshNormalMaterial({}),
        new THREE.MeshStandardMaterial({ color: 0x2C3A47, roughness: 0 , metalness: 0.5}), // black
        new THREE.MeshStandardMaterial({ color: 0xa55eea, roughness: 0 , metalness: 0.5}), // purple
        new THREE.MeshStandardMaterial({ color: 0xf7b731, roughness: 0 , metalness: 0.5}), // yellow
        new THREE.MeshStandardMaterial({ color: 0x20bf6b, roughness: 0 , metalness: 0.5}), // green
        new THREE.MeshStandardMaterial({ color: 0xe84393, roughness: 0 , metalness: 0.5}), // pink
        new THREE.MeshStandardMaterial({ color: 0x7efff5, roughness: 0 , metalness: 0.5}), // diamond
    ];

    const soundEffects = [
        new Audio("/sounds/knock1.ogg"),
        new Audio("/sounds/knock2.ogg"),
        new Audio("/sounds/knock3.ogg"),
        new Audio("/sounds/knock4.ogg"),
    ]

    return geometries.map(({position, r, geometry}) => (
        <Geometry
        key={JSON.stringify(position)}
        position={position.map((p) => p * 2)}
        soundEffects={soundEffects}
        geometry={geometry}
        materials={materials}
        r={r}
        />
    ))

}


function Geometry({r, position, geometry, materials, soundEffects}){
    const meshRef = useRef()
    const [visible, setVisible] = useState(false)

    const startingMaterial = getRandomMaterial(materials, null);

        function getRandomMaterial(materials, excludeMaterial) {
            let newMaterial;
            do {
                newMaterial = gsap.utils.random(materials);
            } while(newMaterial === excludeMaterial);
            return newMaterial;
        }

        function handleClick(e) {
            const mesh = e.object;

            gsap.utils.random(soundEffects).play()

            gsap.to(mesh.rotation,{
                x: `+=${gsap.utils.random(0,2)}`,
                y: `+=${gsap.utils.random(0,2)}`,
                z: `+=${gsap.utils.random(0,2)}`,
                duration: 1.3, 
                ease: "elastic.out(1,0.3)",
                yoyo: true,
            });

            let newMaterial = getRandomMaterial(materials, mesh.material);
            mesh.material = newMaterial;
        }


    const handlePointerOver = () => {
        document.body.style.cursor = "pointer"
    }

    const handlePointerOut = () => {
        document.body.style.cursor = "default"
    }

    useEffect(() => {
        let ctx = gsap.context(() => {
            setVisible(true)
            gsap.from(meshRef.current.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: "elastic.out(1,0.3)",
                delay: 2.35,
            });
        });
        return () => ctx.revert(); // cleanup
    }, []);


    return (
        <group position={position} ref={meshRef}>
            <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
                <mesh 
                geometry={geometry} 
                onClick={handleClick} 
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                visible={visible}
                material={startingMaterial}
                />
            </Float>
        </group>
    )


}
