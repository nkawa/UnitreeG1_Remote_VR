// ********
// ********
import AFRAME from 'aframe';
import '../compo_aframe/vrControllerThumbMenu.js'; // with thumbMenuEventHandler
import '../compo_aframe/axesFrame.js';


export default VrControllerComponents;

function VrControllerComponents(props) {
  const menuItems1 = "g1l-unitree-l-arm,ray,g1r-unitree-r-arm";
  const menuItems2 = "g1l-unitree-l-arm,g1l-unitree-l-arm,ray";

  return (
    <>
      <a-entity ref={props.right}
                right-controller
                laser-controls="hand: right"
                raycaster="objects: .clickable"
                line="color: blue; opacity: 0.75"
                thumbstick-menu={`items: ${menuItems1}`}
                thumbmenu-event-handler
                target-selector
                event-distributor
                visible="true">
        <a-entity a-axes-frame="length: 0.1" />
      </a-entity>
      <a-entity  ref={props.left}
                left-controller
                laser-controls="hand: left"
                thumbstick-menu={`items: ${menuItems2}`}
                thumbmenu-event-handler
                target-selector
                event-distributor
                visible="true">
        <a-entity a-axes-frame="length: 0.1" />
      </a-entity>
      <a-entity cursor="rayOrigin: mouse"
                mouse-cursor
                raycaster="objects: .clickable"></a-entity>

    </>
  );
}
