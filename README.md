# Darsh Egypt 🇪🇬 - Vercel Proxy

## طريقة التركيب على Vercel

### الطريقة الأولى: Drag & Drop (الأسهل)

1. افتح [vercel.com](https://vercel.com)
2. اضغط **Add New → Project**
3. في الصفحة، اسحب ملف الـ ZIP كاملاً إلى منطقة "Drag and drop your output folder"
4. Vercel هيعمل deploy تلقائياً

### الطريقة الثانية: من GitHub

1. افتح [vercel.com](https://vercel.com)
2. اضغط **Add New → Project**
3. اختار GitHub repo: **Mostafa15M/Fast-darsh**
4. اضغط **Deploy**

### الطريقة الثالثة: يدوياً

1. افتح Vercel → **Add New → Project**
2. اختار "Third Party Git Repository" أو "Upload"
3. ارفع المجلد كاملاً (api/ + vercel.json + package.json)

## الملفات المطلوبة

| ملف | الوظيفة |
|-----|---------|
| `api/chat.js` | السيرفر الوسيط - يبعت الرسالة لـ Lovable بدون خصم credit |
| `vercel.json` | إعدادات Vercel |
| `package.json` | إعدادات المشروع |

## كيف يعمل

1. الإكستنشن يبعت `{token, projectId, message}` إلى `/api/chat`
2. السيرفر يضيف `💜 Enviado por Infinity Lovable` + رسالتك
3. يبعتها لـ Lovable API مع Header يمنع خصم الـ credit
4. Lovable يرسل النتيجة

## Endpoint

```
POST https://YOUR-URL.vercel.app/api/chat
Body: { "token": "...", "projectId": "...", "message": "..." }
```
