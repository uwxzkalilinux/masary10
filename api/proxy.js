export default async function handler(req, res) {
  const { unique } = req.query;

  try {
    const response = await fetch(`http://176.241.95.201:8092/id?unique=${unique}`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic YWRtaW46MjQxMDY3ODkw',
      },
    });

    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      return res.status(200).json({ data: [] });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بالسيرفر.' });
  }
}
