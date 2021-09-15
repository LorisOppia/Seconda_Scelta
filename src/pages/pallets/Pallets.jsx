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
  IonLabel
} from '@ionic/react'
import { useState } from 'react'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { App } from '@capacitor/app';
import { settingsOutline, closeOutline } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera'

const Pallets = () => {

  let url = "http://127.0.0.1:8000/caricoScaricoPallets/"


  App.addListener('backButton', () => {
    BarcodeScanner.stopScan()
    setNascondi(false)
    setImm()
    setShowPhoto(false)
  })

  const invia = async () => {
    let carico
    let data = {}
    setShowLoading(true)
    for (let i = 0;i<elem.length; i++){
    carico = false
    data = {"qr":elem[i].toString(),"carico":carico}
      try {
        await fetch(url,{
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
      setShowLoading(false) ;return}
  }
  setElem([])
  setShowToastInvio(true)
  setShowLoading(false)
  }

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) { startScan() }
    };

  const startScan = async () => {
    setNascondi(true)
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) { setElem(righe => [result.content, ...righe]);
                            setNascondi(false); }
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

  const chiudi = (id) => {
    document.getElementById(id).close();
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

  /*const aggiungi_foto = () => {
      setListaFoto(listaFoto => [...listaFoto, "http://placekitten.com/g/200/300"])
  }*/

  const scatta = async () => {
    const image = await Camera.getPhoto({
      quality:100,
      resultType: CameraResultType.Uri,
      saveToGallery: false,
      source: CameraSource.Camera
    })
    setFoto(listaFoto => [...listaFoto, image.webPath])
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
        <IonInput placeholder="Inserisci una nota"/>
      </IonItem>

      <IonItem>
            <IonButton color="success" size="large" onClick={() => {if (elem.length===0) {setShowAlertNoElem(true)} 
                                                                                 else {setShowAlertInvia(true)}}}>
                    Invia
                </IonButton>

              <IonButton size="large" color="warning" onClick={() => scatta()}>
                Scatta
              </IonButton>
              

            <IonButton onClick={() => {setElem(righe => [Math.floor(Math.random() * 50), ...righe])/*checkPermission()*/}} size="large">       
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
              handler: () => {invia()}
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
            message={'Invio in corso...'}
      />

      <IonModal isOpen={showPhoto}>
        <IonToolbar>
          <IonButton slot="end" color="danger" onClick={() => rimuovi_foto(imm)}>Cancella</IonButton>
        </IonToolbar>
        <IonImg src={foto[imm]}>        
          </IonImg>
      </IonModal>
      
    </IonPage>
  )
        }
  else { return null}
}

export default Pallets
