import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsubscribe();
  }, []);

  const cadastrar = () => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        setUsuario(userCredential.user);
        setEmail('');
        setSenha('');
      })
      .catch((error) => alert(error.message));
  };

  const entrar = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        setUsuario(userCredential.user);
        setEmail('');
        setSenha('');
      })
      .catch((error) => alert(error.message));
  };

  const sair = () => {
    signOut(auth)
      .then(() => setUsuario(null))
      .catch((error) => alert(error.message));
  };

  const enviarMensagem = async () => {
    if (titulo && mensagem && usuario) {
      try {
        await addDoc(collection(firestore, 'notifications'), {
          titulo,
          mensagem,
          lida: false,
          createdAt: serverTimestamp(),
          uid: usuario.uid
        });
        setTitulo('');
        setMensagem('');
      } catch (error) {
        console.error("Erro ao adicionar mensagem: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {usuario ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Notificação</Text>
          <Text style={styles.messageSubtitle}>Escreva aqui sua mensagem</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={[styles.input, styles.inputMessage]}
            placeholder="Descrição"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
          />
          <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
            <Text style={styles.botaoTexto}>Enviar Mensagem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSair} onPress={sair}>
            <Text style={styles.botaoTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authContainer}>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>Cadastre-se ou faça login para enviar notificações</Text>
          <View style={styles.inputs}>
            <Text style={styles.identificacao}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Insira seu e-mail"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.identificacao}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Insira sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.botaoCadastrar} onPress={cadastrar}>
            <Text style={styles.botaoTexto}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoEntrar} onPress={entrar}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
  },
  authContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#A73C3C',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 2,
  },
  messageContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#A73C3C',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 2,
    paddingHorizontal: 20,
  },
  messageTitle: {
    marginTop: 50,
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  messageSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  title: {
    marginTop: '12%',
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    width: 270,
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
    marginBottom: 20,
  },
  inputs: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25,
  },
  identificacao: {
    color: '#FFF',
    fontSize: 17,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    width: '100%',
    padding: 15,
    paddingLeft: 30,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 23,
    backgroundColor: '#FFF',
  },
  inputMessage: {
    height: 100,
    textAlignVertical: 'top',
  },
  botaoEnviar: {
    backgroundColor: '#4B0707',
    marginTop: 20,
    padding: 15,
    borderRadius: 23,
    width: '88%',
    alignItems: 'center',
  },
  botaoCadastrar: {
    backgroundColor: '#4B0707',
    marginTop: 15,
    padding: 15,
    borderRadius: 23,
    width: '88%',
    alignItems: 'center',
  },
  botaoSair: {
    backgroundColor: '#4B0707',
    marginTop: 15,
    padding: 15,
    borderRadius: 23,
    width: '88%',
    alignItems: 'center',
  },
  botaoEntrar: {
    backgroundColor: '#4B0707',
    marginTop: 20,
    padding: 15,
    borderRadius: 23,
    width: '88%',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
