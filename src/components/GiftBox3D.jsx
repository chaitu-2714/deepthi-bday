import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import '../styles/Surprise.css';

export default function GiftBox3D({ isActive, onOpen }) {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Create Scene, Camera, and WebGL Renderer
    const scene = new THREE.Scene();
    // Add dark space fog
    scene.fog = new THREE.FogExp2(0x05050f, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // ----------------------------------------------------
    // Create Lights
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // Warm back light for depth
    const backLight = new THREE.DirectionalLight(0x7303c0, 0.8);
    backLight.position.set(-5, 4, -5);
    scene.add(backLight);

    // Magical Golden Light inside the box
    const boxInnerLight = new THREE.PointLight(0xffd700, 0, 15);
    boxInnerLight.position.set(0, 0, 0);
    scene.add(boxInnerLight);

    // ----------------------------------------------------
    // Create 3D Gift Box Geometry & Materials
    // ----------------------------------------------------
    const giftGroup = new THREE.Group();
    scene.add(giftGroup);

    // Luxury Red Box material
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.15,
      metalness: 0.65,
      bumpScale: 0.05
    });

    // Metallic Gold Ribbon material
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.1,
      metalness: 0.85
    });

    // 1. Box Base
    const baseWidth = 2;
    const baseHeight = 2;
    const baseDepth = 2;
    
    const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const boxBase = new THREE.Mesh(baseGeometry, boxMaterial);
    boxBase.castShadow = true;
    boxBase.receiveShadow = true;
    giftGroup.add(boxBase);

    // 2. Ribbons on Base (horizontal and vertical bands)
    const ribSize = 0.28;
    const ribOffset = 0.01;
    
    const ribXGeom = new THREE.BoxGeometry(baseWidth + ribOffset, baseHeight + ribOffset, ribSize);
    const ribX = new THREE.Mesh(ribXGeom, ribbonMaterial);
    boxBase.add(ribX);

    const ribZGeom = new THREE.BoxGeometry(ribSize, baseHeight + ribOffset, baseDepth + ribOffset);
    const ribZ = new THREE.Mesh(ribZGeom, ribbonMaterial);
    boxBase.add(ribZ);

    // 3. Box Lid Group (to animate it flying off easily)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 1.05, 0); // rest on top of base
    giftGroup.add(lidGroup);

    const lidWidth = 2.15;
    const lidHeight = 0.45;
    const lidDepth = 2.15;

    const lidGeometry = new THREE.BoxGeometry(lidWidth, lidHeight, lidDepth);
    const boxLid = new THREE.Mesh(lidGeometry, boxMaterial);
    boxLid.castShadow = true;
    boxLid.receiveShadow = true;
    boxLid.position.set(0, lidHeight / 2, 0); // pivot correction
    lidGroup.add(boxLid);

    // 4. Ribbons on Lid
    const lidRibX = new THREE.Mesh(
      new THREE.BoxGeometry(lidWidth + ribOffset, lidHeight + ribOffset, ribSize),
      ribbonMaterial
    );
    lidRibX.position.set(0, lidHeight / 2, 0);
    lidGroup.add(lidRibX);

    const lidRibZ = new THREE.Mesh(
      new THREE.BoxGeometry(ribSize, lidHeight + ribOffset, lidDepth + ribOffset),
      ribbonMaterial
    );
    lidRibZ.position.set(0, lidHeight / 2, 0);
    lidGroup.add(lidRibZ);

    // 5. Decorative bow on top of lid
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, lidHeight, 0);
    lidGroup.add(bowGroup);

    // Left loop
    const torusGeom = new THREE.TorusGeometry(0.32, 0.08, 12, 32, Math.PI * 1.5);
    const leftLoop = new THREE.Mesh(torusGeom, ribbonMaterial);
    leftLoop.rotation.set(0, 0, Math.PI * 0.25);
    leftLoop.position.set(-0.25, 0.15, 0);
    bowGroup.add(leftLoop);

    // Right loop
    const rightLoop = new THREE.Mesh(torusGeom, ribbonMaterial);
    rightLoop.rotation.set(0, 0, -Math.PI * 0.75);
    rightLoop.position.set(0.25, 0.15, 0);
    bowGroup.add(rightLoop);

    // Center knot
    const knotGeom = new THREE.SphereGeometry(0.14, 16, 16);
    const knot = new THREE.Mesh(knotGeom, ribbonMaterial);
    knot.position.set(0, 0.12, 0);
    bowGroup.add(knot);

    // Hanging ribbon tails
    const tail1Geom = new THREE.ConeGeometry(0.08, 0.6, 4);
    const tail1 = new THREE.Mesh(tail1Geom, ribbonMaterial);
    tail1.rotation.set(0.3, 0, 0.5);
    tail1.position.set(-0.2, 0, 0.25);
    bowGroup.add(tail1);

    const tail2 = new THREE.Mesh(tail1Geom, ribbonMaterial);
    tail2.rotation.set(0.3, 0, -0.5);
    tail2.position.set(0.2, 0, 0.25);
    bowGroup.add(tail2);

    // Create a shadow receiving floor plane
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.25 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.25;
    floor.receiveShadow = true;
    scene.add(floor);

    // ----------------------------------------------------
    // User Interaction (Mouse Drag to Rotate)
    // ----------------------------------------------------
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2; // default angle
    let targetRotationY = -0.6; // default angle
    let isOpening = false;

    const onPointerDown = (e) => {
      if (isOpening) return;
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging || isOpening) return;
      
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaMove = {
        x: clientX - previousMousePosition.x,
        y: clientY - previousMousePosition.y
      };

      // Update target rotations (with damping in the tick loop)
      targetRotationY += deltaMove.x * 0.007;
      targetRotationX += deltaMove.y * 0.007;
      
      // Limit vertical rotation (X axis) to avoid getting upside down
      targetRotationX = Math.max(-0.4, Math.min(0.8, targetRotationX));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Raycasting to detect clicks on the box
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const triggerOpenAnimation = () => {
      if (isOpening) return;
      isOpening = true;
      setHasClicked(true);

      // 1. Shaking animation
      const shakeTimeline = gsap.timeline({ repeat: 2, yoyo: true });
      shakeTimeline.to(giftGroup.position, { x: 0.12, duration: 0.06, ease: 'power1.inOut' })
                   .to(giftGroup.position, { x: -0.12, duration: 0.06, ease: 'power1.inOut' });

      // 2. Cinematic Camera zoom & box opening
      gsap.delayedCall(0.38, () => {
        // Zoom camera in
        gsap.to(camera.position, {
          x: 0,
          y: 1.2,
          z: 3.2,
          duration: 2.2,
          ease: 'power2.inOut'
        });
        
        // Tilt camera down to look into the box
        gsap.to(camera.rotation, {
          x: -0.2,
          duration: 2.2,
          ease: 'power2.inOut'
        });

        // Box base falls open slightly or scale down
        gsap.to(boxBase.scale, {
          x: 0.95,
          y: 0.9,
          z: 0.95,
          duration: 0.8,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        });

        // Lid flies away and rotates
        gsap.to(lidGroup.position, {
          y: 4.5,
          x: -1.5,
          z: -1.5,
          duration: 1.8,
          ease: 'power2.out'
        });

        gsap.to(lidGroup.rotation, {
          x: 2.5,
          y: 1.2,
          z: 1.8,
          duration: 1.8,
          ease: 'power2.out'
        });

        // Magical Golden Light expands
        gsap.to(boxInnerLight, {
          intensity: 65,
          duration: 1.8,
          ease: 'power3.in'
        });

        // Fade the container opacity
        gsap.to(containerRef.current, {
          opacity: 0,
          delay: 1.8,
          duration: 1.2,
          ease: 'power1.inOut',
          onComplete: () => {
            onOpen(); // Trigger next scene in parent state
          }
        });
      });
    };

    const onCanvasClick = (e) => {
      if (isOpening) return;
      
      const rect = domElement.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.set(clickX, clickY);
      raycaster.setFromCamera(mouse, camera);
      
      // Test intersection with the base or the lid
      const intersects = raycaster.intersectObjects([boxBase, boxLid], true);
      
      if (intersects.length > 0) {
        triggerOpenAnimation();
      }
    };

    domElement.addEventListener('click', onCanvasClick);

    // ----------------------------------------------------
    // Animation/Render Loop
    // ----------------------------------------------------
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.015;

      // Gentle floating animation (only if not opening yet)
      if (!isOpening) {
        giftGroup.position.y = Math.sin(time) * 0.12 - 0.2;
        // Slow auto-rotation
        targetRotationY += 0.0025;
      }

      // Smooth drag rotations (damping)
      giftGroup.rotation.y += (targetRotationY - giftGroup.rotation.y) * 0.08;
      giftGroup.rotation.x += (targetRotationX - giftGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------------------
    // Resize Handler
    // ----------------------------------------------------
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      domElement.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domElement.removeEventListener('click', onCanvasClick);
      
      if (mountRef.current && domElement) {
        mountRef.current.removeChild(domElement);
      }
      
      // Dispose materials and geometries to prevent memory leaks
      baseGeometry.dispose();
      lidGeometry.dispose();
      torusGeom.dispose();
      knotGeom.dispose();
      tail1Geom.dispose();
      floorGeometry.dispose();
      boxMaterial.dispose();
      ribbonMaterial.dispose();
      floorMaterial.dispose();
      renderer.dispose();
    };
  }, [isActive, onOpen]);

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef} 
      className="gift-canvas-container"
      style={{ opacity: 1 }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {!hasClicked && (
        <div className="gift-instruction">
          Drag to rotate • Tap Box to open
        </div>
      )}
    </div>
  );
}
