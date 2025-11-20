"use client";
import 'aframe';
import * as React from 'react'
const THREE = window.AFRAME.THREE; // これで　AFRAME と　THREEを同時に使える

import { AppMode } from './appmode.js';

import '../compo_aframe/robotRegistry.js';
import '../compo_aframe/robotLoader.js';
import VrControllerComponents from '../components/VrControllerComponents.jsx';
import '../compo_aframe/ikWorker.js';
import '../compo_aframe/reflectWorkerJoints.js';
import '../compo_aframe/armMotionUI.js';
import '../compo_aframe/gripControl.js';
import '../compo_aframe/default_event_target.js';
import '../compo_aframe/motionFilter.js'
import '../compo_aframe/model_opacity.js'

import { getCookie } from '../lib/cookie_id.js';
import { setupMQTT } from '../lib/MQTT_jobs.js';

import StereoVideo from '../components/stereoWebRTC.js';



// 角度、横方向のオフセットを Cookie から取得して初期化
const getCookiesForInitalize = (appmode, setVrModeAngle, setVrModeOffsetX) => {
  // Cookie, Offsetの取得
  if (!(appmode === AppMode.viewer)) {
    const wk_vrModeAngle = getCookie('vrModeAngle')
    setVrModeAngle(wk_vrModeAngle ? parseFloat(wk_vrModeAngle) : 180);  // change default to 90
    const wk_vrModeOffsetX = getCookie('vrModeOffsetX')
    setVrModeOffsetX(wk_vrModeOffsetX ? parseFloat(wk_vrModeOffsetX) : 0.55); // デフォルト X 方向オフセット
    // console.log("Cookie read vrModeAngle, OffsetX:", vrModeAngle_ref.current, vrModeOffsetX_ref.current);
  }
}


export default function Home(props) {
  const robotIDRef = React.useRef("robot_id_reference"); // ロボットUUID 保持用

  const [vrModeAngle, setVrModeAngle] = React.useState(90);       // ロボット回転角度
  const [vrModeOffsetX, setVrModeOffsetX] = React.useState(0.35);   // X offset
  const [base_rotation, setBaseRotation] = React.useState(`-90 90 0`);     // ベース角度
  const [base_position, setBasePosition] = React.useState(`0.35 0.75 -1`);   // ベース位置

  const [draw_ready, set_draw_ready] = React.useState(false)

  const [debug_message, set_debug_message] = React.useState("")
  const add_debug_message = (message) => {
    set_debug_message((prev) => (prev + " " + message))
  }

  const [rtcStats, set_rtcStats] = React.useState([])

  const g1r_ref = React.useRef(null);
  const g1l_ref = React.useRef(null);

  const right_control = React.useRef(null);
  const left_control = React.useRef(null);

  const deg30 = Math.PI / 6.0;
  const deg90 = Math.PI / 2;
  const deg45 = Math.PI / 4;
  const deg22 = Math.PI / 8;

  // モードに応じて初期ポーズを変更
  let initial_pose = `${-deg90}, ${-deg90}, ${-deg90}, 0, ${deg90}, 0`;
  if (props.appmode === AppMode.simRobot) {
    initial_pose = `${deg45}, ${-deg90}, ${deg45}, 0, ${-deg90}, 0`;
  }

  // MQTT 対応
  React.useEffect(() => {
      setupMQTT(props, robotIDRef, g1r_ref,g1l_ref, set_draw_ready); // useEffect で1回だけ実行される。


  }, []);

  // Cookie から初期値取得
  React.useEffect(() => {
    getCookiesForInitalize(props.appmode, setVrModeAngle, setVrModeOffsetX);
  }, []);
  // base_position, base_rotation 更新
  React.useEffect(() => {
    setBasePosition(`${vrModeOffsetX} 0.75 -1`);
    setBaseRotation(`-90 ${vrModeAngle} 0`);
    console.log("Home base_pos, rotation:", base_position, base_rotation);
  }, [vrModeAngle, vrModeOffsetX]);
  
  
  React.useEffect(() => {
    console.log("Draw Ready!", draw_ready);
    if(draw_ready){// ここでメニュー選択を実施しちゃう！
    // 右手メニュー
//        console.log("Draw Ready! with control",right_control.current, left_control.current);
        right_control.current?.emit('thumbmenu-select', {
          index: 0,
          texts: ["g1r-unitree-r-arm","ray","g1l-unitree-l-arm"]
        });
        left_control.current?.emit('thumbmenu-select', {
          index: 0,
          texts: ["g1l-unitree-l-arm","g1l-unitree-l-arm","ray"]
        });

    }
  }, [draw_ready]);


    return (
      <>
        <a-scene xr-mode-ui={`enabled: ${!(props.appmode === AppMode.viewer) ? 'true' : 'false'}; XRMode: xr`} >
          
          <a-entity id="robot-registry"
            robot-registry
            event-distributor>
            <VrControllerComponents right={right_control} left={left_control} appmode={props.appmode} />
          </a-entity>
          <a-entity camera position="0 1.7 1"
            look-controls
            wasd-controls="acceleration: 200"
          ></a-entity>

          <a-camera id="camera" stereocam position="0 1.1 0.2"></a-camera>


          {  // ステレオカメラ使うか extra-camera={props.appmode}>
            (props.appmode === AppMode.withCam || props.appmode === AppMode.withDualCam || props.appmode === AppMode.viewer) ?
              <StereoVideo rendered={draw_ready} set_rtcStats={set_rtcStats} 
                appmode={props.appmode}
              /> : <></>
          }





        {(props.appmode !== AppMode.simRobot)?
        <a-plane id="unitree-g1-torso"
               position="0 0.55 -1.0" rotation="-90 0 90"
               base-mover="velocityMax:0.2; angularVelocityMax: 0.5"
               width="0.4" height="0.4" color="#7BC8A4"
        >
          <a-plane id="g1r-unitree-r-arm"
                ref={g1r_ref}
                 width="0.1" height="0.1" color="green"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: g1-right"
                 ik-worker={`${0}, ${0}, ${0}, ${0}, ${0}, 0, 0`}
                  reflect-worker-joints={`appmode: ${props.appmode}; arm: right;`}
                 arm-motion-ui
          />
          <a-plane id="g1l-unitree-l-arm"
                ref={g1l_ref}
                 width="0.1" height="0.1" color="green"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: g1-left"
                 ik-worker={`${0}, ${0}, ${0}, ${0}, ${0}, 0, 0`}
                  reflect-worker-joints={`appmode: ${props.appmode}; arm: left;`}

                 arm-motion-ui

          />
        </a-plane>
          :
        <a-plane id="unitree-g1-torso"
               position="0 0.55 -1.0" rotation="-90 0 90"
               base-mover="velocityMax:0.2; angularVelocityMax: 0.5"
               width="0.4" height="0.4" color="#7BC8A4"
        >
          <a-plane id="g1r-unitree-r-arm"
                ref={g1r_ref}
                 width="0.1" height="0.1" color="green"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: g1-right"
          />
          <a-plane id="g1l-unitree-l-arm"
                 width="0.1" height="0.1" color="green"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: g1-left"
          />
        </a-plane>
        }
      


        </a-scene>
      </>
    );


}