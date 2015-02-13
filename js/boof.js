/*

 *      <コ:彡

 *      for boof

 *

 */


// constants
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var aspect = WIDTH/HEIGHT;

// camera
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;

var camera, renderer, controls,
light, light1, light2, crystalMesh,
groundMirror, crystalMaterial;


function init(){

    // renderer
    renderer = new THREE.WebGLRenderer({anitalias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xffffff, 0.2);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(30, aspect, 1, 1000);
    camera.position.set(-50,5,8);
    scene.add(camera);

    // light
    light = new THREE.PointLight(0xff00ff);
    light = new THREE.AmbientLight( 0x00ffff ); // soft white light
    light1 = new THREE.DirectionalLight( 0xffff00, 0.5 );
    light2 = new THREE.HemisphereLight(0xffffff, 0x00dddd, 0.8);
    light1.position.set(-100,200,100);
    light2.position.set(100,100,100);
    scene.add(light1);
    scene.add(light2);

    // on window resize
    window.addEventListener('resize', function(){
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set( 0, 10, 0);
    controls.maxDistance = 50;
    controls.minDistance = 0;
    controls.update();
    $('#container').append(renderer.domElement);
}

function update() {

    requestAnimationFrame( update );
    var timer = Date.now() * 0.001;
    console.log('1');
    // if(crystalMesh){
    crystalMesh.rotation.y -= 0.002;
    console.log('2');
    crystalMesh.rotation.y = ( Math.PI / 2 ) - timer * 0.5;
    crystalMesh.rotation.z = timer * 0.1;

    controls.update();
    groundMirror.render();
    renderer.render(scene, camera);
    console.log('3');
    // }
}

function draw(){
    
    var plane = new THREE.PlaneBufferGeometry( 100, 100 );
    groundMirror = new THREE.Mirror( renderer, camera, {clipBias: 0.003, textureWidth: WIDTH/4, textureHeight: HEIGHT/4, color: 0xdddddd } );
    
    var mirrorMesh = new THREE.Mesh( plane, groundMirror.material );
    mirrorMesh.add( groundMirror );
    scene.add( mirrorMesh );

    // loader for Collada dae file
    // loader = new THREE.ColladaLoader();
    // loader.options.convertUpAxis = true;
    // loader.load('crystal.dae', function(collada){
    //     // material = new THREE.MeshPhongMaterial({
    //     //     color: 0xffffff,
    //     //     shininess: 100
    //     // });
    //     // mesh = new THREE.Mesh(collada.scene, material);
    //     scene.add(collada.scene);
    // });

    // loader -- for blender outputted json file
    crystalMaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 100
    });
    crystalMaterial.transparent = true;
    crystalMaterial.opacity = 0.5;
    
    loader = new THREE.JSONLoader();
    loader.load('js/crystal.js', function(geometry, crystalMaterial){

        crystalMesh = new THREE.Mesh(geometry, crystalMaterial);
        crystalMesh.scale.x = 10;
        crystalMesh.scale.y = 10;
        crystalMesh.scale.z = 10;
        crystalMesh.position.x = 0;
        crystalMesh.position.y = 8;
        crystalMesh.position.z = 15;
        crystalMesh.updateMatrix();

        scene.add(crystalMesh);
        update();

    }); 
}

$(function(){

    init();
    draw();

    $(window).scroll(function(){
        
        if($(this).scrollTop() > 1000) {
            $('.footer a').fadeIn();
        } else {
            $('.footer a').fadeOut();
        }
    });

    $('.footer a').on('click', function(){

        $('body').animate({scrollTop: 0}, 1000);
        return false;
    });
    

});
