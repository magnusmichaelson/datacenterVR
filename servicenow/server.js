(function() {
    // get the room sysid from the url parmaters
    var basicRackData = [];
    var cameraData = {};
    var mountedData = {};
    var rackDesignData = {};
    var xyzRackData = [];
    var rackData = [];
    var roomName = '';
    var roomSysid = $sp.getParameter('sysid');
    var sceneryData = [];
    var unsortedHardware = [];
    data.roomSysid = roomSysid;
    // generate room data
    if (input && input.generatingRoom){
          /*
      roomName = getRoomName(roomSysid);
      cameraData = getCamera(roomName);
      basicRackData = getbasicRackData(roomSysid);
      xyzRackData = getXyzRackData(basicRackData,rackDesignData);
      rackData = getRackDesignData(xyzRackData);
      sceneryData = addScenery(roomName);
      if (rackData.length > 0){
        unsortedHardware = getHardWare(rackData);
      }
      if (unsortedHardware.length > 0){
        mountedData = generateBlocks(rackData,unsortedHardware);
      }
      // turn racks into object
      var rackObject = {}
      rackData.forEach(function(rack){
        rackObject[rack["name"]] = {
                  "block": {
            "draw_lines": 1,
            "rgb_block_red": 1,
            "rgb_block_green": 1,
            "rgb_block_blue": 1,
            "rgb_line_red": 0.5,
            "rgb_line_green": 0.5,
            "rgb_line_blue": 0.5,
            "x_min": rack["u_x_min"],
            "x_max": rack["u_x_max"],
            "y_min": rack["u_y_min"],
            "y_max": rack["u_y_max"],
            "z_min": rack["u_z_min"],
            "z_max": rack["u_z_max"],
            "x_location": (rack["u_x_min"] + rack["u_x_max"]) * 0.5,
            "y_location": (rack["u_y_min"] + rack["u_y_max"]) * 0.5,
            "z_location": (rack["u_z_min"] + rack["u_z_max"]) * 0.5,
            "x_dimension": rack["u_x_max"] - rack["u_x_min"],
            "y_dimension": rack["u_y_max"] - rack["u_y_min"],
            "z_dimension": rack["u_z_max"] - rack["u_z_min"]
                  },
          "data" : {
            "sys_id": rack["sys_id"],
            "rack_units": rack["rack_units"],
            "u_x_aligned": rack["u_x_aligned"],
            "u_z_unit_start": rack["u_z_unit_start"]
          },
          "display" : {
            "u_rack_state": rack["u_rack_state"],
            "u_max_alloc": rack["u_max_alloc"],
            "u_qty_alloc": rack["u_qty_alloc"],
            "u_environment": rack["u_environment"],
            "u_allocated_kw": rack["u_allocated_kw"],
            "u_equip_design_kw": rack["u_equip_design_kw"],
            "u_facil_design_kw": rack["u_facil_design_kw"],
            "u_equip_kw_consume_design": rack["u_equip_kw_consume_design"]
          }
        }
      })
  
      // turn scene into object
      var sceneObject = {}
      sceneryData.forEach(function(scene){
        sceneObject[scene["name"]] = {
                  "block": {
            "draw_lines": scene["u_lines"],
            "rgb_block_red": scene["u_red"],
            "rgb_block_green": scene["u_red"],
            "rgb_block_blue": scene["u_red"],
            "rgb_line_red": 0.5,
            "rgb_line_green": 0.5,
            "rgb_line_blue": 0.5,
            "x_min": scene["u_x_min"],
            "x_max": scene["u_x_max"],
            "y_min": scene["u_y_min"],
            "y_max": scene["u_y_max"],
            "z_min": scene["u_z_min"],
            "z_max": scene["u_z_max"],
            "x_location": (scene["u_x_min"] + scene["u_x_max"]) * 0.5,
            "y_location": (scene["u_y_min"] + scene["u_y_max"]) * 0.5,
            "z_location": (scene["u_z_min"] + scene["u_z_max"]) * 0.5,
            "x_dimension": scene["u_x_max"] - scene["u_x_min"],
            "y_dimension": scene["u_y_max"] - scene["u_y_min"],
            "z_dimension": scene["u_z_max"] - scene["u_z_min"]
          },
          "data" : {
            'sys_id': scene["sys_id"],
            'tag': scene["u_tag"]
          }
        }
      })
      //update mountedData
      var mountedObject = {};
      var mountedTemp = {};
      Object.keys(mountedData).forEach(function(mountedName){
        mountedTemp = mountedData[mountedName];
        mountedObject[mountedName] = {
                  "block": {
            "draw_lines": mountedTemp["u_lines"],
            "rgb_block_red": 1.0,
            "rgb_block_green": 1.0,
            "rgb_block_blue": 1.0,
            "rgb_line_red": 0.5,
            "rgb_line_green": 0.5,
            "rgb_line_blue": 0.5,
            "x_min": mountedTemp["u_x_min"],
            "x_max": mountedTemp["u_x_max"],
            "y_min": mountedTemp["u_y_min"],
            "y_max": mountedTemp["u_y_max"],
            "z_min": mountedTemp["u_z_min"],
            "z_max": mountedTemp["u_z_max"],
            "x_location": (mountedTemp["u_x_min"] + mountedTemp["u_x_max"]) * 0.5,
            "y_location": (mountedTemp["u_y_min"] + mountedTemp["u_y_max"]) * 0.5,
            "z_location": (mountedTemp["u_z_min"] + mountedTemp["u_z_max"]) * 0.5,
            "x_dimension": mountedTemp["u_x_max"] - mountedTemp["u_x_min"],
            "y_dimension": mountedTemp["u_y_max"] - mountedTemp["u_y_min"],
            "z_dimension": mountedTemp["u_z_max"] - mountedTemp["u_z_min"]
          },
          "data" : {
            "ci_name": mountedTemp["ci_name"],
            "ci_sys_id": mountedTemp["ci_sys_id"],
            "sys_id": mountedTemp["sys_id"]
          },
          "display": {
            "asset_tag": mountedTemp["asset_tag"],
            "ci_u_cmdb_ci_status_name": mountedTemp["ci_u_cmdb_ci_status_name"],
            "ci_u_provision_date": mountedTemp["ci_u_provision_date"],
            "collision": mountedTemp["collision"],
            "model_category_name": mountedTemp["model_category_name"],
            "model_u_end_of_life": mountedTemp["model_u_end_of_life"],
            "model_name": mountedTemp["model_name"],
            "model_rack_units": mountedTemp["model_rack_units"],
            "support_group_manager_email": mountedTemp["support_group_manager_email"],
            "sys_class_name": mountedTemp["sys_class_name"],
            "u_smdb_table": mountedTemp["u_smdb_table"],
            "u_last_audit_date": mountedTemp["u_last_audit_date"],
            "serial_number": mountedTemp["serial_number"]
          }
        }
      })
      var allData = {}
      allData["room"] = {}
      allData["room"]["room_name"] = roomName;
      allData["camera"] = cameraData;
      allData["mounted"] = mountedObject;
      allData["scenery"] = sceneObject;
      allData["racks"] = rackObject;
      data.allData = allData;
          if (true){
        data.roomName = roomName;
        data.rackData = rackData;
        data.mountedData = mountedData;
        data.sceneryData = sceneryData;
        data.cameraData = cameraData;
          }
          */
          
    }
    // generate power data
    if (input && input.getPower){
      getPowerData(input.roomName);
    }
    /**
     * @function getRoomName
     * @description gets the room name
     * @param {string} roomSysid - the room sys_id
     * @returns {string} roomName - the name of the room
     */
    function getRoomName(roomSysid){
      var grRoom = new GlideRecord("cmdb_ci_computer_room");
      grRoom.get(roomSysid);
      grRoom.query();
      while (grRoom.next()){
        roomName = grRoom.getValue("name");
      }
      return roomName;
    }
    /**
     * @function getbasicRackData
     * @description finds the rows, then the racks, then the rack names
     * @param {string} roomSysid - the room sys_id
     * @returns {Array.<Object>} basicRackData - the basic rack data
     */
    function getbasicRackData(roomSysid){
      var rowSysidList = [];
      var rackSysidList = [];
      var basicRackData = [];
      // query rows parented to the room
      var grRowRel = new GlideRecord("cmdb_rel_ci");
      grRowRel.addQuery("parent", roomSysid);
      grRowRel.query();
      while (grRowRel.next()){
        if ( rowSysidList.indexOf(grRowRel.getValue("child")) < 0 ) {
          rowSysidList.push(grRowRel.getValue("child"));
        }
      }
      // batch query racks parented to the rows
      var grRackRel = new GlideRecord("cmdb_rel_ci");
      grRackRel.addQuery("parent", "IN", rowSysidList);
      grRackRel.limit(rowSysidList.length);
      grRackRel.query();
      while (grRackRel.next()){
        if ( rackSysidList.indexOf(grRackRel.getValue("child")) < 0 ) {
          rackSysidList.push(grRackRel.getValue("child"));
        }
      }
      // batch query rack data
      var grRack = new GlideRecord("cmdb_ci_rack");
      grRack.addQuery("sys_id", "IN", rackSysidList);
      grRack.limit(rackSysidList.length);
      grRack.query();
      while (grRack.next()){
        basicRackData.push({
          "name": grRack.name.getValue(),
          "sys_id": grRack.sys_id.getValue(),
          "rack_units": grRack.rack_units.getValue()
        });
      }
      return basicRackData;
    }
    /**
     * @function getXyzRackData
     * @description adds xyz data to the racks
     * @param {Array.<Object>} rackDesignData - the data from getRackDesignData()
     * @param {Array.<Object>} rackDesignData - the data from getRackDesignData()
     * @returns {Array.<Object>} xyzRackData - the basic rack data plus design data plus xyz data
     */
    function getXyzRackData(basicRackData,rackDesignData){
      var unitHeight = 0.0445;
      var filteredRacks = [];
      var rackNameList = [];
      var rackMetaData = {};
      var xyzRackData = [];
      var unplacedRacks = [];
      var unplacedRackName = [];
      var unplacedData = {};
      var unplacedCount = 0;
      // filter racks out if they have rack design, but
      basicRackData.forEach(function(rack){
        if (rackDesignData.hasOwnProperty(rack["name"])){
          if (rackDesignData[rack["name"]]["u_rack_state"] == "Landed"){
            filteredRacks.push(rack);
          }
        } else {
            filteredRacks.push(rack);
        }
      });
      // gather rack names
      rackNameList = filteredRacks.map(function(rack){return rack["name"]});
      // get the 3d rack data
      var grRackMetadata = new GlideRecord("u_dcse_vr_rack");
      grRackMetadata.addQuery("u_rack_name", "IN", rackNameList);
      grRackMetadata.query();
      while (grRackMetadata.next()){
        rackMetaData[grRackMetadata.u_rack_name.getValue()] = {
          "u_x_aligned": parseInt(grRackMetadata.u_x_aligned.getValue()),
          "u_x_min": parseFloat(grRackMetadata.u_x_min.getValue()),
          "u_x_max": parseFloat(grRackMetadata.u_x_max.getValue()),
          "u_y_min": parseFloat(grRackMetadata.u_y_min.getValue()),
          "u_y_max": parseFloat(grRackMetadata.u_y_max.getValue()),
          "u_z_min": parseFloat(grRackMetadata.u_z_min.getValue()),
          "u_z_max": parseFloat(grRackMetadata.u_z_max.getValue()),
          "u_z_unit_start": parseFloat(grRackMetadata.u_z_unit_start.getValue())
        }
      }
      // combine data
      filteredRacks.forEach(function(rack){
        if (rackMetaData.hasOwnProperty(rack["name"])){
            xyzRackData.push({
              "name": rack["name"],
              "blocktype": "rack",
              "sys_id": rack["sys_id"],
              "rack_units": rack["rack_units"],
              "u_x_aligned": rackMetaData[rack["name"]]["u_x_aligned"],
              "u_x_min": rackMetaData[rack["name"]]["u_x_min"],
              "u_x_max": rackMetaData[rack["name"]]["u_x_max"],
              "u_y_min": rackMetaData[rack["name"]]["u_y_min"],
              "u_y_max": rackMetaData[rack["name"]]["u_y_max"],
              "u_z_min": rackMetaData[rack["name"]]["u_z_min"],
              "u_z_max": rackMetaData[rack["name"]]["u_z_max"],
              "u_z_unit_start": rackMetaData[rack["name"]]["u_z_unit_start"],
              "u_lines": 1,
              "u_red": 0.8,
              "u_green": 0.8,
              "u_blue": 0.8
            })
          } else {
            unplacedRacks.push(rack);
          }
      })
      // process orphan racks
      unplacedRacks.forEach(function(unplaced){
        unplacedRackName.push(unplaced["name"]);
        unplacedData[unplaced["name"]]  = {
          "sys_id": unplaced["sys_id"],
          "rack_units": unplaced["rack_units"]
        }
      });
      unplacedRackName.sort();
      unplacedRackName.forEach(function(unplacedName){
        xyzRackData.push({
          "name": unplacedName,
          "blocktype": "rack",
          "sys_id": unplacedData[unplacedName]["sys_id"],
          "rack_units": unplacedData[unplacedName]["rack_units"],
          "u_x_aligned": false,
          "u_x_min": unplacedCount,
          "u_x_max": unplacedCount + 0.8,
          "u_y_min": -2.0,
          "u_y_max": -1.0,
          "u_z_min": 0,
          "u_z_max": 3.0,
          "u_z_unit_start": 0.1,
          "u_lines": 1,
          "u_red": 0.8,
          "u_green": 0.8,
          "u_blue": 0.8
        })
        unplacedCount += 1;
      });
      return xyzRackData;
    }
    /**
     * @function getRackDesignData
     * @description adds the rack design data to the xyz rack data
     * @param {Array.<Object>} xyzRackData - the xyz rack data from getXyzRackData()
     * @returns {Array.<Object>} rackDesignData - rack data with rack design added
     */
    function getRackDesignData(xyzRackData){
      var rackDesignData = [];
      var rackNameList = [];
      var tempDesignData = {};
      var rackDesignData = [];
      xyzRackData.forEach(function(rack){
        rackNameList.push(rack["name"]);
      });
      var grRackFlat = new GlideRecord("u_dcse_rack_design_detail");
      grRackFlat.addQuery("u_rack_name", "IN", rackNameList);
      grRackFlat.query();
      while (grRackFlat.next()){
        tempDesignData[grRackFlat.getValue("u_rack_name")] = {
          "u_rack_state": grRackFlat.getValue("u_rack_state"),
          "u_max_alloc": parseInt(grRackFlat.getValue("u_max_alloc")),
          "u_qty_alloc": parseInt(grRackFlat.getValue("u_qty_alloc")),
          "u_environment": grRackFlat.getValue("u_environment"),
          "u_allocated_kw": parseFloat(grRackFlat.getValue("u_allocated_kw")),
          "u_equip_design_kw": parseFloat(grRackFlat.getValue("u_equip_design_kw")),
          "u_facil_design_kw": parseFloat(grRackFlat.getValue("u_facil_design_kw")),
          "u_equip_kw_consume_design": parseFloat(grRackFlat.getValue("u_equip_kw_consume_design"))
        }
      }
      xyzRackData.forEach(function(rack){
        if (tempDesignData.hasOwnProperty(rack["name"])){
          if (tempDesignData[rack["name"]]["u_rack_state"] == "Landed"){
            rackDesignData.push({
              "name": rack["name"],
              "blocktype": rack["blocktype"],
              "sys_id": rack["sys_id"],
              "rack_units": rack["rack_units"],
              "u_x_aligned": rack["u_x_aligned"],
              "u_x_min": rack["u_x_min"],
              "u_x_max": rack["u_x_max"],
              "u_y_min": rack["u_y_min"],
              "u_y_max": rack["u_y_max"],
              "u_z_min": rack["u_z_min"],
              "u_z_max": rack["u_z_max"],
              "u_z_unit_start": rack["u_z_unit_start"],
              "u_lines": rack["u_lines"],
              "u_red": rack["u_red"],
              "u_green": rack["u_green"],
              "u_blue": rack["u_blue"],
              "u_rack_state": tempDesignData[rack["name"]]["u_rack_state"],
              "u_max_alloc": tempDesignData[rack["name"]]["u_max_alloc"],
              "u_qty_alloc": tempDesignData[rack["name"]]["u_qty_alloc"],
              "u_environment": tempDesignData[rack["name"]]["u_environment"],
              "u_allocated_kw": tempDesignData[rack["name"]]["u_allocated_kw"],
              "u_equip_design_kw": tempDesignData[rack["name"]]["u_equip_design_kw"],
              "u_facil_design_kw": tempDesignData[rack["name"]]["u_facil_design_kw"],
              "u_equip_kw_consume_design": tempDesignData[rack["name"]]["u_equip_kw_consume_design"]
            })
          }
        } else {
          rackDesignData.push({
            "name": rack["name"],
            "blocktype": rack["blocktype"],
            "sys_id": rack["sys_id"],
            "rack_units": rack["rack_units"],
            "u_x_aligned": rack["u_x_aligned"],
            "u_x_min": rack["u_x_min"],
            "u_x_max": rack["u_x_max"],
            "u_y_min": rack["u_y_min"],
            "u_y_max": rack["u_y_max"],
            "u_z_min": rack["u_z_min"],
            "u_z_max": rack["u_z_max"],
            "u_z_unit_start": rack["u_z_unit_start"],
            "u_lines": rack["u_lines"],
            "u_red": rack["u_red"],
            "u_green": rack["u_green"],
            "u_blue": rack["u_blue"],
            "u_rack_state": "Data missing",
            "u_max_alloc": "Data missing",
            "u_qty_alloc": "Data missing",
            "u_environment": "Data missing",
            "u_allocated_kw": "Data missing",
            "u_equip_design_kw": "Data missing",
            "u_facil_design_kw": "Data missing",
            "u_equip_kw_consume_design": "Data missing"
          })
        }
      })
      return rackDesignData;
    }
    /**
     * @function getHardWare
     * @description finds rack mounted objects in alm_hardware that match the rack names
     * @param {Array.<Object>} rackData - rack data which contains the rack names needed to match
     * @returns {Array.<Object>} hardwareData - basic hardware data
     */
    function getHardWare(rackData){
      var rackSysidList = [];
      var hardwareData = [];
      rackData.forEach(function(rack){
        if (rackSysidList.indexOf(rack['sys_id']) < 0){
          rackSysidList.push(rack['sys_id']);
        }
      });
      if (rackSysidList.length > 0){
        var grAlmHardware = new GlideRecord('alm_hardware');
        grAlmHardware.addQuery('u_rack', 'IN', rackSysidList);
        grAlmHardware.addNullQuery('parent.sys_id');
        grAlmHardware.addNullQuery('u_slot');
        grAlmHardware.addNotNullQuery('u_rack_u');
        grAlmHardware.addQuery('u_rack_u', '>', 0);
        grAlmHardware.addNotNullQuery('model.rack_units');
        grAlmHardware.addQuery('model.rack_units', '!=', 0);
        //grAlmHardware.setLimit(100);
        grAlmHardware.query();
        while (grAlmHardware.next()) {
          hardwareData.push({
            asset_tag: grAlmHardware.asset_tag.getValue(),
            ci_name: grAlmHardware.ci.name.getValue(),
            ci_sys_id: grAlmHardware.ci.sys_id.getValue(),
            ci_u_cmdb_ci_status_name: grAlmHardware.ci.u_cmdb_ci_status.name.getValue(),
            ci_u_provision_date: grAlmHardware.ci.u_provision_date.getValue(),
            model_category_name: grAlmHardware.model_category.name.getValue(),
            model_name: grAlmHardware.model.name.getValue(),
            model_rack_units: parseInt(grAlmHardware.model.rack_units.getValue()),
            model_u_end_of_life: grAlmHardware.model.u_end_of_life.getValue(),
            serial_number: grAlmHardware.serial_number.getValue(),
            support_group_manager_email: grAlmHardware.support_group.manager.email.getValue(),
            support_group_name: grAlmHardware.support_group.name.getValue(),
            support_group_u_slack_channel: grAlmHardware.support_group.u_slack_channel.getValue(),
            sys_class_name: grAlmHardware.sys_class_name.getValue(),
            sys_id: grAlmHardware.sys_id.getValue(),
            u_last_audit_date: grAlmHardware.u_last_audit_date.getValue(),
            u_rack_u: parseInt(parseInt(grAlmHardware.u_rack_u.getValue())),
            u_slot: parseInt(grAlmHardware.u_slot.getValue()),
            u_rack_name: grAlmHardware.u_rack.name.getValue(),
            u_rack_sys_id: grAlmHardware.u_rack.sys_id.getValue(),
            u_smdb_table: grAlmHardware.u_smdb_table.getValue(),
            u_last_audit_date: grAlmHardware.u_last_audit_date.getValue()
          });
        }
      }
      return hardwareData;
    }
    /**
     * @function generateBlocks
     * @description matches the hardware to the racks, generates 3d blocks
     * @param {Array.<Object>} rackData - the data about the racks
     * @param {Array.<Object>} unsortedHardware - the sorted hardware data from alm_hardware
     * @returns {Array.<Object>} blockData - basic hardware data as 3d blocks
     */
    function generateBlocks(rackData,unsortedHardware){
      var matchingBlocks = [];
      var xMin = 0;
      var xMax = 0;
      var yMin = 0;
      var yMax = 0;
      var zMin = 0;
      var zMax = 0;
      var rackXMin = 0;
      var rackXMax = 0;
      var rackYMin = 0;
      var rackYMax = 0;
      var rackZMin = 0;
      var rackZUnitStart = 0;
      var unitHeight = 0.0445;
      var collisions = {};
      var collision = true;
      var mountedData = {};
      var blockName = "";
      // find matching servers
      rackData.forEach(function(rack){
        rackXMin = rack['u_x_min'];
        rackXMax = rack['u_x_max'];
        rackYMin = rack['u_y_min'];
        rackYMax = rack['u_y_max'];
        rackZMin = rack['u_z_min'];
        rackZUnitStart = rack['u_z_unit_start'];
        matchingBlocks = [];
        unsortedHardware.forEach(function(server){
          if (server['u_rack_sys_id'] == rack['sys_id']){
            matchingBlocks.push(server);
          }
        })
        // generate collision data
        collisions = countRackUnitUsage(matchingBlocks);
        // process matching blocks
        matchingBlocks.forEach(function(block){
          if (rack["u_x_aligned"] == 1){
            xMin = rackXMin - 0.01;
            xMax = rackXMax + 0.01;
            yMin = rackYMin + 0.1;
            yMax = rackYMax - 0.1;
          } else {
            xMin = rackXMin + 0.1;
            xMax = rackXMax - 0.1;
            yMin = rackYMin - 0.01;
            yMax = rackYMax + 0.01;
          }
          zMin = rackZMin + rackZUnitStart + ((block['u_rack_u'] - 1) * unitHeight) + 0.002;
          zMax = rackZMin + rackZUnitStart + ((block['u_rack_u'] - 1) * unitHeight) + (block['model_rack_units'] * unitHeight) - 0.002;
          collision = serverCollisionTest(block,collisions);
          blockName = "alm_hardware_" + block["sys_id"]
          mountedData[blockName] =new PrepareBlock(block,collision,xMin,xMax,yMin,yMax,zMin,zMax);
  
        });
      });
      return mountedData;
    }
    /**
     * @function PrepareBlock
     * @description a constructor that assembles the parts into a 3d block
     * @param {object} block - the hardware the block is being created for
     * @param {boolean} collision - whether the block collides with another
     * @param {string} xMin - the minimum x value
     * @param {string} xMax - the maximum x value
     * @param {string} yMin - the minimum y value
     * @param {string} yMax - the maximum y value
     * @param {string} zMin - the minimum z value
     * @param {string} zMax - the maximum z value
     */
    function PrepareBlock(block,collision,xMin,xMax,yMin,yMax,zMin,zMax){
      this.asset_tag = block['asset_tag'];
      this.blocktype = "hardware";
      this.ci_name = block['ci_name'];
      this.ci_sys_id = block['ci_sys_id'];
      this.ci_sys_updated_on = block['ci_sys_updated_on'];
      this.ci_u_cmdb_ci_status_name = block['ci_u_cmdb_ci_status_name'];
      this.ci_u_provision_date = block['ci_u_provision_date'];
      this.u_lines = 1;
      if (block['model_category_name']){
        this.model_category_name = block['model_category_name'];
      }
      if (block['model_name']){
        this.model_name = block['model_name'];
      } else {
        this.model_name = 'Model Name missing';
      }
      this.model_rack_units = block['model_rack_units'];
      this.model_u_end_of_life = block['model_u_end_of_life'];
      this.serial_number = block['serial_number'];
      this.support_group_manager_email = block['support_group_manager_email'];
      if (!block['support_group_name']){
        this.support_group_name = "No Support Group";
      } else {
        this.support_group_name = block['support_group_name'];
      }
      this.support_group_u_slack_channel = block['support_group_u_slack_channel'];
      this.sys_class_name = block['sys_class_name'];
      this.sys_id = block['sys_id'];
      this.u_last_audit_date = block['u_last_audit_date'];
      this.u_rack_u = block['u_rack_u'];
      this.u_slot = block['u_slot'];
      this.u_rack_name = block['u_rack_name'];
      this.u_rack_sys_id = block['u_rack_sys_id'];
      this.u_smdb_table = block['u_smdb_table'];
      this.u_last_audit_date = block['u_last_audit_date'];
      this.collision = collision;
      this.u_x_min = xMin;
      this.u_x_max = xMax;
      this.u_y_min = yMin;
      this.u_y_max = yMax;
      this.u_z_min = zMin;
      this.u_z_max = zMax;
    }
    /**
     * @function countRackUnitUsage
     * @description generates a count of how many times a rack unit has been used. detects collisions
     * @param {Array.<Object>} matchingBlocks - all the hardware matching a rack
     * @returns {Object} unitUsage - the records of unit usage
     */
    function countRackUnitUsage(matchingBlocks){
      var unitLoop = 0;
      var unitUsage = {};
      var unit = 0;
      matchingBlocks.forEach(function(tempRack){
        for (unitLoop = 0; unitLoop < tempRack['model_rack_units']; unitLoop++){
          unit = tempRack['u_rack_u'] + unitLoop;
          if (unit in unitUsage){
            unitUsage[unit] += 1;
          } else {
            unitUsage[unit] = 1;
          }
        }
      });
      return unitUsage;
    }
    /**
     * @function serverCollisionTest
     * @description xxxxxxxxxxx
     * @param {Object} server - the server being tested for unit collisions
     * @param {Object} rackUnitUsage - the records of unit usage from countRackUnitUsage()
     * @returns {boolean} unitCollision - did a collision occur
     */
    function serverCollisionTest(server,rackUnitUsage){
      var unitCollision = false;
      var unit;
      for (unitLoop = 0; unitLoop < server['model_rack_units']; unitLoop++){
        unit = server['u_rack_u'] + unitLoop;
        if (rackUnitUsage[unit] > 1){
          unitCollision = true;
        }
      }
      return unitCollision;
    }
    /**
     * @function getPowerData
     * @description generate a visualisation to show power usage of racks
     * @param {Array.<Object>} rackData - the rack data
     * @param {string} roomName - the name of the room
     */
    function getPowerData(roomName) {
      var batchQueryId;
      var powerIqAverage = {};
      var powerIqData = [];
      var powerIqMax = {};
      var rackPowerUnprocessed = {};
      var roomMaxPower = 0;
      var grBatchId = new GlideRecord('u_poweriq_batch_control');
      grBatchId.orderByDesc('u_batch_id');
      grBatchId.addQuery("u_import_complete", true);
      grBatchId.setLimit(1);
      grBatchId.query();
      while (grBatchId.next()) {
        batchQueryId = grBatchId.getValue('u_batch_id');
      }
      var grPowerBatch = new GlideRecord('u_poweriq_staging');
      grPowerBatch.addQuery('u_batch_id.u_batch_id', batchQueryId);
      grPowerBatch.addQuery('u_room_name', roomName);
      grPowerBatch.query();
      while (grPowerBatch.next()) {
        powerIqData.push({
          u_rack_name: grPowerBatch.getValue('u_rack_name'),
          u_average_active_power: parseInt(grPowerBatch.getValue('u_average_active_power')),
          u_maximum_active_power: parseInt(grPowerBatch.getValue('u_maximum_active_power'))
        });
      }
      // sort data into an object where the rack name is key and the value is 2 arrays
      powerIqData.forEach(function(reading){
        if (!rackPowerUnprocessed.hasOwnProperty(reading["u_rack_name"])){
          rackPowerUnprocessed[reading["u_rack_name"]] = {};
          rackPowerUnprocessed[reading["u_rack_name"]]["maximum"] = [];
          rackPowerUnprocessed[reading["u_rack_name"]]["maximum"].push(reading["u_maximum_active_power"]);
          rackPowerUnprocessed[reading["u_rack_name"]]["average"] = [];
          rackPowerUnprocessed[reading["u_rack_name"]]["average"].push(reading["u_average_active_power"]);
        } else {
          rackPowerUnprocessed[reading["u_rack_name"]]["average"].push(reading["u_average_active_power"]);
          rackPowerUnprocessed[reading["u_rack_name"]]["maximum"].push(reading["u_maximum_active_power"]);
        }
      });
      // process the results into maximum and averages
      Object.keys(rackPowerUnprocessed).forEach(function(rackName){
        powerIqAverage[rackName] = rackPowerUnprocessed[rackName]["average"].reduce(function(a, b){return a + b;}, 0) / rackPowerUnprocessed[rackName]["average"].length;
        powerIqMax[rackName] = Math.max.apply(null, rackPowerUnprocessed[rackName]["maximum"].map(function(power){return power}));
        if (powerIqMax[rackName] > roomMaxPower){
          roomMaxPower = powerIqMax[rackName];
        }
      })
      data.powerIqMax = powerIqMax;
      data.powerIqAverage = powerIqAverage;
      data.roomMaxPower = roomMaxPower;
    }
    /**
     * @function addScenery
     * @description adds scenery. will later be replaced by a table
     * @param {string} roomName - the name of the room
     * @returns {Array.<Object>} sceneryData - 3d blocks that are not racks or rack mounted
     */
    function addScenery(roomName){
      var sceneryData = [];
      var grScenery = new GlideRecord('u_dcse_vr_scene');
      grScenery.addQuery('u_room_name', roomName);
      grScenery.query();
      while (grScenery.next()) {
        sceneryData.push({
          'u_room_name': grScenery.u_room_name.getValue(),
          'block_name': 'scene_' + grScenery.sys_id.getValue(),
          'u_tag': grScenery.u_tag.getValue(),
          'sys_id': grScenery.sys_id.getValue(),
          'u_lines': parseInt(grScenery.u_lines.getValue()),
          'u_x_min': parseFloat(grScenery.u_x_min.getValue()),
          'u_x_max': parseFloat(grScenery.u_x_max.getValue()),
          'u_y_min': parseFloat(grScenery.u_y_min.getValue()),
          'u_y_max': parseFloat(grScenery.u_y_max.getValue()),
          'u_z_min': parseFloat(grScenery.u_z_min.getValue()),
          'u_z_max': parseFloat(grScenery.u_z_max.getValue()),
          'u_red': parseFloat(grScenery.u_red.getValue()),
          'u_green': parseFloat(grScenery.u_green.getValue()),
          'u_blue': parseFloat(grScenery.u_blue.getValue())
        })
      }
      return sceneryData;
    }
    /**
     * @function getCamera
     * @description contains the start position and rotation of the camera. will later be replaced with a table
     * @param {string} roomName - the name of the room
     * @returns {Object} cameraData - the starting position and rotation of the camera
     */
    function getCamera(roomName){
      var cameraData = {
          "camera_position_x": -7.0,
          "camera_position_y": 1.8,
          "camera_position_z": 3.0,
          "camera_rotation_x": -1.57079635,
          "camera_rotation_y": -1.57079635,
          "camera_rotation_z": -1.57079635
      }
      var grCamera = new GlideRecord('u_dcse_vr_camera');
      grCamera.addQuery('u_room_name', roomName);
      grCamera.query();
      while (grCamera.next()){
        cameraData["camera_position_x"] = parseFloat(grCamera.u_x_position.getValue());
        cameraData["camera_position_y"] = parseFloat(grCamera.u_y_position.getValue());
        cameraData["camera_position_z"] = parseFloat(grCamera.u_z_position.getValue());
        cameraData["camera_rotation_x"] = parseFloat(grCamera.u_x_rotation.getValue());
        cameraData["camera_rotation_y"] = parseFloat(grCamera.u_y_rotation.getValue());
        cameraData["camera_rotation_z"] = parseFloat(grCamera.u_z_rotation.getValue());
      }
      return cameraData;
    }
  })();