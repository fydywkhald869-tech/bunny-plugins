import { storage } from "@vendetta/plugin";
import patchActionSheet from "./patches/ActionSheet";
import patchCommands from "./patches/Commands";
import Settings from "./settings";
import patchGemini from "./GeminiFeature"; // ✅ 1. استيراد الملف الجديد

// تعريف الإعدادات (أضفنا gemini_key)
export const settings: {
    source_lang?: string;
    target_lang?: string;
    translator?: number;
    immersive_enabled?: boolean;
    gemini_key?: string; // ✅ 2. تعريف مكان المفتاح
} = storage;

// القيم الافتراضية
settings.target_lang ??= "en";
settings.translator ??= 1;
settings.immersive_enabled ??= true;
settings.gemini_key ??= ""; // ✅ 3. قيمة افتراضية للمفتاح

let patches = [];

export default {
    onLoad: () => {
        patches = [
            patchActionSheet(), // تشغيل المترجم القديم
            patchCommands(),    // تشغيل الأوامر القديمة
            patchGemini()       // ✅ 4. تشغيل Gemini الجديد
        ];
    },
    onUnload: () => {
        for (const unpatch of patches) unpatch();
    },
    settings: Settings
}
