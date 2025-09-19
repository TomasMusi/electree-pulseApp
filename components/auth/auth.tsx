import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ImageSourcePropType } from "react-native";
import { Leaf, Zap, LogIn, UserPlus, ShieldCheck, Eye, EyeOff } from "lucide-react-native";
import "../../global.css";

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
    return (
        <View>
            <FormField label="Email" placeholder="email@seznam.cz" keyboardType="email-address" />
            <FormField label="Heslo" placeholder="••••••••" secureTextEntry />
            <View className="flex-row items-center justify-between mt-2">
                <Text className="text-white/60 text-xs">Zapamtovat si mě</Text>
                <Pressable>
                    <Text className="text-lime-300 text-xs">Zapomněl Heslo?</Text>
                </Pressable>
            </View>
            <Pressable className="mt-3 h-11 rounded-2xl bg-lime-400 items-center justify-center active:opacity-80">
                <View className="flex-row items-center">
                    <LogIn size={16} color="black" />
                    <Text className="text-black font-semibold ml-2">Příhlásit se</Text>
                </View>
            </Pressable>
        </View>
    );
}

function RegisterForm() {
    return (
        <View>
            <FormField label="Jmeno" placeholder="Adam Novak" />
            <FormField label="Email" placeholder="email@seznam.cz" keyboardType="email-address" />
            <FormField label="Heslo" placeholder="Alespoň 8 Znaků" secureTextEntry />
            <Pressable className="mt-3 h-11 rounded-2xl bg-lime-400 items-center justify-center active:opacity-80">
                <View className="flex-row items-center">
                    <UserPlus size={16} color="black" />
                    <Text className="text-black font-semibold ml-2">Registrovat</Text>
                </View>
            </Pressable>
        </View>
    );
}

function FormField({
    label,
    placeholder,
    keyboardType,
    secureTextEntry,
}: {
    label: string;
    placeholder?: string;
    keyboardType?: any;
    secureTextEntry?: boolean;
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const toggleVisibility = () => setIsPasswordVisible((v) => !v);

    return (
        <View className="mb-3">
            <Text className="text-white/70 text-sm mb-2">{label}</Text>
            <View className="flex-row items-center h-11 rounded-2xl px-4 bg-white/5 border border-white/10">
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
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
    imageSource?: ImageSourcePropType; // local require(...) or { uri: string }
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
