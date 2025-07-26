import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xioxpdhdsphtclicicyn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // استخدم مفتاح الـ Service Role
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { unique, userId, deviceFingerprint } = req.query;

  if (!unique) {
    return res.status(400).json({ error: "يرجى إدخال الرقم الموحد." });
  }

  try {
    // التحقق وتسجيل الجهاز
    if (userId && deviceFingerprint) {
      // تحقق إذا الجهاز موجود
      const { data: devices, error: devicesError } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', userId)
        .eq('device_fingerprint', deviceFingerprint);

      if (devicesError) throw devicesError;

      if (devices.length === 0) {
        // سجل الجهاز الجديد
        await supabase.from('user_devices').insert([{ user_id: userId, device_fingerprint: deviceFingerprint }]);
        // يمكن إرسال تنبيه هنا أو إرجاع نتيجة خاصة
      }
    }

    // استدعاء API الخارجي
    const response = await fetch(`http://176.241.95.201:8092/id?unique=${encodeURIComponent(unique)}`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic YWRtaW46MjQxMDY3ODkw',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `السيرفر رد بحالة ${response.status}` });
    }

    const data = await response.json();

    // حذف رابط الصورة حسب طلبك
    if (data.trips && Array.isArray(data.trips)) {
      data.trips.forEach(trip => {
        if (trip.sonarData && trip.sonarData.manifests) {
          trip.sonarData.manifests.forEach(manifest => {
            if ('sonar_image_url' in manifest) {
              delete manifest.sonar_image_url;
            }
          });
        }
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "خطأ في الاتصال بالسيرفر الخارجي", details: err.message });
  }
}
