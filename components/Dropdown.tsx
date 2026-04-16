import * as SQLite from 'expo-sqlite';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type Props = {
    data: { label: string; value: string }[];
    saveAt: string;
    onChoose?: () => void;
};

export default function DropdownComponent({data, saveAt, onChoose}: Props){
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    let selectedColor = "Selecione a cor";

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };

    const update = async (value: string) => {
        const db = await SQLite.openDatabaseAsync('database');
        try {
            const SavedColor = await db.getAllAsync("SELECT value FROM cor WHERE id = ?", saveAt);
            await db.runAsync('UPDATE cor SET value = ? WHERE id = ?', value, saveAt);
        } catch {
            await db.runAsync('INSERT INTO cor (id, value) VALUES (?, ?', saveAt, value);
        }
    };

    return (
        <View style={styles.container}>
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? selectedColor : '...'}
                searchPlaceholder="Selecione..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                    update(item.value);
                    onChoose;
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#25292e',
        padding: 16
    },
    dropdown: {
        height: 50,
        borderColor: '#25292e',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: '#25292e',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: 'white',
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20, 
    },
    inputSearchStyle: {
        height:  40,
        fontSize: 16,
    }
});