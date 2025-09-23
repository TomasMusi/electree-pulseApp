// components/menu/menu.tsx
import { useMemo, useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Leaf, User, LineChart, BarChart3, ChevronRight } from "lucide-react-native";
import "../../global.css";
import Profile from "@/components/profile/profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "@/components/auth/auth";

// Precist token a ulozit ho do secure Storage
import * as SecureStore from "expo-secure-store";
// decoding JWT
import { Buffer } from "buffer";
import { useNavigation } from "expo-router";

type SeriesPoint = number[];


function decodeJWT(token: string) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const json = Buffer.from(base64, "base64").toString("utf8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}


export default function Menu() {
    const [graphTab, setGraphTab] = useState<"spot" | "day" | "week">("spot");
    const [chartType, setChartType] = useState<"line" | "bar">("line");
    const navigation = useNavigation();
    // 👤 user info from JWT
    const [userName, setUserName] = useState<string | undefined>();
    const [userEmail, setUserEmail] = useState<string | undefined>();

    useEffect(() => {
        (async () => {
            const token = await SecureStore.getItemAsync("auth_token");
            if (!token) return;
            const payload = decodeJWT(token);
            setUserName(payload?.name);
            setUserEmail(payload?.email);
        })();
    }, []);

    // demo data (0–100). Replace with real series from your API.
    const data: Record<typeof graphTab, SeriesPoint> = {
        spot: [41, 47, 55, 62, 58, 70, 66, 73, 79, 68, 64, 59],
        day: [32, 44, 38, 61, 57, 52, 49, 65, 71, 69, 63, 60, 58, 55, 53, 51, 47, 42, 39, 36, 34, 33, 31, 30],
        week: [64, 61, 59, 63, 67, 72, 78],
    };

    const series = data[graphTab];
    const min = useMemo(() => Math.min(...series), [series]);
    const max = useMemo(() => Math.max(...series), [series]);

    return (
        <View className="flex-1 bg-[#0b0f14] px-4 pt-8 pb-10">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                    <View className="h-10 w-10 rounded-2xl bg-lime-400/15 items-center justify-center mr-3">
                        <Leaf size={24} color="#a3e635" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-semibold">ElectreeApp</Text>
                        <Text className="text-white/60 text-xs -mt-0.5">
                            {userName ? `Vítej, ${userName}` : "Přehled & grafy"}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <Pressable
                        onPress={() => navigation.navigate("Profile" as never, { userName, userEmail } as never)}
                        className="h-9 rounded-xl overflow-hidden bg-white/5 border border-white/10 px-3 items-center justify-center active:opacity-80"
                    >
                        <User size={16} color="white" />
                    </Pressable>

                </View>
            </View>

            {/* Highlight Card */}
            <View className="rounded-3xl border border-lime-300/20 bg-[#121821] mb-6 p-4">
                <Text className="text-lime-300 font-medium">
                    {userName ? `Vítejte zpět, ${userName}!` : "Vítejte zpět"}
                </Text>
                {userEmail && <Text className="text-white/60 text-xs mt-1">{userEmail}</Text>}
                <Text className="text-white/70 text-sm mt-2">
                    Podívejte se na dnešní vývoj cen a spotřeby. Přepínejte přehledy níže.
                </Text>
            </View>

            {/* Graph Scope Switcher */}
            <View className="flex-row p-1 rounded-2xl bg-white/5 border border-white/10 mb-4">
                <ScopeTab label="Teď" active={graphTab === "spot"} onPress={() => setGraphTab("spot")} />
                <ScopeTab label="Dnes" active={graphTab === "day"} onPress={() => setGraphTab("day")} />
                <ScopeTab label="Týden" active={graphTab === "week"} onPress={() => setGraphTab("week")} />
            </View>

            {/* Charts Card */}
            <View className="rounded-3xl border border-white/10 bg-[#0f141c] p-5 mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-white font-semibold">Přehled grafů</Text>
                        <Text className="text-white/50 text-[12px]">Min {min} • Max {max}</Text>
                    </View>

                    <View className="flex-row items-center">
                        <Pressable
                            onPress={() => setChartType("line")}
                            className={`h-9 w-9 rounded-xl items-center justify-center mr-2 border ${chartType === "line" ? "bg-lime-400 border-lime-300" : "bg-white/5 border-white/10"
                                }`}
                            accessibilityRole="button"
                            accessibilityLabel="Line chart"
                        >
                            <LineChart size={18} color={chartType === "line" ? "black" : "white"} />
                        </Pressable>
                        <Pressable
                            onPress={() => setChartType("bar")}
                            className={`h-9 w-9 rounded-xl items-center justify-center border ${chartType === "bar" ? "bg-lime-400 border-lime-300" : "bg-white/5 border-white/10"
                                }`}
                            accessibilityRole="button"
                            accessibilityLabel="Bar chart"
                        >
                            <BarChart3 size={18} color={chartType === "bar" ? "black" : "white"} />
                        </Pressable>
                    </View>
                </View>

                {chartType === "line" ? <Sparkline data={series} /> : <BarRow data={series} />}
            </View>

            {/* Quick Links / Secondary Cards */}
            <View className="gap-3">
                <QuickLink title="Spotové ceny" subtitle="Hodinový vývoj" onPress={() => { }} />
                <QuickLink title="Moje spotřeba" subtitle="Denní a týdenní souhrny" onPress={() => { }} />
            </View>
        </View>
    );
}

function ScopeTab({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} className={`flex-1 py-2 rounded-xl items-center ${active ? "bg-lime-400" : ""}`}>
            <Text className={active ? "text-black font-semibold" : "text-white/70"}>{label}</Text>
        </Pressable>
    );
}

/** Simple dependency-free sparkline using Views */
function Sparkline({ data }: { data: number[] }) {
    if (!data.length) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(1, max - min);

    return (
        <View className="h-28 w-full">
            {/* baseline */}
            <View className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
            <View className="absolute inset-0 flex-row items-end">
                {data.map((v, i) => {
                    const h = (v - min) / range;
                    const barH = Math.max(2, h * 96); // px height inside 112px area
                    return (
                        <View key={i} className="flex-1 items-center justify-end">
                            {/* dot */}
                            <View className="w-2 h-2 rounded-full bg-lime-300" style={{ marginBottom: barH }} />
                            {/* connector */}
                            {i > 0 && <View className="w-full h-px bg-lime-300/50 absolute" style={{ bottom: barH + 4 }} />}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

/** Compact bars without any chart lib */
function BarRow({ data }: { data: number[] }) {
    if (!data.length) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(1, max - min);

    return (
        <View className="h-28 w-full flex-row items-end gap-1.5">
            {data.map((v, i) => {
                const h = (v - min) / range;
                const barH = Math.max(8, h * 104); // px height inside 112px area
                return <View key={i} className="flex-1 rounded-lg bg-lime-400/80" style={{ height: barH }} />;
            })}
        </View>
    );
}

function QuickLink({
    title,
    subtitle,
    onPress,
}: {
    title: string;
    subtitle?: string;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} className="rounded-3xl border border-white/10 bg-[#0f141c] px-4 py-4 active:opacity-80">
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-white font-medium">{title}</Text>
                    {!!subtitle && <Text className="text-white/50 text-xs mt-0.5">{subtitle}</Text>}
                </View>
                <View className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                    <ChevronRight size={18} color="white" />
                </View>
            </View>
        </Pressable>
    );
}

const Stack = createNativeStackNavigator();

export function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    );
}
