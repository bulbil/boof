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
light, light1, light2,
groundMirror, crystalMaterial,
crystalMesh1, crystalMesh2, crystalMesh3;
var crystals = [crystalMesh1, crystalMesh2, crystalMesh3];


function init(){

    // renderer
    renderer = new THREE.WebGLRenderer({anitalias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xffffff, 0.2);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(30, aspect, 1, 1000);

    if( WIDTH < 481 ) {
        camera.position.set(-51,6,-38);
    } else {
        camera.position.set(-60,20,20);
    }
    // camera.position.set(0,0,0);
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
    controls.maxDistance = 200;
    controls.minDistance = 0;
    controls.update();
    $('#container').append(renderer.domElement);


    // mirror
    plane = new THREE.PlaneBufferGeometry( 100, 100 );
    groundMirror = new THREE.Mirror( renderer, camera, {clipBias: 0.003, textureWidth: WIDTH/4, textureHeight: HEIGHT/4, color: 0xdddddd } );
    
    mirrorMesh = new THREE.Mesh( plane, groundMirror.material );
    mirrorMesh.add( groundMirror );
    scene.add( mirrorMesh );
}

function update() {

    requestAnimationFrame( update );

    var timer = Date.now() * 0.001;
    var a,b,c;

    crystals[0].rotation.x = 0.002;
    crystals[0].rotation.y = ( Math.PI / 2 ) - (timer * 0.5);
    crystals[0].rotation.z = timer * 0.1;

    crystals[1].rotation.x = -0.005;
    crystals[1].rotation.y = -(( Math.PI / 2 ) - (timer * 0.5));
    crystals[1].rotation.z = -(timer * 0.1);

    crystals[2].rotation.x = ( Math.PI / 2 ) - (timer * 0.5);
    crystals[2].rotation.y = 0.002;
    crystals[2].rotation.z = timer * 0.1;

    controls.update();
    groundMirror.render();
    renderer.render(scene, camera);
}

function draw(){
    

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
    
    loader = new THREE.JSONLoader();
    loader.load('js/crystal.js', function(geometry){

        crystalMaterial = new THREE.MeshPhongMaterial({
            color: 0xdddddd,
            shininess: 100
        });
        crystalMaterial.transparent = true;
        crystalMaterial.opacity = 0.8;

        for (var i in crystals){
            crystals[i] = new THREE.Mesh(geometry, crystalMaterial);
            crystals[i].scale.x = 10;
            crystals[i].scale.y = 10;
            crystals[i].scale.z = 10;
            crystals[i].position.x = 10;
            crystals[i].position.y = 10;
            crystals[i].position.z = 10;
            crystals[i].updateMatrix();
            scene.add(crystals[i]);
        }
        update();
    });
}

$(function(){

    $('marquee').marquee('boof-marquee')
        .mouseover(function(){
            $(this).trigger('stop');
        })
        .mouseout(function(){
            $(this).trigger('start');
        });

    init();
    draw();


    $(window).scroll(function(){
        
        var top = $(this).scrollTop();

        function hideShowOnScroll( el, heightRatio, opacityToggle) {

            if( top > (heightRatio * HEIGHT) ) {
                el.css('opacity', opacityToggle + 0);
            } else if( top < (heightRatio * HEIGHT) ) {
                el.css('opacity', !opacityToggle + 0);
            }
        }
        
        var lineNum = Math.floor((Math.random() * 7) + 1);
        var wordNum = Math.floor((Math.random() * 3) + 1);
        var word = $('#four .word#' + lineNum + ' span:nth-child(' + wordNum + ')');
        var opacity = (word.css('opacity') == 1) ? 0 : 1;

        if(top > (2 * HEIGHT)) {
            word.css('opacity', opacity);
        }
    });

    $('.footer a').on('click', function(){

        $('body').animate({scrollTop: 0}, 1000);
        return false;
    });

    $('#footer a').on('click',function(){
        
        $('#top-container').toggle();
        $('#bottom-container').toggle();
        $('#layer').toggle();
        $('.stripes').toggle();
        $('#floater').toggle();
        $('#container').toggleClass('quiet-view');
        
    });
    
});

