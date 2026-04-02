import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import ModalMenu from "@/components/ModalMenu";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const PlaceholderImage = require("../../assets/images/background-image.png");

export default function Index() {
  const [ selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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

  return (
    <View style= {styles.container}>
      <View style={styles.container}>
        <ImageViewer imgSource={selectedImage || PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button
        onPress={pickImageAsync}
        label="Escolha uma foto" 
        theme="primary"/>
        <Button onPress={onModalOpen} label="Cheque sua lista"/>
        <ModalMenu isVisible={isModalVisible} onClose={onModalClose}>
          {}
        </ModalMenu>
      </View>
    </View>
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