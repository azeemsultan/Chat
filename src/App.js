import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import bg from './bg.jpg'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Button, Divider, Grid, Paper, TextField, Typography } from '@material-ui/core';

firebase.initializeApp({
 
    apiKey: "AIzaSyC2TN5-qT4fY9M1BzMEb63XQfluizEK8hI",
    authDomain: "chat-f2f90.firebaseapp.com",
    projectId: "chat-f2f90",
    storageBucket: "chat-f2f90.appspot.com",
    messagingSenderId: "761357902750",
    appId: "1:761357902750:web:69db86cd7744fcb9c5ac8f",
    
  
 
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
/*
  var docRef = firestore.collection("cities").doc();

docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

*/


  const [user] = useAuthState(auth);
  console.log('MUHAHAHA',user)
  const [nam,setNam]=useState([])
  let displayName='';
  let st=''

  if(user){
    displayName=user.displayName;
    st=1;
  }
/*
  firestore.collection("cities").doc().set({
    name: displayName,
    state: st,
    
  })
  .then(() => {
    console.log("Document successfully written!12312312");
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
  });
/*
 let online='';
 let flag='';
  let  get=async()=> {
    const events = await firebase.firestore().collection('cities')
    events.get().then((querySnapshot) => {
        const tempDoc = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
        console.log(tempDoc,"1111111---")
        setNam(tempDoc);

      })
  }

  get();
  */

  return (
    <Grid container>
      <div style={{width:'100%',backgroundColor:'#ff3c26',height:'50px',display:'flex'}}>
        <div style={{display:'absolute',marginTop:'10px',marginLeft:'20px'}}>
          App
        </div>
        <div style={{display:'flex',width:'100%',justifyContent:'flex-end',marginTop:'10px',marginRight:'20px'}}>
          App
        </div>
      </div>
      <Grid item md={1}></Grid>
      <Grid item md={2}>
        <div style={{height:'500px',width:'100%',backgroundColor:'#dedede',marginTop:'50px',textAlign:'center',color:'white'}}>
         <Typography variant="h6">
          Users Online
         </Typography>

         <ul>
         <li>
         
        {displayName}
        
        <Divider/>
             <br/>
           </li>
           
         </ul>
        </div>
      </Grid>
      <Grid item md={8}>
      
    <div>
    <Paper elevation={3} className="App">
      <header style={{backgroundColor:'#ff3c26'}}>
      <Typography variant="h6" >
                     CHAT CLUB  
                 </Typography>
                 
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </Paper>
    </div>
    </Grid>
    <Grid item md={1}></Grid>
    </Grid>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
    .then(function(result) {
      // code which runs on success
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode);
      alert(errorCode);
    
      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    });
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <Button  onClick={() => auth.signOut()}>Sign Out</Button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
      
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<div  >
    <main className="main" style={{backgroundImage: `url(${bg})`,paddingLeft:'20px'}} >
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <TextField style={{marginLeft:'10px'}} value={formValue} fullWidth onChange={(e) => setFormValue(e.target.value)} label="Write a message..." />

      <Button variant="contained" type="submit" disabled={!formValue} style={{backgroundColor:'#ff3c26'}}>Send</Button>

    </form>
  </div>)
}


function ChatMessage(props) {
  const { text, uid, photoURL,displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  console.log("!@",auth.currentUser.uid)
  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p> 
     
    </div>
  </>)
}


export default App;
