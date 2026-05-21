import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../FirebaseConfig';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        alert('Conta não encontrada. Verifique seu email ou crie uma nova conta.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Senha incorreta. Tente novamente.');
      } else {
        alert('Falha ao logar: ' + error.message);
      }
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Este email já está em uso. Use Entrar para acessar sua conta.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Email inválido. Verifique o formato do email.');
      } else if (error.code === 'auth/weak-password') {
        alert('A senha deve ter pelo menos 6 caracteres.');
      } else {
        alert('Falha ao criar conta: ' + error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.textinput}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.textinput}
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={signIn} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Criar conta" onPress={signUp} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  textinput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

