var DEVISE_COUNT = 1;
var AREAS_COUNT = 1;
var Devices = new DevicesData();
var map;
var moduleArea;
utilMap = Array();

$(document).ready(function () {
    //Загрузка карты
    map = initialize();
    moduleArea = new ModuleArea(map);
    moduleArea.loadAreas();
    moduleArea.enableListeners();
    Devices.getDevicesFromServerSync();
    Devices.loadGPSDataForDevice();

    //Определяем число устьройств
    DEVISE_COUNT = Devices.listDevice.Device.length;
    AREAS_COUNT = moduleArea.areas.length;

    for (var i = 0; i < DEVISE_COUNT; i++) {
        utilMap.push(new GoogleMap(map, Devices, i));
        //запускаем обновление данных для каждого устройства
        utilMap[i].startFollow();
    }

    for (var i = 0; i < DEVISE_COUNT; i++) {
        dev_row(Devices.listDevice.Device[i].name, i);
        stat_row(Devices.listDevice.Device[i].name, i);
        dev_add_listeners(i);
        path_load_devise(Devices.listDevice.Device[i].name, i)
    }

    for (var i = 0; i < AREAS_COUNT; i++) {
        area_row(moduleArea.areas[i].name, i);
        area_add_listeners(i);
    }

    show_point_for_all_device(DEVISE_COUNT);
    show_line_for_all_device(DEVISE_COUNT);
    show_area_for_all_device(AREAS_COUNT);

    show_dev_settings();
    reg_data_picker();
    save_area();
    showFullStatistic();
    Devices.updateDataOnTimer();
});
/*--------------------------------------------------*/

/**
 * Для каждого устройства добавляем строку в таблицу
 * @param name
 * @param id
 */
function dev_row(name, id) {
    id = id.toString();
    var row = "<tr id='dev-row'>";
    row += "<td colspan='2' id='dev-name-" + id + "' class='dev-name'>" + name + "</td>";
    row += "<td id='point-" + id + "' class='dev-show-point' title='Показать путь в виде точек'></td>";
    row += "<td id='line-" + id + "' class='dev-show-line' title='Показать путь в виде линии'></td>";
    row += "</tr>";
    $("#devises").append(row);
}
/**
 * Для каждой зоны добавляем строку в таблицу
 * @param name
 * @param id
 */
function area_row(name, id) {
    id = id.toString();
    var row = "<tr>";
    row += "<td colspan='2' id='area-name-" + id + "' class='dev-area-name'><span class='area-name'>" + name + "</span></td>";
    row += "<td id='area-" + id + "' class='area-show' title='Показать зону'></td>";
    row += "<td id='area-delete-" + id + "' class='area-delete' title='Удалить зону'></td>";
    row += "</tr>";
    $("#areas").append(row);
}

function stat_row(name, id) {
    var row = "<tr>";
    row += "<td  class='dev-name'; vertical-align:middle;'>" + name + "</td>";
    row += "<td  style='border:1px solid gray; height:20px;  padding:3px; vertical-align:middle;'>" +
            utilMap[id].getAverageSpeed().toFixed(2)*4 +
            " км/ч</td>";
    row += "<td  colspan='2' style='border:1px solid gray; padding:3px; vertical-align:middle;'>" +
            utilMap[id].getDistance().toFixed(2)*4 +
            " км</td>";
    $("#stat-table").append(row);
}

/**
 * Функция скрывает или показывает зону
 * @param id - номер зоны
 * @param is_show - Если true зона показывается, если  false скрывается.
 */
function area_show_or_hide(id, is_show) {
    var area_id = "#area-" + id;
    if (is_show) {
        $(area_id).removeClass();
        $(area_id).addClass("area-show-active");
        moduleArea.insertArea(id);
        moduleArea.areas[id].area_is_showed = true;
    } else {
        $(area_id).removeClass();
        $(area_id).addClass("area-show");
        moduleArea.deleteAreaFromMap(id);
        moduleArea.areas[id].area_is_showed = false;
    }
}
/**
 * Функция скрывает или показывает точки
 * @param id - номер зоны
 * @param is_show - Если true  показывается, если  false скрывается.
 */
function points_show_or_hide(id, is_show) {
    var point_id = "#point-" + id.toString();
    if (is_show) {
        $(point_id).removeClass();
        $(point_id).addClass("dev-show-point-active");
        utilMap[id].insertMarkers();
        utilMap[id].point_is_showed = true;
    } else {
        $(point_id).removeClass();
        $(point_id).addClass("dev-show-point");
        utilMap[id].deleteMarkers();
        utilMap[id].point_is_showed = false;
    }
}
/**
 * Функция скрывает или показывает линии
 * @param id - номер зоны
 * @param is_show - Если true показывается, если  false скрывается.
 */
function line_show_or_hide(id, is_show) {
    var line_id = "#line-" + id.toString();
    if (is_show) {
        $(line_id).removeClass();
        $(line_id).addClass("dev-show-line-active");
        utilMap[id].insertPolyline();
        utilMap[id].line_is_showed = true;
    } else {
        $(line_id).removeClass();
        $(line_id).addClass("dev-show-line");
        utilMap[id].deletePolyline();
        utilMap[id].line_is_showed = false;
    }
}
/**
 * Регистрируем слушателей кнопок показать точки, показать путь
 * @param id
 */
function dev_add_listeners(id) {
    id = id.toString();
    var name_id = "#dev-name-" + id;
    var point_id = "#point-" + id;
    var line_id = "#line-" + id;

    $(point_id).click(function() {
        if (utilMap[id].point_is_showed) {
            points_show_or_hide(id, false);
        } else {
            points_show_or_hide(id, true);
        }
    });

    $(line_id).click(function() {
        if (utilMap[id].line_is_showed) {
            line_show_or_hide(id, false);
        } else {
            line_show_or_hide(id, true);
        }
    });
}

/**
 * Регистрируем слушателей кнопок зоны
 * @param id
 */
function area_add_listeners(id) {
    id = id.toString();
    var area_id = "#area-" + id;
    var area_delete_id = "#area-delete-" + id;
    var area_name_id = "#area-name-" + id + " span";
    $(area_id).click(function() {
        if (moduleArea.areas[id].area_is_showed) {
            area_show_or_hide(id, false);
        } else {
            // показываем зону
            area_show_or_hide(id, true);
            // ставим зону по центру крты
            map.panTo(moduleArea.center(moduleArea.areas[id].path));
//            utilMap[0].getLastPoint();
        }
    });

    $(area_delete_id).click(function() {
        $(function() {
            $("#dialog-delete-area p").remove();
            $("#dialog-delete-area").append("<p>Вы действительно хотите удалить зону - <strong>" + moduleArea.areas[id].name + "</strong></p>");
            $("#dialog-delete-area").dialog({
                resizable: false,
                height:140,
                modal: true,
                buttons: {
                    "Удалить": function() {
                        area_show_or_hide(id, false);
                        if (moduleArea.deleteArea(id)) {
                            $(area_id).parent().remove();
                        }
                        $(this).dialog("close");
                    },
                    "Отмена": function() {
                        $(this).dialog("close");
                    }
                }
            });
        });
    });

    $(area_name_id).click(function() {
        //TODO: добавить код для отображения подсказки в зоне
        //map.panTo(shape.getPath())
        map.panTo(
                new google.maps.LatLng(
                        moduleArea.areas[id].path.getAt(0).lat(),
                        moduleArea.areas[id].path.getAt(0).lng()));
    });
}

/**
 * Слушатель кнопки, показать точки всех устроуств
 * @param count_devises
 */
function show_line_for_all_device(count_devises) {
    $("#line-header").toggle(
                            function() {
                                $(this).removeClass().addClass('dev-show-line-active-all');
                                for (var i = 0; i < count_devises; i++) {
                                    line_show_or_hide(i, true);
                                }
                            },
                            function() {
                                $(this).removeClass().addClass('dev-show-line');
                                for (var i = 0; i < count_devises; i++) {
                                    line_show_or_hide(i, false);
                                }
                            });
}
/**
 * Слушатель кнопки, показать пути всех устроуств
 * @param count_devises
 */
function show_point_for_all_device(count_devises) {
    $("#point-header").toggle(
                             function() {
                                 $(this).removeClass().addClass('dev-show-point-active-all');
                                 for (var i = 0; i < count_devises; i++) {
                                     points_show_or_hide(i, true);
                                 }
                             },
                             function() {
                                 $(this).removeClass().addClass('dev-show-point');
                                 for (var i = 0; i < count_devises; i++) {
                                     points_show_or_hide(i, false);
                                 }
                             });
}

function show_area_for_all_device() {
    $("#area-header").toggle(
                            function() {
                                var count_devises = moduleArea.areas.length;
                                $(this).removeClass().addClass('area-show-active-all');
                                for (var i = 0; i < count_devises; i++) {
                                    area_show_or_hide(i, true);
                                }
                            },
                            function() {
                                var count_devises = moduleArea.areas.length;
                                $(this).removeClass().addClass('area-show');
                                for (var i = 0; i < count_devises; i++) {
                                    area_show_or_hide(i, false);
                                }
                            });
}
/**
 * Функция отображает диалоговое окно згрузки пути
 */
function show_dev_settings() {
    $("#settings-dev-form").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            "Загрузить путь": function() {
                $('#settings-dev-form .ui-state-error').css("visibility", "hidden");
                var start_date = $("#start_date").val();
                var end_date = $("#end_date").val();

                var d_start_date = $('#start_date').datepicker("getDate");
                var d_end_date = $('#end_date').datepicker("getDate");

                if (d_start_date > d_end_date) {
                    $('#settings-dev-form .ui-state-error').text("Начальная дата должна быть меньше конечной. ");
                    $('#settings-dev-form .ui-state-error').css("visibility", "visible");
                } else if ($("#settings-dev-form input:checked").length == 0) {
                    $('#settings-dev-form .ui-state-error').text("Выберите устройство для загрузки. ");
                    $('#settings-dev-form .ui-state-error').css("visibility", "visible");
                }

                for (var i = 0; i < DEVISE_COUNT; i++) {
                    var id_checkbox = '#path-load-checkbox-' + i.toString();

                    if ($(id_checkbox).attr("checked")) {
                        Devices.loadGPSDataForDeviceByDate(i,start_date,end_date);
                        points_show_or_hide(i,true);
                    }
                    $("#settings-dev-form").dialog('close');
                }
            },
            "Отмена": function() {
                $("#settings-dev-form").dialog('close')
            }
        },
        close: function() {
            $('#settings-dev-form .ui-state-error').css("visibility", "hidden");
        }
    });
    $("#settings-header").click(function() {
        $("#settings-dev-form").dialog('open');
        clear_save_are_dialog();
    });
    $("#settings-area-form").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Создать зону": function() {
                clear_save_are_dialog();
                var regexp = new RegExp('([a-zа-я0-9])', 'i');
                var name = $("#new-area-name").val();
                var description = $("#new-area-description").val();
                $('#a-comtent').append("name " + name);
                if (regexp.test(name)) {
                    if (moduleArea.saveArea(name, description, moduleArea.path)) {
                        clear_save_are_dialog();
                        $(this).dialog("close");
                        var lastArea = moduleArea.areas.length - 1;
                        area_row(moduleArea.areas[lastArea].name, lastArea);
                        area_add_listeners(lastArea);
                        $("#area-" + lastArea).triggerHandler("click");

                    } else {
                        $('#settings-area-form .ui-state-error').css("visibility", "visible");
                        $('#settings-area-form .ui-state-error').append("Зона не сохранена.");
                    }
                } else {
                    $('#settings-area-form .ui-state-error').css("visibility", "visible");
                    $('#settings-area-form .ui-state-error').append("Введите имя зоны.")
                }
            },
            "Отмена": function() {
                $(this).dialog("close");
                moduleArea.disableListeners();
                clear_save_are_dialog();
            }
        },
        close: function() {
            moduleArea.disableListeners();
            clear_save_are_dialog()
        }
    });
}
/**
 * Функция очищает поля формы, и убирает сообщения об ошибке
 */
function clear_save_are_dialog() {
    $('#name').val("");
    $('#description').val("");
    $('#settings-area-form .ui-state-error').css("visibility", "hidden");
    $('#settings-area-form .ui-state-error').text("");
}

// Datepicker

function reg_data_picker() {
//    $.datepicker.regional[ "ru" ];
    var today = new Date;
    var string_date = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();

    $('#start_date').val(string_date);
    $('#end_date').val(string_date);
    $('#start_date').datepicker();
    $('#end_date').datepicker();
}
/**
 * Функция загружает строку с устройством в таблицу загрузки пути.
 * @param name
 * @param id
 */
function path_load_devise(name, id) {
    id = id.toString();
    var row = "<tr>"
    row += "<td class='path-load-checkbox-td'><input type='checkbox'  id='path-load-checkbox-" + id + "'></td>";
    row += "<td class='path-load-dev-name-td'>" + name + "</td>";
    row += "</tr>";
    $("#path-load-dev").append(row);
}

function save_area() {
    $("#settings-area-header").click(function() {
        $("#save-area").css("display", "none");
        $("#info-paint-area").css("visibility", "visible");
        moduleArea.paintArea();
    });
    $("#cancel-paint-area").click(function() {
        $("#info-paint-area").css("visibility", "hidden");
        moduleArea.disableListeners();
    });

    $("#save-area-link").click(function() {
        $("#settings-area-form").dialog("open");
        $("#save-area").css("display", "none");
        $("#info-paint-area").css("visibility", "hidden");
        moduleArea.stopPaintArea();
    });
}

function showFullStatistic() {
    $('#full-statistic').toggle(function() {
        $('#full-statistic').removeClass().addClass('stat-show-active');
        $('#maps').css('width', '0%');
        $('#statContainer').css('display', 'block');
        for (var i = 0; i < DEVISE_COUNT; i++) {
            $('#statContainer').append(
                    "<p style='margin:10px; background-color:#dedddd; padding:5px; font-size:18px;'>" +
                            "<span style='color:gray'>Имя устройства:</span> " +
                            Devices.listDevice.Device[i].name + "<br>" +
                            "<span style='color:gray'>IMEI:</span> " +
                            Devices.listDevice.Device[i].imei + "</p>");

            var lineChartId = 'lineChart' + i;

            $('#statContainer').append('<div id="' + lineChartId + '"' +
                    'style="width: 500px; height: 400px;"></div>');

            var tableString = '<table width="80%" class="statTable" border="0" cellpadding="0" style="margin:10px;">' +
                    '<tr class="stTable">' +
                    '<td class="stTableF" align="center">Дата</td>' +
                    '<td class="stTableF" align="center">Широта</td>' +
                    '<td class="stTableF" align="center">Долгота</td>' +
                    '<td class="stTableF" align="center">Скорость</td>' +
                    '</tr>';

            for (var j = 0; j < Devices.listGPSData[i].getLength(); j++) {
                tableString += '<tr class="stTable" align="center">' +
                        '<td  class="stTable">' + Devices.listGPSData[i].getDate(j) + '</td>' +
                        '<td  class="stTable">' + Devices.listGPSData[i].getLat(j) + '</td>' +
                        '<td  class="stTable">' + Devices.listGPSData[i].getLng(j) + '</td>' +
                        '<td  class="stTable">' + Devices.listGPSData[i].getSpeed(j) + '</td>' +
                        '</tr>';
            }
            tableString += '</table><br><br>';
            $('#statContainer').append(tableString);
            drawVisualization(i, lineChartId);
        }
//         $('#statContainer').append('<div id="all-chart"  style="width: 500px; height: 400px;"></div>')
//         drawVisualizationSumChatr('all-chart');

    },function() {
        $('#full-statistic').removeClass().addClass('stat-show');
        $('#maps').css('width', '100%');
        $('#statContainer').css('display', 'none');
    });

    function drawVisualization(index, id) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'x');
        data.addColumn('number', 'Скорость');
        data.addColumn('number', 'Ограничение');

        for (var j = 0; j < Devices.listGPSData[index].getLength(); j++) {
            var sp = Number(Devices.listGPSData[index].getSpeed(j));
            var dt = Devices.listGPSData[index].getDate(j);
            sp *= 4;
            data.addRow([dt, sp, 60]);
        }
        // Create and draw the visualization.
        new google.visualization.LineChart(document.getElementById(id)).
                draw(data, {curveType: "function",
                               width: 1100, height: 300}
                );
    }

//    function drawVisualizationSumChatr(id) {
//        var data = new google.visualization.DataTable();
//        data.addColumn('string', 'x');
//        for (var i = 0; i < DEVISE_COUNT; i++) {
//            data.addColumn('number', i.toString()); // Devices.listGPSData[i].name
//        }
//        data.addRow(['1','2','3']);
//        data.addRow(['1','3','2']);
//        data.addRow(['1','4','1']);
//        data.addRow(['1','5','0']);
////        var row = [];
////        for (var i = 0; i < DEVISE_COUNT; i++) {
////            for (var j = 0; j < Devices.listGPSData[i].getLength(); j++) {
////                var sp = Number(Devices.listGPSData[i].getSpeed(j));
////                var dt = Devices.listGPSData[i].getDate(j);
////                data.addRow([dt, sp]);
////            }
////        }
//        // Create and draw the visualization.
//        new google.visualization.LineChart(document.getElementById(id)).
//                draw(data, {curveType: "function",
//                               width: 1000, height: 300}
//                );
//    }
}