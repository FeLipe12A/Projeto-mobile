import Button from "@/components/Button";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

interface Note {
    id: number;
    title: string;
    createdAt: string;
}

type SQLiteDB = SQLite.SQLiteDatabase | null;

let db: SQLiteDB = null;

async function openDatabase(): Promise<SQLiteDB> {
    try {
        const database = await SQLite.openDatabaseAsync("database");
        db = database;

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            createdAt TEXT NOT NULL
            );
        `);

        return db;
    } catch (error) {
        console.error("Erro de inicialização do banco de dados:", error);
        db = null;
        return null;
    }
}

export default function LocalToDo() {
    const [title, setTitle] = useState<string>("");
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>("");

    const fetchNotes = async () => {
        if (!db) return;
        try {
            const allNotes: Note[] = await db.getAllAsync(
                "SELECT * FROM notes ORDER BY id DESC;"
            );
            setNotes(allNotes);
        } catch (error) {
            console.error("Erro de coleta de dados:", error);
        }
    }

    const addNote = async () => {
        if (!db || !title.trim()) return;

        try {
            const now = new Date().toISOString();
            await db.runAsync(
                "INSERT INTO notes (title, createdAt) VALUES (?, ?);",
                [title.trim(), now]
            );

            setTitle("");
            fetchNotes();
        } catch (error) {
            console.error("Erro ao adicionar:", error);
        }
    }

    const deleteNote = async (id: number) => {
        if (!db) return;

        try {
            await db.runAsync("DELETE FROM notes WHERE id = ?;", [id]);
            fetchNotes();
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    };

    const updateNote = async () => {
        if (!db || editingId === null || !editingText.trim()) return;

        try {
            await db.runAsync("UPDATE notes SET title = ? WHERE id = ?;", [editingText.trim(), editingId]);

            setEditingId(null);
            setEditingText("");
            fetchNotes();
        } catch (error) {
            console.error("Erro ao atualizar:", error);
        }
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10}}>Carregando banco de dados...</Text>
            </View>
        );
    }

    useEffect(() => {
        openDatabase().then(() => {
            fetchNotes();
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, []);

    return (
        <View style={{ padding: 20, marginTop: 50 }}>
            <Text style={styles.text}>
                Tarefas
            </Text>

            <TextInput
                placeholder="Escreva uma tarefa"
                value={title}
                onChangeText={setTitle}
                style={styles.input}/>

            <Button onPress={addNote} theme="primary" label="Nova"/>

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const isEditing = editingId === item.id;
                    
                    return (
                        <View style={styles.container}>

                            {isEditing ? (
                                <>
                                    <TextInput value={editingText} onChangeText={setEditingText} style={styles.input}/>
                                    <View style={{ flexDirection: "row", gap: 10 }}>
                                        <Button onPress={updateNote} theme="green" label="Salvar"/>
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
                                    <Text style={styles.text}>
                                        {item.title}
                                    </Text>
                                    
                                    <Text style={[styles.text, { color: "#777" }]}>
                                        {formatDate(item.createdAt)}
                                    </Text>
                                    
                                    <View style={{ flexDirection: "row", gap: 10 }}>
                                        <Button onPress={() => {
                                            setEditingId(item.id);
                                            setEditingText(item.title);
                                        }} 
                                            theme="green" 
                                            label="Editar"/>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#25292e"
    },
    text: {
        color: "#fff",
    },
    input: {
        backgroundColor: "#fff",
        width: "100%",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    }
});