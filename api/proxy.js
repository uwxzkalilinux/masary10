export default async function handler(req, res) {
  const { unique } = req.query;

  try {
    const response = await fetch(`http://176.241.95.201:8092/id?unique=${unique}`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic YWRtaW46MjQxMDY3ODkw',
      },
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);

      // تحويل تاريخ دخول السونار إذا موجود
      if (data.sonar_entry_date) {
        const date = new Date(data.sonar_entry_date);

        const options = {
          timeZone: 'Asia/Baghdad',
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };

        const formatter = new Intl.DateTimeFormat('ar-EG', options);
        const parts = formatter.formatToParts(date);

        const day = parts.find(p => p.type === 'day')?.value || '';
        const month = parts.find(p => p.type === 'month')?.value || '';
        const year = parts.find(p => p.type === 'year')?.value || '';
        const hour = parts.find(p => p.type === 'hour')?.value || '';
        const minute = parts.find(p => p.type === 'minute')?.value || '';

        // التنسيق النهائي
        data.formatted_sonar_entry = `${day}/${month}/${year} الساعة ${hour}:${minute}`;
      }

      return res.status(200).json(data);
    } catch (jsonError) {
      return res.status(502).json({
        error: "الرد من السيرفر الخارجي ليس JSON صحيح",
        raw: text,
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "فشل في الاتصال بالسيرفر الخارجي",
      details: err.message,
    });
  }
}
