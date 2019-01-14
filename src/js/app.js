import * as THREE from 'three';

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import * as dat from 'dat.gui';

// import {TimelineMax} from 'gsap';

var OrbitControls = require('three-orbit-controls')(THREE);

class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xeeeeee, 1);

    this.container = document.getElementById(selector);
    this.container.appendChild(this.renderer.domElement);

    // this.camera = new THREE.PerspectiveCamera(
    //   70,
    //   window.innerWidth / window.innerHeight,
    //   0.001, 1000
    // );
    // this.camera.position.set(0, 0, 6);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    var frustumSize = 10;
    var aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set( 15, -15, 4 );
    // this.camera.position.set( 13.684753056578113,-13.182186046164112,  10.5066061768662773 );
    // this.camera.position.set( 1,1,0 );
    // this.camera.lookAt(0,0,0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);


    this.time = 0;

    this.setupResize();
    this.resize();


    this.settings();

    this.addObjects();
    this.animate();


  }

  settings() {
    let that = this;
    this.settings = {
      shadow: 0.6,
      // offsetVal: 1,
      // speed: 250,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'shadow', 0.1, 0.9, 0.01);
    // this.gui.add(this.settings, 'offsetVal', 1, 20, 0.01);
    // this.gui.add(this.settings, 'speed', 50, 500, 10);

  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    this.renderer.setSize(w, h);
    this.camera.aspect = (w / h);

    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  addObjects() {
    let that = this;


    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extensions GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: {type: 'f', value: 0},
        color: {type: 'v3', value: 0},
        offset: {type: 'f', value: 0},
        shadow: {type: 'f', value: this.settings.shadow},
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });



    this.colors = [
      new THREE.Color(0xEDC951),
      new THREE.Color(0xEB6841),
      new THREE.Color(0xCC2A36),
      new THREE.Color(0x4F372D),
      new THREE.Color(0x03A0B0),
    ];
    this.number = 10;

    // this.geometry = new THREE.PlaneGeometry( 5, 1, 1, 1 );
    this.geometry = new THREE.CylinderGeometry( 2, 2, 1, 4, 5, 1, true );



    this.mats = [];
    for (let i = 0; i < this.number; i++) {
      let newmat = this.material.clone();
      newmat.uniforms.offset.value = i;
      newmat.uniforms.color.value = this.colors[i % 5];
      this.mats.push(newmat);

      let mesh = new THREE.Mesh(this.geometry, newmat);
      this.scene.add(mesh);
      // this.material.uniforms.color
      mesh.position.y = i - 5;
    }

  }

  animate() {
    this.time += 0.5;
    this.material.uniforms.time.value = this.time;

    // console.log(this.settings);

    if (this.mats.length) {
      this.mats.forEach(e=>{
        e.uniforms.time.value = this.time;
      })
    }


    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
}

new Sketch('container');
