// Don't import 'three' directly.
// Please use the AFRAME.THREE to setRotationFromAxisAngle
// instead of the THREE.js one.
import AFRAME from 'aframe';
import {sendRobotJointMQTT, sendRobotStateMQTT} from '../lib/MQTT_jobs'
import {  isNonControlMode} from '../app/appmode';

setJointDirectlyComponent({name: 'set-joints-directly-in-degree',
			   unit:  Math.PI/180});
setJointDirectlyComponent({name: 'set-joints-directly',
			   unit:  1.0});

function setJointDirectlyComponent({name, unit}) {
  AFRAME.registerComponent(name, {
    schema: { type: 'array'},
    init: function() {
      const robotId = this.el.id;
      const jointValues = this.data.map((j)=>parseFloat(j)*unit);
      this.el.addEventListener('robot-registered', () => {
	const robotRegistry = this.el.sceneEl?.robotRegistryComp;
	if (robotRegistry) {
	  const axesList = robotRegistry.get(robotId)?.axes;
	  if (axesList) {
	    axesList.map((axisEl, idx)=> {
              const axis = axisEl.axis;
              axisEl.object3D.setRotationFromAxisAngle(axis,
						       jointValues[idx]);
	    });
	    return; // SUCCEED
	  }
	}
      }, {once: true});
    }
  });
}


AFRAME.registerComponent('reflect-worker-joints', {
	schema: {
		appmode: {type: 'string', default: ''}, // appmode を伝える
		arm: {type: 'string', default: ''}, // left or right
	},
	init: function () {
		console.log("reflect-worker-joints initialized. appmode:", this.data.appmode);
		if (isNonControlMode(this.data.appmode)){
			this.sendMQTT = sendRobotStateMQTT;
		}else{
			this.sendMQTT = sendRobotJointMQTT;
		}
		this.workerDataJointsReady = false;

		// **** ik-worker-start イベントを受け取ったら、workerData.current.joints が使えるか確認する
		this.el.addEventListener('ik-worker-start', () => {
//			console.log("Get ik-worker-start! in reflect-worker-joints", this.el);
			const robotId = this.el.id;
			let checkCount = 0;
			const checkWorkerJoints = () => {
				const jointData = this.el.workerData.current.joints;
				if (jointData) { // not equal NULL?
					// this.el.workerData.current.joints should be exist,
					// but may be null
					const robotRegistry = this.el.sceneEl.robotRegistryComp;
					// console.warn('workerData.joints type:',
					// 	       typeof jointData,
					// 	       'data:', jointData);
					// console.warn('robotRegistryComp:',robotRegistry);
					// console.warn('robotId:', robotId);
					// console.warn('get:', robotRegistry.get(robotId));
					this.axesList = robotRegistry.get(robotId)?.axes;
					if (this.axesList) { // exists?
						if (this.axesList.length === jointData.length) {
							// SUCCEED
							console.log("reflect-worker-joints: workerData.current.joints is ready to use.",this.el);
							this.workerDataJointsReady = true;
							return;
						} else {
							console.warn('length mismatch. axesList:', this.axesList,
								' jointData:', jointData);
						}
					} else {
						console.warn('axesList cannot be found.',
							'it may not have been registered yet.');
					}
				} else {
					// The worker hasn't started working yet
				}
				checkCount++;
				setTimeout(checkWorkerJoints, 500);
			};
			checkWorkerJoints();
			console.log('workerDataJointsReady:', this.workerDataJointsReady);
		}, { once: true });
	},

	// **** tick ****
	tick: function () {
		if (this?.workerDataJointsReady) {
			const jointData = this.el.workerData.current.joints;
			this.axesList.map((axisEl, idx) => {
				// if necessary, you can verify the class 'axis'.
				const axis = axisEl.axis; // this type is THREE.Vector3
				axisEl.object3D.setRotationFromAxisAngle(axis,
					jointData[idx] /*radian*/);
			});

			// ここで同時にMQTT の送信も行う
			// Gripper の情報はどうやって共有するか？

			// left right の情報も送る必要があるよね！
			// 本当は一緒におくったほうが良いから、、、どっちかだけ？
			this.sendMQTT(jointData, this.el.gripState, this.data.arm, this.el.button_a_state, this.el.button_b_state);
		}
	}
});
