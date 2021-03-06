import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
// import Leap from 'leapjs';
import {withLeapContainer} from '../LeapProvider/LeapProvider.js'
// import HandMesh from 'leapjs-plugins';

/** Renders a simple THREE scene geometry from Leapmotion frame data */
class LeapViz extends Component {
  constructor(props) {
    super(props)

    console.log('leapviz props');
    console.log(props);

    this.state = {
      frame: this.props.frame,
      hand1position: new THREE.Vector3(0,0,0),
      hand1rotation: new THREE.Vector3(0,0,0),

      pinky1position: new THREE.Vector3(0,0,0),
      ring1position: new THREE.Vector3(0,0,0),
      birdie1position: new THREE.Vector3(0,0,0),
      index1position: new THREE.Vector3(0,0,0),
      thumb1position: new THREE.Vector3(0,0,0),

      hand2position: new THREE.Vector3(0,0,0),
      hand2rotation: new THREE.Vector3(0,0,0),

      pinky2position: new THREE.Vector3(0,0,0),
      pinky2carpPosition: new THREE.Vector3(0,0,0),
      pinky2dipPosition: new THREE.Vector3(0,0,0),
      pinky2mcpPosition: new THREE.Vector3(0,0,0),
      pinky2pipPosition: new THREE.Vector3(0,0,0),

      ring2position: new THREE.Vector3(0,0,0),
      ring2carpPosition:new THREE.Vector3(0,0,0),
      ring2dipPosition: new THREE.Vector3(0,0,0),
      ring2mcpPosition: new THREE.Vector3(0,0,0),
      ring2pipPosition: new THREE.Vector3(0,0,0),

      birdie2position: new THREE.Vector3(0,0,0),
      birdie2carpPosition: new THREE.Vector3(0,0,0),
      birdie2dipPosition: new THREE.Vector3(0,0,0),
      birdie2mcpPosition: new THREE.Vector3(0,0,0),
      birdie2pipPosition: new THREE.Vector3(0,0,0),

      index2position: new THREE.Vector3(0,0,0),
      index2carpPosition: new THREE.Vector3(0,0,0),
      index2dipPosition: new THREE.Vector3(0,0,0),
      index2mcpPosition: new THREE.Vector3(0,0,0),
      index2pipPosition: new THREE.Vector3(0,0,0),

      thumb2position: new THREE.Vector3(0,0,0),
      thumb2carpPosition: new THREE.Vector3(0,0,0),
      thumb2dipPosition: new THREE.Vector3(0,0,0),
      thumb2mcpPosition: new THREE.Vector3(0,0,0),
      thumb2pipPosition: new THREE.Vector3(0,0,0),

      cubeRotation: new THREE.Euler(),
      sphereRotation: new THREE.Euler(),
      torusRotation: new THREE.Euler(),
      cubePosition: new THREE.Vector3(0,0,0),
      spherePosition: new THREE.Vector3(0,0,0),
      torusPosition: new THREE.Vector3(0,0,0),
      armMeshes: [],
      boneMeshes: []
    };

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.animateHands = this.animateHands.bind(this);
  }

  componentDidMount() {

    this.setupScene();

    this.setupLeap();

    this.start();
  }

  componentWillUnmount() {

    this.stop()

    this.mount.removeChild(this.renderer.domElement)
    // this.leapController.disconnect();
  }

  setupScene(){

    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const b_geometry = new THREE.BoxGeometry(2, 1, 2);
    const b_material = new THREE.MeshBasicMaterial({ color: '#FF0000' });
    const cube = new THREE.Mesh(b_geometry, b_material);

    const s_geometry = new THREE.SphereGeometry(1, 50, 40);
    const s_material = new THREE.MeshBasicMaterial({ color: '#00FF00' });

    var nFingerList = Array.from({length: 10}, (v, k) => k+1);

    this.spheres = nFingerList.map(i => new THREE.Mesh(s_geometry, s_material));

    const ss_geometry = new THREE.SphereGeometry(1, 50, 40);
    const ss_material = new THREE.MeshBasicMaterial({ color: '#FF0000' });
    var nFingerBoneList = Array.from({length: 8}, (v, k) => k+1);
    this.spheres_small = nFingerBoneList.map(i => new THREE.Mesh(ss_geometry, ss_material));

    const t_geometry = new THREE.SphereGeometry(2, 40, 40);
    const t_material = new THREE.MeshBasicMaterial({ color: '#00FF00' });
    const bigSphere1 = new THREE.Mesh(t_geometry, t_material);
    const bigSphere2 = new THREE.Mesh(t_geometry, t_material);

    camera.position.z = 50;
    scene.add(cube);
    this.spheres.map(i => scene.add(i));

    this.spheres_small.map(i => scene.add(i));
    scene.add(bigSphere1);
    scene.add(bigSphere2);

    renderer.setClearColor('#000000');
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = b_material;
    this.cube = cube;
    this.bigSphere1 = bigSphere1;
    this.bigSphere2 = bigSphere2;

    this.mount.appendChild(this.renderer.domElement)
  }

  setupLeap(){

    // TODO pass options with object
    // this.leapController = new Leap.Controller({
    //   host: '127.0.0.1',
    //   port: 6437,
    //   enableGestures: false,
    //   background: false,
    //   optimizeHMD: false,
    //   frameEventName: 'animationFrame', // uses the browser animation loop (generally 60 fps). // 'deviceFrame' - Leap Motion controller frame rate (20 to 200 fps
    //   useAllPlugins: false
    // });
    // .use('handHold')
    // .use('transform', { position: new THREE.Vector3(1, 0, 0)})
    // .use('handEntry')
    // .use('screenPosition')
    // .use('boneHand', {
      // parent: scene,
      // renderer: renderer,
      // scale: getParam('scale'),
      // positionScale: getParam('positionScale'),
      // offset: new THREE.Vector3(0, 0, 0),
      // renderFn: function() {
        // renderer.render(scene, camera);
        // return controls.update();
      // },
      // materialOptions: {
      //   wireframe: getParam('wireframe')
      // },
      // dotsMode: getParam('dots'),
      // stats: stats,
      // camera: camera,
      // boneLabels: function(boneMesh, leapHand) {
      //   if (boneMesh.name.indexOf('Finger_03') === 0) {
      //     return leapHand.pinchStrength;
      //   }
      // },
      // boneColors: function(boneMesh, leapHand) {
      //   if ((boneMesh.name.indexOf('Finger_0') === 0) || (boneMesh.name.indexOf('Finger_1') === 0)) {
      //     return {
      //       hue: 0.6,
      //       saturation: leapHand.pinchStrength
      //     };
      //   }
      // },
      // checkWebGL: true
    // });

    // this.leapController.on('deviceAttached', function() {
    //   console.log('deviceAttached');
    // });
    // this.leapController.on('deviceStreaming', function() {
    //   console.log('deviceStreaming');
    // });
    // this.leapController.on('deviceStopped', function() {
    //   console.log('deviceStopped');
    // });
    // this.leapController.on('deviceRemoved', function() {
    //   console.log('deviceRemoved');
    // });
    //
    // this.leapController.connect();
  }

  start() {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    // console.log('leapviz - animate');
    // console.log(this.props.frame);

    this.setState({
      frame: this.props.frame
    });

    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.bigSphere1.position.x = this.state.hand1position.x/10;
    this.bigSphere1.position.y = this.state.hand1position.y/10;
    this.bigSphere1.position.z = this.state.hand1position.z/10;

    this.bigSphere1.rotation.x = -Math.atan2(this.state.hand1rotation.x, this.state.hand1rotation.y) + Math.PI/2;
    // this.bigSphere1.rotation.y = this.state.hand1rotation.y;
    this.bigSphere1.rotation.z = this.state.hand1rotation.z + 90;

    this.bigSphere2.position.x = this.state.hand2position.x/10;
    this.bigSphere2.position.y = this.state.hand2position.y/10;
    this.bigSphere2.position.z = this.state.hand2position.z/10;

    this.bigSphere2.rotation.x = -this.state.hand2rotation.x + 90;
    this.bigSphere2.rotation.y =  this.state.hand2rotation.y + 90;
    // this.bigSphere2.rotation.z =  this.state.hand2rotation.z + 90;

    this.spheres[0].position.x = this.state.pinky1position.x/10;
    this.spheres[0].position.y = this.state.pinky1position.y/10;
    this.spheres[0].position.z = this.state.pinky1position.z/10;
    this.spheres[1].position.x = this.state.ring1position.x/10;
    this.spheres[1].position.y = this.state.ring1position.y/10;
    this.spheres[1].position.z = this.state.ring1position.z/10;
    this.spheres[2].position.x = this.state.birdie1position.x/10;
    this.spheres[2].position.y = this.state.birdie1position.y/10;
    this.spheres[2].position.z = this.state.birdie1position.z/10;
    this.spheres[3].position.x = this.state.index1position.x/10;
    this.spheres[3].position.y = this.state.index1position.y/10;
    this.spheres[3].position.z = this.state.index1position.z/10;
    this.spheres[4].position.x = this.state.thumb1position.x/10;
    this.spheres[4].position.y = this.state.thumb1position.y/10;
    this.spheres[4].position.z = this.state.thumb1position.z/10;

    this.spheres[5].position.x = this.state.pinky2position.x/10;
    this.spheres[5].position.y = this.state.pinky2position.y/10;
    this.spheres[5].position.z = this.state.pinky2position.z/10;
    this.spheres[6].position.x = this.state.ring2position.x/10;
    this.spheres[6].position.y = this.state.ring2position.y/10;
    this.spheres[6].position.z = this.state.ring2position.z/10;
    this.spheres[7].position.x = this.state.birdie2position.x/10;
    this.spheres[7].position.y = this.state.birdie2position.y/10;
    this.spheres[7].position.z = this.state.birdie2position.z/10;
    this.spheres[8].position.x = this.state.index2position.x/10;
    this.spheres[8].position.y = this.state.index2position.y/10;
    this.spheres[8].position.z = this.state.index2position.z/10;
    this.spheres[9].position.x = this.state.thumb2position.x/10;
    this.spheres[9].position.y = this.state.thumb2position.y/10;
    this.spheres[9].position.z = this.state.thumb2position.z/10;

    this.animateHands();

    // console.log(this.state.pinky2carpPosition.x);
    this.renderer.render(this.scene, this.camera);
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  animateHands()
  {
    // console.log('Leapviz - animateHands');
    // console.log("Frame event for Leap frame " + frame.id);

    const frame = this.state.frame;

    if(frame === undefined || frame.hands === undefined)
      return;
    if( frame.hands[0] !== undefined)
    {
      var leapHand = frame.hands[0],
        leapFingers = frame.fingers;
          // handObj, fingersObj;
      this.setState((prevState, props) => ({
        hand1position: new THREE.Vector3(leapHand.palmPosition[0],leapHand.palmPosition[1],leapHand.palmPosition[2]),
        hand1rotation: new THREE.Vector3(leapHand.palmNormal[0], leapHand.palmNormal[1], leapHand.palmNormal[2]),
        // hand1rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
        pinky1position: new THREE.Vector3(leapFingers[0].tipPosition[0], leapFingers[0].tipPosition[1], leapFingers[0].tipPosition[2]),
         ring1position: new THREE.Vector3(leapFingers[1].tipPosition[0], leapFingers[1].tipPosition[1], leapFingers[1].tipPosition[2]),
        birdie1position: new THREE.Vector3(leapFingers[2].tipPosition[0], leapFingers[2].tipPosition[1], leapFingers[2].tipPosition[2]),
        index1position: new THREE.Vector3(leapFingers[3].tipPosition[0], leapFingers[3].tipPosition[1], leapFingers[3].tipPosition[2]),
        thumb1position: new THREE.Vector3(leapFingers[4].tipPosition[0], leapFingers[4].tipPosition[1], leapFingers[4].tipPosition[2]),
      }));
    }
    else{
      this.setState((prevState, props) => ({
        hand1position: new THREE.Vector3(-1, -1, -1),
        pinky1position: new THREE.Vector3(-1, -1, -1),
        ring1position: new THREE.Vector3(-1, -1, -1),
        birdie1position: new THREE.Vector3(-1, -1, -1),
        index1position: new THREE.Vector3(-1, -1, -1),
        thumb1position: new THREE.Vector3(-1, -1, -1)
      }));

    }
    if(frame.hands[1] !== undefined)
    {
      leapHand = frame.hands[1];
      leapFingers = frame.pointables;
      // console.log(leapFingers[5].dipPosition[0]);

      this.setState((prevState, props) => ({
        hand2position: new THREE.Vector3(leapHand.palmPosition[0],leapHand.palmPosition[1],leapHand.palmPosition[2]),
        hand2rotation: new THREE.Vector3(leapHand.palmNormal[0], leapHand.palmNormal[1], leapHand.palmNormal[2]),
        // hand2rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
        pinky2position: new THREE.Vector3( leapFingers[5].tipPosition[0], leapFingers[5].tipPosition[1], leapFingers[5].tipPosition[2]),
        ring2position: new THREE.Vector3( leapFingers[6].tipPosition[0], leapFingers[6].tipPosition[1], leapFingers[6].tipPosition[2]),
        birdie2position: new THREE.Vector3(leapFingers[7].tipPosition[0], leapFingers[7].tipPosition[1], leapFingers[7].tipPosition[2]),
        index2position: new THREE.Vector3( leapFingers[8].tipPosition[0], leapFingers[8].tipPosition[1], leapFingers[8].tipPosition[2]),
        thumb2position: new THREE.Vector3( leapFingers[9].tipPosition[0], leapFingers[9].tipPosition[1], leapFingers[9].tipPosition[2]),
      }));
    }
    else{
      this.setState((prevState, props) => ({
        hand2position: new THREE.Vector3(-1, -1, -1),
        pinky2position: new THREE.Vector3(-1, -1, -1),
        ring2position: new THREE.Vector3(-1, -1, -1),
        birdie2position: new THREE.Vector3(-1, -1, -1),
        index2position: new THREE.Vector3(-1, -1, -1),
        thumb2position: new THREE.Vector3(-1, -1, -1)
      }));
    }
  }

  render() {
    return (
      <div
        style={{ width: '250px', height: '250px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

LeapViz.propTypes = {
  /**  Leap Motion data frame  */
  frame: PropTypes.object
}

// LeapViz.defaultProp = {
//   /**  Leap motion default data frame */
//   frame: {

//   }
// }

export default withLeapContainer(LeapViz);
