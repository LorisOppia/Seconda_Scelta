import {
  IonContent,
  IonPage,
  IonButton,
  IonToolbar,
  IonTitle,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAlert,
  IonToast,
  IonActionSheet,
  IonIcon,
  IonLoading,
  IonThumbnail,
  IonImg,
  IonInput,
  IonModal,
  IonLabel,
} from '@ionic/react'
import { useState } from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { App } from '@capacitor/app';
import { settingsOutline, arrowBackCircleOutline, arrowForwardCircleOutline } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera'
import { url_note, url_codiceTestata, url_foto, url_codiceArticolo } from "../../config/config";

const Pallets = () => {

  App.addListener('backButton', () => {
    BarcodeScanner.stopScan()
    setNascondi(false)
    setImm()
    setShowPhoto(false)
  })

  const inviaNote = async () => {
    //let url_note = "http://127.0.0.1:8000/declassamento/"
    setShowLoading(true)
    let data={};
    if (note===""){data = {"note": "Nessuna Nota" }}
    else {data = {"note": note}}
      try {
        await fetch(url_note,{
          method: 'POST', 
          mode: 'cors', 
          cache: 'no-cache', 
          credentials: 'same-origin', 
          headers: { 'Content-Type': 'application/json'},
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(data) 
      });
  }
    catch(error){setShowToastErr(true); 
                 setShowLoading(false); return}
  setNote("")
  set_input("input")
  setShowToastInvio(true)
  setShowLoading(false)
  get_id_testata()
  }

  const PostQR = async () => {
    setShowLoading(true)
    let data = {}
    //let url = "http://127.0.0.1:8000/codiceTestata/"
    for (let i=0;i<elem.length;i++){
      data = {"id_testata": idTestata, "qr":elem[i]}
      try {
        await fetch(url_codiceTestata,{
          method: 'POST', 
          mode: 'cors', 
          cache: 'no-cache', 
          credentials: 'same-origin', 
          headers: { 'Content-Type': 'application/json'},
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(data) 
      });
  }
    catch(error){setShowToastErr(true); 
                 setShowLoading(false); return}
    }
  setElem([]);
  setShowToastInvio(true)
  setShowLoading(false)
  }

  const PostFoto = async () => {
    setShowLoading(true)
    let data = {}
    //let url = "http://127.0.0.1:8000/foto/"
    for (let i=0;i<foto.length;i++){
      data = {"id_testata": idTestata, "foto":foto[i]}
      try {
        await fetch(url_foto,{
          method: 'POST', 
          mode: 'cors', 
          cache: 'no-cache', 
          credentials: 'same-origin', 
          headers: { 'Content-Type': 'application/json'},
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(data) 
      });
  }
    catch(error){setShowToastErr(true); 
                 setShowLoading(false); return}
    }
    setFoto([]);
  setShowToastInvio(true)
  setShowLoading(false)
  }

  const get_id_testata = async () => {
    //let url = "http://127.0.0.1:8000/declassamento/"
    let json = []
      await fetch(url_note, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {json = data})
      .catch((error) => {console.error('Error:', error)})

      idTestata = json[json.length-1]["id"]   
      PostQR()
      //PostFoto()
      
}

  const get_id_articolo = async (barcode) => {
    //let url = "http://127.0.0.1:8000/codiceArticolo/"
    let json = []
      await fetch(url_codiceArticolo, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {json = data})
      .catch((error) => {console.error('Error:', error)})

      if (elem.length===0) { for (let i=0;i<json.length;i++){ 
                                      if (json[i]["qr"]===barcode) {setCodiceArticolo(json[i]["id_articolo"]);
                                                                    setElem(elem => [json[i]["qr"], ...elem])} 
                            } }
      else { for (let i=0;i<json.length;i++){ 
                      if (json[i]["qr"]===barcode) {
                              if (json[i]["id_articolo"]===codiceArticolo) {setElem(elem => [json[i]["qr"], ...elem])}      //aggiungi errore
                      }
      }
  }
}
const chiudi = (id) => {
  document.getElementById(id).close();
};

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) { startScan() }
    };

  const startScan = async () => {
    setNascondi(true)
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) { setNascondi(false);
                             get_id_articolo(result.content);}
    };
    
  const rimuovi_elem = (x) => {
    let app = [...elem]
    app.splice(x,1)
    setElem(app)
    };
  
  const rimuovi_foto = (x) => {
    let app = [...foto]
    app.splice(x,1)
    setFoto(app)
    setShowPhoto(false)
    setImm()
    };

  const salva_elem = () => {
    setElemSalva(elem);
    setElem([])
    };

  const salva_foto = () => {
    setListaFotoSalva(foto);
    setFoto([])
    };
  
  const recupera_elem = () => {
    setElem(elemSalva)
    setElemSalva([])
  };

  const recupera_foto = () => {
    setFoto(fotoSalva)
    setListaFotoSalva([])
  };

  const set_input = (id) => {
    document.getElementById(id).value="";
  };

  const [elem, setElem] = useState([])
  const [elemSalva, setElemSalva] = useState([])
  const [nascondi, setNascondi] = useState(false)
  const [showAlertRimuovi_elem, setShowAlertRimuovi_elem] = useState(false)
  const [showAlertRimuovi_foto, setShowAlertRimuovi_foto] = useState(false)
  const [showAlertInvia, setShowAlertInvia] = useState(false)
  const [showAlertNoElem, setShowAlertNoElem] = useState(false)
  const [showAlertNoPhoto, setShowAlertNoPhoto] = useState(false)
  const [showToastInvio, setShowToastInvio] = useState(false)
  const [showToastErr, setShowToastErr] = useState(false)
  const [opzioni, setOpzioni] = useState(false)
  const [showAlertSalva_elem, setShowAlertSalva_elem] = useState(false)
  const [showAlertSalva_foto, setShowAlertSalva_foto] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [foto,setFoto] = useState([])

  const [fotoSalva,setListaFotoSalva] = useState([])
  const [imm,setImm] = useState(0)
  const [showPhoto, setShowPhoto] = useState(false)
  const [codiceArticolo, setCodiceArticolo] = useState()
  const [note, setNote] = useState("")
  let idTestata


  /*const aggiungi_foto = () => {
      setListaFoto(listaFoto => [...listaFoto, "http://placekitten.com/g/200/300"])
  }*/

  const scatta = async () => {
    const image = await Camera.getPhoto({
      quality:100,
      resultType: CameraResultType.Base64,   //Uri, Base64, DataUrl
      saveToGallery: true,
      source: CameraSource.Camera
    })

    let imm = "data:image/png;base64," + image.base64String
    setFoto(foto => [...foto, imm])
    console.log(imm)
};

  if (nascondi===false){
    return(
    <IonPage>
    <IonToolbar>
        <IonTitle>Home page</IonTitle>
      </IonToolbar>

      <IonItem>
        Elementi da declassare: {elem.length}
        <IonButton color="light" size="medium" slot="end" onClick={()=>setOpzioni(true)}> <IonIcon icon={settingsOutline}/></IonButton>
      </IonItem>

      <IonContent>
        {elem.map((_,i) => (<IonItemSliding key={i} id={i}>
                                <IonItemOptions side="end" >
                                  <IonItemOption color="danger" onClick={() => {rimuovi_elem(i); chiudi(i)}}>
                                  Rimuovi
                                  </IonItemOption>
                                </IonItemOptions>
                                <IonItem>
                                {elem[i]}
                                </IonItem>
                              </IonItemSliding>))}
      </IonContent>
      
      <IonItem>
      {foto.map((_,i) => (
          <IonThumbnail key={i}>
            <IonImg src={foto[i]} onClick={() => {setImm(i); setShowPhoto(true)}}/>
          </IonThumbnail>
      ))}
      </IonItem>
  
      <IonItem>
        Note:
        <IonInput id="input" placeholder="Inserisci una nota" onIonChange={e => setNote(e.detail.value)}></IonInput>
        
      </IonItem>

      <IonItem>
            <IonButton color="success" size="large" onClick={() => {if (elem.length===0) {setShowAlertNoElem(true)} 
                                                                    else {setShowAlertInvia(true)}}}>
                    Invia
                </IonButton>

              <IonButton size="large" color="warning" onClick={() => scatta()}>
                Scatta
              </IonButton>         

            <IonButton onClick={() => {let x = Math.floor(Math.random() * 5); x = x.toString(); get_id_articolo(x) /*checkPermission()*/}} size="large">       
                 Scan
            </IonButton>
      </IonItem>

      <IonAlert
          isOpen={showAlertRimuovi_elem}
          onDidDismiss={() => setShowAlertRimuovi_elem(false)}
          header={'Vuoi rimuovere tutti gli elementi?'}
          buttons={[
            {
              text: 'Annulla',
              handler: () => {setShowAlertRimuovi_elem(false)}
            },
            {
              text: 'Rimuovi',
              handler: () => { salva_elem() }
            }
          ]}
        />
        <IonAlert
        isOpen={showAlertRimuovi_foto}
        onDidDismiss={() => setShowAlertRimuovi_foto(false)}
        header={'Vuoi rimuovere tutte le foto?'}
        buttons={[
          {
            text: 'Annulla',
            handler: () => {setShowAlertRimuovi_foto(false)}
          },
          {
            text: 'Rimuovi',
            handler: () => { salva_foto() }
          }
        ]}
      /> 
        <IonAlert
          isOpen={showAlertInvia}
          onDidDismiss={() => setShowAlertInvia(false)}
          header={'Vuoi inviare ' + elem.length +' elementi?'}
          buttons={[
            {
              text: 'Annulla',
              handler: () => {setShowAlertInvia(false)}
            },
            {
              text: 'Invia',
              handler: () => {inviaNote()}
            }
          ]}
        />
        <IonAlert
          isOpen={showAlertSalva_elem}
          onDidDismiss={() => setShowAlertSalva_elem(false)}
          header={'Non ci sono elementi da recuperare'}
          buttons={[
            {
              text: 'Ok',
              handler: () => {setShowAlertSalva_elem(false)}
            }
          ]}
        />
        <IonAlert
          isOpen={showAlertSalva_foto}
          onDidDismiss={() => setShowAlertSalva_foto(false)}
          header={'Non ci sono foto da recuperare'}
          buttons={[
            {
              text: 'Ok',
              handler: () => {setShowAlertSalva_foto(false)}
            }
          ]}
        />
        <IonAlert
          isOpen={showAlertNoElem}
          onDidDismiss={() => setShowAlertNoElem(false)}
          header={'Non ci sono elementi'}
          buttons={[
            {
              text: 'Ok',
              handler: () => {setShowAlertNoElem(false)}
            }
          ]}
        />
        <IonAlert
          isOpen={showAlertNoPhoto}
          onDidDismiss={() => setShowAlertNoPhoto(false)}
          header={'Non ci sono foto'}
          buttons={[
            {
              text: 'Ok',
              handler: () => {setShowAlertNoPhoto(false)}
            }
          ]}
        />
        <IonToast
            isOpen={showToastInvio}
            duration={2000}
            onDidDismiss={() => setShowToastInvio(false)}
            message="Operazione completata"
            position="bottom"
            color="success"
          />
          <IonToast
            isOpen={showToastErr}
            duration={2000}
            onDidDismiss={() => setShowToastErr(false)}
            message="Errore"
            position="bottom"
            color="danger"
          />

          <IonActionSheet 
            isOpen={opzioni}
            onDidDismiss={() => setOpzioni(false)}
            header= {"Opzioni"}
            buttons={[{
              text: 'Rimuovi tutti gli elementi',
              handler: () => {if (elem.length===0){setShowAlertNoElem(true)} 
                              else {setShowAlertRimuovi_elem(true)}}
            },{
              text: 'Rimuovi tutte le foto',
              handler: () => {if (foto.length===0) {setShowAlertNoPhoto(true)}
                              else {setShowAlertRimuovi_foto(true)}}
            },{
              text: 'Recupera elementi',
              handler: () => {if (elemSalva.length===0) {setShowAlertSalva_elem(true)}
                              else {recupera_elem()}}
            },{
              text: 'Recupera foto',
              handler: () => {if (fotoSalva.length===0) {setShowAlertSalva_foto(true)}
                              else {recupera_foto()}}
            }]}>
        </IonActionSheet>

        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={"Invio in corso..."}
      />

      <IonModal isOpen={showPhoto}>
        
        <IonImg src={foto[imm]} />        
          <IonToolbar>
        <IonButton slot="start" onClick={() => {if (imm>0) {setImm(imm => imm-1)}}}><IonIcon icon={arrowBackCircleOutline}/></IonButton>
        <IonButton slot="end" onClick={() => {if (imm<foto.length-1) setImm(imm => imm+1)}}><IonIcon icon={arrowForwardCircleOutline}/></IonButton>

          <IonButton color="danger" onClick={() => rimuovi_foto(imm)}>Cancella</IonButton>
        </IonToolbar>
      </IonModal>
      
    </IonPage>
  )
        }
  else { return null}
}

export default Pallets
