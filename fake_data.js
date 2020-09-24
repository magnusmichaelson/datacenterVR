"use strict";
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
