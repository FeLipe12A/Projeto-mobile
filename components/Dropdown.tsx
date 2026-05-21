import { db } from "@/FirebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type Props = {
    data: { label: string; value: string }[];
    saveAt: string;
    onChoose?: () => void;
};

export default function DropdownComponent({data, saveAt, onChoose}: Props){
    const [value, setValue] = useState<string | null>(null);
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

    useEffect(() => {
        async function loadValue() {
            try {
                const docRef = doc(db, 'settings', saveAt);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const savedValue = docSnap.data().value as string;
                    setValue(savedValue);
                }
            } catch (error) {
                console.error('Erro ao carregar cor do Firestore:', error);
            }
        }

        loadValue();
    }, [saveAt]);

    const update = async (newValue: string) => {
        const docRef = doc(db, 'settings', saveAt);
        await setDoc(docRef, { value: newValue }, { merge: true });
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
                onChange={async item => {
                    const newValue = item.value;
                    setValue(newValue);
                    setIsFocus(false);
                    await update(newValue);
                    onChoose?.();
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