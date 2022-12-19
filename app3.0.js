const {Client} = require('whatsapp-web.js');
const qrcode = require ('qrcode-terminal');
let PE = [{}] //Arreglo para almacenar los mensajes pendientes
let ENV = [{}] //Arreglo para almacenar los mensajes enviados
let NR = [{}] //Arreglo para almacenar los Numeros no registrados

const client = new Client();
let IndicadorMasivo;

const path = require('path');

const route = path.dirname('Z:/Privada/Joseph Carballo/MASIVOS/SUBIDA MASIVA.xlsx' + path.join('/SUBIDA MASIVA.xlsx'))
console.log (route);


client.on ('qr', (qr)=>{
    console.log ('QR:',qr)
    qrcode.generate(qr,{small:true})
});


client.on ('ready', ()=>{
    console.log('Nueva sesion creada')

    
    client.on ('message_create', (Sended) =>{
        console.log ('sended:',Sended.body + "\n"+"Enviado por mi:" + Sended.fromMe)

        if (Sended.fromMe === false){
            IndicadorMasivo= false;
        }       
        if (Sended.body === "!CANCELAR"){
            IndicadorMasivo=false;
                for (let S of PE){
                    PE.splice(0,PE.length)
                }
                for (let A of ENV){
                    ENV.splice(0, ENV.length)
                }
                for (let D of NR){
                    NR.splice(0, NR.length)
                }
        
                console.log (PE, ENV, NR)
        }
        if (Sended.body === '!MASIVO'){
            const readerS = require ('xlsx');     
             IndicadorMasivo = true;

            const dat = readerS.readFile(route)   
            let sheet_name_list= dat.SheetNames;
            let xlData = readerS.utils.sheet_to_json(dat.Sheets[sheet_name_list[0]]);
   
            console.log (xlData)
            
            for (let D of xlData){
                number = '506' + D.NUMERO
                let msgg = D.MENSAJE
                let chatid =  number + "@c.us"
                //let whatsappID = verificarNumero(number)
                //console.log(whatsappID)
                //if (whatsappID != null) {
                //    client.sendMessage(chatid, msgg)
                //}
                client.isRegisteredUser(chatid).then(function(isRegistered) {
                    if(isRegistered) {
                        client.sendMessage(chatid, msgg);
                    }
                })   
            }
        }
    });    
});

client.initialize();

//async function verificarNumero(number) {
//    let whatsappID = await client.getNumberId(number)
//    return whatsappID;
//}