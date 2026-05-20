import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../FirebaseConfig';

export default function index(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) router.replace('/(tabs)/home');
        } catch (error: any) {
            console.error(error);
            alert('Falha ao logar: ' + error.message);
        }
    }

    const singUp = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            if (user) router.replace('/(tabs)/home');
        } catch (error: any) {
            console.error(error);
            alert('Falha ao criar conta: ' + error.message);
        }
    }

    return (
        <SafeAreaView style={ styles.container }>
            
        </SafeAreaView>
    )
}

