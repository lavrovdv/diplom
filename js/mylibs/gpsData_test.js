/**
 * Created by IntelliJ IDEA.
 * User: I
 * Date: 15.08.2010
 * Time: 18:12:41
 * To change this template use File | Settings | File Templates.
 */
function GPSData(imei) {
    var _this = this;   // ��������� ������ �� ������������ ������
    this.latitude;
    this.longitude;
    this.jsonObject;
    this.timer;
    this.imei = imei;
    this.limit = 0;
    this.TIMEOUT = 3000;
}
/**Not used*/

GPSData.prototype.getLength = function() {
    return this.jsonObject.ServerData.length;
};
GPSData.prototype.getLat = function(index) {
    return this.jsonObject.ServerData[index].GPS.latitude;
};
GPSData.prototype.getLng = function(index) {
    return this.jsonObject.ServerData[index].GPS.longitude;
};
GPSData.prototype.getDate = function(index) {
    return this.jsonObject.ServerData[index].GPS.date;
};
GPSData.prototype.getSpeed = function(index) {
    return this.jsonObject.ServerData[index].GPS.speed;
};
GPSData.prototype.getImei = function(index) {
    return this.jsonObject.ServerData[index].GPS.imei;
};

/**Work*/
GPSData.prototype.getJsonObject = function() {
    return this.jsonObject;
};
/**Work*/
GPSData.prototype.getGeoArray = function() {
    var geoArray = new Array();
    for (var i = 0; i < this.jsonObject.ServerData.length; i++) {
        geoArray[i] = [this.jsonObject.ServerData[i].GPS.latitude, this.jsonObject.ServerData[i].GPS.longitude];
        //geoArray[i] = [i,i];
    }
    return geoArray;
};
/**Get data from server, synchronous method.*/
GPSData.prototype.getDataFromServerSync = function() {
    var _this = this;
    jQuery.ajax({
        type: 'GET',
        url: 'json_data',                        // ��������� URL �
        data: 'imei=' + this.imei,
        async: false,
        cache: false,
        dataType : "json",                     // ��� ����������� ������
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function (json) { // ������ ���� ���������� �� ������� success
            _this.jsonObject = json;
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
//          jQuery('#CurrentState').html('textStatus - ' + textStatus + '; errorThrown -' + errorThrown);
            $("#error").css("visibility", "visible");
        }
    });
};

/**Get data from server, synchronous method.*/
GPSData.prototype.getDataFromServerSyncByDate = function(startDate, endDate) {
    var _this = this;
    jQuery.ajax({
        type: 'GET',
        url: 'gps_data_by_date',                        // ��������� URL �
        data: 'imei=' + this.imei + '&startDate=' + startDate + '&endDate=' + endDate,
        async: false,
        cache: false,
        dataType : "json",                     // ��� ����������� ������
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function (json) { // ������ ���� ���������� �� ������� success
            _this.jsonObject = json;
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
//          $('#error').css("visibility", "visible").html('textStatus - ' + textStatus + '; errorThrown -' + errorThrown);
            //$("#error").css("visibility", "visible");
        }
    });
};

/**Get data from server,  Asynchronous method.����*/
GPSData.prototype.getDevicesFromServer = function() {
    var _this = this;
    jQuery.ajax({
        type: 'GET',
        url: 'json_data',                        // ��������� URL �
        data: 'imei=' + this.imei,
        async: true,
        cache: false,
        dataType : "json",                     // ��� ����������� ������
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function (json) { // ������ ���� ���������� �� ������� success
            _this.jsonObject = json;
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
//            jQuery('#CurrentState').html('textStatus - ' + textStatus + '; errorThrown -' + errorThrown);
            //$("#error").css("visibility", "visible");
        }
    });
};

GPSData.prototype.updateGPSDataOnTimer = function() {
    this.limit = 1;
    var _this = this;
    this.timer = setInterval(function() {
        jQuery.ajax({
            type: 'GET',
            url: 'gps_data_last',                        // ��������� URL �
            data: 'imei=' + _this.imei,
            async: false,
            cache: false,
            dataType : "json",                     // ��� ����������� ������
            beforeSend: function() {
            },
            complete: function() {
            },
            success: function (json) {
                //������ ���������� ������������� ��������.
                var last = _this.getLength() - 1;
                //��������� ���� ��������� ���������� �� ���������� �������������� ��������� �������.
                if (_this.getLat(last) == json.ServerData[0].GPS.latitude
                        && _this.getLng(last) == json.ServerData[0].GPS.longitude) {

                    _this.jsonObject.ServerData[last] = json.ServerData[0];
                } else {
                    _this.jsonObject.ServerData[_this.getLength()] = json.ServerData[0];
                }
            },
            error : function (XMLHttpRequest, textStatus, errorThrown) {
                //jQuery('#error').html('textStatus - ' + textStatus + '; errorThrown -' + errorThrown);
//                $('#error').html('');
//                $('#error').append('<p>Error User data. Please <a href="/"> login</a> </p>' );
                //$("#error").css("visibility", "visible"); //todo: �������� ����������� �� ������
                _this.stopTimer(this.timer);
            }
        })
    }, this.TIMEOUT);
};

GPSData.prototype.stopTimer = function() {
    this.limit = 0;
    clearInterval(this.timer);
};

function DevicesData() {
    var _this = this;   // ��������� ������ �� ������������ ������
    this.nameDevice;
    this.imei;
    this.listDevice;
    this.listGPSData = new Array();
    this.timer;
    this.TIMEOUT = 2000;
    //this.getDataFromServer();
    //this.jsonObject = jsonObject;

}
/**Not used*/
DevicesData.prototype.getnameDevice = function() {
    return this.nameDevice;
};
/**Not used*/
DevicesData.prototype.getIMEI = function() {
    return this.imei;
};
/**Work*/
DevicesData.prototype.getListDevice = function() {
    return this.listDevice;
};
DevicesData.prototype.getDeviceGPSData = function(index) {
    return this.listGPSData[index];
};
DevicesData.prototype.loadGPSDataForDevice = function() {
    if (this.listDevice != null) {
        for (var i = 0; i < this.listDevice.Device.length; i++) {
            this.listGPSData[i] = new GPSData(this.listDevice.Device[i].imei);//������� ������ ��� �������� ��������� ��� ����������
            this.listGPSData[i].getDataFromServerSync();// ��������� ������ ��� ���������� � ������� ������ �������  GPSData (���������� ������� �� imei)
        }
    }
};

DevicesData.prototype.loadGPSDataForDeviceByDate = function(id,startDate, endDate) {
    //if (this.listDevice != null) {
    //    for (var i = 0; i < this.listDevice.Device.length; i++) {
//            this.listGPSData[id] = new GPSData(this.listDevice.Device[id].imei);//������� ������ ��� �������� ��������� ��� ����������
            this.listGPSData[id].getDataFromServerSyncByDate(startDate, endDate);// ��������� ������ ��� ���������� � ������� ������ �������  GPSData (���������� ������� �� imei)
      //  }
    //}
};
/**Get data from server, synchronous method.*/
DevicesData.prototype.getDevicesFromServerSync = function() {
    var _this = this;
    jQuery.ajax({
        type: 'GET',
        url: 'device',                        // ��������� URL �
//        data: 'user=1',
        async: false,
        cache: false,
        dataType : "json",                     // ��� ����������� ������
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function (json) { // ������ ���� ���������� �� ������� success
            _this.listDevice = json;
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
//            jQuery('#CurrentState').html('textStatus - ' + textStatus + '; errorThrown -' + errorThrown);
            //$("#error").css("visibility", "visible");
        }
    });
};
/**Get data from server,  Asynchronous method.*/
DevicesData.prototype.getDevicesFromServer = function() {
    var _this = this;
    jQuery.ajax({
        type: 'GET',
        url: 'device',                        // ��������� URL �
//        data: 'user=1',
        async: true,
        cache: false,
        dataType : "json",                     // ��� ����������� ������
        beforeSend: function() {
        },
        complete: function() {
        },
        success: function (json) { // ������ ���� ���������� �� ������� success
            _this.listDevice = json;
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
//            jQuery('#CurrentState').html('textStatus - ' + textStatus + '; errorThrown -' + errorThrown);
           // $("#error").css("visibility", "visible");
        }
    });
};

DevicesData.prototype.updateDataOnTimer = function() {
    for (var i = 0; i < this.listGPSData.length; i++) {
        this.listGPSData[i].updateGPSDataOnTimer();
    }
};

DevicesData.prototype.stopTimer = function() {
    clearInterval(this.timer);
};

