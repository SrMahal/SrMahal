const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


/* =========================================================
   THREE.JS
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xfefdfd);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});


renderer.setClearColor(0xffffff, 1);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.physicallyCorrectLights = true;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 2.5;


document
    .querySelector(".model")
    .appendChild(renderer.domElement);


/* =========================================================
   BACKGROUND
========================================================= */

const textureLoader =
    new THREE.TextureLoader();


const backgroundTexture =
    textureLoader.load(
        "./assets/pages/inicio/img/background.png"
    );


const planeGeometry =
    new THREE.PlaneGeometry(
        80,
        50
    );


const planeMaterial =
    new THREE.MeshBasicMaterial({

        map:
            backgroundTexture,

        side:
            THREE.DoubleSide,

    });


const plane =
    new THREE.Mesh(
        planeGeometry,
        planeMaterial
    );


plane.position.set(
    0,
    0,
    0
);


scene.add(
    plane
);


/* =========================================================
   LUZES
========================================================= */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        3
    );


scene.add(
    ambientLight
);


const mainLight =
    new THREE.DirectionalLight(
        0xffffff,
        1
    );


mainLight.position.set(
    5,
    10,
    7.5
);


scene.add(
    mainLight
);


const fillLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );


fillLight.position.set(
    -5,
    0,
    -5
);


scene.add(
    fillLight
);


const hemiLight =
    new THREE.HemisphereLight(
        0xffffff,
        0xffffff,
        2
    );


hemiLight.position.set(
    0,
    25,
    0
);


scene.add(
    hemiLight
);


/* =========================================================
   ANIMAÇÃO BÁSICA
========================================================= */

function basicAnimate() {

    renderer.render(
        scene,
        camera
    );

    requestAnimationFrame(
        basicAnimate
    );

}


basicAnimate();


/* =========================================================
   MODELO PRINCIPAL
========================================================= */

let model;


const loader =
    new THREE.GLTFLoader();


loader.load(

    "./assets/pages/inicio/3d/lata.glb",

    function (gltf) {

        model =
            gltf.scene;


        model.traverse(
            (node) => {

                if (
                    node.isMesh
                ) {

                    if (
                        node.material
                    ) {

                        node.material.metalness =
                            0.7;

                        node.material.roughness =
                            0.3;

                        node.material.envMapIntensity =
                            1;

                    }


                    node.castShadow =
                        true;

                    node.receiveShadow =
                        true;

                }

            }
        );


        const box =
            new THREE.Box3()
                .setFromObject(
                    model
                );


        const center =
            box.getCenter(
                new THREE.Vector3()
            );


        model.position.sub(
            center
        );


        scene.add(
            model
        );


        const size =
            box.getSize(
                new THREE.Vector3()
            );


        const maxDim =
            Math.max(
                size.x,
                size.y,
                size.z
            );


        camera.position.z =
            maxDim * 1.5;


        model.scale.set(
            0,
            0,
            0
        );


        playInitialAnimation();


        cancelAnimationFrame(
            basicAnimate
        );


        animate();

    }

);


/* =========================================================
   EFEITOS
========================================================= */

const floatAmplitude =
    0.2;

const floatSpeed =
    1.5;

const rotationSpeed =
    0.3;


let isFloating =
    true;

let currentScroll =
    0;


const stickyHeight =
    window.innerHeight;


const scannerSection =
    document.querySelector(
        ".scanner"
    );


const scannerPosition =
    scannerSection.offsetTop;


const scanContainer =
    document.querySelector(
        ".scan-container"
    );


/* =========================================================
   SOM
========================================================= */

const scanSound =
    new Audio(
        "./assets/pages/inicio/sound/bell.mp3"
    );


gsap.set(
    scanContainer,
    {
        scale:
            0
    }
);


/* =========================================================
   ANIMAÇÃO INICIAL
========================================================= */

function playInitialAnimation() {

    if (
        model
    ) {

        gsap.to(
            model.scale,
            {

                x:
                    1.8,

                y:
                    1.8,

                z:
                    1.8,

                duration:
                    1,

                ease:
                    "power2.out",

            }
        );

    }


    gsap.to(
        scanContainer,
        {

            scale:
                1,

            duration:
                1,

            ease:
                "power2.out",

        }
    );

}


/* =========================================================
   RETORNO AO TOPO
========================================================= */

ScrollTrigger.create({

    trigger:
        "body",

    start:
        "top top",

    end:
        "top -10",

    onEnterBack:
        () => {

            if (
                model
            ) {

                gsap.to(
                    model.scale,
                    {

                        x:
                            1.8,

                        y:
                            1.8,

                        z:
                            1.8,

                        duration:
                            1,

                        ease:
                            "power2.out",

                    }
                );


                gsap.to(
                    ".perfil",
                    {

                        opacity:
                            0,

                        scale:
                            0,

                        duration:
                            0.5,

                        ease:
                            "power2.in",

                    }
                );


                isFloating =
                    true;

            }


            gsap.to(
                scanContainer,
                {

                    scale:
                        1,

                    duration:
                        1,

                    ease:
                        "power2.out",

                }
            );

        },

});


/* =========================================================
   HERO
========================================================= */

gsap
    .timeline({

        scrollTrigger: {

            trigger:
                ".hero",

            start:
                "top top",

            end:
                "bottom top",

            scrub:
                1,

        }

    })

    .to(
        ".hero h1",
        {

            opacity:
                0,

            scale:
                0.8,

            y:
                -80

        },
        0
    )

    .to(
        ".hero h2",
        {

            opacity:
                0,

            scale:
                0.9,

            y:
                -200

        },
        0.001
    )

    .to(
        ".hero p",
        {

            opacity:
                0,

            scale:
                1,

            y:
                -180

        },
        0.005
    );


/* =========================================================
   SCANNER
========================================================= */

ScrollTrigger.create({

    trigger:
        ".scanner",

    start:
        "top top",

    end:
        `${stickyHeight}px`,

    pin:
        true,


    onEnter:
        () => {

            if (
                model
            ) {

                isFloating =
                    false;


                model.position.y =
                    0;


                setTimeout(
                    () => {

                        scanSound.currentTime =
                            0;

                        scanSound.play();

                    },
                    500
                );


                gsap.to(
                    model.rotation,
                    {

                        y:
                            model.rotation.y
                            + Math.PI * 2,

                        duration:
                            1,

                        ease:
                            "power2.inOut",


                        onComplete:
                            () => {

                                gsap.to(
                                    model.scale,
                                    {

                                        x:
                                            0,

                                        y:
                                            0,

                                        z:
                                            0,

                                        duration:
                                            0.5,

                                        ease:
                                            "power2.in",


                                        onComplete:
                                            () => {

                                                gsap.to(
                                                    scanContainer,
                                                    {

                                                        scale:
                                                            0,

                                                        duration:
                                                            0.5,

                                                        ease:
                                                            "power2.in",

                                                    }
                                                );


                                                setTimeout(
                                                    () => {

                                                        gsap.to(
                                                            ".perfil",
                                                            {

                                                                opacity:
                                                                    1,

                                                                scale:
                                                                    1,

                                                                duration:
                                                                    0.5,

                                                                ease:
                                                                    "power2.out",

                                                            }
                                                        );

                                                    },
                                                    600
                                                );

                                            },

                                    }
                                );

                            },

                    }
                );

            }

        },


    onLeaveBack:
        () => {

            gsap.set(
                scanContainer,
                {
                    scale:
                        0
                }
            );


            gsap.to(
                scanContainer,
                {

                    scale:
                        1,

                    duration:
                        1,

                    ease:
                        "power2.out",

                }
            );

        },

});


/* =========================================================
   SCROLL
========================================================= */

lenis.on(
    "scroll",
    (event) => {

        currentScroll =
            event.scroll;

    }
);


/* =========================================================
   ANIMAÇÃO PRINCIPAL
========================================================= */

function animate() {

    if (
        model
    ) {

        if (
            isFloating
        ) {

            const floatOffset =

                Math.sin(
                    Date.now()
                    * 0.001
                    * floatSpeed
                )

                * floatAmplitude;


            model.position.y =
                floatOffset;

        }


        const scrollProgress =

            Math.min(
                currentScroll
                / scannerPosition,
                1
            );


        if (
            scrollProgress < 1
        ) {

            model.rotation.y =
                scrollProgress
                * Math.PI
                * 2;

        }


        if (
            scrollProgress < 1
        ) {

            model.rotation.y +=
                0.01
                * rotationSpeed;

        }

    }


    renderer.render(
        scene,
        camera
    );


    requestAnimationFrame(
        animate
    );

}


/* =========================================================
   CARD
========================================================= */

const portfolioCard =
    document.querySelector(
        ".portfolio-card"
    );


if (
    portfolioCard
) {

    portfolioCard.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                portfolioCard
                    .getBoundingClientRect();


            const x =
                event.clientX
                - rect.left;


            const y =
                event.clientY
                - rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                (
                    (y - centerY)
                    / centerY
                )
                * -8;


            const rotateY =
                (
                    (x - centerX)
                    / centerX
                )
                * 8;


            portfolioCard.style.transform = `
                scale(1)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;

        }
    );


    portfolioCard.addEventListener(
        "mouseleave",
        () => {

            portfolioCard.style.transform =
                "scale(1) rotateX(0deg) rotateY(0deg)";

        }
    );

}