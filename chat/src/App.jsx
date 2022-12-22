import { addDoc, collection, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useCollectionData} from "react-firebase-hooks/firestore";
import { app, databaseApp } from "./services/firebaseConfig";
import { getAuth } from "firebase/auth";

import "./App.css";
import { useState } from "react";

const auth = getAuth(app);

export const App = () => {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>ReactChat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
}

// criar a sala de bate papos

export const ChatRoom = () => {

  // criar a referencia no banco e busca as mensagens.
  const messageRef = collection(databaseApp, "messages");

  // criar um query para trazer as mensagens na ordem de criação de cada uma,
  // retornando essas mensagens da mais antiga para a mais nova.
  const QueryMessages = query(messageRef, orderBy("createdAt"), limit(25)); 

  // cria um vetor, para armazenar e mostrar essas mensagens em tela
  const [messages] = useCollectionData(QueryMessages, { idField: "id" });

  const [formValue, setFormValue] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();

    const { photoURL, uid } = auth.currentUser;

    await addDoc(messageRef, {
      text: formValue,
      uid,
      photoURL,
      createdAt: serverTimestamp(),
    });
    setFormValue("");
  };

  return (
    <>
      <main>
        { messages && messages.map((msg, index) => {
          <ChatMessage key={index} message={msg}/>
        }) }
      </main>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue} 
          onChange={e => setFormValue(e.target.value)} 
        />
        <button>Enviar</button>
      </form>
    </>
  )
}

export const ChatMessage = (props) => {
  const { text, photoURL, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={ photoURL } />
      <p>{ text }</p>
    </div>
  )
}

export const SignIn = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  return (
    <button className="sign-in" onClick={() => signInWithGoogle()}>
      Logar com Google
    </button>
  );
};

export const SignOut = () => {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sair
      </button>
    )
  );
};
