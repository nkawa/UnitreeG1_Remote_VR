// ********
// ********
import AFRAME from 'aframe';
import '../compo_aframe/vrControllerThumbMenu.js'; // with thumbMenuEventHandler
import '../compo_aframe/axesFrame.js';
import '../compo_aframe/abButtonControl.js';
import '../compo_aframe/gripControl.js';


export default VrControllerComponents;

function VrControllerComponents(props) {
  const menuItems1 = "g1l-unitree-l-arm,ray,g1r-unitree-r-arm";
  const menuItems2 = "g1l-unitree-l-arm,g1l-unitree-l-arm,ray";

  return (
    <>
      <a-entity ref={props.right}
                oculus-touch-controls="hand: right"
                thumbstick-menu={`items: ${menuItems1}`}
                thumbmenu-event-handler
                ab-button-control
                grip-control
                target-selector
                event-distributor
                visible="true">
        <a-entity a-axes-frame="length: 0.1" />
      </a-entity>
      <a-entity  ref={props.left}
                oculus-touch-controls="hand: left"
                thumbstick-menu={`items: ${menuItems2}`}
                thumbmenu-event-handler
                target-selector
                event-distributor
                visible="true">
        <a-entity a-axes-frame="length: 0.1" />
      </a-entity>

    </>
  );
}
