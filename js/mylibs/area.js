function Area() {
    this.id = "";
    this.name = "";
    this.description = "";
    this.path = new google.maps.MVCArray();
    this.area_is_showed = false;
    //this.color = "";
}

function ModuleArea(map) {
    this.areas = new Array();
    this.polygons = new Array();
    this.map = map;
    // Преременная слушателя карты
    this.clickLisner = null;
    this.line = new google.maps.Polyline();
    this.path = new google.maps.MVCArray();
    this.point = new google.maps.LatLng(25.774252, -80.190262);
    this.polygon = null;

    this.overlay = new Array();
    //массив всплавающтх подсказок
    this.infoWindows = Array();
    this.marker = null;
    this.temp = 0;
    this.temp_poly = null;
//
//    this.path.push(new google.maps.LatLng(53.51533979295454, 49.36400538978569));
//    this.path.push(new google.maps.LatLng(53.495022765148526, 49.38494807777397));
//    this.path.push(new google.maps.LatLng(53.48460523706068, 49.33327800331108));

//    var line = new google.maps.Polyline({
//        path: this.path,
//        strokeColor: '#ff0000',
//        strokeOpacity: 1.0,
//        strokeWeight: 2
//    });

//  var line = new google.maps.Polyline({
//    path: path,
//    strokeColor: '#ff0000',
//    strokeOpacity: 1.0,
//    strokeWeight: 2
//  });
//    line.setMap(map);
//    this.marker = new google.maps.Marker({
//        map: this.map,
//        position: this.point,
//        draggable: false
//    });

//    line.setMap(this.map);
}

/**
 * Функция проверяет нахорится ли точка внутри полигона.
 * @param point - Координаты точки google.maps.LatLng.
 * @param polygon -Массив координат полигона google.maps.LatLng.
 */
ModuleArea.prototype.checkPoint = function(point, polygon) {
    var x = point.lat();
    var y = point.lng();
    var xp = new Array();
    var yp = new Array();

    for (var i = 0; i < polygon.getLength(); i++) {
        xp.push(polygon.getAt(i).lat());
        yp.push(polygon.getAt(i).lng());
    }

    var npol = xp.length;
    var j = npol - 1;
    var c = 0;
    for (i = 0; i < npol; i++) {
        if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) &&
                (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
            c = !c;
        }
        j = i;
    }
    return c;
};
/**
 * тестовый метод
 * @param name
 * @param description
 * @param polygon
 */
ModuleArea.prototype.savePolygon = function(name, description, polygon) {
    var dataString = "name=" + name + "&description=" + description + "&polygon=";
    for (var i = 0; i < polygon.length; i++) {
        dataString += polygon.getAt(i).lat() + "|" + polygon.getAt(i).lng() + "|"
    }
    return dataString;

};

ModuleArea.prototype.enableListeners = function() {
    var _this = this;

//    _this.clickLisner = google.maps.event.addListener(_this.map, 'click',
//                                                     function(e) {
//                                                         _this.path.push(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
//                                                         var path = _this.line.getPath();
//                                                         path.push(e.latLng);
//                                                     });

    $('#create-polygon').click(function() {
        _this.paintArea();
    });

    $('#check-point').click(function() {
        if (_this.checkPoint(_this.marker, _this.path)) {
            $('#result').append("point in polygon");
        } else $('#result').append("point out polygon");
    });

    $('#save-polygon').click(function() {
//        $('#result').append(_this.savePolygon("name", "description", _this.path));
        _this.stopPaintArea();
    });

//    $('#test').click(function() {
//        marker1 = new google.maps.Marker({
//            map: _this.map,
//            position: new google.maps.LatLng(25.774252, -80.190262),
//            draggable: false
//        });
//        $('#result').append("test");
//    });
//    $("#settings-area-form").dialog({
//        autoOpen: false,
//        height: 300,
//        width: 350,
//        modal: true,
//        buttons: {
//            "Создать зону": function() {
////                var bValid = true;
////                allFields.removeClass("ui-state-error");
////                $('#result').append(_this.saveArea(name, description, _this.path));
//
//                if (_this.saveArea(name, description, _this.path)) {
//                    $('#result').append("area saved")
//                } else {
//                    $('#result').append("area Not saved")
//                }
//            },
//            "Отмена": function() {
//                $(this).dialog("close");
//
//            }
//        },
//        close: function() {
//            allFields.val("").removeClass("ui-state-error");
//        }
//    });
//    $("#settings-area-header").click(function() {
//        $("#settings-area-form").dialog('open')
//    });
};

ModuleArea.prototype.disableListeners = function() {
    var _this = this;
    line.setMap(null);
    moduleArea.temp_poly.setMap(null);
    this.path = new google.maps.MVCArray();

    google.maps.event.removeListener(_this.clickLisner);

    $('#create-polygon').unbind();
    $('#check-point').unbind();
    $('#save-polygon').unbind();
};

ModuleArea.prototype.clearMap = function() {
    var _this = this;
    //_this.line.setMap(null);
    for (var i = 0; i < _this.overlay.length; i++) {
        _this.overlay[i].setMap(null)
    }
//    _this.polygon.setMap(null);
    _this.line.setMap(null);
};

ModuleArea.prototype.loadAreas = function() {
    var _this = this;
    jQuery.ajax({
        type: 'GET',
        url: 'load_areas',
//        data: 'user=1',
        async: false,
        cache: false,
        dataType : "json",
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function (json) { // success
            _this.areas = new Array();
            if (json != null) {
                for (var i = 0; i < json.Areas.length; i++) {
                    var area = new Area();
                    area.id = json.Areas[i].id;
                    area.name = json.Areas[i].name;
                    area.description = json.Areas[i].description;

                    for (var j = 0; j < json.Areas[i].polygon.length; j++) {
                        var lat = json.Areas[i].polygon[j].lat;
                        var lng = json.Areas[i].polygon[j].lng;
                        area.path.push(new google.maps.LatLng(lat, lng));
                    }
                    _this.areas.push(area);
                    _this.clearMap();
                    _this.createPolygon(area.path);
//                    _this.addOnMap();
                }
            }
//            $("#result").append("json - " + json.Areas[0].polygon[0].lat)
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
            $("#result").append(errorThrown)
        }
    });
};

ModuleArea.prototype.deleteArea = function(id) {
    var _this = this;
    var er = true;
    jQuery.ajax({
        type: 'GET',
        url: 'delete_area',
        data: 'id=' + _this.areas[id].id,
        async: false,
        cache: false,
        dataType : "json",
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function () { // success
            er = true;
            _this.areas.splice(id,1); //удаление элемента из массива
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
            er = false;
        }
    });
    return er;
};
/**
 * Добавить все зоны на карту
 */
ModuleArea.prototype.addOnMap = function() {
    var _this = this;
    for (var i = 0; i < _this.areas.length; i++) {
        _this.createPolygon(_this.areas[i].path).setMap(_this.map);
    }
};
ModuleArea.prototype.insertArea = function(id) {
    var _this = this;
    _this.overlay[id].setMap(_this.map);
    _this.openInfoWindow(id);
    //_this.infoWindows[id].open(map);
//     $("#a-content").append("insertArea " + _this.overlay.length);
};

ModuleArea.prototype.deleteAreaFromMap = function(id) {
    var _this = this;
    _this.overlay[id].setMap(null);
    _this.closeInfoWindow(id);
//    _this.infoWindows[id].close();
//    $("#a-content").append("deleteArea " + _this.overlay.length);
};


/**
 * Методы режима редактирования зон, в данном режиме на карте не отабражаются другие зоны
 *
 * Добавление зоны состоит из трех сетодов stopPaintArea, stopPaintArea, createArea, saveArea.
 *
 * */
/**
 * Данный метод вызывает режим редактирования карты.
 * С карты удаляются все зоны. карта находится в данном режиме пока пользователь не вызовет метод stopPaintArea()
 *
 * ==Button
 */
ModuleArea.prototype.paintArea = function() {
    var _this = this;
    _this.path = new google.maps.MVCArray();
    _this.clearMap();
    line = new google.maps.Polyline({
        strokeColor: '#ff0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    line.setMap(this.map);

    _this.clickLisner = google.maps.event.addListener(_this.map, 'click',
                                                     function(e) {
                                                         _this.path.push(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
                                                         var path = line.getPath();
                                                         path.push(e.latLng);
                                                         if (_this.path.length == 3) $("#save-area").css("display", "block");
                                                     });
//    _this.enableListeners();
};

/**
 * Посте того как пользователь создал зону в виде линий он должен вызвать данный метод.
 * Линии преобразуются в зону и вызывается окно создания новой зоны.
 *
 * ==Button
 */
ModuleArea.prototype.stopPaintArea = function() {
    var _this = this;
    _this.temp_poly = new google.maps.Polygon({
        paths: _this.path,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.35
    });

    _this.temp_poly.setMap(_this.map);
    line.setMap(null);
};

/**
 * Завершение создания зоны, зона сохраняется на сервере, и добавляется к массиву зон объекта ModuleArea.
 * Все зоны перерисовываются
 */
ModuleArea.prototype.createArea = function() {
    var _this = this;
    var newArea = new Area();
    newArea.name = "new name";
    newArea.description = "new description";
    if (_this.path.getLength() > 1) {
        newArea.path = _this.path;
    }
    else {
        newArea.path = null;
    }
    // Дабавляем новую зону в масив
    _this.areas.push(newArea);
    _this.path = null;
    _this.clearMap();
};

ModuleArea.prototype.saveArea = function(name, decription, polygon) {
    var _this = this;
    var dataString = "name=" + name + "&description=" + decription + "&polygon=";
    for (var i = 0; i < polygon.length; i++) {
        dataString += polygon.getAt(i).lat() + "|" + polygon.getAt(i).lng() + "|"
    }

    /** Если сохранение прошло без ошибок метод вернет true иначе false */
    var er = true;
    jQuery.ajax({
        type: 'GET',
        url: 'save_area',
        data: dataString,
        async: false,
        cache: false,
        dataType : "json",
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function (json) {
//            if (json.Error == "error") {
//                er = false;
//            }
            var newArea = new Area();
            newArea.name = name;
            newArea.description = decription;
            newArea.path = polygon;
            _this.areas.push(newArea);
            _this.createPolygon(newArea.path);
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
            er = false;
        }
    });
    return er;
};

ModuleArea.prototype.createPolygon = function(path) {
    var _this = this;
    var poly = new google.maps.Polygon({
        paths: path,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.35
    });

    _this.overlay.push(poly);
    _this.addInfoWindow(_this.center(path));
    return poly;
};

ModuleArea.prototype.textForInfoWindow = function(id) {
    var name = "Зона - <strong>" + this.areas[id].name + "</strong><br>";
    var description = "Описание:<br><div >" + this.areas[id].description + "<div><br>"
    var devList = "";
    //TODO: глобальяная переменная - utilMap
    for (var i = 0; i < utilMap.length; i++) {
        if (this.checkPoint(utilMap[i].getLastPoint(), this.areas[id].path)) {
            devList += "<li>" + utilMap[i].deviceData.name + "</li>"
        }
    }
    var devises = "Устройства в зоне:<br><ui>" + devList + "</ui>";
    return name + description + devises;
};

//ModuleArea.prototype.addClickListenerForInfoWindow = function(area) {
//    var _this = this;
//    google.maps.event.addListener(area, 'click', function() {
//        _this.addInfoWindow("text")
//    });
//};

ModuleArea.prototype.addInfoWindow = function(latLng) {
    var _this = this;
    var infoWindow = new google.maps.InfoWindow({
        position: latLng
    });
    _this.infoWindows.push(infoWindow);
};

ModuleArea.prototype.closeInfoWindow = function(id) {
    this.infoWindows[id].close();
};

ModuleArea.prototype.openInfoWindow = function(id) {
    this.infoWindows[id].setContent(this.textForInfoWindow(id));
    this.infoWindows[id].open(map);
};

ModuleArea.prototype.center = function(path) {
    var sum_lat = 0;
    var sum_lng = 0;
    var n = path.length;
    for (var i = 0; i < n; i++) {
        sum_lat += path.getAt(i).lat();
        sum_lng += path.getAt(i).lng();
    }
    return new google.maps.LatLng(sum_lat / n, sum_lng / n);
};
