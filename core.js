"use strict";
var cameraData = {
    "camera_position_x": 5.672,
    "camera_position_y": 14.360,
    "camera_position_z": 2.274,
    "camera_rotation_x": -2.065,
    "camera_rotation_y": -0.224,
    "camera_rotation_z": -2.752
};
var rackMax = 20;
var rowMax = 6;
var roomXDimension = 8 + (rackMax * 0.6);
var roomYDimension = 8 + (((rowMax * 2) - 1) * 1.2);
var anchor;
var controlsEnabled = false;
var element = document.body;
var emptyBlocks = {};
var ghostDiv;
var havePointerLock;
var htmlElement;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var mountBlocks = {};
var mountColor = {};
var mountData = {};
var prevTime;
var rackBlocks = {};
var rackColor = {};
var rackData = {};
var roomNameElement;
var roomName;
var roomSysid;
var sceneBlocks = {};
var selectedBlock = "";
var selectedPreviousName = "";
var serverLink = this;
var speed = 6;
var speedBoost = false;
var threeCamera;
var threeControls;
var threeRaycaster;
var threeRenderer;
var threeScene;
// @ts-ignore
var threeVelocity = new THREE.Vector3();
var titleText;
//roomSysid = serverLink.data.roomSysid;
rendererResize();
window.addEventListener('resize', rendererResize, false);
/*
// servicenow stuff
if (roomSysid == null) {
  urlParamMissingWarning();
} else {
  serverLink.data.generatingRoom = true;
  serverLink.server.update().then(function(){
    serverLink.data.generatingRoom = false;
    allData = serverLink.data.allData;
    */
roomName = "Datacenter";
roomSysid = "abcde";
var rackResult = fakeRacks(rowMax, rackMax);
rackData = rackResult["tempRackData"];
rackBlocks = rackResult["tempRackBlocks"];
sceneBlocks = fakeScene(roomXDimension, roomYDimension);
var mountResult = fakeMount(rackData, rackBlocks);
mountData = mountResult["tempMountData"];
mountBlocks = mountResult["tempMountBlock"];
emptyBlocks = fakeEmpty(rackBlocks);
roomNameElement = document.getElementById('roomName');
if (roomNameElement) {
    anchor = document.createElement('a');
    titleText = document.createTextNode(roomName);
    anchor.appendChild(titleText);
    anchor.href = "/nav_to.do?uri=%2Fcmdb_ci_computer_room.do%3Fsys_id%3D" + roomSysid;
    roomNameElement.appendChild(anchor);
}
havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if (havePointerLock) {
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
    ghostDiv = document.getElementById('ghost');
    if (ghostDiv) {
        ghostDiv.addEventListener('click', pointerLockRequest, false);
    }
}
else {
    console.log('Your browser doesn\'t seem to support Pointer Lock API');
}
generateScene();
animate();
//});
//}
function generateScene() {
    var speedElement = document.getElementById('speed');
    var threeCrosshair;
    var threeGeometry;
    var threeLight;
    var threeMaterial;
    htmlElement = document.getElementById('rackOverlay');
    if (htmlElement) {
        htmlElement.addEventListener('change', rackDropDown, false);
    }
    htmlElement = document.getElementById('rackFilter');
    if (htmlElement) {
        htmlElement.addEventListener('change', rackDropDown, false);
    }
    htmlElement = document.getElementById('mountOverlay');
    if (htmlElement) {
        htmlElement.addEventListener('change', mountDropDown, false);
    }
    htmlElement = document.getElementById('mountFilter');
    if (htmlElement) {
        htmlElement.addEventListener('change', mountDropDown, false);
    }
    htmlElement = document.getElementById("speed");
    if (htmlElement) {
        htmlElement.addEventListener("change", function () {
            speed = parseFloat(speedElement.value);
        }, false);
    }
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    // fill dropdowns
    generateRackFilter();
    generatemountFilter();
    // scene
    // @ts-ignore
    threeScene = new THREE.Scene();
    // light
    // @ts-ignore
    threeLight = new THREE.AmbientLight(0xffffff);
    threeScene.add(threeLight);
    // camera
    // @ts-ignore
    threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
    // @ts-ignore
    threeControls = new THREE.PointerLockControls(threeCamera, document.body);
    threeControls.getObject().position.set(cameraData["camera_position_x"], cameraData["camera_position_y"], cameraData["camera_position_z"]);
    threeControls.getObject().rotation.set(cameraData["camera_rotation_x"], cameraData["camera_rotation_y"], cameraData["camera_rotation_z"]);
    threeScene.add(threeCamera);
    // threeCrosshair
    // @ts-ignore
    threeGeometry = new THREE.Geometry();
    // @ts-ignore
    threeGeometry.vertices.push(new THREE.Vector3(0, 0.001, -0.1));
    // @ts-ignore
    threeGeometry.vertices.push(new THREE.Vector3(0, -0.001, -0.1));
    // @ts-ignore
    threeGeometry.vertices.push(new THREE.Vector3(0.001, 0, -0.1));
    // @ts-ignore
    threeGeometry.vertices.push(new THREE.Vector3(-0.001, 0, -0.1));
    // @ts-ignore
    threeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    // @ts-ignore
    threeCrosshair = new THREE.LineSegments(threeGeometry, threeMaterial);
    threeCamera.add(threeCrosshair);
    // raycaster
    // @ts-ignore
    threeRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);
    // renderer
    // @ts-ignore
    threeRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('my_canvas') });
    threeRenderer.setClearColor(0xf0f3f4);
    generateBlocks(rackBlocks, "rack", false);
    generateBlocks(sceneBlocks, "scene", false);
    generateBlocks(mountBlocks, "mount", true);
    generateBlocks(emptyBlocks, "empty", false);
    rackDropDown();
    mountDropDown();
    rendererResize();
}
function animate() {
    var blue;
    var closestDistance = -1;
    var currentBlockType = "";
    var delta;
    var fpsOutput;
    var green;
    var previousBlockType = "";
    var targetDarkness = 0.8;
    var threeClosest;
    var threeIntersects;
    var time;
    var red;
    // @ts-ignore
    var threeCameraPostion = new THREE.Vector3();
    // @ts-ignore
    var threeCameraDirection = new THREE.Vector3();
    requestAnimationFrame(animate);
    if (controlsEnabled) {
        threeCamera.getWorldPosition(threeCameraPostion);
        threeCamera.getWorldDirection(threeCameraDirection);
        threeRaycaster.set(threeCameraPostion, threeCameraDirection);
        threeIntersects = threeRaycaster.intersectObjects(threeScene.children);
        if (threeIntersects.length > 0) {
            for (var i = 0; i < threeIntersects.length; i++) {
                if (threeIntersects[i].object.type == 'Mesh') {
                    if (closestDistance == -1) {
                        closestDistance = threeIntersects[i].distance;
                        threeClosest = threeIntersects[i];
                    }
                    else {
                        if (threeIntersects[i].distance < closestDistance) {
                            closestDistance = threeIntersects[i].distance;
                            threeClosest = threeIntersects[i];
                        }
                    }
                }
            }
        }
        if (closestDistance != -1) {
            // check if the selected block has changed
            if (threeClosest.object.name != selectedBlock) {
                if (selectedBlock) {
                    // unhighlight previous object
                    previousBlockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
                    if (previousBlockType == "mount") {
                        red = mountColor[selectedBlock][0];
                        green = mountColor[selectedBlock][1];
                        blue = mountColor[selectedBlock][2];
                        threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
                    }
                    if (previousBlockType == "rack") {
                        red = rackColor[selectedBlock][0];
                        green = rackColor[selectedBlock][1];
                        blue = rackColor[selectedBlock][2];
                        threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
                    }
                    if (previousBlockType == "empty") {
                        threeScene.getObjectByName(selectedBlock).material.color.setRGB(0.5, 0.5, 0.5);
                    }
                }
                selectedBlock = threeClosest.object.name;
            }
            // highlight the selected block
            currentBlockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
            if (currentBlockType == "mount") {
                red = mountColor[selectedBlock][0] * targetDarkness;
                green = mountColor[selectedBlock][1] * targetDarkness;
                blue = mountColor[selectedBlock][2] * targetDarkness;
                threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
            }
            if (currentBlockType == "rack") {
                red = rackColor[selectedBlock][0] * targetDarkness;
                green = rackColor[selectedBlock][1] * targetDarkness;
                blue = rackColor[selectedBlock][2] * targetDarkness;
                threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
            }
            if (currentBlockType == "empty") {
                threeScene.getObjectByName(selectedBlock).material.color.setRGB(0.3, 0.3, 0.3);
            }
        }
        // movement
        time = performance.now();
        delta = (time - prevTime);
        fpsOutput = document.getElementById("fps");
        if (fpsOutput) {
            fpsOutput.innerText = "FPS: " + Math.floor(1000 / delta);
        }
        if (speedBoost) {
            delta = delta * 5 / 1000;
        }
        else {
            delta = delta / 1000;
        }
        threeVelocity.x = 0;
        threeVelocity.z = 0;
        if (moveForward)
            threeVelocity.z = -speed * delta;
        if (moveBackward)
            threeVelocity.z = speed * delta;
        if (moveLeft)
            threeVelocity.x = -speed * delta;
        if (moveRight)
            threeVelocity.x = speed * delta;
        threeControls.getObject().translateX(threeVelocity.x);
        threeControls.getObject().translateZ(threeVelocity.z);
        if (moveDown) {
            threeControls.getObject().position.y -= (speed * delta);
        }
        if (moveUp) {
            threeControls.getObject().position.y += (speed * delta);
        }
        // minimum height
        if (threeControls.getObject().position.y < 1.8) {
            threeControls.getObject().position.y = 1.8;
        }
        prevTime = time;
    }
    threeRenderer.render(threeScene, threeCamera);
}
function rendererResize() {
    var divTop;
    var divMyCanvas;
    var divGhost;
    var divLower;
    var canvasWidth = window.innerWidth - 4;
    var canvasHeight = window.innerHeight - 4;
    var topHeight = 40;
    var lowerHeight = 68;
    var centerHeight = canvasHeight - topHeight - lowerHeight;
    divTop = document.getElementById("top");
    if (divTop) {
        divTop.style.position = 'absolute';
        divTop.style.left = "0px";
        divTop.style.top = "0px";
        divTop.style.width = canvasWidth + "px";
        divTop.style.height = topHeight + "px";
    }
    divMyCanvas = document.getElementById("my_canvas");
    if (divMyCanvas) {
        divMyCanvas.style.position = 'absolute';
        divMyCanvas.style.left = "0px";
        divMyCanvas.style.top = topHeight + "px";
        divMyCanvas.style.width = canvasWidth + "px";
        divMyCanvas.style.height = centerHeight + "px";
    }
    divGhost = document.getElementById("ghost");
    if (divGhost) {
        divGhost.style.position = 'absolute';
        divGhost.style.left = "0px";
        divGhost.style.top = topHeight + "px";
        divGhost.style.width = canvasWidth + "px";
        divGhost.style.height = centerHeight + "px";
    }
    divLower = document.getElementById("lower");
    if (divLower) {
        divLower.style.position = 'absolute';
        divLower.style.left = "0px";
        divLower.style.top = topHeight + centerHeight + "px";
        divLower.style.width = canvasWidth + "px";
        divLower.style.height = lowerHeight + "px";
        divLower.style.overflow = 'auto';
    }
    if (threeCamera) {
        threeCamera.aspect = canvasWidth / centerHeight;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(canvasWidth, centerHeight);
    }
}
function generateBlocks(inputData, blockType, highlightable) {
    var gameXLocation = 0;
    var gameYLocation = 0;
    var gameZLocation = 0;
    var gameXDimension = 0;
    var gameYDimension = 0;
    var gameZDimension = 0;
    var threeEdges;
    var threeGeometry;
    var threeMaterial;
    var threeMesh;
    var threeLine;
    Object.keys(inputData).forEach(function (blockName) {
        // translate from blender xyz to game xyz
        gameXLocation = parseFloat(inputData[blockName]['y_location']);
        gameYLocation = parseFloat(inputData[blockName]['z_location']);
        gameZLocation = parseFloat(inputData[blockName]['x_location']);
        gameXDimension = parseFloat(inputData[blockName]['y_dimension']);
        gameYDimension = parseFloat(inputData[blockName]['z_dimension']);
        gameZDimension = parseFloat(inputData[blockName]['x_dimension']);
        // @ts-ignore
        threeGeometry = new THREE.BoxGeometry(gameXDimension, gameYDimension, gameZDimension);
        // @ts-ignore
        threeMaterial = new THREE.MeshStandardMaterial();
        threeMaterial.color.setRGB(inputData[blockName]['rgb_block_red'], inputData[blockName]['rgb_block_green'], inputData[blockName]['rgb_block_blue']);
        // @ts-ignore
        threeMesh = new THREE.Mesh(threeGeometry, threeMaterial);
        threeMesh.position.x = gameXLocation;
        threeMesh.position.y = gameYLocation;
        threeMesh.position.z = gameZLocation;
        threeMesh.name = blockName;
        threeMesh.userData.blockType = blockType;
        threeMesh.userData.highlightable = highlightable;
        threeScene.add(threeMesh);
        if (inputData[blockName]["draw_lines"] == 1) {
            // @ts-ignore
            threeEdges = new THREE.EdgesGeometry(threeGeometry);
            // @ts-ignore
            threeMaterial = new THREE.LineBasicMaterial();
            threeMaterial.color.setRGB(inputData[blockName]['rgb_line_red'], inputData[blockName]['rgb_line_green'], inputData[blockName]['rgb_line_blue']);
            // @ts-ignore
            threeLine = new THREE.LineSegments(threeEdges, threeMaterial);
            threeMesh.add(threeLine);
        }
    });
}
function applyColor(inputData, inputColor) {
    var red = 1;
    var green = 1;
    var blue = 1;
    var threeTarget;
    Object.keys(inputData).forEach(function (blockName) {
        if (inputColor.hasOwnProperty(blockName)) {
            red = inputColor[blockName][0];
            green = inputColor[blockName][1];
            blue = inputColor[blockName][2];
            threeTarget = threeScene.getObjectByName(blockName);
            threeTarget.material.color.setRGB(red, green, blue);
        }
    });
}
function onKeyDown(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true;
            break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 16: // left shift
            moveDown = true;
            break;
        case 32: // space
            moveUp = true;
            break;
        case 69: // e
            speedBoost = true;
            break;
        case 80: // p
            cameraPositionRotation();
            break;
    }
}
function onKeyUp(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
        case 16: // left shift
            moveDown = false;
            break;
        case 32: // space
            moveUp = false;
            break;
        case 69: // e
            speedBoost = false;
            break;
    }
}
function generateRackFilter() {
    var rackEnvironmentElement = document.getElementById('rackFilter');
    var optionElement;
    var rackEnvironmentList = [];
    Object.keys(rackData).forEach(function (rackName) {
        if (rackEnvironmentList.indexOf(rackData[rackName]['u_environment']) < 0) {
            rackEnvironmentList.push(rackData[rackName]['u_environment']);
        }
    });
    rackEnvironmentList.sort();
    rackEnvironmentList.forEach(function (group) {
        optionElement = document.createElement('option');
        optionElement.text = group;
        optionElement.value = group;
        rackEnvironmentElement.add(optionElement);
    });
}
function generatemountFilter() {
    var mountFilterElement = document.getElementById('mountFilter');
    var optionElement;
    var supportGroupList = [];
    Object.keys(mountData).forEach(function (blockName) {
        if (supportGroupList.indexOf(mountData[blockName]['support_group_name']) < 0) {
            supportGroupList.push(mountData[blockName]['support_group_name']);
        }
    });
    supportGroupList.sort();
    supportGroupList.forEach(function (group) {
        optionElement = document.createElement('option');
        optionElement.text = group;
        optionElement.value = group;
        mountFilterElement.add(optionElement);
    });
}
function rackDropDown() {
    var overlayElement = document.getElementById('rackOverlay');
    var overlayValue = overlayElement.value;
    if (overlayValue == 'default') {
        overlayRackDefault(rackData);
    }
    if (overlayValue == 'power') {
        overlayRackPower(rackData);
    }
    if (overlayValue == 'rackCapacity') {
        overlayRackCapacity(rackData);
    }
}
function overlayRackDefault(rackData) {
    var rackEnvironmentElement = document.getElementById('rackFilter');
    var rackEnvironmentValue = rackEnvironmentElement.value;
    var color = [];
    Object.keys(rackData).forEach(function (rackName) {
        color = [1, 1, 1];
        if (rackEnvironmentValue == 'all' || rackEnvironmentValue == rackData[rackName]["u_environment"]) {
            rackColor[rackName] = [1, 1, 1];
        }
    });
    applyColor(rackData, rackColor);
}
function overlayRackPower(rackData) {
    var rackEnvironmentElement = document.getElementById('rackFilter');
    var rackEnvironmentValue = rackEnvironmentElement.value;
    var color = [];
    Object.keys(rackData).forEach(function (rackName) {
        color = [1, 1, 1];
        if (rackEnvironmentValue == 'all' || rackEnvironmentValue == rackData[rackName]["u_environment"]) {
            if (rackData[rackName]["u_equip_kw_consume_design"] > -1) {
                color = spectrumGreenRed(rackData[rackName]["u_equip_kw_consume_design"], rackData[rackName]["u_equip_design_kw"]);
            }
            else {
                color = [0.8, 0.8, 0.8];
            }
        }
        rackColor[rackName] = color;
    });
    applyColor(rackData, rackColor);
}
function overlayRackCapacity(rackData) {
    var rackEnvironmentElement = document.getElementById('rackFilter');
    var rackEnvironmentValue = rackEnvironmentElement.value;
    var color = [];
    Object.keys(rackData).forEach(function (rackName) {
        color = [1, 1, 1];
        if (rackEnvironmentValue == 'all' || rackEnvironmentValue == rackData[rackName]["u_environment"]) {
            if (rackData[rackName]["u_max_alloc"] > 0) {
                if (rackData[rackName]["u_qty_alloc"] > 0) {
                    color = spectrumGreenRed(rackData[rackName]["u_qty_alloc"], rackData[rackName]["u_max_alloc"]);
                }
                else {
                    color = spectrumGreenRed(0, 1);
                }
            }
            else {
                color = [0.8, 0.8, 0.8];
            }
        }
        rackColor[rackName] = color;
    });
    applyColor(rackData, rackColor);
}
function mountDropDown() {
    var overlayElement = document.getElementById('mountOverlay');
    var overlayValue = overlayElement.value;
    if (overlayValue == 'default') {
        overlaymountDefault();
    }
    if (overlayValue == 'objectModelCategory') {
        overlayMountModelCategory();
    }
    if (overlayValue == 'objectLastAudit') {
        overlayMountLastAudit();
    }
}
function overlaymountDefault() {
    var supportGroupElement = document.getElementById('mountFilter');
    var supportGroupValue = supportGroupElement.value;
    var color = [];
    Object.keys(mountData).forEach(function (blockName) {
        color = [1, 1, 1];
        if (supportGroupValue == 'all' || supportGroupValue == mountData[blockName]['support_group_name']) {
            if (!mountData[blockName]['ci_name']) {
                color = [1, 0.5, 0];
            }
            if (mountData[blockName]['collision']) {
                color = [1, 0, 0];
            }
        }
        mountColor[blockName] = color;
    });
    applyColor(mountData, mountColor);
}
function overlayMountModelCategory() {
    var supportGroupElement = document.getElementById('mountFilter');
    var supportGroupValue = supportGroupElement.value;
    var color = [];
    // hue 40 sat 40 val 100/60
    var colorStorage = [1.0, 0.867, 0.6];
    // hue 120 sat 40 val 100/60
    var colorNetwork = [0.6, 1.0, 0.6];
    // hue 200 sat 40 val 100/60
    var colorServer = [0.6, 0.867, 1.0];
    // hue 280 sat 40 val 100/60
    var colorOther = [0.867, 0.6, 1.0];
    var colorChart = {
        "IP Firewall": colorNetwork,
        "IP Router": colorNetwork,
        "IP Switch": colorNetwork,
        "Router": colorNetwork,
        "Network Gear": colorNetwork,
        "Out of Band Device": colorNetwork,
        "Linux Server": colorServer,
        "Server": colorServer,
        "Server Chassis": colorServer,
        "Windows Server": colorServer,
        "Storage Device": colorStorage,
        "Storage Server": colorStorage,
        "Storage Shelf": colorStorage,
        "UPS": colorOther,
        "PDU": colorOther
    };
    Object.keys(mountData).forEach(function (blockName) {
        color = [1, 1, 1];
        if (supportGroupValue == 'all' || supportGroupValue == mountData[blockName]['support_group_name']) {
            if (mountData[blockName]['model_category_name'] in colorChart) {
                color = colorChart[mountData[blockName]['model_category_name']];
            }
        }
        mountColor[blockName] = color;
    });
    applyColor(mountData, mountColor);
}
function overlayMountLastAudit() {
    var supportGroupElement = document.getElementById('mountFilter');
    var supportGroupValue = supportGroupElement.value;
    var color = [];
    var now = Date.now();
    var lastAudit = 0;
    // 2 yeasr * 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds;
    var milliseconds = 63072000000;
    Object.keys(mountData).forEach(function (blockName) {
        color = [1, 1, 1];
        if (supportGroupValue == 'all' || supportGroupValue == mountData[blockName]['support_group_name']) {
            if (mountData[blockName]['u_last_audit_date']) {
                lastAudit = Date.parse(mountData[blockName]['u_last_audit_date']);
                color = spectrumGreenRed((now - lastAudit), milliseconds);
            }
            else {
                color = spectrumGreenRed(1, 1);
            }
        }
        mountColor[blockName] = color;
    });
    applyColor(mountData, mountColor);
}
function spectrumGreenRed(numerator, denominator) {
    var decimal = 0;
    var saturation = 0.3;
    var red = 0;
    var green = 0;
    var blue = 0;
    decimal = numerator / denominator;
    if (denominator == 0) {
        decimal = 1;
    }
    if (decimal < 0.0) {
        decimal = 0.0;
    }
    if (decimal > 1.0) {
        decimal = 1.0;
    }
    // green to yellow
    if (decimal < 0.5) {
        red = (1 - saturation) + (decimal / 0.5 * saturation);
        green = 1;
        blue = (1 - saturation);
    }
    // yellow to red
    if (decimal >= 0.5) {
        red = 1;
        green = (1 - saturation) + (saturation - ((decimal - 0.5) / 0.5) * saturation);
        blue = (1 - saturation);
    }
    // max or over, hard red
    if (decimal >= 1.0) {
        red = 1;
        green = 0;
        blue = 0;
    }
    return [red, green, blue];
}
function spectrumBluePink(numerator, denominator) {
    var decimal = 0;
    var saturation = 0.3;
    var red;
    var green;
    var blue;
    decimal = numerator / denominator;
    if (denominator == 0) {
        decimal = 1;
    }
    if (decimal < 0.0) {
        decimal = 0.0;
    }
    if (decimal > 1.0) {
        decimal = 1.0;
    }
    red = (1 - saturation) + (decimal * saturation);
    green = (1 - saturation);
    blue = 1;
    return [red, green, blue];
}
function cameraPositionRotation() {
    var lower = document.getElementById("lower");
    if (lower) {
        var camXPos = threeControls.getObject().position.x.toFixed(3);
        var camYPos = threeControls.getObject().position.y.toFixed(3);
        var camZPos = threeControls.getObject().position.z.toFixed(3);
        var camXRot = threeCamera.rotation.x.toFixed(3);
        var camYRot = threeCamera.rotation.y.toFixed(3);
        var camZRot = threeCamera.rotation.z.toFixed(3);
        while (lower.firstChild) {
            lower.removeChild(lower.firstChild);
        }
        lower.innerText = "Camera: [" + camXPos + ", " + camYPos + ", " + camZPos + ", " + camXRot + ", " + camYRot + ", " + camZRot + "]";
    }
}
function exportBlocks(input, blockType) {
    var jsonData;
    var filename;
    var encodedData;
    var download;
    var output = {};
    Object.keys(input).forEach(function (blockName) {
        output[blockName] = {
            "x_location": input[blockName]['x_location'],
            "y_location": input[blockName]['y_location'],
            "z_location": input[blockName]['z_location'],
            "x_dimension": input[blockName]['x_dimension'],
            "y_dimension": input[blockName]['y_dimension'],
            "z_dimension": input[blockName]['z_dimension'],
            "rgb_block_red": input[blockName]['rgb_block_red'],
            "rgb_block_green": input[blockName]['rgb_block_green'],
            "rgb_block_blue": input[blockName]['rgb_block_blue'],
            "draw_lines": input[blockName]['draw_lines'],
            "rgb_line_red": input[blockName]['rgb_line_red'],
            "rgb_line_green": input[blockName]['rgb_line_green'],
            "rgb_line_blue": input[blockName]['rgb_line_blue']
        };
    });
    jsonData = JSON.stringify(output, null, 2);
    //filename = allData["room"]["room_name"] + '_' + blockType + '.json';
    filename = "test.json";
    encodedData = 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonData);
    download = document.createElement('a');
    download.setAttribute('href', encodedData);
    download.setAttribute('download', filename);
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
}
function urlParamMissingWarning() {
    var errorMessage;
    errorMessage = "This page requires a room sysid.<br />";
    errorMessage += "Like this...<br />";
    errorMessage += "dcse_3d_room%26sysid%3D99dcf36a2b45820054a41bc5a8da1596";
    // @ts-ignore
    spUtil.addErrorMessage(errorMessage);
}
function pointerLockRequest() {
    var element = document.body;
    // @ts-ignore
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
}
function pointerlockchange() {
    // @ts-ignore
    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
        controlsEnabled = true;
        moveForward = false;
        moveBackward = false;
        moveLeft = false;
        moveRight = false;
        moveUp = false;
        moveDown = false;
        prevTime = performance.now();
        document.addEventListener('click', mouseClick, false);
    }
    else {
        document.removeEventListener('click', mouseClick, false);
        controlsEnabled = false;
    }
}
// menu //////////////////////////////////////////////////////////////////////////
function mouseClick(event) {
    if (event.button == 2) {
        mouseMenu(event);
    }
}
function mouseMenu(event) {
    var button;
    var blockType;
    var htmlElement;
    var addButton = function (title, id, className) {
        htmlElement = document.getElementById('ghost');
        if (htmlElement) {
            button = document.createElement("BUTTON");
            button.id = id;
            button.className = className;
            button.innerHTML = title;
            htmlElement.appendChild(button);
        }
    };
    blockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
    if (blockType == "mount") {
        addButton('Open Asset Record', 'openAssetRecord', 'btn-group-green');
        htmlElement = document.getElementById('openAssetRecord');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Open Asset Record', 'openAssetRecord', 'btn-group-grey');
    }
    if (blockType == "mount") {
        addButton('Open CI Record', 'openCiRecord', 'btn-group-green');
        htmlElement = document.getElementById('openCiRecord');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Open CI Record', 'openCiRecord', 'btn-group-grey');
    }
    if (blockType == "rack") {
        addButton('Rack visualisation', 'rackVisual', 'btn-group-green');
        htmlElement = document.getElementById('rackVisual');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Rack visualisation', 'rackVisual', 'btn-group-grey');
    }
    if (blockType == "mount") {
        addButton('Reboot Server', 'rebootServer', 'btn-group-green');
        htmlElement = document.getElementById('rebootServer');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Reboot Server', 'rebootServer', 'btn-group-grey');
    }
    if (blockType == "mount") {
        addButton('Request Provisioning', 'requestProvisioning', 'btn-group-green');
        htmlElement = document.getElementById('requestProvisioning');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Request Provisioning', 'requestProvisioning', 'btn-group-grey');
    }
    if (blockType == "mount") {
        addButton('Request Smarthands Support', 'requestSmarthandsSupport', 'btn-group-green');
        htmlElement = document.getElementById('requestSmarthandsSupport');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Request Smarthands Support', 'requestSmarthandsSupport', 'btn-group-grey');
    }
    if (blockType == "empty") {
        addButton('Reserve Space', 'reserveSpace', 'btn-group-green');
        htmlElement = document.getElementById('reserveSpace');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Reserve Space', 'reserveSpace', 'btn-group-grey');
    }
    if (blockType == "mount") {
        addButton('Run QA Test Suite', 'runQaTestSuite', 'btn-group-green');
        htmlElement = document.getElementById('runQaTestSuite');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Run QA Test Suite', 'runQaTestSuite', 'btn-group-grey');
    }
    if (blockType == "mount") {
        addButton('Wipe Drive', 'wipeDrive', 'btn-group-green');
        htmlElement = document.getElementById('wipeDrive');
        if (htmlElement) {
            htmlElement.addEventListener('click', onScreeMenuStop, false);
        }
    }
    else {
        addButton('Wipe Drive', 'wipeDrive', 'btn-group-grey');
    }
    // block download
    addButton('Download blocks', 'downloadBlocks', 'btn-group-green');
    htmlElement = document.getElementById('downloadBlocks');
    if (htmlElement) {
        htmlElement.addEventListener('click', subMenuDownloadBlocks, false);
    }
    // cancel
    addButton('Cancel', 'cancel', 'btn-group-green');
    htmlElement = document.getElementById('cancel');
    if (htmlElement) {
        htmlElement.addEventListener('click', onScreeMenuStop, false);
    }
    onScreenMenuStart();
}
function subMenuDownloadBlocks() {
    var button;
    var htmlElement;
    var ghost;
    // clear main menu
    ghost = document.getElementById("ghost");
    if (ghost) {
        while (ghost.firstChild) {
            ghost.removeChild(ghost.firstChild);
        }
        var addButton = function (title, id, className) {
            htmlElement = document.getElementById('ghost');
            if (htmlElement) {
                button = document.createElement("BUTTON");
                button.id = id;
                button.className = className;
                button.innerHTML = title;
                htmlElement.appendChild(button);
            }
        };
        addButton('Download scene blocks', 'downloadSceneBlocks', 'btn-group-green');
        htmlElement = document.getElementById('downloadSceneBlocks');
        if (htmlElement) {
            htmlElement.addEventListener('click', function () {
                exportBlocks(mountBlocks, "scene");
                onScreeMenuStop();
            }, false);
        }
        addButton('Download rack blocks', 'downloadRackBlocks', 'btn-group-green');
        htmlElement = document.getElementById('downloadRackBlocks');
        if (htmlElement) {
            htmlElement.addEventListener('click', function () {
                exportBlocks(rackBlocks, "racks");
                onScreeMenuStop();
            }, false);
        }
    }
}
function onScreenMenuStart() {
    var ghost;
    ghost = document.getElementById("ghost");
    if (ghost) {
        ghost.removeEventListener('click', pointerLockRequest, false);
    }
    document.exitPointerLock();
}
function onScreeMenuStop() {
    var ghost;
    ghost = document.getElementById("ghost");
    if (ghost) {
        while (ghost.firstChild) {
            ghost.removeChild(ghost.firstChild);
        }
        ghost.addEventListener('click', pointerLockRequest, false);
    }
}
// fake datacenter ////////////////////////////////////////////////////////////////////////////////////
function fakeScene(roomXDimension, roomYDimension) {
    var scene = {};
    scene["floor"] = {
        "draw_lines": 0,
        "rgb_block_red": "0.8",
        "rgb_block_green": "0.8",
        "rgb_block_blue": "0.8",
        "rgb_line_red": "0.0",
        "rgb_line_green": "0.0",
        "rgb_line_blue": "0.0",
        "x_location": (roomXDimension * 0.5).toString(),
        "y_location": (roomYDimension * 0.5).toString(),
        "z_location": "-0.1",
        "x_dimension": roomXDimension.toString(),
        "y_dimension": roomYDimension.toString(),
        "z_dimension": "0.2"
    };
    scene["x_min_wall"] = {
        "draw_lines": 0,
        "rgb_block_red": "0.850",
        "rgb_block_green": "0.850",
        "rgb_block_blue": "0.850",
        "rgb_line_red": "0.000",
        "rgb_line_green": "0.000",
        "rgb_line_blue": "0.000",
        "x_location": "-0.100",
        "y_location": (roomYDimension * 0.5).toString(),
        "z_location": "1.500",
        "x_dimension": "0.200",
        "y_dimension": roomYDimension.toString(),
        "z_dimension": "3.000"
    };
    scene["x_max_wall"] = {
        "draw_lines": 0,
        "rgb_block_red": "0.850",
        "rgb_block_green": "0.850",
        "rgb_block_blue": "0.850",
        "rgb_line_red": "0.000",
        "rgb_line_green": "0.000",
        "rgb_line_blue": "0.000",
        "x_location": (roomXDimension + 0.1).toString(),
        "y_location": (roomYDimension * 0.5).toString(),
        "z_location": "1.500",
        "x_dimension": "0.200",
        "y_dimension": roomYDimension.toString(),
        "z_dimension": "3.000"
    };
    scene["y_min_wall"] = {
        "draw_lines": 0,
        "rgb_block_red": "0.750",
        "rgb_block_green": "0.750",
        "rgb_block_blue": "0.750",
        "rgb_line_red": "0.000",
        "rgb_line_green": "0.000",
        "rgb_line_blue": "0.000",
        "x_location": (roomXDimension * 0.5).toString(),
        "y_location": "-0.100",
        "z_location": "1.500",
        "x_dimension": roomXDimension.toString(),
        "y_dimension": "0.200",
        "z_dimension": "3.000"
    };
    scene["y_max_wall"] = {
        "draw_lines": 0,
        "rgb_block_red": "0.750",
        "rgb_block_green": "0.750",
        "rgb_block_blue": "0.750",
        "rgb_line_red": "0.000",
        "rgb_line_green": "0.000",
        "rgb_line_blue": "0.000",
        "x_location": (roomXDimension * 0.5).toString(),
        "y_location": (roomYDimension + 0.1).toString(),
        "z_location": "1.500",
        "x_dimension": roomXDimension.toString(),
        "y_dimension": "0.200",
        "z_dimension": "3.000"
    };
    return scene;
}
function fakeEmpty(tempRackBlock) {
    var emptyCount = 0;
    var emptyName;
    var tempEmptyBlocks = {};
    var unitCount;
    var unitHeight = 0.0445;
    var xDimension = 0;
    var xLocation = 0;
    var yDimension = 0;
    var yLocation = 0;
    var zDimension = 0;
    var zLocation = 0;
    var zLoop = 0;
    var zStart = 0;
    Object.keys(tempRackBlock).forEach(function (rackName) {
        if (rackData[rackName]["facing"] == 0) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]) - (parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.5) - 0.002;
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]);
            xDimension = 0.002;
            yDimension = parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.9;
        }
        if (rackData[rackName]["facing"] == 1) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]);
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]) + (parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.5) + 0.002;
            xDimension = parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.9;
            yDimension = 0.002;
        }
        if (rackData[rackName]["facing"] == 2) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]) + (parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.5) + 0.002;
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]);
            xDimension = 0.002;
            yDimension = parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.9;
        }
        if (rackData[rackName]["facing"] == 3) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]);
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]) - (parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.5) - 0.002;
            xDimension = parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.9;
            yDimension = 0.002;
        }
        zStart = parseFloat(rackBlocks[rackName]["z_location"]) - (parseFloat(rackBlocks[rackName]["z_dimension"]) * 0.5) + (unitHeight * 2);
        for (zLoop = 0; zLoop < 11; zLoop++) {
            unitCount = 39 + zLoop;
            zDimension = unitHeight;
            zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 0.5);
            emptyName = "empty_" + emptyCount;
            tempEmptyBlocks[emptyName] = {
                "draw_lines": 1,
                "rgb_block_red": "0.5",
                "rgb_block_green": "0.5",
                "rgb_block_blue": "0.5",
                "rgb_line_red": "1.0",
                "rgb_line_green": "1.0",
                "rgb_line_blue": "1.0",
                "x_location": xLocation.toFixed(3),
                "y_location": yLocation.toFixed(3),
                "z_location": zLocation.toFixed(3),
                "x_dimension": xDimension.toFixed(3),
                "y_dimension": yDimension.toFixed(3),
                "z_dimension": zDimension.toFixed(3)
            };
            emptyCount += 1;
        }
    });
    return tempEmptyBlocks;
}
function randomEnvironment() {
    var dice = Math.floor(Math.random() * 6);
    var environmentList = ["environment1", "environment2", "environment3", "environment4", "environment5", "environment6"];
    return environmentList[dice];
}
function randomSupportGroup() {
    var dice = Math.floor(Math.random() * 3);
    var supportGroupList = ["team1", "team2", "team3"];
    return supportGroupList[dice];
}
function fakeRacks(rowMax, rackMax) {
    var facing = 0;
    var rackCount = 0;
    var tempRackData = {};
    var tempRackBlocks = {};
    var rackName;
    var rackPower;
    var xloop;
    var yloop;
    for (yloop = 0; yloop < rowMax; yloop++) {
        for (xloop = 0; xloop < rackMax; xloop++) {
            if (yloop % 2 == 0) {
                facing = 1;
            }
            else {
                facing = 3;
            }
            rackName = "rack_" + yloop + "_" + xloop;
            tempRackBlocks[rackName] = {
                "draw_lines": 1,
                "rgb_block_red": "1.0",
                "rgb_block_green": "1.0",
                "rgb_block_blue": "1.0",
                "rgb_line_red": "0.5",
                "rgb_line_green": "0.5",
                "rgb_line_blue": "0.5",
                "x_location": (4 + 0.3 + (xloop * 0.6)).toString(),
                "y_location": (4 + 1.2 + (yloop * 2.4)).toString(),
                "z_location": "1.2",
                "x_dimension": "0.58",
                "y_dimension": "1.2",
                "z_dimension": "2.4"
            };
            rackPower = Math.floor(Math.random() * 21);
            tempRackData[rackName] = {
                "id": rackCount.toString(),
                "facing": facing,
                "rack_units": 50,
                "u_allocated_kw": 0,
                "u_environment": randomEnvironment(),
                "u_equip_design_kw": 20,
                "u_equip_kw_consume_design": rackPower,
                "u_facil_design_kw": 0,
                "u_max_alloc": 10,
                "u_qty_alloc": xloop % 10,
                "u_rack_state": "Landed"
            };
            rackCount++;
        }
    }
    return { tempRackData: tempRackData, tempRackBlocks: tempRackBlocks };
}
function fakeMount(rackData, rackBlocks) {
    var ciName;
    var collision;
    var fakedates;
    var mountCount = 0;
    var mountName = "";
    var tempMountBlock = {};
    var tempMountData = {};
    var unitCount;
    var unitHeight = 0.0445;
    var xDimension = 0;
    var xLocation = 0;
    var yDimension = 0;
    var yLocation = 0;
    var zDimension = 0;
    var zLocation = 0;
    var zLoop;
    var zStart = 0;
    fakedates = ['2018-07-25 04:21:00', '2019-01-25 04:21:00', '2019-07-25 04:21:00', '2020-01-25 04:21:00', '2020-07-25 04:21:00'];
    Object.keys(rackData).forEach(function (rackName) {
        if (rackData[rackName]["facing"] == 0) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]) - (parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.5) - 0.009;
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]);
            xDimension = 0.016;
            yDimension = parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.9;
        }
        if (rackData[rackName]["facing"] == 1) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]);
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]) + (parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.5) + 0.009;
            xDimension = parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.9;
            yDimension = 0.016;
        }
        if (rackData[rackName]["facing"] == 2) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]) + (parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.5) + 0.009;
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]);
            xDimension = 0.016;
            yDimension = parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.9;
        }
        if (rackData[rackName]["facing"] == 3) {
            xLocation = parseFloat(rackBlocks[rackName]["x_location"]);
            yLocation = parseFloat(rackBlocks[rackName]["y_location"]) - (parseFloat(rackBlocks[rackName]["y_dimension"]) * 0.5) - 0.009;
            xDimension = parseFloat(rackBlocks[rackName]["x_dimension"]) * 0.9;
            yDimension = 0.016;
        }
        zStart = parseFloat(rackBlocks[rackName]["z_location"]) - (parseFloat(rackBlocks[rackName]["z_dimension"]) * 0.5) + (unitHeight * 2);
        for (zLoop = 0; zLoop < 10; zLoop++) {
            unitCount = (zLoop * 2);
            zDimension = (unitHeight * 2) - 0.002;
            zLocation = zStart + (unitCount * unitHeight) + unitHeight;
            mountName = "server_" + mountCount;
            ciName = "fake";
            if (Math.random() > 0.95) {
                ciName = "";
            }
            collision = 0;
            if (Math.random() > 0.95) {
                collision = 1;
            }
            tempMountData[mountName] = {
                "ci_name": ciName,
                "ci_sys_id": mountCount.toString(),
                "collision": collision,
                "model_category_name": "Server",
                "model_rack_units": 1,
                "rack_name": rackName,
                "rack_u": unitCount,
                "support_group_name": randomSupportGroup(),
                "u_last_audit_date": fakedates[Math.floor(Math.random() * 5)]
            };
            tempMountBlock[mountName] = {
                "draw_lines": 1,
                "rgb_block_red": "0.850",
                "rgb_block_green": "0.850",
                "rgb_block_blue": "0.850",
                "rgb_line_red": "0.500",
                "rgb_line_green": "0.500",
                "rgb_line_blue": "0.500",
                "x_location": xLocation.toFixed(3),
                "y_location": yLocation.toFixed(3),
                "z_location": zLocation.toFixed(3),
                "x_dimension": xDimension.toFixed(3),
                "y_dimension": yDimension.toFixed(3),
                "z_dimension": zDimension.toFixed(3)
            };
            mountCount += 1;
        }
        for (zLoop = 0; zLoop < 3; zLoop++) {
            unitCount = 20 + zLoop;
            zDimension = unitHeight - 0.002;
            zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 0.5);
            mountName = "network_" + mountCount;
            tempMountData[mountName] = {
                "ci_name": mountName,
                "ci_sys_id": mountCount.toString(),
                "collision": 0,
                "model_category_name": "Network Gear",
                "model_rack_units": 1,
                "rack_name": rackName,
                "rack_u": unitCount,
                "support_group_name": randomSupportGroup(),
                "u_last_audit_date": fakedates[Math.floor(Math.random() * 5)]
            };
            tempMountBlock[mountName] = {
                "draw_lines": 1,
                "rgb_block_red": "0.850",
                "rgb_block_green": "0.850",
                "rgb_block_blue": "0.850",
                "rgb_line_red": "0.500",
                "rgb_line_green": "0.500",
                "rgb_line_blue": "0.500",
                "x_location": xLocation.toFixed(3),
                "y_location": yLocation.toFixed(3),
                "z_location": zLocation.toFixed(3),
                "x_dimension": xDimension.toFixed(3),
                "y_dimension": yDimension.toFixed(3),
                "z_dimension": zDimension.toFixed(3)
            };
            mountCount += 1;
        }
        for (zLoop = 0; zLoop < 4; zLoop++) {
            unitCount = 23 + zLoop * 4;
            zDimension = (unitHeight * 4) - 0.002;
            zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 2);
            mountName = "server_" + mountCount;
            tempMountData[mountName] = {
                "ci_name": mountName,
                "ci_sys_id": mountCount.toString(),
                "collision": 0,
                "model_category_name": "Server",
                "model_rack_units": 1,
                "rack_name": rackName,
                "rack_u": unitCount,
                "support_group_name": randomSupportGroup(),
                "u_last_audit_date": fakedates[Math.floor(Math.random() * 5)]
            };
            tempMountBlock[mountName] = {
                "draw_lines": 1,
                "rgb_block_red": "0.850",
                "rgb_block_green": "0.850",
                "rgb_block_blue": "0.850",
                "rgb_line_red": "0.500",
                "rgb_line_green": "0.500",
                "rgb_line_blue": "0.500",
                "x_location": xLocation.toFixed(3),
                "y_location": yLocation.toFixed(3),
                "z_location": zLocation.toFixed(3),
                "x_dimension": xDimension.toFixed(3),
                "y_dimension": yDimension.toFixed(3),
                "z_dimension": zDimension.toFixed(3)
            };
            mountCount += 1;
        }
    });
    return { tempMountData: tempMountData, tempMountBlock: tempMountBlock };
}
