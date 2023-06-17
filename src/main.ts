import * as THREE from 'three';
//@ts-ignore
import audioVertexShader from './shaders/audioVertexShader.glsl'
//@ts-ignore
import audioFragmentShader from "./shaders/audioFragmentShader.glsl"
import { Uniforms } from './types/types';

			let scene:THREE.Scene, 
      camera: THREE.PerspectiveCamera, 
      renderer: THREE.WebGLRenderer, 
      analyser: THREE.AudioAnalyser, 
      uniforms: Uniforms,
      sphere: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;

			const startButton = document.getElementById( 'startButton' );
			startButton?.addEventListener( 'click', init );

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

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera();
        camera.position.z = 10
        const light = new THREE.AmbientLight()

				//

				const listener = new THREE.AudioListener();

				const audio = new THREE.Audio( listener );
				const file = './src/assets/BabyElephantWalk60.wav';

				if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {

					const loader = new THREE.AudioLoader();
					loader.load( file, function ( buffer ) {

						audio.setBuffer( buffer );
						audio.play();

					} );

				} else {

					const mediaElement = new Audio( file );
					mediaElement.play();

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
        const sphereMesh = new THREE.ShaderMaterial( { 
          uniforms: uniforms, 
          fragmentShader: audioFragmentShader
        });
        sphere = new THREE.Mesh( sphereGeometry, sphereMesh )
				const geometry = new THREE.PlaneGeometry( 1, 1 );

				// const mesh = new THREE.Mesh( geometry, material );
				scene.add( sphere );
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

				analyser.getFrequencyData();
        // console.log(analyser.data)

				uniforms.tAudioData.value.needsUpdate = true;
        uniforms.colorFromAudio.value = (analyser.data[0] / 100)
        console.log(analyser.data[0] / 100)

				renderer.render( scene, camera );

			}
