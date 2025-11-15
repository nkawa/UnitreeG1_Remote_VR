import AFRAME from 'aframe'
const THREE = window.AFRAME.THREE;
import {globalWorkerRef, globalObjectsRef} from '@ucl-nuee/rapier-worker'
import {isoMultiply} from './isometry3.js';

AFRAME.registerComponent('rapier-rigidbody-attach', {
  schema: {
    rigidBody: { type: 'string' },
    position: { type: 'vec3' },
    quaternion: { type: 'vec4' }
  },
  init: function () {
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    this.offset = [pos, quat];
  },
  update: function () {
    const p = this.data.position;
    const q = this.data.quaternion;
    this.offset[0].set(p.x, p.y, p.z);
    this.offset[1].set(q.x, q.y, q.z, q.w);
    this.offset[1].normalize();
  },
  tick: function () {
    if (// this.el.hasLoaded &&
	globalWorkerRef?.current?.postMessage) {
      if (globalObjectsRef?.current[this.data.rigidBody]) {
	const worldPosition = new THREE.Vector3();
	const worldQuaternion = new THREE.Quaternion();
	// console.log('<><><> typeof this.el?.endLink:', typeof this.el?.endLink,
	// 	    'this.el.id:', this.el?.id);
	if (this.el?.endLink) {
	  this.el.endLink.object3D.getWorldPosition(worldPosition);
	  this.el.endLink.object3D.getWorldQuaternion(worldQuaternion);
	  const newPose = isoMultiply([worldPosition, worldQuaternion],
				      this.offset);
	  // console.log('<<<< setNextPose id:',tihs.data.rigidBody
	  globalWorkerRef.current.postMessage({
            type: 'setNextPose',
            id: this.data.rigidBody,
	    pose: [...newPose[0].toArray(), ...newPose[1].toArray()]
	  });
	}
      }
    }
  }
});
