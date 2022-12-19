

    
    whatsapp.on ('message', (mensaje) => {
        console.log ('Received:', mensaje.to, mensaje.body)
        
        
        
        if (mensaje.body === "!CANCELAR"){
            IndicadorMasivo=false;
            for (var S of Var1){
                Var1.splice(0,Var1.length)
            }

            for (var A of Var2){
                Var2.splice(0, Var2.length)
            }
            console.log (Var1, Var2)
        }
        
        
        if (mensaje.body === "!MASIVO-C1"){

            const reader = require ('xlsx');
            IndicadorMasivo = true

            const dat = reader.readFile(route)   
            var sheet_name_list = dat.SheetNames;
            var xlData = reader.utils.sheet_to_json(dat.Sheets[sheet_name_list[0]]);

            console.log (xlData)

            for (var D of xlData){
                id= D.IDMSG
                number = '506' + D.NUMERO
                msgg = D.MENSAJE
                chatid =  number + "@c.us" 
                whatsapp.sendMessage(chatid, msgg)
                
            }

            
            

        }   





        

        
    })





    whatsapp.on('message_ack', (sms) => {
        console.log (IndicadorMasivo)
        console.log(sms.ack)
        if (sms.body=== '!MASIVO-C1'){
                    
        }else{
            if (IndicadorMasivo === true){
            
                var reader = require ('xlsx');
                const dat = reader.readFile(route)   
                var sheet_name_list = dat.SheetNames;
                var xlData = reader.utils.sheet_to_json(dat.Sheets[sheet_name_list[0]]);
                
                let IDMSJ;
                for(var D of xlData){
                let identify = '506' + D.NUMERO + '@c.us'
                    console.log (identify,sms.to)
                    

                if (identify === sms.to){
                    
                    IDMSJ = D.IDMSG
    
                    console.log(IDMSJ)
                }}
            
    
    
                if (sms.ack === 1){
                    
    
                    let now = new Date()
    
    
                    Var1.push({IDMS:IDMSJ,Mensaje:sms.body, Numero:sms.to, Envio: 'Pendiente', Hora:now,})
                    
                    
                }
    
                if (sms.ack === 2){
                    
    
                    
                    
                    for(var C of Var1){
                        
                                
                        if(C.Numero === sms.to){
                            if(C.Mensaje === sms.body){
                                
                                Var1.filter((valor,index, arr)=>{
                                    Var1.splice(index);
                                    console.log(arr)
                                })
                                
                                


                            }
                        }           
                                

                                

                                
                                                      

                                

                                
                                

                            
                    
                    }

                    for(var C of Var2){
                        
                        if(C.Numero === sms.to){
                            if(C.Mensaje === sms.body){
                                Var2.filter((valor,index, arr)=>{
                                    Var2.splice(index);
                                    console.log(arr)
                                })
                                
                                
                                /*
                                var item=Var2.filter(Var2 => Var2.Numero===sms.to)
                                console.log('item:',item)
                                item.splice(0, 1)
                                console.log ('indexof' + Var2.indexOf (item.Numero))
                                    */

                            }
                        }
                    }


                    
                    let now = new Date()
                    
                    Var2.push({IDMS:IDMSJ, Mensaje:sms.body, Numero:sms.to, Envio: 'Enviado: ', Hora: now,})
    
                    //reader.writeFile(WorkBook, 'Z:/Privada/UDI/C1_MANTENIMIENTO/REPORTE ENVÍO.xlsx');
                }


                if (sms.ack === 3) {
                   
                    



                    for(var C of Var1){
                        
                                
                        if(C.Numero === sms.to){
                            if(C.Mensaje === sms.body){
                                
                                Var1.filter((valor,index, arr)=>{
                                    Var1.splice(index);
                                    console.log(arr)
                                })
                                
                                
    
    
                            }
                        }           
                                      
                    
                    }
    
                    for(var C of Var2){
                        
                        if(C.Numero === sms.to){
                            if(C.Mensaje === sms.body){
                                Var2.filter((valor,index, arr)=>{
                                    Var2.splice(index);
                                    console.log(arr)
                                })
                                
                                
                                /*
                                var item=Var2.filter(Var2 => Var2.Numero===sms.to)
                                console.log('item:',item)
                                item.splice(0, 1)
                                console.log ('indexof' + Var2.indexOf (item.Numero))
                                    */
    
                            }
                        }
                    }
                    
                    let now = new Date()
                    
                    Var2.push({IDMS:IDMSJ, Mensaje:sms.body, Numero:sms.to, Envio: 'Enviado: ', Hora: now,})
    
                    //reader.writeFile(WorkBook, 'Z:/Privada/UDI/C1_MANTENIMIENTO/REPORTE ENVÍO.xlsx');
    
        
        
                }

                
                console.log(Var1,Var2)
    
                
    
                var exc = reader.utils.book_new();
                let workSheet1 = reader.utils.json_to_sheet(Var1);
                let workSheet2 = reader.utils.json_to_sheet(Var2);
                reader.utils.book_append_sheet(exc, workSheet1, 'PENDIENTE ENVÍO')
                reader.utils.book_append_sheet(exc, workSheet2, 'ENVIADOS')
                reader.writeFile(exc, 'Z:/Privada/UDI/C1_CICLOS/REPORTE ENVÍO.xlsx');
            
        }


            
            
        }
            
        })













    
   
    

})




whatsapp.initialize()