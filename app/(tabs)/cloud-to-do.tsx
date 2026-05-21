import Button from "@/components/Button";
import { db } from "@/FirebaseConfig";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";

interface Note {
    id: string;
    title: string;
    createdAt: string;
    completed: boolean;
}

export default function CloudToDo() {
    const [title, setTitle] = useState<string>('');
    const [notes, setNotes] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>("");
    const auth = getAuth();
    const user = auth.currentUser;
    const todosCollection = collection(db, "todos");

    useEffect(() => {
        fetchNotes();
    }, [user]);

    const fetchNotes = async () => {
        if (user) {
            const q = query(todosCollection, where("userId", "==", user.uid));
            const data = await getDocs(q);
            setNotes(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        } else {
            console.log("O usuário não está logado");
        }
    };

    const addNote = async () => {
        if (user) {
            await addDoc(todosCollection, { title, createdAt: new Date().toISOString(), completed: false, userId: user.uid });
            setTitle('');
            fetchNotes();
        } else {
            console.log("O usuário não está logado");
        }
    };

    const deleteNote = async (id: string) => {
        const todoDoc = doc(db, "todos", id.toString());
        await deleteDoc(todoDoc);
        fetchNotes();
    };

    const updateNote = async (id: string) => {
        if (!editingText.trim()) return;

        const todoDoc = doc(db, "todos", id.toString());
        await updateDoc(todoDoc, { title: editingText.trim() });

        setEditingId(null);
        setEditingText("");
        fetchNotes();
    };

    const toggleCompleted = async (id: string, completed: boolean) => {
        const todoDoc = doc(db, "todos", id.toString());
        await updateDoc(todoDoc, { completed: !completed });
        fetchNotes();
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString();
    };

    if (Platform.OS === "web") {
        return (
            <ScrollView>
                <View style={{ padding: 20, marginTop: 10 }}>
                    <Text style={[styles.text, { marginBottom: 5 }]}>
                        Tarefas
                    </Text>

                    <TextInput
                        placeholder="Escreva uma tarefa"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input} />

                    <View style={[styles.container, { padding: 40, marginTop: 10 }]}>
                        <Button onPress={addNote} theme="primary" label="Nova" />
                    </View>

                    <FlatList
                        data={notes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isEditing = editingId === item.id;

                            return (
                                <View style={styles.container}>

                                    {isEditing ? (
                                        <>
                                            <TextInput value={editingText} onChangeText={setEditingText} style={styles.input} />
                                            <View style={{ flexDirection: "row", gap: 5 }}>
                                                <Button onPress={() => updateNote(item.id)} theme="green" label="Salvar" />
                                                <Button
                                                    onPress={() => {
                                                        setEditingId(null);
                                                        setEditingText("");
                                                    }}
                                                    theme="red"
                                                    label="Cancelar" />
                                            </View>
                                        </>
                                    ) : (
                                        <>
<View style={styles.itemRow}>
                                                <Switch
                                                    value={item.completed}
                                                    onValueChange={() => toggleCompleted(item.id, item.completed)}
                                                />
                                                <Text style={[styles.text, item.completed && styles.completedText, { marginTop: 15 }]}> 
                                                    {item.title}
                                                </Text>
                                            </View>

                                            <Text style={[styles.text, { color: "#777" }]}>
                                                {formatDate(item.createdAt)}
                                            </Text>

                                            <View style={{ flexDirection: "row", gap: 10 }}>
                                                <Button onPress={() => {
                                                    setEditingId(item.id);
                                                    setEditingText(item.title);
                                                }}
                                                    theme="green"
                                                    label="Editar" />

                                                <Button
                                                    onPress={() => deleteNote(item.id)}
                                                    theme="red"
                                                    label="Excluir"
                                                />
                                            </View>
                                        </>
                                    )}
                                </View>
                            );
                        }}
                    />
                </View>
            </ScrollView>
        );
    } else {
        return (
            <View style={{ padding: 20, marginTop: 10 }}>
                <Text style={[styles.text, { marginBottom: 5 }]}>
                    Tarefas
                </Text>

                <TextInput
                    placeholder="Escreva uma tarefa"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input} />

                <View style={[styles.container, { padding: 40, marginTop: 10 }]}>
                    <Button onPress={addNote} theme="primary" label="Nova" />
                </View>

                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isEditing = editingId === item.id;

                        return (
                            <View style={styles.container}>

                                {isEditing ? (
                                    <>
                                        <TextInput value={editingText} onChangeText={setEditingText} style={styles.input} />
                                        <View style={{ flexDirection: "row", gap: 5 }}>
                                            <Button onPress={() => updateNote(item.id)} theme="green" label="Salvar" />
                                            <Button
                                                onPress={() => {
                                                    setEditingId(null);
                                                    setEditingText("");
                                                }}
                                                theme="red"
                                                label="Cancelar" />
                                        </View>
                                    </>
                                ) : (
                                    <>
                                            <View style={styles.itemRow}>
                                                <Switch
                                                    value={item.completed}
                                                    onValueChange={() => toggleCompleted(item.id, item.completed)}
                                                />
                                                <Text style={[styles.text, item.completed && styles.completedText, { marginTop: 20 }]}> 
                                                    {item.title}
                                                </Text>
                                            </View>
                                        <Text style={[styles.text, { color: "#777" }]}>
                                            {formatDate(item.createdAt)}
                                        </Text>

                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                            <Button onPress={() => {
                                                setEditingId(item.id);
                                                setEditingText(item.title);
                                            }}
                                                theme="green"
                                                label="Editar" />

                                            <Button
                                                onPress={() => deleteNote(item.id)}
                                                theme="red"
                                                label="Excluir"
                                            />
                                        </View>
                                    </>
                                )}
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "#000",
    },
    completedText: {
        textDecorationLine: "line-through",
        color: "#666",
    },
    input: {
        backgroundColor: "#fff",
        width: "100%",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    }
});