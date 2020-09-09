  const cameraData: Record<string, number> = {
    "camera_position_x": 5.672,
    "camera_position_y": 14.360,
    "camera_position_z": 2.274,
    "camera_rotation_x": -2.065,
    "camera_rotation_y": -0.224,
    "camera_rotation_z": -2.752
  };
  const rackMax: number = 20;
  const rowMax: number = 6;
  const roomXDimension: number = 8 + (rackMax * 0.6);
  const roomYDimension: number = 8 + (((rowMax * 2) -1) * 1.2);
  interface Block {
    "draw_lines": number;
    "x_location": string;
    "y_location": string;
    "z_location": string;
    "x_dimension": string;
    "y_dimension": string;
    "z_dimension": string;
    "rgb_block_red": string;
    "rgb_block_green": string;
    "rgb_block_blue": string;
    "rgb_line_red": string;
    "rgb_line_green": string;
    "rgb_line_blue": string;
  }
  interface Rack {
    "id": string;
    "facing": number;
    "rack_units": number;
    "u_allocated_kw": number;
    "u_environment": string;
    "u_equip_design_kw": number;
    "u_equip_kw_consume_design": number;
    "u_facil_design_kw": number;
    "u_max_alloc": number;
    "u_qty_alloc": number;
    "u_rack_state": string;
  }
  var rackBlocks: Record<string, Block> = {};
  var rackData: Record<string, Rack> = fakeRacks(rowMax,rackMax);
  var sceneBlocks: Record<string, Block> = fakeScene(roomXDimension,roomYDimension);

  /*
  allData["racks"] = fakeRacks(rowMax,rackMax);
  allData["mount"] = fakeMount(allData["racks"]);
  allData["empty"] = fakeEmpty(allData["racks"]);
*/
  //const rackData: Record
/*
  var rowMax: number = 6;
  roomXDimension = 8 + (rackMax * 0.6);
  roomYDimension = 8 + (((rowMax * 2) -1) * 1.2);
  allData["room"] = {}
  allData["room"]["room_name"] = "roomName";
  allData["camera"] = {
      "camera_position_x": 5.672,
      "camera_position_y": 14.360,
      "camera_position_z": 2.274,
      "camera_rotation_x": -2.065,
      "camera_rotation_y": -0.224,
      "camera_rotation_z": -2.752
  }; [5.672, 14.360, 2.274, -2.065, -0.224, -2.752]
  allData["scene"] = fakeScene(roomXDimension,roomYDimension);
  allData["racks"] = fakeRacks(rowMax,rackMax);
  allData["mount"] = fakeMount(allData["racks"]);
  allData["empty"] = fakeEmpty(allData["racks"]);
*/
  //const allData: Record<string, string> = fakeAllData;
  //const allData: Array<{[index: string]: string}
  //var allData: object = fakeAllData();
  // @ts-ignore
  //var powerData: object = fakePower(allData);
  // test data
  /*
  powerData["rack_19_5"] = {
    "average": 1,
    "maximum": 1
  }
  */
  /*
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
  */
  var anchor: HTMLAnchorElement;
  var controlsEnabled: boolean = false;
  var element: HTMLElement = document.body;
  var ghostDiv: HTMLElement | null;
  var havePointerLock: boolean;
  var htmlElement: HTMLElement | null;
  var moveForward: boolean = false;
  var moveBackward: boolean = false;
  var moveLeft: boolean = false;
  var moveRight: boolean = false;
  var moveUp: boolean = false;
  var moveDown: boolean = false;
  var mountData: object = {};
  var mountColor: Record<string, Array<number>> = {};
  var prevTime: number;
  var rackColor: Record<string, Array<number>> = {};
  var roomNameElement: HTMLElement | null;
  var roomName: string = "roomName";
  var roomSysid: string = "abcde";
  var selectedBlock: string = "";
  var selectedPreviousName: string = "";
  var serverLink: any = this;
  var speed: number = 6;
  var speedBoost: boolean = false;
  var threeCamera: any;
  var threeControls: any;
  var threeRaycaster: any;
  var threeRenderer: any;
  var threeScene: any;
  // @ts-ignore
  var threeVelocity: any = new THREE.Vector3();
  var titleText: Text;
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
      roomNameElement = document.getElementById('roomName');
      if (roomNameElement){
        anchor = document.createElement('a');
        titleText = document.createTextNode(roomName);
        anchor.appendChild(titleText);
        anchor.href = "/nav_to.do?uri=%2Fcmdb_ci_computer_room.do%3Fsys_id%3D" + roomSysid;
        roomNameElement.appendChild(anchor);
      }
      havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
      if ( havePointerLock ) {
        document.addEventListener('pointerlockchange', pointerlockchange, false );
        document.addEventListener('mozpointerlockchange', pointerlockchange, false );
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false );
        ghostDiv = document.getElementById('ghost');
        if (ghostDiv){
          ghostDiv.addEventListener( 'click', pointerLockRequest, false );
        }
      } else {
        console.log('Your browser doesn\'t seem to support Pointer Lock API');
      }
      generateScene();
      animate();
    //});
  //}
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
    var threeCrosshair: any;
    var threeGeometry: any;
    var threeLight: any;
    var threeMaterial: any;
    htmlElement = document.getElementById('rackOverlay');
    if (htmlElement){
      htmlElement.addEventListener('change', rackDropDown, false);
    }
    htmlElement = document.getElementById('rackFilter');
    if (htmlElement){
      htmlElement.addEventListener('change', rackDropDown, false);
    }
    htmlElement = document.getElementById('mountOverlay');
    if (htmlElement){
      htmlElement.addEventListener('change', mountDropDown, false);
    }
    htmlElement = document.getElementById('mountFilter');
    if (htmlElement){
      htmlElement.addEventListener('change', mountDropDown, false);
    }
    htmlElement = document.getElementById("speed");
    if (htmlElement){
      htmlElement.addEventListener("change", function(){
        speed = parseFloat(speedElement.value);
      }, false);
    }
    //document.getElementById('exportScene').addEventListener('click', exportScene, false);
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
    threeLight = new THREE.AmbientLight(0xffffff);
    threeScene.add(threeLight);
    // camera
    // @ts-ignore
    threeCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
    // @ts-ignore
    threeControls = new THREE.PointerLockControls( threeCamera, document.body );
    threeControls.getObject().position.set(cameraData["camera_position_x"],cameraData["camera_position_y"],cameraData["camera_position_z"]);
    threeControls.getObject().rotation.set(cameraData["camera_rotation_x"],cameraData["camera_rotation_y"],cameraData["camera_rotation_z"]);
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
    threeRaycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 100 );
    // renderer
    // @ts-ignore
    threeRenderer = new THREE.WebGLRenderer({antialias:true, canvas:document.getElementById('my_canvas')});
    threeRenderer.setClearColor( 0xf0f3f4 );
    generateBlocks(rackBlocks,"rack",false)
    //generateBlocks(allData["scene"],"scene",false)
    //generateBlocks(allData["mount"],"mount",true)
    //generateBlocks(allData["empty"],"empty",false)
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
  function generateBlocks(inputData: Record<string, Block>,blockType: string,highlightable: boolean){
    var gameXLocation: number = 0;
    var gameYLocation: number = 0;
    var gameZLocation: number = 0;
    var gameXDimension: number = 0;
    var gameYDimension: number = 0;
    var gameZDimension: number = 0;
    var threeEdges: any;
    var threeGeometry: any;
    var threeMaterial: any;
    var threeMesh: any;
    var threeLine: any;
    Object.keys(inputData).forEach(function(blockName){
      // translate from blender xyz to game xyz
      gameXLocation = parseFloat(inputData[blockName]['y_location']);
      gameYLocation = parseFloat(inputData[blockName]['z_location']);
      gameZLocation = parseFloat(inputData[blockName]['x_location']);
      gameXDimension = parseFloat(inputData[blockName]['y_dimension']);
      gameYDimension = parseFloat(inputData[blockName]['z_dimension']);
      gameZDimension = parseFloat(inputData[blockName]['x_dimension']);
      // @ts-ignore
      threeGeometry = new THREE.BoxGeometry(gameXDimension,gameYDimension,gameZDimension);
      // @ts-ignore
      threeMaterial = new THREE.MeshStandardMaterial();
      threeMaterial.color.setRGB(inputData[blockName]['rgb_block_red'],inputData[blockName]['rgb_block_green'],inputData[blockName]['rgb_block_blue']);
      // @ts-ignore
      threeMesh = new THREE.Mesh(threeGeometry,threeMaterial);
      threeMesh.position.x = gameXLocation;
      threeMesh.position.y = gameYLocation;
      threeMesh.position.z = gameZLocation;
      threeMesh.name = blockName;
      threeMesh.userData.blockType = blockType;
      threeMesh.userData.highlightable = highlightable;
      threeScene.add(threeMesh);
      if (inputData[blockName]["draw_lines"] == 1){
        // @ts-ignore
        threeEdges = new THREE.EdgesGeometry( threeGeometry );
        // @ts-ignore
        threeMaterial = new THREE.LineBasicMaterial();
        threeMaterial.color.setRGB(inputData[blockName]['rgb_line_red'],inputData[blockName]['rgb_line_green'],inputData[blockName]['rgb_line_blue']);
        // @ts-ignore
        threeLine = new THREE.LineSegments(threeEdges, threeMaterial);
        threeMesh.add(threeLine);
      }
    });
  }
  /**
   * @function onKeyDown
   * @description associate actions with key presses
   */
  function onKeyDown(event: KeyboardEvent){
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
  function onKeyUp(event: KeyboardEvent){
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
    var lower: HTMLElement | null = document.getElementById("lower");
    if (lower){
      var camXPos: number = threeControls.getObject().position.x.toFixed(3);
      var camYPos: number = threeControls.getObject().position.y.toFixed(3);
      var camZPos: number = threeControls.getObject().position.z.toFixed(3);
      var camXRot: number = threeCamera.rotation.x.toFixed(3);
      var camYRot: number = threeCamera.rotation.y.toFixed(3);
      var camZRot: number = threeCamera.rotation.z.toFixed(3);
      while (lower.firstChild) {
        lower.removeChild(lower.firstChild);
      }
      lower.innerText = "Camera: [" + camXPos + ", " + camYPos + ", " + camZPos + ", " + camXRot + ", " + camYRot + ", " + camZRot + "]";
    }
  }
  /**
   * @function applyColor
   * @description apply the colors in mountColor to the 3d blocks
   * @param {Array.<Object>} objectData - the 3d blocks
   * @param {Object} mountColor - the colors
   */
  function applyColor(inputData: Object,inputColor: Record<string, Array<number>>){
    var red: number = 1;
    var green: number = 1;
    var blue: number = 1;
    var threeTarget: any;
    Object.keys(inputData).forEach(function(blockName){
      if (inputColor.hasOwnProperty(blockName)){
        red = inputColor[blockName][0];
        green = inputColor[blockName][1];
        blue = inputColor[blockName][2];
        threeTarget = threeScene.getObjectByName(blockName);
        threeTarget.material.color.setRGB(red,green,blue);
      }
    })
  }
  /**
   * @function generateRackFilter
   * @description fill the environment dropdown
   */
  function generateRackFilter(){
    var rackEnvironmentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('rackFilter');
    var optionElement: HTMLOptionElement;
    var rackEnvironmentList: Array<string> = [];
    /*
    Object.keys(allData["racks"]).forEach(function(rackName){
      if (rackEnvironmentList.indexOf(allData["racks"][rackName]["design"]['u_environment']) < 0){
        rackEnvironmentList.push(allData["racks"][rackName]["design"]['u_environment']);
      }
    });
    */
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
    var optionElement: HTMLOptionElement;
    var supportGroupList: Array<string> = [];
    var mount: object = {};
    /*
    Object.keys(allData["mount"]).forEach(function(blockName){
      mount = allData["mount"][blockName];
      if (supportGroupList.indexOf(mount['support_group_name']) < 0){
        supportGroupList.push(mount['support_group_name']);
      }
    });
    */
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
    var overlayElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('rackOverlay');
    var overlayValue: string = overlayElement.value;
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
    //if (Object.keys(powerData["racks"]).length > 0) {
      //powerRender(allData,powerData);
    //} else {
      //serverLink.data.roomName = roomName;
      //serverLink.data.getPower = true;
      //serverLink.server.update().then(function (d) {
        //serverLink.data.getPower = false;
        //powerData = serverLink.data.powerIqMax;
        //powerRender(allData,powerData);
      //});
    //}
  }
  /**
   * @function powerRender
   * @description colors all objects in a rack according to the racks power usage
   */
  /*
  function powerRender(allData: Object, powerData: Object){
    var rackEnvironmentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('rackFilter');
    var rackEnvironmentValue: string = rackEnvironmentElement.value;
    var grey: number = 0.8;
    var longMessage: string = "";
    var powerDesign: number = 0;
    var powerUsage: number = 0;
    var averageOrMax: string;
    var ratingType: string;
    var roomMaximum: number = powerData["room_maximum"];
    var shortMessage: string = "";
    var singleRackReport: Array<any> = [];
    var tempColor: Array<number> = [];
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
    //applyColor(allData["racks"],rackColor);
  }
  */
  /**
   * @function overlayRackDefault
   * @description all blocks drawn white except collisions, which are red
   */
  function overlayRackDefault(){
    var color: Array<number> = [];
    /*
    Object.keys(allData["racks"]).forEach(function(rackName){
      rackColor[rackName] = [1,1,1];
    });
    */
    //applyColor(allData["racks"],rackColor);
  }

  /**
   * @function overlayRackCapacity
   * @description colors all objects in a rack to show that rack's capacity
   */
  function overlayRackCapacity(){
    var rackEnvironmentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('rackFilter');
    var rackEnvironmentValue: string = rackEnvironmentElement.value;
    var color: Array<number> = [];
    var rack: object = {};
    var singleRackReport: Array<any> = [];
    var tempColor: Array<number> = [];
    /*
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
    */
    //applyColor(allData["racks"],rackColor);
  }
  /**
   * @function mountDropDown
   * @description triggers overlays when dropdowns are changed
   */
  function mountDropDown(){
    var overlayElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountOverlay');
    var overlayValue: string = overlayElement.value;
    if (overlayValue == 'default'){
      //overlaymountDefault();
    }
    if (overlayValue == 'objectModelCategory'){
      //overlayObjectModelCategory();
    }
    if (overlayValue == 'objectModelEndOfLife'){
      //overlayObjectModelEndOfLife();
    }
    if (overlayValue == 'objectLastAudit'){
      //overlayObjectLastAudit();
    }
  }
  /**
   * @function overlayDefault
   * @description all blocks drawn white except collisions, which are red
   */
  function overlaymountDefault(){
    var color: Array<number> = [];
    var mount: object = {};
    /*
    Object.keys(allData["mount"]).forEach(function(blockName){
      mount = allData["mount"][blockName];
      color = [1,1,1];
      if (mount['collision']){
        color = [1, 0, 0];
      }
      mountColor[blockName] = color;
    })
    */
    //applyColor(allData["mount"],mountColor);
  }
  /**
   * @function overlayObjectModelCategory
   * @description colors objects according to their model category
   */
  function overlayObjectModelCategory(){
    var supportGroupElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountFilter');
    var supportGroupValue: string = supportGroupElement.value;
    var color: Array<number> = [];
    // hue 40 sat 40 val 100/60
    var colorStorage: Array<number> = [1.0, 0.867, 0.6];
    // hue 120 sat 40 val 100/60
    var colorNetwork: Array<number> = [0.6, 1.0, 0.6];
    // hue 200 sat 40 val 100/60
    var colorServer: Array<number> = [0.6, 0.867, 1.0];
    // hue 280 sat 40 val 100/60
    var colorOther: Array<number> = [0.867, 0.6, 1.0];
    var colorChart: object = {
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
    var mount: object = {};
    /*
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
    */
  }
  /**
   * @function overlayObjectModelEndOfLife
   * @description any models that are end of life are shown as red
   */
  /*
  function overlayObjectModelEndOfLife(){
    var supportGroupElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountFilter');
    var supportGroupValue: string = supportGroupElement.value;
    var color: Array<number> = [];
    var mount: object;
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
  */
  /**
   * @function overlayObjectLastAudit
   * @description colors objects in a green to red spectrum by the date of their last audit
   */
  /*
  function overlayObjectLastAudit(){
    var supportGroupElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('mountFilter');
    var supportGroupValue: string = supportGroupElement.value;
    var color: Array<number> = [];
    var now: number = Date.now();
    var lastAudit: number = 0
    var block: object;
    // 2 yeasr * 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds;
    var milliseconds: number = 63072000000;
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
    //applyColor(allData["mount"],mountColor);
  }
  */
  /**
   * @function rendererResize
   * @description resizes the renderer when the page is resized
   */
  function rendererResize(){
    var divTop: HTMLElement | null;
    var divMyCanvas: HTMLElement | null;
    var divGhost: HTMLElement | null;
    var divLower: HTMLElement | null;
    var canvasWidth: number = window.innerWidth - 4;
    var canvasHeight: number = window.innerHeight - 4;
    var topHeight: number = 40;
    var lowerHeight: number = 68;
    var centerHeight: number = canvasHeight - topHeight - lowerHeight;
    divTop = document.getElementById("top");
    if (divTop){
      divTop.style.position = 'absolute';
      divTop.style.left = "0px";
      divTop.style.top = "0px";
      divTop.style.width = canvasWidth + "px";
      divTop.style.height = topHeight + "px";
    }
    divMyCanvas = document.getElementById("my_canvas");
    if (divMyCanvas){
      divMyCanvas.style.position = 'absolute';
      divMyCanvas.style.left = "0px";
      divMyCanvas.style.top = topHeight + "px";
      divMyCanvas.style.width = canvasWidth + "px";
      divMyCanvas.style.height = centerHeight + "px";
    }
    divGhost = document.getElementById("ghost");
    if (divGhost){
      divGhost.style.position = 'absolute';
      divGhost.style.left = "0px";
      divGhost.style.top = topHeight + "px";
      divGhost.style.width = canvasWidth + "px";
      divGhost.style.height = centerHeight + "px";
    }
    divLower = document.getElementById("lower");
    if (divLower){
      divLower.style.position = 'absolute';
      divLower.style.left = "0px";
      divLower.style.top = topHeight + centerHeight + "px";
      divLower.style.width = canvasWidth + "px";
      divLower.style.height = lowerHeight + "px";
      divLower.style.overflow='auto';
    }
    if (threeCamera){
      threeCamera.aspect = canvasWidth / centerHeight;
      threeCamera.updateProjectionMatrix();
      threeRenderer.setSize( canvasWidth, centerHeight );
    }
  }
  /**
   * @function spectrumGreenRed
   * @description take a number and returns color data from green to red
   * @param {number} decimal - the number to be converted into color
   */
  function spectrumGreenRed(numerator: number, denominator: number) {
    var decimal: number = 0;
    var saturation: number = 0.3;
    var red: number = 0;
    var green: number = 0;
    var blue: number= 0;
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
  function spectrumBluePink(numerator: number, denominator: number) {
    var decimal: number = 0;
    var saturation: number = 0.3;
    var red: number;
    var green: number;
    var blue: number;
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
    var blue: number;
    var closestDistance: number = -1;
    var currentBlockType: string = "";
    var delta: number;
    var fpsOutput: HTMLElement | null;
    var green: number;
    var previousBlockType: string = "";
    var targetDarkness: number = 0.8;
    var threeClosest: any;
    var threeIntersects: Array<any>;
    var time: number
    var red: number;
    // @ts-ignore
    var threeCameraPostion: any = new THREE.Vector3();
    // @ts-ignore
    var threeCameraDirection: any = new THREE.Vector3();
    requestAnimationFrame( animate );
    if ( controlsEnabled ) {
      threeCamera.getWorldPosition(threeCameraPostion);
      threeCamera.getWorldDirection(threeCameraDirection);
      threeRaycaster.set( threeCameraPostion, threeCameraDirection );
      threeIntersects = threeRaycaster.intersectObjects(threeScene.children);
      if (threeIntersects.length > 0){
        for ( var i: number = 0; i < threeIntersects.length; i++ ) {
          if (threeIntersects[i].object.type == 'Mesh'){
            if (closestDistance == -1){
              closestDistance = threeIntersects[i].distance;
              threeClosest = threeIntersects[i];
            } else {
              if (threeIntersects[i].distance < closestDistance){
                closestDistance = threeIntersects[i].distance;
                threeClosest = threeIntersects[i];
              }
            }
          }
        }
      }
      if (closestDistance != -1){
        // check if the selected block has changed
        if (threeClosest.object.name != selectedBlock){
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
          selectedBlock = threeClosest.object.name;
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
      time = performance.now();
      delta = ( time - prevTime );
      fpsOutput = document.getElementById("fps");
      if (fpsOutput){
        fpsOutput.innerText = "FPS: " + Math.floor(1000 / delta);
      }
      if (speedBoost){
        delta = delta * 5 / 1000;
      } else {
        delta = delta / 1000;
      }
      threeVelocity.x = 0;
      threeVelocity.z = 0;
      if ( moveForward ) threeVelocity.z = -speed * delta;
      if ( moveBackward ) threeVelocity.z = speed * delta;
      if ( moveLeft ) threeVelocity.x = -speed * delta;
      if ( moveRight ) threeVelocity.x = speed * delta;
      threeControls.getObject().translateX( threeVelocity.x);
      threeControls.getObject().translateZ( threeVelocity.z);
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
    threeRenderer.render(threeScene,threeCamera);
  }
  /**
   * @function mouseClick
   * @description opens a page on the selected object
   */
  function mouseClick(event: MouseEvent){
    /*
    if (event.button == 0){
      leftMouseClick(event);
    }
    if (event.button == 1){
      middleMouseClick(event);
    }
    if (event.button == 2){
      rightMouseClick(event);
    }
    */
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
  /*
  function middleMouseClick(event: MouseEvent){
    var lower: HTMLElement | null;
    var textNode: Text;
    lower = document.getElementById("lower");
    if (lower){
      while (lower.firstChild) {
        lower.removeChild(lower.firstChild);
      }
      textNode = document.createTextNode("Middle mouse button clicked");
      lower.appendChild(textNode);
    }
  }
  */
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
  /*
  function rightMouseClick(event){
    var button: HTMLElement;
    var blockType: string;
    var addButton: any = function(title,id,className){
          button = document.createElement("BUTTON");
          button.id = id;
          button.className = className;
          button.innerHTML = title;
          document.getElementById('ghost').appendChild(button);
    }
    blockType = threeScene.getObjectByName(selectedBlock).userData.blockType;
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
  */

  //function subMenuDownloadBlocks(){
  //  var button: HTMLElement;
  //  var ghost: HTMLElement;
    // clear main menu
  //  ghost = document.getElementById("ghost");
  //  while (ghost.firstChild) {
  //    ghost.removeChild(ghost.lastChild);
  //  }
  //  var addButton: any = function(title,id,className){
  //        button = document.createElement("BUTTON");
  //        button.id = id;
  //        button.className = className;
  //        button.innerHTML = title;
   //       document.getElementById('ghost').appendChild(button);
  //  }
    //addButton('Download scene blocks','downloadSceneBlocks','btn-group-green');
    //document.getElementById('downloadSceneBlocks').addEventListener('click', function(){
    //  exportBlocks(allData["scene"],"scene");
    //  onScreeMenuStop();
    //}, false);
    //addButton('Download rack blocks','downloadRackBlocks','btn-group-green');
    //document.getElementById('downloadRackBlocks').addEventListener('click', function(){
    //  exportBlocks(allData["racks"],"racks");
    //  onScreeMenuStop();
    //}, false);
  //}
  /**
   * @function exportScene
   * @description downloads json containing anonymous 3d data and color of blocks that are not rack mount objects
   */
  function exportBlocks(input: Record<string, Block>, blockType: string){
    var jsonData: string;
    var filename: string;
    var encodedData: string;
    var download: HTMLElement;
    var output: Record<string, Block> = {};
    Object.keys(input).forEach(function(blockName: string ){
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
      }
    });
    jsonData = JSON.stringify(output, null, 2);
    //filename = allData["room"]["room_name"] + '_' + blockType + '.json';
    filename = "test.json";
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
  function onScreenMenuStart(){
    var ghost: HTMLElement | null | undefined;
    ghost = document.getElementById("ghost");
    if (ghost){
      ghost.removeEventListener( 'click', pointerLockRequest, false );
    }
    document.exitPointerLock();
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
    var ghost: HTMLElement | null | undefined;
    ghost = document.getElementById("ghost");
    if (ghost){
      while (ghost.firstChild) {
        ghost.removeChild(ghost.firstChild);
      }
      ghost.addEventListener( 'click', pointerLockRequest, false );
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
  /*
  function leftMouseClick(event){
    var blockData: object = {};
    var anchor: HTMLElement;
    var linebreak: HTMLElement;
    var lower: HTMLElement;
    var textNode: Text;
    var blockType: string = "";
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
  */
  /*
  function fakeAllData(){
    var allData: Object = {};
    var rackMax: number = 20;
    var roomXDimension: number;
    var roomYDimension: number;
    var rowMax: number = 6;
    roomXDimension = 8 + (rackMax * 0.6);
    roomYDimension = 8 + (((rowMax * 2) -1) * 1.2);
    allData["room"] = {}
    allData["room"]["room_name"] = "roomName";
    allData["camera"] = {
        "camera_position_x": 5.672,
        "camera_position_y": 14.360,
        "camera_position_z": 2.274,
        "camera_rotation_x": -2.065,
        "camera_rotation_y": -0.224,
        "camera_rotation_z": -2.752
    }; [5.672, 14.360, 2.274, -2.065, -0.224, -2.752]
    allData["scene"] = fakeScene(roomXDimension,roomYDimension);
    allData["racks"] = fakeRacks(rowMax,rackMax);
    allData["mount"] = fakeMount(allData["racks"]);
    allData["empty"] = fakeEmpty(allData["racks"]);
    return allData;
  }
  */

  function fakeScene(roomXDimension: number,roomYDimension: number){
    var scene: Record<string, Block> = {};
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
    }
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
    }
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
    }
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
    }
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
    }
    return scene;
  }
  /*
  function fakeMount(rackData){
    var dateNow: Date;
    var endOfLife: number;
    var fakedates: Array<string>;
    var mountCount: number = 0;
    var mountData: Object = {};
    var mountName: string = "";
    var rack: Object = {};
    var seconds: number;
    var unitCount: number;
    var unitHeight: number = 0.0445;
    var xDimension: number = 0;
    var xLocation: number = 0;
    var yDimension: number = 0;
    var yLocation: number = 0;
    var zDimension: number = 0;
    var zLocation: number = 0;
    var zLoop: number;
    var zStart: number = 0;
    fakedates = ['2018-07-25 04:21:00','2019-01-25 04:21:00','2019-07-25 04:21:00','2020-01-25 04:21:00','2020-07-25 04:21:00'];
    Object.keys(rackData).forEach(function(rackName){
      rack = rackData[rackName];
      if (rack["facing"] == 0){
        xLocation = rack["block"]["x_location"] - (rack["block"]["x_dimension"] * 0.5) - 0.009;
        yLocation = rack["block"]["y_location"];
        xDimension = 0.016;
        yDimension = rack["block"]["y_dimension"] * 0.9;
      }
      if (rack["facing"] == 1){
        xLocation = rack["block"]["x_location"];
        yLocation = rack["block"]["y_location"] + (rack["block"]["y_dimension"] * 0.5) + 0.009;
        xDimension = rack["block"]["x_dimension"] * 0.9;
        yDimension = 0.016;
      }
      if (rack["facing"] == 2){
        xLocation = rack["block"]["x_location"] + (rack["block"]["x_dimension"] * 0.5) + 0.009;
        yLocation = rack["block"]["y_location"];
        xDimension = 0.016;
        yDimension = rack["block"]["y_dimension"] * 0.9;
      }
      if (rack["facing"] == 3){
        xLocation = rack["block"]["x_location"];
        yLocation = rack["block"]["y_location"] - (rack["block"]["y_dimension"] * 0.5) - 0.009;
        xDimension = rack["block"]["x_dimension"] * 0.9;
        yDimension = 0.016;
      }
      zStart = rack["block"]["z_location"] - (rack["block"]["z_dimension"] * 0.5) + (unitHeight * 2);
      for (zLoop = 0; zLoop < 10; zLoop++){
        unitCount = (zLoop * 2);
        zDimension = (unitHeight * 2) -0.002;
        zLocation = zStart + (unitCount * unitHeight) + unitHeight;
        mountName = "server_" + mountCount;
        if (Math.random() > 0.95){
          endOfLife = 1;
        } else {
          endOfLife = 0;
        }
        seconds = Math.random() * 5 * 365 * 24 * 60 * 60 * 1000;
        dateNow = new Date();
        mountData[mountName] = {
          "block": {
            "draw_lines": 1,
            "rgb_block_red": 1.0,
            "rgb_block_green": 1.0,
            "rgb_block_blue": 1.0,
            "rgb_line_red": 0.5,
            "rgb_line_green": 0.5,
            "rgb_line_blue": 0.5,
            "x_location": xLocation,
            "y_location": yLocation,
            "z_location": zLocation,
            "x_dimension": xDimension,
            "y_dimension": yDimension,
            "z_dimension": zDimension
          },
          "ci_name": mountName,
          "ci_sys_id": mountCount.toString(),
          "sys_id": mountCount,
          "asset_tag": "fake",
          "ci_u_cmdb_ci_status_name": "fake",
          "ci_u_provision_date": "fake",
          "collision": 0,
          "model_category_name": "Server",
          "model_u_end_of_life": endOfLife,
          "model_name": "fake",
          "model_rack_units": 1,
          "support_group_name": randomSupportGroup(),
          "support_group_manager_email": "fake@fake.com",
          "sys_class_name": "fake",
          "u_smdb_table": "fake",
          "u_last_audit_date": fakedates[Math.floor(Math.random() * 5)],
          "serial_number": "fake"
        }
        mountCount += 1;
      }
      for (zLoop = 0; zLoop < 3; zLoop++){
        unitCount = 20 + zLoop;
        zDimension = unitHeight - 0.002;
        zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 0.5);
        mountName = "network_" + mountCount;
        if (Math.random() > 0.95){
          endOfLife = 1;
        } else {
          endOfLife = 0;
        }
        seconds = Math.random() * 5 * 365 * 24 * 60 * 60 * 1000;
        dateNow = new Date();
        mountData[mountName] = {
          "block": {
            "draw_lines": 1,
            "rgb_block_red": 1.0,
            "rgb_block_green": 1.0,
            "rgb_block_blue": 1.0,
            "rgb_line_red": 0.5,
            "rgb_line_green": 0.5,
            "rgb_line_blue": 0.5,
            "x_location": xLocation,
            "y_location": yLocation,
            "z_location": zLocation,
            "x_dimension": xDimension,
            "y_dimension": yDimension,
            "z_dimension": zDimension
          },
          "ci_name": mountName,
          "ci_sys_id": mountCount.toString(),
          "sys_id": mountCount,
          "asset_tag": "fake",
          "ci_u_cmdb_ci_status_name": "fake",
          "ci_u_provision_date": "fake",
          "collision": 0,
          "model_category_name": "Network Gear",
          "model_u_end_of_life": endOfLife,
          "model_name": "fake",
          "model_rack_units": 1,
          "support_group_name": randomSupportGroup(),
          "support_group_manager_email": "fake@fake.com",
          "sys_class_name": "fake",
          "u_smdb_table": "fake",
          "u_last_audit_date": fakedates[Math.floor(Math.random() * 5)],
          "serial_number": "fake"
        }
        mountCount += 1;
      }
      for (zLoop = 0; zLoop < 4; zLoop++){
        unitCount = 23 + zLoop * 4;
        zDimension = (unitHeight * 4) - 0.002;
        zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 2);
        mountName = "server_" + mountCount;
        if (Math.random() > 0.95){
          endOfLife = 1;
        } else {
          endOfLife = 0;
        }
        mountData[mountName] = {
          "block": {
            "draw_lines": 1,
            "rgb_block_red": 1.0,
            "rgb_block_green": 1.0,
            "rgb_block_blue": 1.0,
            "rgb_line_red": 0.5,
            "rgb_line_green": 0.5,
            "rgb_line_blue": 0.5,
            "x_location": xLocation,
            "y_location": yLocation,
            "z_location": zLocation,
            "x_dimension": xDimension,
            "y_dimension": yDimension,
            "z_dimension": zDimension
          },
          "ci_name": mountName,
          "ci_sys_id": mountCount.toString(),
          "sys_id": mountCount,
          "asset_tag": "fake",
          "ci_u_cmdb_ci_status_name": "fake",
          "ci_u_provision_date": "fake",
          "collision": 0,
          "model_category_name": "Server",
          "model_u_end_of_life": endOfLife,
          "model_name": "fake",
          "model_rack_units": 1,
          "support_group_name": randomSupportGroup(),
          "support_group_manager_email": "fake@fake.com",
          "sys_class_name": "fake",
          "u_smdb_table": "fake",
          "u_last_audit_date": fakedates[Math.floor(Math.random() * 5)],
          "serial_number": "fake"
        }
        mountCount += 1;
      }
    })
    return mountData;
  }

  function fakeEmpty(rackData){
    var emptyCount: number = 0;
    var emptyData: Object = {};
    var rack: Object = {};
    var unitCount: number;
    var unitHeight: number = 0.0445;
    var xDimension: number = 0;
    var xLocation: number = 0;
    var yDimension: number = 0;
    var yLocation: number = 0;
    var zDimension: number = 0;
    var zLocation: number = 0;
    var zLoop: number = 0;
    var zStart: number = 0;
    Object.keys(rackData).forEach(function(rackName){
      rack = rackData[rackName];
      if (rack["facing"] == 0){
        xLocation = rack["block"]["x_location"] - (rack["block"]["x_dimension"] * 0.5) - 0.002;
        yLocation = rack["block"]["y_location"];
        xDimension = 0.002;
        yDimension = rack["block"]["y_dimension"] * 0.9;
      }
      if (rack["facing"] == 1){
        xLocation = rack["block"]["x_location"];
        yLocation = rack["block"]["y_location"] + (rack["block"]["y_dimension"] * 0.5) + 0.002;
        xDimension = rack["block"]["x_dimension"] * 0.9;
        yDimension = 0.002;
      }
      if (rack["facing"] == 2){
        xLocation = rack["block"]["x_location"] + (rack["block"]["x_dimension"] * 0.5) + 0.002;
        yLocation = rack["block"]["y_location"];
        xDimension = 0.002;
        yDimension = rack["block"]["y_dimension"] * 0.9;
      }
      if (rack["facing"] == 3){
        xLocation = rack["block"]["x_location"];
        yLocation = rack["block"]["y_location"] - (rack["block"]["y_dimension"] * 0.5) - 0.002;
        xDimension = rack["block"]["x_dimension"] * 0.9;
        yDimension = 0.002;
      }
      zStart = rack["block"]["z_location"] - (rack["block"]["z_dimension"] * 0.5) + (unitHeight * 2);
      for (zLoop = 0; zLoop < 11; zLoop++){
        unitCount = 39 + zLoop;
        zDimension = unitHeight;
        zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 0.5);
        emptyData[emptyCount] = {
          "block": {
            "draw_lines": 1,
            "rgb_block_red": 0.5,
            "rgb_block_green": 0.5,
            "rgb_block_blue": 0.5,
            "rgb_line_red": 1.0,
            "rgb_line_green": 1.0,
            "rgb_line_blue": 1.0,
            "x_location": xLocation,
            "y_location": yLocation,
            "z_location": zLocation,
            "x_dimension": xDimension,
            "y_dimension": yDimension,
            "z_dimension": zDimension
          },
          "name": rackName + "_" + unitCount,
          "rack_name": rackName,
          "unit_height": unitCount
        }
        emptyCount += 1;
      }
    });
    return emptyData;
  }
*/
  function randomEnvironment(){
    var dice: number = Math.floor(Math.random() * 6);
    var environmentList: Array<string> = ["environment1","environment2","environment3","environment4","environment5","environment6"];
    return environmentList[dice];
  }
/*
  function randomSupportGroup(){
    var dice: number = Math.floor(Math.random() * 3);
    var supportGroupList: Array<string> = ["team1","team2","team3"];
    return supportGroupList[dice];
  }

  function fakePower(allData){
    var powerData: object = {};
    var randomPower: number = 0;
    powerData["racks"] = {}
    Object.keys(allData["racks"]).forEach(function(rackName){
      if (allData["racks"][rackName]["design"]["u_equip_design_kw"] != "no data"){
        if (allData["racks"][rackName]["design"]["u_equip_design_kw"] > 0){
          randomPower = Math.random() * 10;
          powerData["racks"][rackName] = {
            "average": randomPower,
            "maximum": randomPower * (1.0 + Math.random() * 0.3)
          }
        }
      } else {
        randomPower = Math.random() * 10;
        powerData["racks"][rackName] = {
          "average": randomPower,
          "maximum": randomPower * (1.0 + Math.random() * 0.3)
          }
      }
    })
    powerData["room_maximum"] = 13;
    return powerData;
  }
*/

/*
interface Block {
  "draw_lines": number;
  'id': string;
  "rgb_block_red": string;
  "rgb_block_green": string;
  "rgb_block_blue": string;
  "rgb_line_red": string;
  "rgb_line_green": string;
  "rgb_line_blue": string;
  "x_location": string;
  "y_location": string;
  "z_location": string;
  "x_dimension": string;
  "y_dimension": string;
  "z_dimension": string;
}
*/

  function fakeRacks(rowMax: number, rackMax: number){
    var facing: number = 0;
    var rackCount: number = 0;
    var rackData: Record<string, Rack> = {};
    var rackName: string;
    var xloop: number;
    var yloop: number;
    for (yloop = 0; yloop < rowMax; yloop++){
      for (xloop = 0; xloop < rackMax; xloop++){
        if (yloop % 2 == 0){
          facing = 1;
        } else {
          facing = 3;
        }
        rackName = "rack_" + xloop + "_" + yloop;
        rackBlocks[rackName] = {
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
          "z_dimension": "1.2"
        }
        rackData[rackName] = {
          "id": rackCount.toString(),
          "facing": facing,
          "rack_units": 50,
          "u_allocated_kw": 10,
          "u_environment": randomEnvironment(),
          "u_equip_design_kw": 12,
          "u_equip_kw_consume_design": 20,
          "u_facil_design_kw": 16,
          "u_max_alloc": 10,
          "u_qty_alloc": xloop % 10,
          "u_rack_state": "Landed"
        }
        rackCount++;
      }
    }
    return rackData;
  }