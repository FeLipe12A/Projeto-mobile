import Button from "@/components/Button";
import DropdownComponent from "@/components/Dropdown";
import ImageViewer from "@/components/ImageViewer";
import ModalMenu from "@/components/ModalMenu";
import { db } from "@/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const PlaceholderImage = require("../../assets/images/background-image.png");

export default function Home() {
  const [ selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const backgroundColor =  useSharedValue("white");
  const data = [
    { label: 'Rosa', value: '#edb8d4' },
    { label: 'Azul', value: '#a5c9f4' },
    { label: 'Verde', value: '#d1fcd8' },
    { label: 'Branco', value: '#fffeff' },
    { label: 'Cinza', value: '#cccccc' },
  ]

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if(!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    } else {
      alert('Você não selecionou nenhuma imagem.');
    }
  }

  const onModalOpen = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const getSelectedColor = async () => {
    try {
      const colorDoc = doc(db, 'settings', 'SelectedColor');
      const docSnap = await getDoc(colorDoc);

      if (docSnap.exists()) {
        const savedColor = docSnap.data().value as string;
        backgroundColor.value = savedColor;
      } else {
        await setDoc(colorDoc, { value: '#fffeff' });
        backgroundColor.value = '#fffeff';
      }
    } catch (error) {
      console.error('Erro ao ler cor do Firestore:', error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(backgroundColor.value, { duration: 400}),
  }));

  useEffect(() => {
    getSelectedColor();
  }, []);

  return (
    <Animated.View style= {[styles.container, animatedStyle]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <ImageViewer imgSource={selectedImage || PlaceholderImage} />
      </Animated.View>
      <View style={styles.footerContainer}>
        <Button
        onPress={pickImageAsync}
        label="Escolha uma foto" 
        theme="primary"/>
        <Button onPress={onModalOpen} label="Cheque sua lista"/>
        <ModalMenu isVisible={isModalVisible} onClose={onModalClose}>
          <View>
            <DropdownComponent data={data} saveAt="SelectedColor" onChoose={getSelectedColor} ></DropdownComponent>
          </View>
        </ModalMenu>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a5c9f4",
  },

  text:{
    color: "#342323",
  },

  link: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#342323",
  },

  footerContainer:{
    flex: 1/3,
    alignItems: "center",
  }
});