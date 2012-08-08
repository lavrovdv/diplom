/**
 * Created by IntelliJ IDEA.
 * User: I
 * Date: 10.08.2010
 * Time: 17:12:38
 * To change this template use File | Settings | File Templates.
 */
var test_follow = 0;
//var map;
//var Devices = new DevicesData();
var DeviseOnMap = new Array();

function initialize() {
    var LL = new google.maps.LatLng(53.49910737182342, 49.3960202365875);
    var mapDiv = document.getElementById('maps');
    var map = new google.maps.Map(mapDiv, {
        center: LL,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    return map;
//    $("#p-content").append("map " + map);

//    Devices.getDevicesFromServerSync();
//    Devices.loadGPSDataForDevice();

    /*for (var i = 0; i < Devices.listDevice.Device.length; i++) {
     //Создание обьекта работы с картой для каждого устройства
     DeviseOnMap[i] = new GoogleMap(Devices, i);

     $('#devices').append("<p class='device'>" +
     "<input type='checkbox' checked name='d" + i + "'/>" +
     Devices.listDevice.Device[i].name + "</p>");
     $('#stat').append("<p >  " +
     '<span style="color:gray">Name: </span>' +
     '<span style="font-weight:100;">' + Devices.listDevice.Device[i].name + '</span><br>' +
     '<span style="color:gray">Average Speed: </span>' +
     DeviseOnMap[i].getAverageSpeed().toFixed(2) +
     '<span style="color:gray"> km/h</span><br>' +
     '<span style="color:gray">Distance: </span>' +
     DeviseOnMap[i].getDistance().toFixed(2) +
     '<span style="color:gray"> km</span>'+
     "</p>");
     }*/

    //Выбор цвета линии
//    DeviseOnMap[0].setLineColor("#06F");
//    DeviseOnMap[0].setFollowImage("/images/126.png");
//    DeviseOnMap[1].setFollowImage("/images/121.png");
//    DeviseOnMap[2].setFollowImage("/images/102.png");

    //Запуск обновления данных по таймеду
//    setInterval(function() {
//        $('#stat').html(' ');
//        for (var i = 0; i < Devices.listDevice.Device.length; i++) {
//            $('#stat').append("<p >  " +
//                    '<span style="color:gray">Name: </span>' +
//                    '<span style="font-weight:100;">' + Devices.listDevice.Device[i].name + '</span><br>' +
//                    '<span style="color:gray">Average Speed: </span>' +
//                    DeviseOnMap[i].getAverageSpeed().toFixed(2) +
//                    '<span style="color:gray"> km/h</span><br>' +
//                    '<span style="color:gray">Distance: </span>' +
//                    DeviseOnMap[i].getDistance().toFixed(2) +
//                    '<span style="color:gray"> km</span>'+
//                    "</p>");
//        }
//    }, 500);
    //устанавливаем иконки номеров маршрутов
//    for (var i1 = 0; i1 < DeviseOnMap.length; i1++) {
//        DeviseOnMap[i1].startFollow();
//    }

//    Devices.updateDataOnTimer();

}

function GoogleMap(map, device, index) {

    //this.map;
    /** name, imei*/
    this.map = map;
    this.deviceData = device.listDevice.Device[index];
    this.GPSData = device.getDeviceGPSData(index);
    this.LL = new google.maps.LatLng(53.49910737182342, 49.3960202365875);
    this.pathline = new google.maps.Polyline();
    /** В this.infoWindows содержатся все подсказки для маркеров*/
    this.infoWindows = new Array();
    this.lineColor = "#FF0000";
    this.pointImage = new google.maps.MarkerImage("/images/pointOrange.png");
    this.followImage = new google.maps.MarkerImage("/images/pointBlack.png");
    this.PathCoordinates = new google.maps.Polyline().getPath();
    this.timer;
    this.TIMEOUT = 1000;
    this.markers = new Array();
    this.lastMarker;
//    this.points_button_state = true;
//    this.line_button_state = true;
//    this.follow_button_state = true;
    // Флаг отображена или нет линия пути для устройства
    this.line_is_showed = false;
    // Флаг отображены или нет точки пути для устройства
    this.point_is_showed = false;
}
GoogleMap.prototype.setPointImage = function(imageUrl) {
    this.pointImage = new google.maps.MarkerImage(imageUrl);
};
GoogleMap.prototype.setFollowImage = function(imageUrl) {
    this.followImage = new google.maps.MarkerImage(imageUrl);
};
/**
 * Последняя координата
 * @param id - Номер устройства
 * @return - google.maps.LatLng()
 */
GoogleMap.prototype.getLastPoint = function() {
    var last = this.GPSData.getLength() - 1
    var lat = this.GPSData.getLat(last);
    var lng = this.GPSData.getLng(last);
//    $("#a-content").append("getLastPoint " + new google.maps.LatLng(lat, lng));
    return new google.maps.LatLng(lat, lng);
};

GoogleMap.prototype.createMarker = function(position, text) {
    //Создание маркера
//        $("#p-content").append("text " + this.map);
    var marker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: this.pointImage
        //title:"Hello World!"
    });
    this.markers.push(marker);
    //this.lastMarker = marker;
    //Создание подсказки для маркера
    var infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
        var myHtml = text;
        infoWindow.setContent(myHtml);
        infoWindow.open(map, marker);
    });
    this.infoWindows.push(infoWindow);
};
GoogleMap.prototype.insertMarkers = function() {

    for (var j = 0; j < this.GPSData.getLength(); j++) {
        var lat = this.GPSData.getLat(j);
        var lng = this.GPSData.getLng(j);

        var text = '<span style="color:gray">Имя: </span>' + this.deviceData.name + '<br>' +
                '<span style="color:gray">Координаты: </span>' + lat + ' ' + lng + '<br>' +
                '<span style="color:gray">Скорость: </span>' + this.GPSData.getSpeed(j);

        var position = new google.maps.LatLng(lat, lng);
        this.createMarker(position, text);
    }
};
GoogleMap.prototype.deleteMarkers = function() {
    /**Убираем маркеры*/
    for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
    }
    /**Убираем окна подсказок*/
    for (var i = 0; i < this.infoWindows.length; i++) {
        this.infoWindows[i].close();
    }
};
GoogleMap.prototype.setLineColor = function(color) {
    this.lineColor = color;
};
GoogleMap.prototype.insertPolyline = function() {
    //var PathCoordinates = new google.maps.Polyline().getPath();
    this.PathCoordinates = new google.maps.Polyline().getPath();
//        if (this.line_button_state) {
    for (var i = 0; i < this.GPSData.getLength(); i++) {
        var lat = this.GPSData.getLat(i);
        var lng = this.GPSData.getLng(i);
        this.PathCoordinates.push(new google.maps.LatLng(lat, lng));
    }

    this.pathline.setOptions({
        path: this.PathCoordinates,
        strokeColor: this.lineColor,
        strokeOpacity: 0.8,
        strokeWeight: 2
    });

    this.pathline.setMap(map);
//            this.line_button_state = false;
//        }
//        else {

//            this.line_button_state = true;
//        }
};
GoogleMap.prototype.deletePolyline = function() {
    this.pathline.setMap(null);
};
/**Use timer*/
GoogleMap.prototype.startFollow = function() {
//    if (this.follow_button_state) {
//        this.follow_button_state = false;
    var last = this.GPSData.getLength() - 1;
    //var last = test_follow;
    var _this = this;
    var position = new google.maps.LatLng(this.GPSData.getLat(last), this.GPSData.getLng(last));
    if (this.lastMarker == null) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: this.followImage
            //title:"Hello World!"
        });
        this.lastMarker = marker;
    }

    this.timer = setInterval(function() {
        var last = _this.GPSData.getLength() - 1;
        //var last = test_follow;
        var lat = _this.GPSData.getLat(last);
        var lng = _this.GPSData.getLng(last);
        var text = _this.deviceData.name + '<br>' + lat + ' ' + lng;
        var position = new google.maps.LatLng(lat, lng);
        _this.lastMarker.setPosition(position);
        //this.createMarker(position, text);
        //test_follow++;
    }, 500);
//    } else {
//        this.follow_button_state = true;
//        this.lastMarker.setMap(null);
//        this.lastMarker = null;
//        clearInterval(this.timer);
//        //this.stopFollow();
//    }
};

GoogleMap.prototype.stopFollow = function() {
    clearInterval(this.timer);
};
GoogleMap.prototype.getAverageSpeed = function() {
    var speed = 0;
    var length = this.GPSData.getLength();
    for (var i = 0; i < length; i++) {
        //$('#stat').append(speed + '<br>');
        speed += parseFloat(this.GPSData.getSpeed(i));
    }
    speed = speed / (length - 1);
    return speed;
};
GoogleMap.prototype.getDistance = function() {
    var distance = 0;
    var earthRadius = 6371;
    var length = this.GPSData.getLength() - 1;
    for (var i = 0; i < length; i++) {
        var lat1 = parseFloat(this.GPSData.getLat(i));
        var lng1 = parseFloat(this.GPSData.getLng(i));
        var lat2 = parseFloat(this.GPSData.getLat(i + 1));
        var lng2 = parseFloat(this.GPSData.getLng(i + 1));

        distance += (earthRadius * Math.acos(Math.sin(degToRad(lat1)) * Math.sin(degToRad(lat2)) +
                Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.cos(degToRad(lng1 - lng2))));
    }
    return distance;

    function radToDeg(rad) {
        return rad * 180 / Math.PI;
    }

    function degToRad(deg) {
        return deg * Math.PI / 180;
    }
};

/*jQuery(document).ready(function() {
 google.maps.event.addDomListener(window, 'load', initialize);



 //Слушатели кнопок
 $('#points').click(function() {
 for (var i = 0; i < DeviseOnMap.length; i++) {
 if ($('input[name=d' + i + ']').is(':checked')) {
 DeviseOnMap[i].insertMarkers();
 }
 }
 });

 $('#line').click(function() {
 for (var i = 0; i < DeviseOnMap.length; i++) {
 if ($('input[name=d' + i + ']').is(':checked')) {
 DeviseOnMap[i].insertPolylines();
 }
 }
 });

 $('#follow').click(function() {
 for (var i = 0; i < DeviseOnMap.length; i++) {
 if ($('input[name=d' + i + ']').is(':checked')) {
 DeviseOnMap[i].startFollow();
 }
 }
 });
 $('#stopFollow').click(function() {
 //$('#devices').append("Devices " + Devices.getDeviceGPSData(0).getLength());
 //Devices.updateDataOnTimer();
 });
 map_Statistic = true;*/
//$('#statistic').click(function() {
//    if (map_Statistic) {
//        $('#maps').css('width', '0%');
//        $('#statContainer').show();
//        for (var i = 0; i < Devices.listDevice.Device.length; i++) {
//            //if ($('input[name=d' + i + ']').is(':checked')) {
//
//            $('#statContainer').append(
//                    "<p style='margin:10px; background-color:#dedddd; padding:5px; font-size:18px;'>" +
//                            "<span style='color:gray'>Devise name:</span> " +
//                            Devices.listDevice.Device[i].name + "<br>" +
//                            "<span style='color:gray'>Devise IMEI:</span> " +
//                            Devices.listDevice.Device[i].imei + "</p>");
//
//            var lineChartId = 'lineChart' + i;
//
//            $('#statContainer').append('<div id="' + lineChartId + '"' +
//                    'style="width: 500px; height: 400px;"></div>');
//
//            var tableString = '<table width="80%" class="statTable" border="0" cellpadding="0" style="margin:10px;">' +
//                    '<tr class="stTable">' +
//                    '<td class="stTableF" align="center">Data</td>' +
//                    '<td class="stTableF" align="center">latitude</td>' +
//                    '<td class="stTableF" align="center">latitude</td>' +
//                    '<td class="stTableF" align="center">speed</td>' +
//                    '</tr>';
//
//            for (var j = 0; j < Devices.listGPSData[i].getLength(); j++) {
//                tableString += '<tr class="stTable" align="center">' +
//                        '<td  class="stTable">' + Devices.listGPSData[i].getDate(j) + '</td>' +
//                        '<td  class="stTable">' + Devices.listGPSData[i].getLat(j) + '</td>' +
//                        '<td  class="stTable">' + Devices.listGPSData[i].getLng(j) + '</td>' +
//                        '<td  class="stTable">' + Devices.listGPSData[i].getSpeed(j) + '</td>' +
//                        '</tr>';
//            }
//            tableString += '</table><br><br>';
//            $('#statContainer').append(tableString);
//            drawVisualization(i, lineChartId);
//            //};
//        }
//        map_Statistic = false;
//    } else {
//        $('#maps').css('width', '100%');
//        $('#statContainer').hide();
//        map_Statistic = true;
//    }
//});
//
//
//function drawVisualization(index, id) {
//    var data = new google.visualization.DataTable();
//    data.addColumn('string', 'x');
//    data.addColumn('number', 'Speed');
//
//    for (var j = 0; j < Devices.listGPSData[index].getLength(); j++) {
//        var sp = Number(Devices.listGPSData[index].getSpeed(j));
//        var dt = Devices.listGPSData[index].getDate(j)
//        data.addRow([dt, sp]);
//    }
//
//
//    // Create and draw the visualization.
//    new google.visualization.LineChart(document.getElementById(id)).
//            draw(data, {curveType: "function",
//                           width: 1000, height: 300}
//            );
//}
//});


//google.maps.event.addDomListener(window, 'load', initialize);

