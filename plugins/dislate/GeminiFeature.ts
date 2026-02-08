import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { storage } from "@vendetta/plugin";

const ActionSheet = findByProps("openLazy", "hideActionSheet");

// 1. دالة الترجمة الخاصة بـ Gemini
async function translateWithGemini(text) {
    const key = storage.gemini_key; // سنقرأ المفتاح من هنا
    if (!key) return "⚠️ اذهب للإعدادات وضع مفتاح Gemini";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Translate to Arabic: ${text}` }] }]
            })
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "خطأ في الترجمة";
    } catch (e) { return "خطأ في الاتصال"; }
}

// 2. دالة "الباتش" التي تضيف الزر
export default function patchGemini() {
    return after("openLazy", ActionSheet, ([component, args, actionMessage]) => {
        const message = args?.message || actionMessage;
        if (!message?.content) return;

        component.then(instance => {
            const buttons = instance.props?.buttons;
            if (!buttons) return;

            // إضافة زر Gemini (دون حذف الأزرار القديمة)
            buttons.unshift({
                label: "Gemini Translate", // اسم الزر الجديد
                icon: getAssetIDByName("ic_google_translate"),
                onPress: async () => {
                    showToast("Gemini يترجم...", getAssetIDByName("ic_sync"));
                    const result = await translateWithGemini(message.content);
                    showToast(result, getAssetIDByName("Check"));
                }
            });
        });
    });
}

