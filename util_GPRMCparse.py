from datetime import *

#$GPRMC,215417,A,53.4739,N,49.47380,W,16,4,231.8,171110,004.2,W*70,imei:572776984948029
#$GPRMC,220516,A,5133.82,N,00042.24,W,173.8,231.8,130610,004.2,W*70,imei:572776984948029
#|  0  |   1  |2|    3  |4|    5   |6|  7  |  8  |   9  |  10 | 11 |         12         |
class  GPRMCparse:
    def __init__(self, str):
        self.str = str
        str = self.str.split(",")
        self.datetime = datetime(
                int("20" + str[9][4:]), # year
                int(str[9][2:4]), # month
                int(str[9][0:2]), # day
                int(str[1][0:2]), # hour
                int(str[1][2:4]), # minute
                int(str[1][4:6]), # second
                datetime.now().microsecond) # microsecond

        self.latitude = float(str[3])#str[3]
        self.longitude = float(str[5])
        self.speed = float(str[7])
        self.imei = int(str[12][5:])
        self.state = True

  