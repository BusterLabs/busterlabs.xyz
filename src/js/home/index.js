const RADIUS = 200;
const FIST_DURATION = 1600;
const FIST_DELAY = 800;
const CIRCLE_DURATION = FIST_DELAY;
const CIRCLE_DELAY = 300;

const {
    CustomShape,
    Shape,
    Burst,
    Timeline,
} = require('mo-js');

class Fist extends CustomShape {
    getShape () {
        return '<path class="logo_fist--inside logo_fist--animated" d="M22.615 33.399c-.018-1.053-.869-2.482-2.572-2.776-1.385-.238-2.783.24-3.12 1.437-.175-1.561-1.522-2.099-3.177-2.058-1.613.041-2.941.787-3.104 2.296-.407-.898-1.448-1.178-2.684-1.148l-.05.002c-1.207.029-2.238.465-2.635 1.385-.357-.199-.881-.224-1.647.047-.945.334-2.615 1.768-3.311 4.742-.537 2.295.197 5.493.197 5.493-.074 1.423 1.009 2.636 2.4 2.712a2.587 2.587 0 0 0 2.46-1.396l.012.462c.039 1.593 1.343 2.854 2.914 2.815l.05-.002a2.85 2.85 0 0 0 2.639-2.008c.267 1.572 1.627 2.706 3.194 2.666 1.739-.044 3.114-1.502 3.088-3.262.241 1.463 1.499 2.525 2.957 2.498l.049-.002c1.626-.029 3.36-1.647 3.33-3.296.001.002-.892-4.725-.99-10.607z"/><path class="logo_fist--outside logo_fist--animated" d="M23.541 44.609c-.528.649-1.314 1.107-2.207 1.124l-.049.001c-.16.001-.32-.008-.479-.025-.08-.012-.159-.021-.239-.031-1.025-.164-2.157-.689-2.807-1.442.139-.92.158-1.839.146-2.742-.015-.983-.076-1.953-.119-2.921a34.193 34.193 0 0 1-.032-2.922 7.096 7.096 0 0 0-.446 1.427c-.101.488-.172.982-.213 1.479-.087.991-.087 1.978-.07 2.951.016.975.056 1.938.016 2.886-.021.474-.035 1.187-.189 1.518-.316.677-1.26.821-2.054.842-1.375.034-2.842-.811-3.429-2.035l.005-.04c.055-.426.11-.853.156-1.281.088-.858.144-1.727.144-2.594 0-.869-.051-1.74-.171-2.604a14.363 14.363 0 0 0-.235-1.288 10 10 0 0 0-.375-1.26c-.032.441-.043.875-.055 1.305-.012.432-.018.859-.025 1.287-.013.854-.019 1.707-.02 2.561 0 .854.008 1.709.046 2.573.018.36.04 1.403.077 1.864a2.82 2.82 0 0 1-1.95.855h-.051c-1.308.033-2.643-1.023-3.077-2.297l.007-.117c.051-.742.105-1.486.139-2.238.032-.752.046-1.511-.004-2.279a9.074 9.074 0 0 0-.145-1.151 4.3 4.3 0 0 0-.156-.571 2.228 2.228 0 0 0-.12-.274.902.902 0 0 0-.176-.239c.027.093.04.186.047.279.007.092.007.185.005.277a8.69 8.69 0 0 1-.033.555c-.034.369-.075.74-.117 1.111-.081.744-.15 1.494-.182 2.254-.03.757-.032 1.521.052 2.293l.008.06c-.457.316-1.022.458-1.634.458-3.98 0-3.135-5.91-2.599-8.205.089-.379.189-.723.3-1.035-.358.574-.68 1.336-.917 2.351-.537 2.295-.778 8.205 2.597 8.205.991 0 1.858-.431 2.341-1.19.032.17.116 3.07 3.044 3.07h.05a2.821 2.821 0 0 0 2.208-1.171c-.059.271-.1.546-.123.821-.197 2.175 1.495 3.246 2.54 2.867a18.02 18.02 0 0 1 7.046-1.092c1.26.05 2.092-.851 2.26-2.318.641-.5 1.128-1.215 1.264-1.912z"/>';
    }
}

mojs.addShape( 'fist', Fist );



/**
 * Hide the fist after the animation.
 */
const hideFist = () => {
    //const nodes = document.querySelectorAll('.logo_fist--animated');
    const nodes = document.querySelectorAll('svg');
    [].map.call(nodes, (node) => {
        const parent = node.parentElement.getAttribute('data-name');
        if (!parent) {
            return;
        }
        node.parentElement.parentElement.removeChild(node.parentElement);
    })
}

/**
 * Set the coordinates and start the animation.
 */
const startAnimation = () => {

    const logo = document.querySelector('.logo_fist--outside');
    const {
        top,
        right,
        bottom,
        left,
        width,
        height,
    } = logo.getBoundingClientRect();
    console.log(logo.getBoundingClientRect());

    const fist = new Shape({
        left: 0,
        top: 0,
        shape: 'fist',
        fill: '#FF9C00',
        scale: { 0 : 1 },
        easing: 'elastic.out',
        duration: FIST_DURATION,
        delay: FIST_DELAY,
        radius: width * 2.13
    });

    const circle = new Shape({
        left: 0,
        top: 0,
        stroke: 'rgba(235, 163, 82, 0.8)',
        strokeWidth: { [2*RADIUS] : 0 },
        fill: 'none',
        scale: { 0: 1, easing: 'quad.out' },
        radius: RADIUS,
        duration: CIRCLE_DURATION,
        delay: CIRCLE_DELAY,
    });

    const timeline = new Timeline({ speed: 1.5 });
    timeline.add(  circle, fist );

    const coords = {
        x: left + (width * 2.12),
        y: top + (height * 1.02),
    };

    circle.tune(coords);
    fist.tune(coords);
    timeline.replay();

    setTimeout(hideFist, FIST_DURATION);
}

document.addEventListener( 'DOMContentLoaded', startAnimation);
