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
    this.renderer.setClearColor(0x000000, 1);

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
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);


    this.time = 0;

    this.setupResize();
    this.resize();


    this.settings();

    this.addObjects();
    this.animate();


  }
  changeShadow() {
    if (this.mats.length) {
      this.mats.forEach(e=>{
        e.uniforms.shadow.value = this.settings.shadow;
      })
    }
  }
  changeOffset() {
    if (this.mats.length) {
      this.mats.forEach(e=>{
        e.uniforms.offsetVal.value = this.settings.offsetVal;
      })
    }
  }
  changeLength() {
    if (this.mats.length) {
      this.mats.forEach(e=>{
        e.uniforms.length.value = this.settings.length;
      })
    }
  }
  changeSpeed() {
    this.time += this.settings.speed;
    this.material.uniforms.time.value = this.time;
    if (this.mats.length) {
      this.mats.forEach(e=>{
        e.uniforms.time.value = this.time;
      })
    }
  }
  changeGeometry() {
    this.geometry = new THREE.CylinderGeometry( this.settings.radiusTop, this.settings.radiusBot, this.settings.height, this.settings.segments, 5, 1, true );
    this.linesMesh.forEach((el, i)=>{
      el.geometry = this.geometry;
      el.position.y = this.settings.height*i - 5;
    });
  }
  settings() {
    let that = this;
    this.settings = {
      shadow: 0.4,
      offsetVal: 10,
      speed: 0.5,
      length: 0.7,
      height: 1,
      radiusTop: 2,
      radiusBot: 2,
      segments: 4,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'shadow', 0, 1, 0.01).onChange(() => this.changeShadow());
    this.gui.add(this.settings, 'offsetVal', 1, 50, 1).onChange(() => this.changeOffset());
    this.gui.add(this.settings, 'speed', 0.5, 25, 0.5);
    this.gui.add(this.settings, 'length', 0.1, 1, 0.1).onChange(() => this.changeLength());
    this.gui.add(this.settings, 'height', 0.5, 3, 0.1).onChange(() => this.changeGeometry());
    this.gui.add(this.settings, 'radiusTop', 1, 3, 0.1).onChange(() => this.changeGeometry());
    this.gui.add(this.settings, 'radiusBot', 1, 3, 0.1).onChange(() => this.changeGeometry());
    this.gui.add(this.settings, 'segments', 3, 50, 1).onChange(() => this.changeGeometry());

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
        offsetVal: {type: 'f', value: this.settings.offsetVal},
        shadow: {type: 'f', value: this.settings.shadow},
        length: {type: 'f', value: this.settings.length},
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

    //common geo


    this.geometry = new THREE.CylinderGeometry( this.settings.radiusTop, this.settings.radiusBot, this.settings.height, this.settings.segments, 5, 1, true );
    // this.geometry = new THREE.CylinderGeometry( 20, 2, 1, 4, 5, 1, true );

    this.mats = [];
    this.linesMesh = [];
    for (let i = 0; i < this.number; i++) {
      let newmat = this.material.clone();
      newmat.uniforms.offset.value = i;
      newmat.uniforms.color.value = this.colors[i % 5];
      this.mats.push(newmat);


      let mesh = new THREE.Mesh(this.geometry, newmat);
      this.linesMesh.push(mesh);
      this.scene.add(mesh);
      // this.material.uniforms.color
      mesh.position.y = this.settings.height*i - 5;
    }



    //instanceGeo

    // this.geometry = new THREE.CylinderBufferGeometry( 2, 2, 1, 4, 5, 1, true );
    //
    // this.instanceGeo = new THREE.InstancedBufferGeometry();
    // let vertices = this.geometry.attributes.position.clone();
    // this.instanceGeo.addAttribute('position', vertices);
    // this.instanceGeo.attributes.uv = this.geometry.attributes.uv;
    // this.instanceGeo.attributes.normal = this.geometry.attributes.normal;
    // this.instanceGeo.index = this.geometry.index;
    //
    // let instancePositions = [];
    // let instanceColors = [];
    // let instanceOffsets = [];
    // for (let i = 0; i < this.number; i++) {
    //   instancePositions.push(
    //     0,
    //     i - 5,
    //     0
    //   );
    //   instanceColors.push(
    //     this.colors[i%5].r,
    //     this.colors[i%5].g,
    //     this.colors[i%5].b,
    //   );
    //   instanceOffsets.push(i);
    // }
    //
    // this.instanceGeo.addAttribute('instancePosition', new THREE.InstancedBufferAttribute(
    //   new Float32Array(instancePositions), 3
    // ));
    // this.instanceGeo.addAttribute('instanceColor', new THREE.InstancedBufferAttribute(
    //   new Float32Array(instanceColors), 3
    // ));
    // this.instanceGeo.addAttribute('instanceOffset', new THREE.InstancedBufferAttribute(
    //   new Float32Array(instanceOffsets), 1
    // ));
    //
    // this.mats = [];
    //
    // this.instanceMesh = new THREE.Mesh(this.instanceGeo,this.material);
    // this.scene.add(this.instanceMesh);



  }

  animate() {

    this.changeSpeed();

    // this.changeGeometry();


    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
}

new Sketch('container');
