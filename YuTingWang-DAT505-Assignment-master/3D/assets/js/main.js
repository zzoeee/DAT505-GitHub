(function() {
    var Sparks,
        bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        };
    var geometrytemp;
    // Create a text loader for creating font objects
    var loader = new THREE.FontLoader();

    loader.load( 'three.js/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

        // Create text buffer object to improve rendering effect and performance
        geometrytemp = new THREE.TextBufferGeometry( 'opinions', {
            font: font,
            size: 40,
            height: 10,
            curveSegments: 2,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 2,
            bevelOffset: 0,
            bevelSegments: 2
        } );
    } );

    Sparks = (function() {
        function Sparks() {
            this.render = bind(this.render, this);
            this.rotateRadians = bind(this.rotateRadians, this);
            this.random = bind(this.random, this);
            this.mouseMove = bind(this.mouseMove, this);
            this.resize = bind(this.resize, this);
            this.animate = bind(this.animate, this);
            this.setStage = bind(this.setStage, this);
            // this.setLighting = bind(this.setLighting, this);
            this.drawText = bind(this.drawText, this);
            this.initText = bind(this.initText, this);
            this.setActors = bind(this.setActors, this);
            this.init = bind(this.init, this);
            this.setStage();
            // this.setLighting();
            this.setActors();
            this.animate();
            // this.interval = setInterval(this.init, 15);
            // document.getElementById('bgm').play();
            document.addEventListener("click", (function(_this) {
                return function() {
                    if (_this.interval) {
                        clearInterval(_this.interval);
                        document.getElementById('bgm').pause();
                        return _this.interval = null;
                    } else {
                        document.getElementById('bgm').play();
                        return _this.interval = setInterval(_this.init, 15);
                    }
                };
            })(this));
        }

        // Initialize the function and call it when using new
        Sparks.prototype.init = function() {
            var i, j, k, ref, ref1, results, v;
            // The number of texts drawn within each interval time interval can affect performance too much
            this.textsPerInterval = 2;
            for (i = j = 0, ref = this.textsPerInterval; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                this.initText();
            }
            ref1 = this.spheresInfo;
            results = [];
            for (k in ref1) {
                v = ref1[k];
                results.push(this.drawText(this.spheresInfo[k]));
            }
            return results;
        };

        Sparks.prototype.setActors = function() {
            this.canvasMouse = new THREE.Vector3(0, 0, 0);
            this.spheresInfo = {};
            this.sphereIndex = 0;
            this.parent = new THREE.Object3D();
            this.scene.add(this.parent);
            this.floorDimensions = 350;
            this.floorLevel = -100;
            // this.geometry = new THREE.BoxBufferGeometry(this.floorDimensions, 5, this.floorDimensions);
            this.material = new THREE.MeshLambertMaterial({
                color: "#000000"
            });
            this.material.depthWrite = false;
            this.material.transparent = true;
            this.material.opacity = 0.2;
            this.floor = new THREE.Mesh(this.geometry, this.material);
            this.floor.position.y = this.floorLevel - (this.radius / 2);
            this.floor.position.z = 0;
            return this.scene.add(this.floor);
        };

        Sparks.prototype.initText = function() {
            this.info = {};
            // Set the color of random font switching. The color list sets this. color attribute under the setstage function. Random (0,4) uses the first four colors.
            this.info.color = this.colors[this.random(0, 4)];
            this.info.radius = this.radius;
            this.info.radiusStart = this.info.radius;
            this.info.radiusDeincrement = this.info.radius * -0.002;
            this.info.startX = this.canvasMouse.x || 0;
            this.info.startY = this.canvasMouse.y || 100;
            this.info.startZ = this.canvasMouse.z || 0;
            if (this.info.startY < this.floorLevel - (this.info.radiusStart / 2)) {
                this.info.startY = this.floorLevel - (this.info.radiusStart / 2);
            }
            this.info.isXNegative = this.random(1, 2);
            this.info.isZNegative = this.random(1, 2);
            this.info.vx = this.info.isXNegative === 1 ? this.random(0, 50) * -0.15 : this.random(0, 50) * 0.15;
            this.info.vxMult = this.random(10, 20) * 0.15;
            this.info.vy = this.random(-10, 20);
            this.info.vyMult = this.random(4, 6) * -0.1;
            this.info.vz = this.info.isZNegative === 1 ? this.random(-25, 25) * -0.4 : this.random(-25, 25) * 0.4;
            this.info.vzMult = this.random(10, 20) * 0.1;
            this.sphereIndex++;
            this.spheresInfo[this.sphereIndex] = this.info;
            this.info.ID = this.sphereIndex;
            this.info.bounced = false;
            // This parameter sets the drop rate of text
            this.info.startGravity = 1;
            this.info.gravity = this.info.startGravity;
            this.geometry = geometrytemp;
            this.material = new THREE.MeshBasicMaterial({
                color: this.info.color
            });
            this.sphere = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.sphere);
            return this.info.sphere = this.sphere;
        };
        //Algorithms for Drawing Text and Text Falling and Removal
        Sparks.prototype.drawText = function(info) {
            info.sphere.scale.x = info.sphere.scale.x += info.radiusDeincrement;
            info.sphere.scale.y = info.sphere.scale.y += info.radiusDeincrement;
            info.sphere.scale.z = info.sphere.scale.z += info.radiusDeincrement;
            info.sphere.position.x = info.startX += info.vx * 0.6;
            info.sphere.position.y = info.startY -= info.vy * 0.5;
            info.sphere.position.z = info.startZ -= info.vz * 0.6;
            if (info.sphere.position.y < (this.floorLevel - (info.radiusStart / 2))) {
                if (!info.bounced) {
                    info.vx *= info.vxMult;
                    info.vz *= info.vzMult;
                } else {
                    info.vx *= 0.95;
                    info.vz *= 0.95;
                }
                if (!(info.sphere.position.x > (this.floorDimensions / 2) || info.sphere.position.x < -(this.floorDimensions / 2) || info.sphere.position.z > (this.floorDimensions / 2) || info.sphere.position.z < -(this.floorDimensions / 2))) {
                    info.vy *= info.vyMult;
                    info.sphere.position.y = this.floorLevel + (info.radiusStart * info.sphere.scale.x);
                } else {
                    info.gravity = this.info.startGravity / 2;
                    info.sphere.position.y = info.startY -= info.vy * 0.01;
                }
                info.bounced = true;
            }
            info.vy += info.gravity;
            // Zoom in below 0.1 and delete
            if (info.sphere.scale.y <= 0.1) {
                delete this.spheresInfo[info.ID];
                return this.scene.remove(info.sphere);
            }
        };



        Sparks.prototype.setStage = function() {
            this.colors = ['#da6b00', '#8555d4', '#4ad3b5','#d9d919', '#ffffff'];
            this.radius = 5;
            this.mouse = new THREE.Vector2();
            this.renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById("canvas"),
                antialias: true
            });
            // Setting stage background color hexadecimal color code
            this.renderer.setClearColor('#FFFFFF');
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
            this.camera.position.z = 600;
            // this.stats = new Stats();
            // this.stats.setMode(0);
            // this.stats.domElement.style.position = 'absolute';
            // this.stats.domElement.style.left = '0px';
            // this.stats.domElement.style.top = '0px';
            // document.getElementById("stats").appendChild(this.stats.domElement);
            window.addEventListener('resize', this.resize, false);
            return window.addEventListener('mousemove', this.mouseMove, false);
        };

        Sparks.prototype.animate = function() {
            requestAnimationFrame(this.animate);
            // this.stats.update();
            return this.render();
        };

        // Zoom window redrawing canvas
        Sparks.prototype.resize = function() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            return this.render();
        };

        // Mouse movement events
        Sparks.prototype.mouseMove = function() {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.vector = new THREE.Vector3(this.mouse.x || 0, this.mouse.y || 0, 0);
            this.vector.unproject(this.camera);
            this.dir = this.vector.sub(this.camera.position).normalize();
            this.distance = -this.camera.position.z / this.dir.z;
            return this.canvasMouse = this.camera.position.clone().add(this.dir.multiplyScalar(this.distance));
        };

        Sparks.prototype.random = function(min, max) {
            return Math.floor(Math.random() * max) + min;
        };

        //
        Sparks.prototype.rotateRadians = function(deg) {
            return deg * (Math.PI / 180);
        };

        Sparks.prototype.render = function() {
            return this.renderer.render(this.scene, this.camera);
        };

        return Sparks;

    })();


    new Sparks;

}).call(this);
