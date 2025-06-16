export default async function handler(req, res) {
  const { unique } = req.query;

  try {
    const response = await fetch(`http://176.241.95.201:8092/id?unique=${unique}`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic YWRtaW46MjQxMDY3ODkw',
      },
    });

    const text = await response.text(); // ناخذ الرد كنص

    try {
      const data = JSON.parse(text); // نحاول نحوله لـ JSON
      return res.status(200).json(data);
    } catch (jsonError) {
      // الرد مو JSON → نعرضه كما هو
      return res.status(502).json({
        error: "الرد من السيرفر الخارجي ليس JSON صحيح",
        raw: text,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "فشل في الاتصال بالسيرفر الخارجي", details: err.message });
  }
}
