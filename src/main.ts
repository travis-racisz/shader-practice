import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
//@ts-ignore
import audioVertexShader from './shaders/audioVertexShader.glsl'
//@ts-ignore
import audioFragmentShader from "./shaders/audioFragmentShader.glsl"

	let scene:THREE.Scene = new THREE.Scene(), 
	camera: THREE.PerspectiveCamera, 
	renderer: THREE.WebGLRenderer, 
	analyser: THREE.AudioAnalyser, 
	controls: OrbitControls,
	// file: any,
	// light: THREE.AmbientLight,
	uniforms: any,
	// points: THREE.Points,
	sphere

	
	// const geometry = new THREE.SphereGeometry(1, 32, 16);
	const boxes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>[] = []; 
	const color = new THREE.Color(); 
	const n = 75, n2 = n / 2
	const particles = 64; 
	const colors = [];
	// @ts-ignore
	const audioElement: HTMLAudioElement | null = document.getElementById("audio")
	const fileElement = document.getElementById("song-upload")
	fileElement?.addEventListener("change", (e) => { 
		// Cannot play media. No decoders for requested formats: text/html
		if(audioElement){ 
			// @ts-ignore
			const files = e.target?.files
			audioElement.src = URL.createObjectURL(files[0])
			audioElement?.load()
			audioElement?.removeAttribute("hidden")
			document.getElementById("play-button")?.removeAttribute('hidden')
			document.getElementById("pause-button")?.removeAttribute('hidden')
			init()
		}
	})

	
	for( let i = 0; i < particles; i++){ 
		const boxGeometry = new THREE.BoxGeometry(5, 5, 5)
		const boxMaterial = new THREE.MeshPhongMaterial()
		const boxMesh = new THREE.Mesh( boxGeometry, boxMaterial )
		
		// particle positions 
		const x = Math.random() * n - n2
		const y = Math.random() * n - n2
		const z = Math.random() * n - n2
		boxMesh.position.x = x
		boxMesh.position.y = y 
		boxMesh.position.z = z
		
		
		// colors 
		const vx = ( x / n) + 0.5;
		const vy = ( y / n) + 0.5;
		const vz = ( z / n) + 0.5;
		
		color.setRGB( vx, vy, vz, THREE.SRGBColorSpace );
		boxMaterial.color = new THREE.Color().setRGB(vx, vy, vz, THREE.SRGBColorSpace)
		colors.push(color.r, color.g, color.b)
		boxes.push( boxMesh )
		scene.add( boxMesh )

	}
	

	// const startButton = document.getElementById( 'startButton' );
	// startButton?.addEventListener( 'click', init );

	function init() {

			const fftSize = 128;

			//

			const overlay = document.getElementById( 'overlay' );
			overlay?.remove();

			//

			const container = document.getElementById( 'container' );

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );
			container?.appendChild( renderer.domElement );
			
			
			
			camera = new THREE.PerspectiveCamera();
			camera.position.z = 150
			const light = new THREE.AmbientLight()
			
			//
			
			controls = new OrbitControls(camera, renderer.domElement)
			const listener = new THREE.AudioListener();

			const audio = new THREE.Audio( listener );
			audio.hasPlaybackControl
			const file = audioElement?.src;

			if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {

				const loader = new THREE.AudioLoader();
				// @ts-ignore
				loader.load( file, function ( buffer ) {

					audio.setBuffer( buffer );
					audio.play();
					setUpControls(audio)

				} );

			} else {

				const mediaElement = new Audio( file );
				mediaElement.play();
				setUpControls(mediaElement)

				audio.setMediaElementSource( mediaElement );

			}

			analyser = new THREE.AudioAnalyser( audio, fftSize );

			//

			const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;
			uniforms = {

				tAudioData: { value: new THREE.DataTexture( analyser.data, fftSize / 2, 1, format ) },
				colorFromAudio: { value: Number }

			};

			// const material = new THREE.ShaderMaterial( {

			// 	uniforms: uniforms,
			// 	vertexShader: audioVertexShader,
			// 	fragmentShader: audioFragmentShader

			// } );
	const sphereGeometry = new THREE.SphereGeometry(1,1)
	const sphereMesh = new THREE.MeshBasicMaterial( { 
		// uniforms: uniforms, 
		// fragmentShader: audioFragmentShader
	});
			sphere = new THREE.Mesh( sphereGeometry, sphereMesh )
			// const geometry = new THREE.PlaneGeometry( 1, 1 );

			// const mesh = new THREE.Mesh( geometry, material );
			scene.add( sphere );
			scene.add( camera )
			scene.add( light )

			//

			window.addEventListener( 'resize', onWindowResize );

			animate();

		}

		function onWindowResize() {

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			requestAnimationFrame( animate );

			render();

		}

		function render() {
			// returns array of 64 bit data 

			analyser.getFrequencyData();
			// console.log(analyser.data, 'data')
			controls.update()
			controls.autoRotate = true
	

			uniforms.tAudioData.value.needsUpdate = true;
			uniforms.colorFromAudio.value = (analyser.data[0] / 100)
			boxes.forEach((box, index) => {
				
					// box.rotation.x += 0.01
					// box.rotation.y += 0.01
					const s = (analyser.data[index - 1] / 100) + 1
					box.scale.set(s, s, s)
				 
			});
			// points.rotation.x += 0.01

			renderer.render( scene, camera );

		}

		function setUpControls(audio: THREE.Audio | HTMLAudioElement): void{ 
			console.log('setting up controls')
			document.getElementById('play-button')?.addEventListener('click', function(){ 
				console.log('play')
				audio.play()
			})

			document.getElementById('pause-button')?.addEventListener('click', function(){ 
				console.log('pause')
				audio.pause()
			})
		}


		// set up points within sphere geometry 
		/* we want 64 points 
		can assign each one to the value from the music, then animate the points to change position based on the audio wave value
		*/

		// function createPoints(): void{ 

		// }