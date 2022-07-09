const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const scene = new THREE.Scene();



//create a blue LineBasicMaterial
const material = new THREE.LineBasicMaterial( {
	
	linewidth: 3,
	linecap: 'round', //ignored by WebGLRenderer
	linejoin:  'round' //ignored by WebGLRenderer
} );

let x = 0
let y = 0
let z = 0
let a = 0
let b = 0
let c = 0
let j = 0
let r = 0
let f = 0

function animate() {
    requestAnimationFrame( animate );

        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
        camera.position.set( r, f, 100);
        if (innerWidth <= 600) {
            camera.position.set( r, f, 300)
        }
        camera.lookAt( 0, 0, 0 );
       if (x <= 100 ) {
            x += 0.3
        
       } else {
           x = 0
       }
       if (y >= -100 ) {
            y -= 0.6
    
        } else {
            y = 0
        }
        if (z >= 100  ) {
            z += 0.9
    
        } else {
            z = 0
        }

        if (a <= 9999 ) {
            a += 5
        
       } else {
           a = 0
       }
        if (b <= 9999 ) {
            b += 5
        
       } else {
           b = 0
       }
       if (c <= 9999 ) {
        c += 5
       } else {
           c = 0
       }

       if (j <= 200) {
           j += 0.5
       }
       else {
           j = 0
       }
       
        
        const material = new THREE.LineBasicMaterial( { color: a*c } );
    

    const points = [];

    points.push( new THREE.Vector3( -x, y, -20 ) );
    points.push( new THREE.Vector3( 0, z, 0 ) );
    points.push( new THREE.Vector3( -x, -y, -20 ) );

    points.push( new THREE.Vector3( x, -y, 0 ) );
    points.push( new THREE.Vector3( 0, -z, -20 ) );
    points.push( new THREE.Vector3( x, y, 0 ) );

    points.push( new THREE.Vector3( -x, -y, -20 ) );
    points.push( new THREE.Vector3( 0, -z, 0 ) );
    points.push( new THREE.Vector3( -x, y, -20 ) );

    points.push( new THREE.Vector3( x, y, 0 ) );
    points.push( new THREE.Vector3( 0, z, -20 ) );
    points.push( new THREE.Vector3( x, -y, 0 ) );




    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );

    scene.add( line );

    addEventListener('mousemove', (event) => {
        r = event.clientX / 10
    
     
    })

    addEventListener('scroll', (event) => {
        f = scrollY / 2
    })

    renderer.render( scene, camera );

    setTimeout(() => {
        scene.remove( line )
    }, 2000);
;
    
};
animate()