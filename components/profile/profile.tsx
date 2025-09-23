// components/profile/Profile.tsx
import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    Modal,
    Alert,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ChevronLeft,
    LogOut,
    User as UserIcon,
    Mail,
    Shield,
    Phone,
    Settings2,
    Pencil,
} from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import "../../global.css";

type RouteParams = { userName?: string; userEmail?: string };

export default function Profile({ route }: { route: { params?: RouteParams } }) {
    const navigation = useNavigation();
    const { userName, userEmail } = route?.params || {};
    const initials = useMemo(
        () =>
            (userName || userEmail || "?")
                .split(" ")
                .map((s) => s[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
        [userName, userEmail]
    );

    // theme toggle
    const [isDark, setIsDark] = useState(true);

    // modules
    const [personalModal, setPersonalModal] = useState(false);
    const [securityMenuModal, setSecurityMenuModal] = useState(false);

    const [emailModal, setEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState(userEmail || "");

    const [pwdModal, setPwdModal] = useState(false);
    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");

    const onLogout = async () => {
        await SecureStore.deleteItemAsync("auth_token");
        navigation.reset({ index: 0, routes: [{ name: "Auth" as never }] });
    };

    const saveEmail = () => {
        if (!newEmail.includes("@")) {
            Alert.alert("Neplatný email", "Zadejte prosím platný email.");
            return;
        }
        Alert.alert("Email změněn", newEmail);
        setEmailModal(false);
    };

    const savePassword = () => {
        if (pwd1.length < 8) {
            Alert.alert("Slabé heslo", "Heslo musí mít alespoň 8 znaků.");
            return;
        }
        if (pwd1 !== pwd2) {
            Alert.alert("Nesouhlasí", "Hesla se neshodují.");
            return;
        }
        Alert.alert("Heslo změněno", "Vaše heslo bylo změněno.");
        setPwdModal(false);
        setPwd1("");
        setPwd2("");
    };

    return (
        <View className="flex-1 bg-[#0b0f14] px-6 pt-12 pb-8">
            {/* Header*/}
            <View className="flex-row items-center justify-between mb-6">
                <Pressable
                    onPress={() => navigation.goBack()}
                    className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center active:opacity-80"
                    accessibilityRole="button"
                    accessibilityLabel="Zpět"
                >
                    <ChevronLeft size={18} color="white" />
                </Pressable>

                <Text className="text-white text-base font-semibold">Profil</Text>
                <View className="h-9 w-9" />
            </View>

            {/* Profilovka, Jmeno, Email */}
            <View className="items-center mb-8">
                <View className="h-24 w-24 rounded-full items-center justify-center bg-lime-400/10 border border-lime-400/40 relative">
                    <Text className="text-lime-300 text-3xl font-bold">{initials}</Text>
                    <View className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-[#121821] border border-white/10 items-center justify-center">
                        <Pencil size={16} color="#a3e635" />
                    </View>
                </View>

                <Text className="text-white text-xl font-semibold mt-4">
                    {userName ?? "Uživatel"}
                </Text>
                <Text className="text-white/60">{userEmail ?? "email@example.com"}</Text>
            </View>

            {/* List */}
            <View className="rounded-3xl bg-[#0f141c] border border-white/10">
                {/* 1) Osobní údaje – pouze zobrazení informací */}
                <Row
                    icon={<UserIcon size={18} color="white" />}
                    title="Osobní údaje"
                    onPress={() => setPersonalModal(true)}
                />

                {/* 2) Soukromí & Bezpečnost – submenu (Změnit email/heslo) */}
                <Row
                    icon={<Shield size={18} color="white" />}
                    title="Soukromí & Bezpečnost"
                    onPress={() => setSecurityMenuModal(true)}
                />

                {/* Kontaktujte nás */}
                <Row
                    icon={<Phone size={18} color="white" />}
                    title="Kontaktujte nás"
                    onPress={() => Alert.alert("Kontakt", "support@electree.app")}
                />

                {/* Preference (Zmena barvy) */}
                <RowSwitch
                    icon={<Settings2 size={18} color="white" />}
                    title="Motiv aplikace"
                    value={isDark}
                    onValueChange={(v) => {
                        setIsDark(v);
                        Alert.alert("Motiv", v ? "Tmavý" : "Světlý");
                    }}
                    rightLabel={isDark ? "Tmavý" : "Světlý"}
                />
            </View>

            {/* Odhlaseni */}
            <Pressable
                onPress={onLogout}
                className="mt-4 h-11 rounded-2xl items-center justify-center flex-row active:opacity-80 bg-red-500"
            >
                <LogOut size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Odhlásit se</Text>
            </Pressable>

            {/* Footer */}
            <Text className="text-white/30 text-center mt-auto text-xs">© Electree 2025</Text>

            {/* ===== Moduly ===== */}

            {/* Osobní údaje*/}
            <BottomSheet visible={personalModal} onClose={() => setPersonalModal(false)} title="Osobní údaje">
                <InfoRow label="Jméno" value={userName ?? "Uživatel"} />
                <InfoRow label="Email" value={userEmail ?? "email@example.com"} />
                <View className="flex-row gap-3 mt-3">
                    <Button primary label="Zavřít" onPress={() => setPersonalModal(false)} />
                </View>
            </BottomSheet>

            {/* Submenu: Soukromí & Bezpečnost */}
            <BottomSheet visible={securityMenuModal} onClose={() => setSecurityMenuModal(false)} title="Soukromí & Bezpečnost">
                <Pressable
                    onPress={() => {
                        setSecurityMenuModal(false);
                        setEmailModal(true);
                    }}
                    className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10 active:opacity-80 mb-3"
                >
                    <View className="flex-row items-center">
                        <View className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                            <Mail size={18} color="white" />
                        </View>
                        <Text className="text-white">Změnit email</Text>
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => {
                        setSecurityMenuModal(false);
                        setPwdModal(true);
                    }}
                    className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10 active:opacity-80"
                >
                    <View className="flex-row items-center">
                        <View className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                            <Shield size={18} color="white" />
                        </View>
                        <Text className="text-white">Změnit heslo</Text>
                    </View>
                </Pressable>
            </BottomSheet>

            {/* Zmena Emailu */}
            <BottomSheet visible={emailModal} onClose={() => setEmailModal(false)} title="Změnit email">
                <LabeledField label="Nový email">
                    <TextInput
                        value={newEmail}
                        onChangeText={setNewEmail}
                        placeholder="novy@email.cz"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="flex-1 text-white"
                    />
                </LabeledField>
                <View className="flex-row gap-3">
                    <Button ghost label="Zrušit" onPress={() => setEmailModal(false)} />
                    <Button primary label="Uložit" onPress={saveEmail} />
                </View>
            </BottomSheet>

            {/* Zmena Hesla */}
            <BottomSheet visible={pwdModal} onClose={() => setPwdModal(false)} title="Změnit heslo">
                <LabeledField label="Nové heslo">
                    <TextInput
                        value={pwd1}
                        onChangeText={setPwd1}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        secureTextEntry
                        className="flex-1 text-white"
                    />
                </LabeledField>
                <LabeledField label="Potvrzení hesla">
                    <TextInput
                        value={pwd2}
                        onChangeText={setPwd2}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        secureTextEntry
                        className="flex-1 text-white"
                    />
                </LabeledField>
                <View className="flex-row gap-3 mt-1">
                    <Button ghost label="Zrušit" onPress={() => setPwdModal(false)} />
                    <Button primary label="Uložit" onPress={savePassword} />
                </View>
            </BottomSheet>
        </View>
    );
}

/* ---------- Znovu pouzivatelne veci ---------- */

function Row({
    icon,
    title,
    onPress,
}: {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className="px-4 py-4 border-b border-white/10 active:opacity-80 flex-row items-center justify-between"
        >
            <View className="flex-row items-center">
                <View className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                    {icon}
                </View>
                <Text className="text-white">{title}</Text>
            </View>
            <Text className="text-white/40">{">"}</Text>
        </Pressable>
    );
}

function RowSwitch({
    icon,
    title,
    value,
    onValueChange,
    rightLabel,
}: {
    icon: React.ReactNode;
    title: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
    rightLabel?: string;
}) {
    return (
        <View className="px-4 py-4 border-b border-white/10 flex-row items-center justify-between">
            <View className="flex-row items-center">
                <View className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
                    {icon}
                </View>
                <Text className="text-white">{title}</Text>
            </View>
            <View className="flex-row items-center">
                {!!rightLabel && <Text className="text-white/60 mr-2 text-xs">{rightLabel}</Text>}
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: "rgba(255,255,255,0.2)", true: "#a3e635" }}
                    thumbColor={value ? "#0b0f14" : "#ffffff"}
                />
            </View>
        </View>
    );
}

function Button({
    label,
    onPress,
    primary,
    ghost,
}: {
    label: string;
    onPress: () => void;
    primary?: boolean;
    ghost?: boolean;
}) {
    const style = primary
        ? "bg-lime-400"
        : ghost
            ? "bg-white/5 border border-white/10"
            : "bg-white/10";
    const text = primary ? "text-black" : "text-white";
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 h-11 rounded-2xl items-center justify-center active:opacity-80 ${style}`}
        >
            <Text className={`${text} font-semibold`}>{label}</Text>
        </Pressable>
    );
}

function LabeledField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <View className="mb-3">
            <Text className="text-white/70 text-sm mb-2">{label}</Text>
            <View className="h-11 rounded-2xl px-4 bg-white/5 border border-white/10 flex-row items-center">
                {children}
            </View>
        </View>
    );
}

// Nastavovani BottomSheetu (okenko ktere vyskoci.)
function BottomSheet({
    visible,
    onClose,
    title,
    children,
}: {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-[#0b0f14]">
                {/* Header */}
                <View className="px-5 py-6 mt-6 flex-row items-center justify-between border-b border-white/10 bg-[#0b0f14]">
                    <Pressable
                        onPress={onClose}
                        className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center active:opacity-80"
                        accessibilityRole="button"
                        accessibilityLabel="Zpět"
                    >
                        <Text className="text-white text-lg">←</Text>
                    </Pressable>
                    <Text className="text-white text-base font-semibold">{title}</Text>
                    <View className="h-9 w-9" />
                </View>

                {/* Content */}
                <View className="flex-1 p-5">
                    {children}
                </View>
            </SafeAreaView>
        </Modal>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View className="mb-3">
            <Text className="text-white/70 text-sm mb-1">{label}</Text>
            <View className="h-11 rounded-2xl px-4 bg-white/5 border border-white/10 items-center justify-center">
                <Text className="text-white/90">{value}</Text>
            </View>
        </View>
    );
}
