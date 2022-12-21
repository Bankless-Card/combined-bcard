import React from "react";

function fadeOutEffect() {
  var fadeTarget = document.getElementById("target");

  console.log(fadeTarget);

  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 200);
}

function fadeInEffect() {
  var fadeTarget = document.getElementById("target");
  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 0;
      }
      if (fadeTarget.style.opacity >= 0 && !(fadeTarget.style.opacity > 1) ) {
          fadeTarget.style.opacity += 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 200);
}

function slideFunction() {

  let slider = document.getElementById('confirm');
  let notice = document.getElementsByClassName('delete-notice');
  console.log(slider);

  var slidepos = slider.value;

  console.log(slidepos);

  if(slidepos > 99){
      // User slided the slider
      slider.fadeOutEffect();
      notice[0].fadeInEffect();
  }
}

export default class Modal extends React.Component {
  render() {
    if(!this.props.show){ return null; }
    return (
      <div>
        <h2>Confirm Your Exchange</h2>
        <p>You will receive:</p>
        <h3>[PIC] [amount] [currency]</h3>
        <p>In echange for:</p>
        <h3>[PIC] [amount] [currency]</h3>
        <hr />
        <p>Exchange Rate: [1 BANK = 0.200192]</p>
        <p>Commission Rate: [0.5%] fee $?</p>

        <h3>Slide to confirm</h3>
        <section id="alertbox">
          {/* <p>You are about to delete <strong>super-important-file.html</strong></p>
          <p>Are you sure? Drag the slider to the right to delete this file.</p> */}
          <div className="confirmation-slider">
            <div id="status">
              <input id="confirm" type="range" value="0" min="0" max="100" 
                onChange={slideFunction} />
              <span className="delete-notice">File deleted.</span>
            </div>
          </div>
        </section>
      </div>
    )
  }
}