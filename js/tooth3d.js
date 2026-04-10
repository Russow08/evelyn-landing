/* ==========================================================================
   TOOTH3D.JS — Three.js Crystal Molar para el Hero
   Diente 3D con material de cristal azul, auto-rotate y mouse interaction.
   Requiere three.min.js cargado antes que este script.
   ========================================================================== */

(function () {
    'use strict';

    var container = document.getElementById('hero-tooth-3d');
    if (!container) return;

    /* Si Three.js no cargó (sin internet / bloqueado), mostrar SVG fallback */
    if (typeof THREE === 'undefined') {
        var fb = container.querySelector('.tooth-fallback');
        if (fb) fb.style.display = 'block';
        return;
    }

    /* ── Renderer ─────────────────────────────────────────────────────────── */
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    container.appendChild(canvas);

    var W = container.offsetWidth  || 440;
    var H = container.offsetHeight || 440;

    var renderer = new THREE.WebGLRenderer({
        canvas    : canvas,
        antialias : true,
        alpha     : true,        /* fondo transparente → el gradiente del hero se ve */
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    /* outputColorSpace disponible desde r139 */
    if (THREE.SRGBColorSpace !== undefined) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    /* ── Escena y Cámara ──────────────────────────────────────────────────── */
    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);

    /* ── Materiales ───────────────────────────────────────────────────────── */
    /* Corona: cristal azul translúcido */
    var crystalMat = new THREE.MeshPhysicalMaterial({
        color              : new THREE.Color(0x0a78b8),
        roughness          : 0.06,
        metalness          : 0.0,
        transmission       : 0.72,   /* efecto vidrio / cristal */
        thickness          : 2.2,
        ior                : 1.45,
        clearcoat          : 1.0,
        clearcoatRoughness : 0.04,
        transparent        : true,
        opacity            : 0.94,
        emissive           : new THREE.Color(0x001a3d),
        emissiveIntensity  : 0.3,
    });

    /* Raíces: azul oscuro más sólido */
    var rootMat = new THREE.MeshPhysicalMaterial({
        color              : new THREE.Color(0x052230),
        roughness          : 0.14,
        metalness          : 0.0,
        transmission       : 0.55,
        thickness          : 1.2,
        ior                : 1.35,
        clearcoat          : 0.6,
        clearcoatRoughness : 0.1,
        transparent        : true,
        opacity            : 0.88,
        emissive           : new THREE.Color(0x000810),
        emissiveIntensity  : 0.08,
    });

    /* ── Geometría del diente ─────────────────────────────────────────────── */
    var tooth = new THREE.Group();
    scene.add(tooth);

    /* Corona: esfera aplanada y ancha (molar) */
    var crownGeo = new THREE.SphereGeometry(1.85, 48, 32);
    crownGeo.scale(1.58, 1.08, 1.12);
    tooth.add(new THREE.Mesh(crownGeo, crystalMat));

    /* 4 cúspides (los 4 "picos" del molar) */
    var cuspGeo = new THREE.SphereGeometry(0.62, 24, 18);
    [
        [-0.80,  1.30,  0.44],
        [ 0.80,  1.30,  0.44],
        [-0.80,  1.28, -0.44],
        [ 0.80,  1.28, -0.44],
    ].forEach(function (p) {
        var m = new THREE.Mesh(cuspGeo, crystalMat);
        m.position.set(p[0], p[1], p[2]);
        tooth.add(m);
    });

    /* Cuello cervical (conector corona → raíces) */
    var neckGeo  = new THREE.CylinderGeometry(1.08, 1.45, 0.52, 32);
    var neckMesh = new THREE.Mesh(neckGeo, crystalMat);
    neckMesh.position.y = -1.58;
    tooth.add(neckMesh);

    /* Raíces: 2 cilindros cónicos */
    var rGeo = new THREE.CylinderGeometry(0.38, 0.07, 2.6, 20);

    var rL = new THREE.Mesh(rGeo, rootMat);
    rL.position.set(-0.60, -3.12, 0);
    rL.rotation.z = 0.09;
    tooth.add(rL);

    var rR = new THREE.Mesh(rGeo, rootMat);
    rR.position.set( 0.60, -3.12, 0);
    rR.rotation.z = -0.09;
    tooth.add(rR);

    /* ── Iluminación ──────────────────────────────────────────────────────── */
    /* Luz ambiental base */
    scene.add(new THREE.AmbientLight(0x4477bb, 1.0));

    /* Luz principal (arriba-izquierda, blanco-azul) → brillo especular */
    var keyLight = new THREE.DirectionalLight(0xb8d8ff, 5.5);
    keyLight.position.set(-3.5, 5, 3);
    scene.add(keyLight);

    /* Luz de contorno trasera (cyan) → glow cristalino desde atrás */
    var rimLight = new THREE.PointLight(0x00c8ff, 4.5, 18);
    rimLight.position.set(3, -1, -5);
    scene.add(rimLight);

    /* Luz de relleno (derecha-frente) */
    var fillLight = new THREE.PointLight(0x0055cc, 2.0, 14);
    fillLight.position.set(4, 2, 3);
    scene.add(fillLight);

    /* Luz inferior (teal) → glow desde abajo, simula energía interna */
    var underLight = new THREE.PointLight(0x00e8d0, 1.5, 10);
    underLight.position.set(0, -5, 1);
    scene.add(underLight);

    /* ── Interacción con el mouse ─────────────────────────────────────────── */
    tooth.position.y = 0.5;

    var mouseX   = 0;
    var mouseY   = 0;
    var tgtRotX  = 0;
    var tgtRotY  = 0.4;
    var autoSpin = true;

    container.addEventListener('mouseenter', function () { autoSpin = false; });
    container.addEventListener('mouseleave', function () { autoSpin = true;  });

    container.addEventListener('mousemove', function (e) {
        var r = container.getBoundingClientRect();
        mouseX = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        mouseY = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    });

    /* Touch para móvil */
    container.addEventListener('touchmove', function (e) {
        e.preventDefault();
        var t = e.touches[0];
        var r = container.getBoundingClientRect();
        mouseX = ((t.clientX - r.left) / r.width  - 0.5) * 2;
        mouseY = ((t.clientY - r.top)  / r.height - 0.5) * 2;
    }, { passive: false });

    /* ── Loop de animación ────────────────────────────────────────────────── */
    var clock = new THREE.Clock();

    function tick() {
        requestAnimationFrame(tick);
        var t = clock.getElapsedTime();

        /* Flotación suave (igual que el CSS toothFloat pero en 3D) */
        tooth.position.y = 0.5 + Math.sin(t * 0.8) * 0.14;

        if (autoSpin) {
            /* Auto-rotación continua mientras el usuario no interactúa */
            tooth.rotation.y = t * 0.38;
            tooth.rotation.x = Math.sin(t * 0.3) * 0.07;
        } else {
            /* Seguir el mouse suavemente (lerp) */
            tgtRotY += (mouseX *  1.2 - tgtRotY) * 0.06;
            tgtRotX += (mouseY * -0.55 - tgtRotX) * 0.06;
            tooth.rotation.y = tgtRotY;
            tooth.rotation.x = tgtRotX;
        }

        renderer.render(scene, camera);
    }

    tick();

    /* ── Responsive resize ────────────────────────────────────────────────── */
    window.addEventListener('resize', function () {
        var nW = container.offsetWidth;
        var nH = container.offsetHeight;
        if (!nW || !nH) return;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
    });

})();
