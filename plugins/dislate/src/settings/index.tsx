import { getAssetIDByName } from "@vendetta/ui/assets"
import { React, ReactNative, stylesheet, constants, NavigationNative, url } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui"
import { Forms } from "@vendetta/ui/components"
import { manifest } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"

import { settings } from ".."
import TargetLang from "./TargetLang"
import TranslatorPage from "./TranslatorPage"

const { ScrollView, Text } = ReactNative
// ✅ 1. أضفنا FormInput و FormSection هنا
const { FormRow, FormSwitchRow, FormInput, FormSection } = Forms 

const styles = stylesheet.createThemedStyleSheet({
    subheaderText: {
        color: semanticColors.HEADER_SECONDARY,
        textAlign: 'center',
        margin: 10,
        marginBottom: 50,
        letterSpacing: 0.25,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        fontSize: 14
    }
})

export default () => {
    const navigation = NavigationNative.useNavigation()
    useProxy(settings)

    return (
        <ScrollView>
            {/* --- الإعدادات القديمة --- */}
            <FormSection title="General Settings">
                <FormSwitchRow
                    label={"Immersive Translation"}
                    subLabel={"Display both original and translation"}
                    leading={<FormRow.Icon source={getAssetIDByName("ic_chat_bubble_filled_24px")} />}
                    value={settings.immersive_enabled ?? true}
                    onValueChange={(v) => {
                        settings.immersive_enabled = v
                    }}
                />

                <FormRow
                    label={"Translate to"}
                    subLabel={settings.target_lang?.toLowerCase()}
                    leading={<FormRow.Icon source={getAssetIDByName("ic_activity_24px")} />}
                    trailing={() => <FormRow.Arrow />}
                    onPress={() => navigation.push("VendettaCustomPage", {
                        title: "Translate to",
                        render: TargetLang,
                    })}
                />
                <FormRow
                    label={"Translator (Standard)"}
                    subLabel={settings.translator ? "Google Translate" : "DeepL"}
                    leading={<FormRow.Icon source={getAssetIDByName("ic_locale_24px")} />}
                    trailing={() => <FormRow.Arrow />}
                    onPress={() => navigation.push("VendettaCustomPage", {
                        title: "Translator",
                        render: TranslatorPage,
                    })}
                />
            </FormSection>

            {/* --- ✅ 2. هذا هو الجزء الجديد لـ Gemini --- */}
            <FormSection title="Gemini AI (New)">
                <FormRow
                    label="Gemini API Key"
                    subLabel="Required for 'Gemini Translate' button"
                    leading={<FormRow.Icon source={getAssetIDByName("ic_google_translate")} />}
                >
                    <FormInput
                        value={settings.gemini_key}
                        placeholder="Paste your API Key (AIza...)"
                        onChange={(v: string) => (settings.gemini_key = v)}
                        secureTextEntry={true} // لإخفاء المفتاح
                    />
                </FormRow>
            </FormSection>

            <Text style={styles.subheaderText} onPress={() => url.openURL("https://github.com/Rico040/bunny-plugins")}>
                {`Build: (${manifest.hash.substring(0, 7)})`}
            </Text>
        </ScrollView>
    )
}
