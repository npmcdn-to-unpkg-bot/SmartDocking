import { Injectable, Inject } from "@angular/core"

@Injectable()
export class TagService {

    private portModel: string = "0xea60"
    private port: string = ""
    private serialPortFactory: Any
    private serialPort: Any
    private open: boolean
    private readString: string
    private readState: boolean = false

    constructor () {
        this.serialPortFactory = SerialPortFactory;
    }
    
    private asciiToString(data: Any): string {
        let x = ""
        for(let it of data) {
            x += String.fromCharCode(it);
        } 
        return x;
    }

    private writeAndRead(sendData: string): Promise<string> {
        return new Promise((result,rej) => {
             this.serialPort.on("data", ress => {
                 let xk = this.asciiToString(ress)
                 let k = xk.substring(1, xk.length - 3)
                 this.readState = false
                 console.log("send: " + sendData + "    reviced: " + k)
                 result(k)
            })           
            this.serialPort.write(sendData)
            this.readState = true
        })
    }
    
    public readTag(): Promise<string> {
        return this.writeAndRead("tag")
    }

    public init(): Promise<string> {
        return new Promise((res, rej) => {
            this.serialPortFactory.list((err, ports) => {
                ports.forEach(port => {
                    if(port.productId === this.portModel) {
                        this.port = port.comName
                    }
                })
                if(this.port === "") {
                    rej("Please make sure scanner is connected.")
                } else {
                    this.serialPort = new SerialPort(this.port, {baudrate: 115200}, false)
                    let readStart = () => {
                        this.open = true;
                        this.writeAndRead("start").then(result => {
                            if(result.indexOf("ok") === -1) {
                                rej("fund incompatible reader.")
                            } else {
                                res(result)
                            }
                        })                       
                    }
                    this.serialPort.open(err => {
                        if(err) {
                            rej("Problem connecting to reader.")
                        } else {
                            readStart()
                        }
                    })
                }
            })
        })
    }
    
    public close(): Promise<string> {
       return new Promise((res, rej) => {
           if(open) {
               if(this.readState) {
                   this.writeAndRead("end").then(re => {
                        this.serialPort.close()
                        this.open = false
                       res("ok")                      
                   })} else 
               {
                   this.serialPort.close()
                   this.open = false
                   res("ok")
               }
           } else {
               res("port is not open")
           }
       }) 
    }
    
}
