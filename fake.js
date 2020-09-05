function fakeAllData() {
    var allData = {};
    var rackMax = 20;
    var roomXDimension;
    var roomYDimension;
    var rowMax = 6;
    roomXDimension = 8 + (rackMax * 0.6);
    roomYDimension = 8 + (((rowMax * 2) - 1) * 1.2);
    allData["room"] = {};
    allData["room"]["room_name"] = "roomName";
    allData["camera"] = {
        "camera_position_x": 5.672,
        "camera_position_y": 14.360,
        "camera_position_z": 2.274,
        "camera_rotation_x": -2.065,
        "camera_rotation_y": -0.224,
        "camera_rotation_z": -2.752
    };
    [5.672, 14.360, 2.274, -2.065, -0.224, -2.752];
    allData["scene"] = fakeScene(roomXDimension, roomYDimension);
    allData["racks"] = fakeRacks(rowMax, rackMax);
    allData["mount"] = fakeMount(allData["racks"]);
    allData["empty"] = fakeEmpty(allData["racks"]);
    return allData;
}
function fakeScene(roomXDimension, roomYDimension) {
    var scene = {};
    scene["floor"] = {
        "block": {
            "draw_lines": 0,
            "rgb_block_red": 0.8,
            "rgb_block_green": 0.8,
            "rgb_block_blue": 0.8,
            "rgb_line_red": 0.0,
            "rgb_line_green": 0.0,
            "rgb_line_blue": 0.0,
            "x_location": roomXDimension * 0.5,
            "y_location": roomYDimension * 0.5,
            "z_location": -0.1,
            "x_dimension": roomXDimension,
            "y_dimension": roomYDimension,
            "z_dimension": 0.2
        },
        'sys_id': 0,
        'tag': "building"
    };
    scene["x_min_wall"] = {
        "block": {
            "draw_lines": 0,
            "rgb_block_red": 0.85,
            "rgb_block_green": 0.85,
            "rgb_block_blue": 0.85,
            "rgb_line_red": 0.0,
            "rgb_line_green": 0.0,
            "rgb_line_blue": 0.0,
            "x_location": -0.1,
            "y_location": roomYDimension * 0.5,
            "z_location": 1.5,
            "x_dimension": 0.2,
            "y_dimension": roomYDimension,
            "z_dimension": 3
        },
        'sys_id': 1,
        'tag': "building"
    };
    scene["x_max_wall"] = {
        "block": {
            "draw_lines": 0,
            "rgb_block_red": 0.85,
            "rgb_block_green": 0.85,
            "rgb_block_blue": 0.85,
            "rgb_line_red": 0.0,
            "rgb_line_green": 0.0,
            "rgb_line_blue": 0.0,
            "x_location": roomXDimension + 0.1,
            "y_location": roomYDimension * 0.5,
            "z_location": 1.5,
            "x_dimension": 0.2,
            "y_dimension": roomYDimension,
            "z_dimension": 3
        },
        'sys_id': 2,
        'tag': "building"
    };
    scene["y_min_wall"] = {
        "block": {
            "draw_lines": 0,
            "rgb_block_red": 0.75,
            "rgb_block_green": 0.75,
            "rgb_block_blue": 0.75,
            "rgb_line_red": 0.0,
            "rgb_line_green": 0.0,
            "rgb_line_blue": 0.0,
            "x_location": roomXDimension * 0.5,
            "y_location": -0.1,
            "z_location": 1.5,
            "x_dimension": roomXDimension,
            "y_dimension": 0.2,
            "z_dimension": 3
        },
        'sys_id': 3,
        'tag': "building"
    };
    scene["y_max_wall"] = {
        "block": {
            "draw_lines": 0,
            "rgb_block_red": 0.75,
            "rgb_block_green": 0.75,
            "rgb_block_blue": 0.75,
            "rgb_line_red": 0.0,
            "rgb_line_green": 0.0,
            "rgb_line_blue": 0.0,
            "x_location": roomXDimension * 0.5,
            "y_location": roomYDimension + 0.1,
            "z_location": 1.5,
            "x_dimension": roomXDimension,
            "y_dimension": 0.2,
            "z_dimension": 3
        },
        'sys_id': 4,
        'tag': "building"
    };
    return scene;
}
function fakeMount(rackData) {
    var dateNow;
    var endOfLife;
    var fakedates;
    var mountCount = 0;
    var mountData = {};
    var mountName = "";
    var rack = {};
    var seconds;
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
        rack = rackData[rackName];
        if (rack["facing"] == 0) {
            xLocation = rack["block"]["x_location"] - (rack["block"]["x_dimension"] * 0.5) - 0.009;
            yLocation = rack["block"]["y_location"];
            xDimension = 0.016;
            yDimension = rack["block"]["y_dimension"] * 0.9;
        }
        if (rack["facing"] == 1) {
            xLocation = rack["block"]["x_location"];
            yLocation = rack["block"]["y_location"] + (rack["block"]["y_dimension"] * 0.5) + 0.009;
            xDimension = rack["block"]["x_dimension"] * 0.9;
            yDimension = 0.016;
        }
        if (rack["facing"] == 2) {
            xLocation = rack["block"]["x_location"] + (rack["block"]["x_dimension"] * 0.5) + 0.009;
            yLocation = rack["block"]["y_location"];
            xDimension = 0.016;
            yDimension = rack["block"]["y_dimension"] * 0.9;
        }
        if (rack["facing"] == 3) {
            xLocation = rack["block"]["x_location"];
            yLocation = rack["block"]["y_location"] - (rack["block"]["y_dimension"] * 0.5) - 0.009;
            xDimension = rack["block"]["x_dimension"] * 0.9;
            yDimension = 0.016;
        }
        zStart = rack["block"]["z_location"] - (rack["block"]["z_dimension"] * 0.5) + (unitHeight * 2);
        for (zLoop = 0; zLoop < 10; zLoop++) {
            unitCount = (zLoop * 2);
            zDimension = (unitHeight * 2) - 0.002;
            zLocation = zStart + (unitCount * unitHeight) + unitHeight;
            mountName = "server_" + mountCount;
            if (Math.random() > 0.95) {
                endOfLife = 1;
            }
            else {
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
            };
            mountCount += 1;
        }
        for (zLoop = 0; zLoop < 3; zLoop++) {
            unitCount = 20 + zLoop;
            zDimension = unitHeight - 0.002;
            zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 0.5);
            mountName = "network_" + mountCount;
            if (Math.random() > 0.95) {
                endOfLife = 1;
            }
            else {
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
            };
            mountCount += 1;
        }
        for (zLoop = 0; zLoop < 4; zLoop++) {
            unitCount = 23 + zLoop * 4;
            zDimension = (unitHeight * 4) - 0.002;
            zLocation = zStart + (unitCount * unitHeight) + (unitHeight * 2);
            mountName = "server_" + mountCount;
            if (Math.random() > 0.95) {
                endOfLife = 1;
            }
            else {
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
            };
            mountCount += 1;
        }
    });
    return mountData;
}
function fakeEmpty(rackData) {
    var emptyCount = 0;
    var emptyData = {};
    var rack = {};
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
    Object.keys(rackData).forEach(function (rackName) {
        rack = rackData[rackName];
        if (rack["facing"] == 0) {
            xLocation = rack["block"]["x_location"] - (rack["block"]["x_dimension"] * 0.5) - 0.002;
            yLocation = rack["block"]["y_location"];
            xDimension = 0.002;
            yDimension = rack["block"]["y_dimension"] * 0.9;
        }
        if (rack["facing"] == 1) {
            xLocation = rack["block"]["x_location"];
            yLocation = rack["block"]["y_location"] + (rack["block"]["y_dimension"] * 0.5) + 0.002;
            xDimension = rack["block"]["x_dimension"] * 0.9;
            yDimension = 0.002;
        }
        if (rack["facing"] == 2) {
            xLocation = rack["block"]["x_location"] + (rack["block"]["x_dimension"] * 0.5) + 0.002;
            yLocation = rack["block"]["y_location"];
            xDimension = 0.002;
            yDimension = rack["block"]["y_dimension"] * 0.9;
        }
        if (rack["facing"] == 3) {
            xLocation = rack["block"]["x_location"];
            yLocation = rack["block"]["y_location"] - (rack["block"]["y_dimension"] * 0.5) - 0.002;
            xDimension = rack["block"]["x_dimension"] * 0.9;
            yDimension = 0.002;
        }
        zStart = rack["block"]["z_location"] - (rack["block"]["z_dimension"] * 0.5) + (unitHeight * 2);
        for (zLoop = 0; zLoop < 11; zLoop++) {
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
            };
            emptyCount += 1;
        }
    });
    return emptyData;
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
function fakePower(allData) {
    var powerData = {};
    var randomPower = 0;
    powerData["racks"] = {};
    Object.keys(allData["racks"]).forEach(function (rackName) {
        if (allData["racks"][rackName]["design"]["u_equip_design_kw"] != "no data") {
            if (allData["racks"][rackName]["design"]["u_equip_design_kw"] > 0) {
                randomPower = Math.random() * 10;
                powerData["racks"][rackName] = {
                    "average": randomPower,
                    "maximum": randomPower * (1.0 + Math.random() * 0.3)
                };
            }
        }
        else {
            randomPower = Math.random() * 10;
            powerData["racks"][rackName] = {
                "average": randomPower,
                "maximum": randomPower * (1.0 + Math.random() * 0.3)
            };
        }
    });
    powerData["room_maximum"] = 13;
    return powerData;
}
function fakeRacks(rowMax, rackMax) {
    var design = {};
    var facing = 0;
    var rackCount = 0;
    var rackData = {};
    var rackName;
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
            rackName = "rack_" + xloop + "_" + yloop;
            design = {
                "u_rack_state": "Landed",
                "u_max_alloc": 10,
                "u_qty_alloc": xloop % 10,
                "u_environment": randomEnvironment(),
                "u_allocated_kw": 10,
                "u_equip_kw_consume_design": 20,
                "u_equip_design_kw": 16,
                "u_facil_design_kw": 12
            };
            if (xloop == rackMax - 1) {
                design = {
                    "u_rack_state": "Landed",
                    "u_max_alloc": 10,
                    "u_qty_alloc": xloop % 10,
                    "u_environment": randomEnvironment(),
                    "u_allocated_kw": 0,
                    "u_equip_kw_consume_design": 0,
                    "u_equip_design_kw": 0,
                    "u_facil_design_kw": 0
                };
            }
            if (yloop == rowMax - 1) {
                design = {
                    "u_rack_state": "no data",
                    "u_max_alloc": "no data",
                    "u_qty_alloc": "no data",
                    "u_environment": "no data",
                    "u_allocated_kw": "no data",
                    "u_equip_design_kw": "no data",
                    "u_facil_design_kw": "no data",
                    "u_equip_kw_consume_design": "no data"
                };
            }
            rackData[rackName] = {
                "block": {
                    "draw_lines": 1,
                    "rgb_block_red": 1,
                    "rgb_block_green": 1,
                    "rgb_block_blue": 1,
                    "rgb_line_red": 0.5,
                    "rgb_line_green": 0.5,
                    "rgb_line_blue": 0.5,
                    "x_location": 4 + 0.3 + (xloop * 0.6),
                    "y_location": 4 + 1.2 + (yloop * 2.4),
                    "z_location": 1.2,
                    "x_dimension": 0.58,
                    "y_dimension": 1.2,
                    "z_dimension": 2.4
                },
                "sys_id": rackCount,
                "rack_units": 50,
                "facing": facing,
                "design": design
            };
            rackCount++;
        }
    }
    return rackData;
}
