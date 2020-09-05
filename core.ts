  // @ts-ignore
  var allData = fakeAllData();
  // @ts-ignore
  var powerData = fakePower(allData);
  // test data
  powerData["rack_19_5"] = {
    "average": 1,
    "maximum": 1
  }
  allData["racks"]["rack_19_5"]["design"] = {
    "u_rack_state": "Landed",
    "u_max_alloc": 10,
    "u_qty_alloc": 12,
    "u_environment": -1,
    "u_allocated_kw": 0,
    "u_equip_kw_consume_design": 0,
    "u_equip_design_kw": 0,
    "u_facil_design_kw": 0
  }
  var anchor: HTMLAnchorElement;
  var controlsEnabled: boolean = false;
  var element: HTMLElement = document.body;
  var havePointerLock: boolean;
  var moveForward: boolean = false;
  var moveBackward: boolean = false;
  var moveLeft: boolean = false;
  var moveRight: boolean = false;
  var moveUp: boolean = false;
  var moveDown: boolean = false;
  var mountData: object = {};
  var mountColor: object = {};
  var prevTime: number;
  var rackColor: object = {};
  var raycaster: any;
  var renderer: any;
  var roomName: string = '';
  var roomSysid: string;
  var selectedBlock: string = "";
  var selectedPreviousName: string = "";
  var serverLink: any = this;
  var speed: number = 6;
  var speedBoost: boolean = false;
  var threeCamera: any;
  var threeControls: any;
  var threeScene: any;
  var titleText: Text;
  // @ts-ignore
  var velocity: any = new THREE.Vector3();
  //roomSysid = serverLink.data.roomSysid;
  rendererResize()
  window.addEventListener( 'resize', rendererResize, false );
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
      anchor = document.createElement('a');
      titleText = document.createTextNode(allData["room"]["room_name"]);
      anchor.appendChild(titleText);
      anchor.href = "/nav_to.do?uri=%2Fcmdb_ci_computer_room.do%3Fsys_id%3D" + roomSysid;
      document.getElementById('roomName').appendChild(anchor);
      havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
      if ( havePointerLock ) {
        document.addEventListener('pointerlockchange', pointerlockchange, false );
        document.addEventListener('mozpointerlockchange', pointerlockchange, false );
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false );
        document.getElementById('ghost').addEventListener( 'click', pointerLockRequest, false );
      } else {
        console.log('Your browser doesn\'t seem to support Pointer Lock API');
      }
      generateScene();
      animate();
    //});
  //}
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function download(data,filename){
    var jsonData: string;
    var encodedData: string;
    var download: HTMLAnchorElement;
    jsonData = JSON.stringify(data, null, null).replace(/(\r\n|\n|\r)/gm, "");
    encodedData = 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonData);
    download = document.createElement('a');
    download.setAttribute('href', encodedData );
    download.setAttribute('download', filename);
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }
  /**
   * @function urlParamMissingWarning
   * @description gives an explanation of how a rack sys_id needs to given as a url parameter
   */
  function urlParamMissingWarning() {
    var errorMessage: string;
    errorMessage = "This page requires a room sysid.<br />";
    errorMessage += "Like this...<br />";
    errorMessage += "dcse_3d_room%26sysid%3D99dcf36a2b45820054a41bc5a8da1596";
    // @ts-ignore
    spUtil.addErrorMessage(errorMessage);
  }
  /**
   * @function pointerLockRequest
   * @description attempts to lock the mouse pointer when the page is clicked
   */
  function pointerLockRequest(){
    var element: HTMLElement = document.body;
    // @ts-ignore
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();
  }
  /**
   * @function pointerlockchange
   * @description actions to take when the pointer is locked
   */
  function pointerlockchange(){
    // @ts-ignore
    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
      controlsEnabled = true;
      moveForward = false;
      moveBackward = false;
      moveLeft = false;
      moveRight = false;
      moveUp = false;
      moveDown = false;
      prevTime= performance.now();
      document.addEventListener( 'click', mouseClick, false);
      //document.addEventListener('mousewheel', mouseWheelZoom, false);
    } else {
      document.removeEventListener( 'click', mouseClick, false );
      //document.removeEventListener('mousewheel', mouseWheelZoom, false);
      controlsEnabled = false;
    }
  }
  /**
   * @function generateScene
   * @description generate everything in the 3D scene
   */
  function generateScene(){
    var speedElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('speed');
    // event listeners
    var threeGeometry: any;
    var threeMaterial: any;
    var threeCrosshair: any;
    document.getElementById('rackOverlay').addEventListener('change', rackDropDown, false);
    document.getElementById('rackFilter').addEventListener('change', rackDropDown, false);
    document.getElementById('mountOverlay').addEventListener('change', mountDropDown, false);
    document.getElementById('mountFilter').addEventListener('change', mountDropDown, false);
    //document.getElementById('exportScene').addEventListener('click', exportScene, false);
    document.getElementById("speed").addEventListener("change", function(){
      speed = parseFloat(speedElement.value);
    }, false);
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    // fill dropdowns
    generateRackFilter()
    generatemountFilter();
    // scene
    // @ts-ignore
    threeScene = new THREE.Scene();
    // light
    // @ts-ignore
    var light = new THREE.AmbientLight(0xffffff);
    threeScene.add( light );
    // camera
    // @ts-ignore
    threeCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
    // @ts-ignore
    threeControls = new THREE.PointerLockControls( threeCamera, document.body );
    threeControls.getObject().position.set(allData["camera"]["camera_position_x"],allData["camera"]["camera_position_y"],allData["camera"]["camera_position_z"]);
    threeControls.getObject().rotation.set(allData["camera"]["camera_rotation_x"],allData["camera"]["camera_rotation_y"],allData["camera"]["camera_rotation_z"]);
    threeScene.add(threeCamera);
    // threeCrosshair
    // @ts-ignore
    threeGeometry = new THREE.Geometry();
    // @ts-ignore
    threeGeometry.vertices.push( new THREE.Vector3( 0, 0.001, -0.1 ) );
    // @ts-ignore
    threeGeometry.vertices.push( new THREE.Vector3( 0, -0.001, -0.1 ) );
    // @ts-ignore
    threeGeometry.vertices.push( new THREE.Vector3( 0.001, 0, -0.1 ) );
    // @ts-ignore
    threeGeometry.vertices.push( new THREE.Vector3( -0.001, 0, -0.1 ) );
    // @ts-ignore
    threeMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
    // @ts-ignore
    threeCrosshair = new THREE.LineSegments( threeGeometry, threeMaterial );
    threeCamera.add(threeCrosshair);
    // raycaster
    // @ts-ignore
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 100 );
    // renderer
    // @ts-ignore
    renderer = new THREE.WebGLRenderer({antialias:true, canvas:document.getElementById('my_canvas')});
    renderer.setClearColor( 0xf0f3f4 );
    generateBlocks(allData["racks"],"rack",false)
    generateBlocks(allData["scene"],"scene",false)
    generateBlocks(allData["mount"],"mount",true)
    generateBlocks(allData["empty"],"empty",false)
    rackDropDown();
    mountDropDown();
    rendererResize();
  }
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function generateBlocks(inputData,blockType,highlightable){
    var block = {};
    var gameXLocation = 0;
    var gameYLocation = 0;
    var gameZLocation = 0;
    var gameXDimension = 0;
    var gameYDimension = 0;
    var gameZDimension = 0;
    var threeMaterial;
    var mesh;
    var line;
    Object.keys(inputData).forEach(function(blockName){
      block = inputData[blockName]["block"];
      // translate from blender xyz to game xyz
      gameXLocation = block['y_location'];
      gameYLocation = block['z_location'];
      gameZLocation = block['x_location'];
      gameXDimension = block['y_dimension']
      gameYDimension = block['z_dimension'];
      gameZDimension = block['x_dimension'];
      // @ts-ignore
      threeGeometry = new THREE.BoxGeometry(gameXDimension,gameYDimension,gameZDimension);
      // @ts-ignore
      threeMaterial = new THREE.MeshStandardMaterial();
      threeMaterial.color.setRGB(block['rgb_block_red'],block['rgb_block_green'],block['rgb_block_blue']);
      // @ts-ignore
      mesh = new THREE.Mesh(geometry,material);
      mesh.position.x = gameXLocation;
      mesh.position.y = gameYLocation;
      mesh.position.z = gameZLocation;
      mesh.name = blockName;
      mesh.userData.blockType = blockType;
      mesh.userData.highlightable = highlightable;
      threeScene.add(mesh);
      if (block["draw_lines"] == 1){
        // @ts-ignore
        edges = new THREE.EdgesGeometry( threeGeometry );
        // @ts-ignore
        threeMaterial = new THREE.LineBasicMaterial();
        threeMaterial.color.setRGB(block['rgb_line_red'],block['rgb_line_green'],block['rgb_line_blue']);
        // @ts-ignore
        line = new THREE.LineSegments(edges, threeMaterial);
        mesh.add(line);
      }
    });
  }
  /**
   * @function onKeyDown
   * @description associate actions with key presses
   */
  function onKeyDown(event){
    switch (event.keyCode){
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
        cameraPosRot();
        break;
    }
  };
  /**
   * @function onKeyUp
   * @description  associate actions with key releases
   */
  function onKeyUp(event){
    switch(event.keyCode){
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
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function cameraPosRot(){
    var lower = document.getElementById("lower");
    var camXPos = threeControls.getObject().position.x.toFixed(3);
    var camYPos = threeControls.getObject().position.y.toFixed(3);
    var camZPos = threeControls.getObject().position.z.toFixed(3);
    var camXRot = threeCamera.rotation.x.toFixed(3);
    var camYRot = threeCamera.rotation.y.toFixed(3);
    var camZRot = threeCamera.rotation.z.toFixed(3);
    while (lower.firstChild) {
      lower.removeChild(lower.lastChild);
    }
    lower.innerText = "Camera: [" + camXPos + ", " + camYPos + ", " + camZPos + ", " + camXRot + ", " + camYRot + ", " + camZRot + "]";
  }
  /**
   * @function applyColor
   * @description apply the colors in mountColor to the 3d blocks
   * @param {Array.<Object>} objectData - the 3d blocks
   * @param {Object} mountColor - the colors
   */
  function applyColor(inputData,inputColor){
    var red = 1;
    var green = 1;
    var blue = 1;
    var target;
    Object.keys(inputData).forEach(function(blockName){
      if (inputColor.hasOwnProperty(blockName)){
        red = inputColor[blockName][0];
        green = inputColor[blockName][1];
        blue = inputColor[blockName][2];
        target = threeScene.getObjectByName(blockName);
        target.material.color.setRGB(red,green,blue);
      }
    })
  }
  /**
   * @function generateRackFilter
   * @description fill the environment dropdown
   */
  function generateRackFilter(){
    var rackEnvironmentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('rackFilter');
    var optionElement;
    var rackEnvironmentList = [];
    Object.keys(allData["racks"]).forEach(function(rackName){
      if (rackEnvironmentList.indexOf(allData["racks"][rackName]["design"]['u_environment']) < 0){
        rackEnvironmentList.push(allData["racks"][rackName]["design"]['u_environment']);
      }
    });
    rackEnvironmentList.sort();
    rackEnvironmentList.forEach(function(group){
      optionElement = document.createElement('option');
      optionElement.text = group;
      optionElement.value = group;
      rackEnvironmentElement.add(optionElement);
    });
  }
  /**
   * @function generatemountFilter
   * @description fill the support group dropdown
   */
  function generatemountFilter(){
    var mountFilterElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountFilter');
    var optionElement;
    var supportGroupList = [];
    var mount = {};
    Object.keys(allData["mount"]).forEach(function(blockName){
      mount = allData["mount"][blockName];
      if (supportGroupList.indexOf(mount['support_group_name']) < 0){
        supportGroupList.push(mount['support_group_name']);
      }
    });
    supportGroupList.sort();
    supportGroupList.forEach(function(group){
      optionElement = document.createElement('option');
      optionElement.text = group;
      optionElement.value = group;
      mountFilterElement.add(optionElement);
    });
  }
  /**
   * @function rackDropDown
   * @description triggers overlays when dropdowns are changed
   */
  function rackDropDown(){
    var overlayElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountOverlay');
    var overlayValue = overlayElement.value;
    if (overlayValue == 'default'){
      overlayRackDefault();
    }
    if (overlayValue == 'Power'){
      overlayRackPower();
    }
    if (overlayValue == 'rackCapacity'){
      overlayRackCapacity();
    }
  }
  /**
   * @function overlayRackPower
   * @description pulls power data from the server and triggers visualisation
   * @param {string} visualisationType - either average or maximum
   */
  function overlayRackPower() {
    if (Object.keys(powerData["racks"]).length > 0) {
      powerRender(allData,powerData);
    } else {
      serverLink.data.roomName = roomName;
      serverLink.data.getPower = true;
      serverLink.server.update().then(function (d) {
        serverLink.data.getPower = false;
        powerData = serverLink.data.powerIqMax;
        powerRender(allData,powerData);
      });
    }
  }
  /**
   * @function powerRender
   * @description colors all objects in a rack according to the racks power usage
   */
  function powerRender(allData,powerData){
    var rackEnvironmentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('rackFilter');
    var rackEnvironmentValue = rackEnvironmentElement.value;
    var grey = 0.8;
    var longMessage = "";
    var powerDesign = 0;
    var powerUsage = 0;
    var averageOrMax;
    var ratingType;
    var roomMaximum = powerData["room_maximum"];
    var shortMessage = "";
    var singleRackReport = [];
    var tempColor = [];
    Object.keys(allData["racks"]).forEach(function(rackName){
      // power usage
      if (powerData["racks"].hasOwnProperty(rackName)){
        if (averageOrMax == "average"){
          powerUsage = powerData["racks"][rackName]["average"];
        } else {
          powerUsage = powerData["racks"][rackName]["maximum"];
        }
      } else {
        powerUsage = -1;
      }
      // power rating
      if (allData["racks"][rackName]["design"].hasOwnProperty("u_equip_design_kw")){
        if (ratingType == "equip"){
          powerDesign = allData["racks"][rackName]["design"]["u_equip_design_kw"]
        }
        if (ratingType == "facility"){
          powerDesign = allData["racks"][rackName]["design"]["u_facil_design_kw"]
        }
        if (ratingType == "consume"){
          powerDesign = allData["racks"][rackName]["design"]["u_equip_kw_consume_design"]
        }
      } else {
        powerDesign = -1;
      }
      // default for unselected
      singleRackReport = [1,1,1,"",""];
      if (rackEnvironmentValue == 'all' || rackEnvironmentValue == allData["racks"][rackName]["design"]["u_environment"]){
        if (powerDesign == -1 && powerUsage == -1){
          shortMessage = "";
          longMessage = "Rack has no design data and no power data";
          singleRackReport = [grey,grey,grey,shortMessage,longMessage];
        }
        if (powerDesign == -1 && powerUsage != -1){
          tempColor = spectrumBluePink(powerUsage, roomMaximum);
          shortMessage = powerUsage.toFixed(2) + " / NA KW";
          longMessage = "Rack has no design data, only power actuals";
          singleRackReport = [tempColor[0],tempColor[1],tempColor[2],shortMessage,longMessage];
        }
        if (powerDesign == 0 && powerUsage == -1){
          shortMessage = "";
          longMessage = "Rack is unallocated";
          singleRackReport = [grey,grey,grey,shortMessage,longMessage];
        }
        if (powerDesign == 0 && powerUsage != -1){
          shortMessage = powerUsage.toFixed(2) + " / 0 KW";
          longMessage = "Rack is unallocated, but is using power anyway";
          singleRackReport = [1,0,0,shortMessage,longMessage];
        }
        if (powerDesign != -1 && powerDesign > 0 && powerUsage == -1){
          shortMessage = "NA / " + powerDesign + " KW";
          longMessage = "Rack has design data, but no power data";
          singleRackReport = [grey,grey,grey,shortMessage,longMessage];
        }
        if (powerDesign != -1 && powerDesign > 0 && powerUsage != -1){
          tempColor = spectrumGreenRed(powerUsage, powerDesign);
          shortMessage = powerUsage.toFixed(2) + " / " + powerDesign + " KW";
          longMessage = "Rack has design data and power actuals";
          singleRackReport = [tempColor[0],tempColor[1],tempColor[2],shortMessage,longMessage];
        }
      }
      rackColor[rackName] = singleRackReport;
    });
    applyColor(allData["racks"],rackColor);
  }
  /**
   * @function overlayRackDefault
   * @description all blocks drawn white except collisions, which are red
   */
  function overlayRackDefault(){
    var color = [];
    Object.keys(allData["racks"]).forEach(function(rackName){
      rackColor[rackName] = [1,1,1];
    });
    applyColor(allData["racks"],rackColor);
  }

  /**
   * @function overlayRackCapacity
   * @description colors all objects in a rack to show that rack's capacity
   */
  function overlayRackCapacity(){
    var rackEnvironmentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('rackFilter');
    var rackEnvironmentValue = rackEnvironmentElement.value;
    var color = [];
    var rack = {};
    var singleRackReport = [];
    var tempColor = [];
    Object.keys(allData["racks"]).forEach(function(rackName){
      rack = allData["racks"][rackName];
      singleRackReport = [1,1,1]
        if (rackEnvironmentValue == 'all' || rackEnvironmentValue == rack["design"]["u_environment"]){
          if (rack['design']["u_max_alloc"] > 0){
            if (rack['design']["u_qty_alloc"] > 0){
              tempColor = spectrumGreenRed(rack['design']["u_qty_alloc"], rack['design']["u_max_alloc"]);
              singleRackReport = [tempColor[0],tempColor[1],tempColor[2],rack['design']["u_qty_alloc"] +" / " + rack['design']["u_max_alloc"]];
            } else {
              singleRackReport = spectrumGreenRed(0,1);
            }
          } else {
            singleRackReport = [0.8,0.8,0.8];
          }
        }
      rackColor[rackName] = singleRackReport;
    });
    applyColor(allData["racks"],rackColor);
  }
  /**
   * @function mountDropDown
   * @description triggers overlays when dropdowns are changed
   */
  function mountDropDown(){
    var overlayElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountOverlay');
    var overlayValue = overlayElement.value;
    if (overlayValue == 'default'){
      overlaymountDefault();
    }
    if (overlayValue == 'objectModelCategory'){
      overlayObjectModelCategory();
    }
    if (overlayValue == 'objectModelEndOfLife'){
      overlayObjectModelEndOfLife();
    }
    if (overlayValue == 'objectLastAudit'){
      overlayObjectLastAudit();
    }
  }
  /**
   * @function overlayDefault
   * @description all blocks drawn white except collisions, which are red
   */
  function overlaymountDefault(){
    var color = [];
    var mount = {};
    Object.keys(allData["mount"]).forEach(function(blockName){
      mount = allData["mount"][blockName];
      color = [1,1,1];
      if (mount['collision']){
        color = [1, 0, 0];
      }
      mountColor[blockName] = color;
    })
    applyColor(allData["mount"],mountColor);
  }
  /**
   * @function overlayObjectModelCategory
   * @description colors objects according to their model category
   */
  function overlayObjectModelCategory(){
    var supportGroupElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountFilter');
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
    }
    var mount = {};
    Object.keys(allData["mount"]).forEach(function(blockName){
      mount = allData["mount"][blockName];
      color = [1,1,1];
      if (supportGroupValue == 'all' || supportGroupValue == mount['support_group_name']){
        if (mount['model_category_name'] in colorChart){
          color = colorChart[mount['model_category_name']]
        }
        if (!mount['ci_name']){
          color = [1, 0.5, 0]
        }
        if (mount['collision']){
          color = [1, 0, 0]
        }
      }
      mountColor[blockName] = color;
    })
    applyColor(allData["mount"],mountColor);
  }
  /**
   * @function overlayObjectModelEndOfLife
   * @description any models that are end of life are shown as red
   */
  function overlayObjectModelEndOfLife(){
    var supportGroupElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountFilter');
    var supportGroupValue = supportGroupElement.value;
    var color = [];
    var mount;
    Object.keys(allData["mount"]).forEach(function(blockName){
      mount = allData["mount"][blockName];
      color = [1,1,1];
      if (supportGroupValue == 'all' || supportGroupValue == mount['support_group_name']){
        if (mount['model_u_end_of_life'] == '1'){
          color = [1, 0, 0];
        }
      }
      mountColor[blockName] = color;
    })
    applyColor(allData["mount"],mountColor);
  }
  /**
   * @function overlayObjectLastAudit
   * @description colors objects in a green to red spectrum by the date of their last audit
   */
  function overlayObjectLastAudit(){
    var supportGroupElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountFilter');
    var supportGroupValue = supportGroupElement.value;
    var color = [];
    var now = Date.now();
    var lastAudit = 0
    var block;
    // 2 yeasr * 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds;
    var milliseconds = 63072000000;
    Object.keys(allData["mount"]).forEach(function(blockName){
      block = allData["mount"][blockName];
      color = [1,1,1];
      if (supportGroupValue == 'all' || supportGroupValue == block['support_group_name']){
        if (block['u_last_audit_date']){
          lastAudit = Date.parse(block['u_last_audit_date']);
          color = spectrumGreenRed((now - lastAudit), milliseconds);
        } else {
          color = spectrumGreenRed(1,1);
        }
      }
      if (supportGroupValue == 'all' || supportGroupValue == block['support_group_name']){
        if (block['model_u_end_of_life'] == '1'){
          color = [1, 0, 0];
        }
      }
      mountColor[blockName] = color;
    })
    applyColor(allData["mount"],mountColor);
  }
  /**
   * @function rendererResize
   * @description resizes the renderer when the page is resized
   */
  function rendererResize(){
    var canvasWidth = window.innerWidth - 4;
    var canvasHeight = window.innerHeight - 4;
    var topHeight = 40;
    var lowerHeight = 68;
    var centerHeight = canvasHeight - topHeight - lowerHeight;
    // top
    document.getElementById("top").style.position = 'absolute';
    document.getElementById("top").style.left = "0px";
    document.getElementById("top").style.top = "0px";
    document.getElementById("top").style.width = canvasWidth + "px";
    document.getElementById("top").style.height = topHeight + "px";
    // center divs
    document.getElementById("my_canvas").style.position = 'absolute';
    document.getElementById("my_canvas").style.left = "0px";
    document.getElementById("my_canvas").style.top = topHeight + "px";
    document.getElementById("my_canvas").style.width = canvasWidth + "px";
    document.getElementById("my_canvas").style.height = centerHeight + "px";

    document.getElementById("ghost").style.position = 'absolute';
    document.getElementById("ghost").style.left = "0px";
    document.getElementById("ghost").style.top = topHeight + "px";
    document.getElementById("ghost").style.width = canvasWidth + "px";
    document.getElementById("ghost").style.height = centerHeight + "px";
    // lower div
    document.getElementById("lower").style.position = 'absolute';
    document.getElementById("lower").style.left = "0px";
    document.getElementById("lower").style.top = topHeight + centerHeight + "px";
    document.getElementById("lower").style.width = canvasWidth + "px";
    document.getElementById("lower").style.height = lowerHeight + "px";
    document.getElementById("lower").style.overflow='auto';
    //document.getElementById("lower").style.border = "#CCCCCC 1px solid";
    if (threeCamera){
      threeCamera.aspect = canvasWidth / centerHeight;
      threeCamera.updateProjectionMatrix();
      renderer.setSize( canvasWidth, centerHeight );
    }
  }
  /**
   * @function spectrumGreenRed
   * @description take a number and returns color data from green to red
   * @param {number} decimal - the number to be converted into color
   */
  function spectrumGreenRed(numerator,denominator) {
    var decimal = 0;
    var saturation = 0.3;
    var red;
    var green;
    var blue;
    decimal = numerator / denominator;
    if (denominator == 0){
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
    return [red,green,blue];
  }
  /**
   * @function spectrumBluePink
   * @description take a number and returns color data from blue to pink
   * @param {number} decimal - the number to be converted into color
   */
  function spectrumBluePink(numerator,denominator) {
    var decimal = 0;
    var saturation = 0.3;
    var red;
    var green;
    var blue;
    decimal = numerator / denominator;
    if (denominator == 0){
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
    return [red,green,blue];
  }
  /**
   * @function animate
   * @description the animation loop
   */
  function animate() {
    var previousBlockType = "";
    var currentBlockType = "";
    var currentRed;
    var currentGreen;
    var currentBlue;
    var previousRed;
    var previousGreen;
    var previousBlue;
    var blue;
    var closest;
    var closestDistance = -1;
    var green;
    var intersects;
    var red;
    var targetDarkness = 0.8;
    // @ts-ignore
    var cameraPostion = new THREE.Vector3();
    // @ts-ignore
    var cameraDirection = new THREE.Vector3();
    requestAnimationFrame( animate );
    if ( controlsEnabled ) {
      threeCamera.getWorldPosition(cameraPostion);
      threeCamera.getWorldDirection(cameraDirection);
      raycaster.set( cameraPostion, cameraDirection );
      var intersects = raycaster.intersectObjects(threeScene.children);
      if (intersects.length > 0){
        for ( var i = 0; i < intersects.length; i++ ) {
          if (intersects[i].object.type == 'Mesh'){
            if (closestDistance == -1){
              closestDistance = intersects[i].distance;
              closest = intersects[i];
            } else {
              if (intersects[i].distance < closestDistance){
                closestDistance = intersects[i].distance;
                closest = intersects[i];
              }
            }
          }
        }
      }
      if (closestDistance != -1){
        // check if the selected block has changed
        if (closest.object.name != selectedBlock){
          if (selectedBlock){
            // unhighlight previous object
            previousBlockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
            if (previousBlockType == "mount"){
              red = mountColor[selectedBlock][0];
              green = mountColor[selectedBlock][1];
              blue = mountColor[selectedBlock][2];
              threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
            }
            if (previousBlockType == "rack"){
              red = rackColor[selectedBlock][0]
              green = rackColor[selectedBlock][1]
              blue = rackColor[selectedBlock][2]
              threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
            }
            if (previousBlockType == "empty"){
              threeScene.getObjectByName(selectedBlock).material.color.setRGB(0.5, 0.5, 0.5);
            }
          }
          selectedBlock = closest.object.name;
        }
        // highlight the selected block
        currentBlockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
        if (currentBlockType == "mount"){
          red = mountColor[selectedBlock][0] * targetDarkness;
          green = mountColor[selectedBlock][1] * targetDarkness;
          blue = mountColor[selectedBlock][2] * targetDarkness;
          threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
        }
        if (currentBlockType == "rack"){
          red = rackColor[selectedBlock][0] * targetDarkness;
          green = rackColor[selectedBlock][1] * targetDarkness;
          blue = rackColor[selectedBlock][2] * targetDarkness;
          threeScene.getObjectByName(selectedBlock).material.color.setRGB(red, green, blue);
        }
        if (currentBlockType == "empty"){
          threeScene.getObjectByName(selectedBlock).material.color.setRGB(0.3, 0.3, 0.3);
        }
      }
      // movement
      var time = performance.now();
      var delta = ( time - prevTime );
      document.getElementById("fps").innerText = "FPS: " + Math.floor(1000 / delta);
      if (speedBoost){
        delta = delta * 5 / 1000;
      } else {
        delta = delta / 1000;
      }
      velocity.x = 0;
      velocity.z = 0;
      if ( moveForward ) velocity.z = -speed * delta;
      if ( moveBackward ) velocity.z = speed * delta;
      if ( moveLeft ) velocity.x = -speed * delta;
      if ( moveRight ) velocity.x = speed * delta;
      threeControls.getObject().translateX( velocity.x);
      threeControls.getObject().translateZ( velocity.z);
      if (moveDown){
        threeControls.getObject().position.y -= (speed * delta);
      }
      if (moveUp){
        threeControls.getObject().position.y += (speed * delta);
      }
      // minimum height
      if (threeControls.getObject().position.y < 1.8){
        threeControls.getObject().position.y = 1.8;
      }
      prevTime = time;
    }
    renderer.render(threeScene,threeCamera);
  }
  /**
   * @function mouseClick
   * @description opens a page on the selected object
   */
  function mouseClick(event){
    if (event.button == 0){
      leftMouseClick(event);
    }
    if (event.button == 1){
      middleMouseClick(event);
    }
    if (event.button == 2){
      rightMouseClick(event);
    }
  }
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function middleMouseClick(event){
    var blockData = {};
    var anchor;
    var linebreak;
    var lower;
    var preformatted;
    var textNode;
    lower = document.getElementById("lower");
    while (lower.firstChild) {
      lower.removeChild(lower.lastChild);
    }
    textNode = document.createTextNode("Middle mouse button clicked");
    lower.appendChild(textNode);
  }
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function rightMouseClick(event){
    var ghost;
    var optionElement;
    var optionList = [];
    var select;
    var button;
    var blockType;
    var addButton = function(title,id,className){
          button = document.createElement("BUTTON");
          button.id = id;
          button.type = 'button';
          button.className = className;
          button.innerHTML = title;
          document.getElementById('ghost').appendChild(button);
    }
    blockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
    console.log(blockType)

    if (blockType == "mount"){
      addButton('Open Asset Record','openAssetRecord','btn-group-green');
      document.getElementById('openAssetRecord').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Open Asset Record','openAssetRecord','btn-group-grey');
    }
    if (blockType == "mount"){
      addButton('Open CI Record','openCiRecord','btn-group-green');
      document.getElementById('openCiRecord').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Open CI Record','openCiRecord','btn-group-grey');
    }
    if (blockType == "rack"){
      addButton('Rack visualisation','rackVisual','btn-group-green');
      document.getElementById('rackVisual').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Rack visualisation','rackVisual','btn-group-grey');
    }
    if (blockType == "mount"){
      addButton('Reboot Server','rebootServer','btn-group-green');
      document.getElementById('rebootServer').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Reboot Server','rebootServer','btn-group-grey');
    }
    if (blockType == "mount"){
      addButton('Request Provisioning','requestProvisioning','btn-group-green');
      document.getElementById('requestProvisioning').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Request Provisioning','requestProvisioning','btn-group-grey');
    }
    if (blockType == "mount"){
      addButton('Request Smarthands Support','requestSmarthandsSupport','btn-group-green');
      document.getElementById('requestSmarthandsSupport').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Request Smarthands Support','requestSmarthandsSupport','btn-group-grey');
    }
    if (blockType == "empty"){
      addButton('Reserve Space','reserveSpace','btn-group-green');
      document.getElementById('reserveSpace').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Reserve Space','reserveSpace','btn-group-grey');
    }
    if (blockType == "mount"){
      addButton('Run QA Test Suite','runQaTestSuite','btn-group-green');
      document.getElementById('runQaTestSuite').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Run QA Test Suite','runQaTestSuite','btn-group-grey');
    }
    if (blockType == "mount"){
      addButton('Wipe Drive','wipeDrive','btn-group-green');
      document.getElementById('wipeDrive').addEventListener('click', onScreeMenuStop, false);
    } else {
      addButton('Wipe Drive','wipeDrive','btn-group-grey');
    }
    // block download
    addButton('Download blocks','downloadBlocks','btn-group-green');
    document.getElementById('downloadBlocks').addEventListener('click', subMenuDownloadBlocks, false);
    // cancel
    addButton('Cancel','cancel','btn-group-green');
    document.getElementById('cancel').addEventListener('click', onScreeMenuStop, false);
    onScreenMenuStart();
  }

  function subMenuDownloadBlocks(){
    var button;
    console.log("foooooo")
    var ghost;
    // clear main menu
    ghost = document.getElementById("ghost");
    while (ghost.firstChild) {
      ghost.removeChild(ghost.lastChild);
    }
    var addButton = function(title,id,className){
          button = document.createElement("BUTTON");
          button.id = id;
          button.type = 'button';
          button.className = className;
          button.innerHTML = title;
          document.getElementById('ghost').appendChild(button);
    }
    addButton('Download scene blocks','downloadSceneBlocks','btn-group-green');
    document.getElementById('downloadSceneBlocks').addEventListener('click', function(){
      exportBlocks(allData["scene"],"scene");
      onScreeMenuStop();
    }, false);
    addButton('Download rack blocks','downloadRackBlocks','btn-group-green');
    document.getElementById('downloadRackBlocks').addEventListener('click', function(){
      exportBlocks(allData["racks"],"racks");
      onScreeMenuStop();
    }, false);
  }
  /**
   * @function exportScene
   * @description downloads json containing anonymous 3d data and color of blocks that are not rack mount objects
   */
  function exportBlocks(input, blockType){
    var jsonData;
    var filename;
    var encodedData;
    var download;
    var output = {};
    var block = {};
    Object.keys(input).forEach(function(blockName){
      block = input[blockName]["block"];
      output[blockName] = {
        "x_location": block['x_location'].toFixed(3),
        "y_location": block['y_location'].toFixed(3),
        "z_location": block['z_location'].toFixed(3),
        "x_dimension": block['x_dimension'].toFixed(3),
        "y_dimension": block['y_dimension'].toFixed(3),
        "z_dimension": block['z_dimension'].toFixed(3),
        "rgb_block_red": block['rgb_block_red'].toFixed(3),
        "rgb_block_green": block['rgb_block_green'].toFixed(3),
        "rgb_block_blue": block['rgb_block_blue'].toFixed(3),
        "draw_lines": block['draw_lines'],
        "rgb_line_red": block['rgb_line_red'].toFixed(3),
        "rgb_line_green": block['rgb_line_green'].toFixed(3),
        "rgb_line_blue": block['rgb_line_blue'].toFixed(3)
      }
    });
    jsonData = JSON.stringify(output, null, 2);
    filename = allData["room"]["room_name"] + '_' + blockType + '.json';
    encodedData = 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonData);
    download = document.createElement('a');
    download.setAttribute('href', encodedData );
    download.setAttribute('download', filename);
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }

  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function onScreenMenu(){
    var linebreak;
    var lower;
    var textNode;
    lower = document.getElementById("lower");
    while (lower.firstChild) {
      lower.removeChild(lower.lastChild);
    }
    onScreeMenuStop()
  }
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function onScreenMenuStart(){
    document.exitPointerLock();
    document.getElementById('ghost').removeEventListener( 'click', pointerLockRequest, false );
  }
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function onScreeMenuStop(){
    var ghost;
    console.log('test')
    ghost = document.getElementById("ghost");
    while (ghost.firstChild) {
      ghost.removeChild(ghost.lastChild);
    }
    document.getElementById('ghost').addEventListener( 'click', pointerLockRequest, false );
  }
  /**
   * @function xxxxxx
   * @description xxxxxxxxx
   * @param {string} xxxxx - xxxxx
   * @param {boolean} xxxxx - xxxxx
   * @param {number} xxxxx - xxxxx
   * @param {Object} xxxxx - xxxxx
   * @param {Array.<Object>} xxxxx - xxxxx
   * @return {string} xxxxx - xxxxx
   */
  function leftMouseClick(event){
    var blockData = {};
    var anchor;
    var linebreak;
    var lower;
    var preformatted;
    var textNode;
    var blockType = "";
    lower = document.getElementById("lower");
    while (lower.firstChild) {
      lower.removeChild(lower.lastChild);
    }
    if (selectedBlock){
    blockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
      if (blockType == "mount"){
        blockData = allData["mount"][selectedBlock];
        anchor = document.createElement('a');
        anchor.setAttribute('href',"/nav_to.do?uri=%2Falm_hardware.do%3Fsys_id%3D" + blockData["sys_id"]);
        anchor.innerText = selectedBlock;
        lower.appendChild(anchor);
        preformatted = document.createElement("PRE");
        //linebreak = document.createElement("br");
        //textNode = document.createTextNode("Name: " + blockData["data"]["ci_name"] +"\n");
        //preformatted.appendChild(textNode);
        //textNode = document.createTextNode(JSON.stringify(blockData["display"], null, 2));
        //preformatted.appendChild(textNode);
        //lower.appendChild(preformatted);
      }
      if (blockType == "rack"){
        blockData = allData["racks"][selectedBlock];
        anchor = document.createElement('a');
        anchor.setAttribute('href',"/nav_to.do?uri=%2Fsp%3Fid%3Ddcscapeng_rackview%26rackSysid%3D" + blockData["sys_id"]);
        anchor.innerText = selectedBlock;
        lower.appendChild(anchor);
        if (rackColor[selectedBlock].length > 3 && rackColor[selectedBlock][3] != ""){
          linebreak = document.createElement("br");
          lower.appendChild(linebreak);
          textNode = document.createTextNode("     " + rackColor[selectedBlock][3]);
          lower.appendChild(textNode);
        }
        if (rackColor[selectedBlock].length > 4 && rackColor[selectedBlock][4] != ""){
          linebreak = document.createElement("br");
          lower.appendChild(linebreak);
          textNode = document.createTextNode("     " + rackColor[selectedBlock][4]);
          lower.appendChild(textNode);
        }
        //preformatted = document.createElement("PRE");
        //preformatted.appendChild(textNode);
        //linebreak = document.createElement("br");
        //textNode = document.createTextNode("Rack name: " + selectedBlock +"\n");
        //preformatted.appendChild(textNode);
        //textNode = document.createTextNode(JSON.stringify(blockData["display"], null, 2));
        //preformatted.appendChild(textNode);
        //lower.appendChild(preformatted);
      }
      if (blockType == "scene"){
        blockData = allData["scene"][selectedBlock];
        anchor = document.createElement('a');
        anchor.setAttribute('href',"/nav_to.do?uri=%2Fu_dcse_vr_scene.do%3Fsys_id%3D" + blockData["sysid"]);
        anchor.innerText = "scene";
        lower.appendChild(anchor);
      }
    } else {
      lower.innerHTML = "Room: " + allData["room"]["room_name"];
    }
  }
