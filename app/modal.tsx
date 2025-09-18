import { View } from "react-native";
import "../global.css"
import Auth from "@/components/auth/auth";

export default function ModalScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Auth />
    </View>
  );
}

