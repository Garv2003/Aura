import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Pressable,
  Text,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { wp } from "@/helpers/common";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import { Octicons } from "@expo/vector-icons";
import { hp } from "@/helpers/common";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-toast-message";

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState("loading");

  const fileName = (item?.webformatURL as string)?.split("/") as string[];

  const imageUrl = item?.webformatURL;

  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const onLoad = () => {
    setStatus("");
  };

  const getSize = () => {
    if (status === "loading") {
      return {
        width: 100,
        height: 100,
      };
    }
    const aspectRatio: any =
      Number(item?.imageWidth) / Number(item?.imageHeight);
    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);

    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };
  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      showToast({
        message: "Permission to access media library is required",
        type: "error",
      });
      return false;
    }
    return true;
  };
  const handelDownloadFile = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return null;
      }
      const { uri } = await FileSystem.downloadAsync(
        imageUrl as string,
        filePath
      );
      setStatus("");
      console.log("Finished downloading to ", uri);
      return uri;
    } catch (e) {
      console.error(e);
      showToast({
        message: "Failed to download",
        type: "error",
      });
      return null;
    }
  };

  const handelDownload = async () => {
    setStatus("downloading");
    let url = await handelDownloadFile();
    if (!url) {
      setStatus("");
      return;
    }
    const asset = await MediaLibrary.createAssetAsync(url);
    const album = await MediaLibrary.getAlbumAsync("Download");
    if (album === null) {
      await MediaLibrary.createAlbumAsync("Download", asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    if (url) {
      showToast({
        message: "Downloaded successfully",
        type: "success",
      });
    }
    setStatus("");
  };

  const handelShare = async () => {
    setStatus("sharing");

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      alert("Uh oh, sharing isn't available on your platform");
      return;
    }

    let uri = await handelDownloadFile();
    if (uri) {
      await Sharing.shareAsync(uri);
      setStatus("");
    }
  };

  const showToast = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error";
  }) => {
    Toast.show({
      type: type,
      text1: message,
    });
  };

  const config = {
    success: ({ text1, props, ...rest }: any) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
    error: ({ text1, props, ...rest }: any) => (
      <View style={{ height: 60, width: "100%", backgroundColor: "red" }}>
        <Text>{text1}</Text>
      </View>
    ),
  };

  return (
    <BlurView tint="dark" intensity={60} style={styles.container}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status === "loading" && (
            <ActivityIndicator size="large" color="#fff" />
          )}
        </View>
        <Image
          transition={1000}
          source={item?.webformatURL}
          onLoad={onLoad}
          style={[styles.image, getSize()]}
        />
      </View>
      <View style={styles.buttons}>
        <View>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="#fff" />
          </Pressable>
        </View>
        <View>
          {status === "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handelDownload}>
              <Octicons name="download" size={24} color="#fff" />
            </Pressable>
          )}
        </View>
        <View>
          {status === "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handelShare}>
              <Octicons name="share" size={24} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>
      <Toast
        config={config}
        visibilityTime={2000}
        autoHide={true}
        position="bottom"
      />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  buttons: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    borderCurve: "continuous",
  },
  toast: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  toastText: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ImageScreen;
