import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ImageSourcePropType, ActivityIndicator, Alert } from "react-native";
import { Leaf, Zap, LogIn, UserPlus, ShieldCheck, Eye, EyeOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import "../../global.css";
import * as SecureStore from "expo-secure-store";
import { login, register } from "@/services/auth";



export default function Auth() {
    const [tab, setTab] = useState<"login" | "register">("login");

    return (
        <View className="flex-1 bg-[#0b0f14] px-4 pt-8 pb-10">
            {/* Header */}
            <View className="flex-row items-center mb-6">
                <View className="h-10 w-10 rounded-2xl bg-lime-400/15 items-center justify-center mr-3">
                    <Leaf size={24} color="#a3e635" />
                </View>
                <View>
                    <Text className="text-white text-lg font-semibold">Electree</Text>
                    <Text className="text-white/60 text-xs -mt-0.5">Energetický Dodavatel</Text>
                </View>
            </View>

            {/* Highlight Card */}
            <View className="rounded-3xl border border-lime-300/20 bg-[#121821] mb-6 p-4">
                <View className="flex-row items-center">
                    <Zap size={16} color="#bef264" />
                    <Text className="text-lime-300 ml-2 font-medium">Chytřejší sazby začínají zde</Text>
                </View>
                <Text className="text-white/70 text-sm mt-2">
                    Sledujte hodinové ceny, nastavte upozornění.
                </Text>
            </View>

            {/* Switcher */}
            <View className="flex-row p-1 rounded-2xl bg-white/5 border border-white/10 mb-4">
                <TabButton label="Přihlášení" active={tab === "login"} onPress={() => setTab("login")} />
                <TabButton label="Registrace" active={tab === "register"} onPress={() => setTab("register")} />
            </View>

            {/* Form Card */}
            <View className="rounded-3xl border border-white/10 bg-[#0f141c] p-6">
                {tab === "login" ? <LoginForm /> : <RegisterForm />}

                {/* Divider */}
                <View className="my-5">
                    <View className="h-px bg-white/10" />
                    <Text className="self-center -mt-2 px-2 bg-[#0f141c] text-[11px] text-white/40 uppercase">
                        nebo pokračujte pomoci
                    </Text>
                </View>

                {/* Alt auth buttons with images */}
                <View className="flex-row gap-3">
                    <AuthAltButton label="Apple" imageSource={require("../../assets/images/apple.png")} />
                    <AuthAltButton label="Google" imageSource={require("../../assets/images/google.png")} />
                </View>
            </View>

            {/* Trust bar */}
            <View className="mt-6 flex-row items-center">
                <ShieldCheck size={16} color="#bef264" />
                <Text className="text-white/50 text-xs ml-2">Vaše data jsou šifrovaná end-to-end</Text>
            </View>
        </View>
    );
}

function TabButton({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 py-2 rounded-xl items-center ${active ? "bg-lime-400" : ""}`}
        >
            <Text className={active ? "text-black font-semibold" : "text-white/70"}>{label}</Text>
        </Pressable>
    );
}


function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const onLogin = async () => {
        try {
            if (!email.trim() || !password) {
                Alert.alert("Chyba", "Vyplňte email i heslo.");
                return;
            }
            setLoading(true);
            const data = await login(email.trim(), password);
            // data: { token, token_type, expires_in, status, message }
            await SecureStore.setItemAsync("auth_token", data.token);
            Alert.alert("Přihlášení", data?.message ?? "Úspěšně přihlášen.");

            // Ujisteni, ze Menu se stane Rootem (zadne vraceni na Auth!)
            navigation.reset({
                index: 0,
                routes: [{ name: "Menu" as never }],
            });

        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.response?.data?.error || e.message;
            Alert.alert("Chyba přihlášení", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <FormField label="Email" placeholder="email@seznam.cz" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <FormField label="Heslo" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
            <View className="flex-row items-center justify-between mt-2">
                <Text className="text-white/60 text-xs">Zapamatovat si mě</Text>
                <Pressable><Text className="text-lime-300 text-xs">Zapomněl heslo?</Text></Pressable>
            </View>

            <Pressable
                onPress={onLogin}
                disabled={loading}
                className={`mt-3 h-11 rounded-2xl items-center justify-center active:opacity-80 ${loading ? "bg-white/20" : "bg-lime-400"}`}
            >
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <View className="flex-row items-center">
                        <LogIn size={16} color="black" />
                        <Text className="text-black font-semibold ml-2">Přihlásit se</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
}
function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onRegister = async () => {
        try {
            if (!name.trim() || !email.trim() || !password) {
                Alert.alert("Chyba", "Vyplňte jméno, email i heslo.");
                return;
            }
            setLoading(true);
            const data = await register(name.trim(), email.trim(), password);
            // očekáváš { status: "ok", message: "...", data: {...} }
            Alert.alert("Registrace", data?.message ?? "Účet vytvořen. Nyní se přihlaste.");
        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.response?.data?.error || e.message;
            Alert.alert("Chyba registrace", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <FormField label="Jméno" placeholder="Adam Novak" value={name} onChangeText={setName} />
            <FormField label="Email" placeholder="email@seznam.cz" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <FormField label="Heslo" placeholder="Alespoň 8 znaků" secureTextEntry value={password} onChangeText={setPassword} />

            <Pressable
                onPress={onRegister}
                disabled={loading}
                className={`mt-3 h-11 rounded-2xl items-center justify-center active:opacity-80 ${loading ? "bg-white/20" : "bg-lime-400"}`}
            >
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <View className="flex-row items-center">
                        <UserPlus size={16} color="black" />
                        <Text className="text-black font-semibold ml-2">Registrovat</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
}

function FormField({
    label,
    placeholder,
    keyboardType,
    secureTextEntry,
    value,
    onChangeText,
}: {
    label: string;
    placeholder?: string;
    keyboardType?: any;
    secureTextEntry?: boolean;
    value: string;
    onChangeText: (t: string) => void;
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const toggleVisibility = () => setIsPasswordVisible((v) => !v);

    return (
        <View className="mb-3">
            <Text className="text-white/70 text-sm mb-2">{label}</Text>
            <View className="flex-row items-center h-11 rounded-2xl px-4 bg-white/5 border border-white/10">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    autoCapitalize="none"
                    className="flex-1 text-white"
                />
                {secureTextEntry && (
                    <Pressable onPress={toggleVisibility} className="pl-2" accessibilityRole="button">
                        {isPasswordVisible ? <EyeOff size={20} color="white" /> : <Eye size={20} color="white" />}
                    </Pressable>
                )}
            </View>
        </View>
    );
}


function AuthAltButton({
    label,
    imageSource,
}: {
    label: string;
    imageSource?: ImageSourcePropType;
}) {
    return (
        <Pressable
            className="flex-1 h-11 rounded-2xl bg-white items-center justify-center border border-white/20 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <View className="flex-row items-center">
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={{ width: 18, height: 18, marginRight: 8 }}
                        resizeMode="contain"
                    />
                ) : null}
                <Text className="text-black/90 font-medium">{label}</Text>
            </View>
        </Pressable>
    );
}
