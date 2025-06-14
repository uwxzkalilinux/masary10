export default async function handler(req, res) {
  const { unique } = req.query;

  const response = await fetch(`http://176.241.95.201:8092/id?unique=${unique}`, {
    method: 'GET',
    headers: {
      Authorization: 'Basic YWRtaW46MjQxMDY3ODkw',
    },
  });

  if (!response.ok) {
    return res.status(500).json({ error: "فشل في جلب البيانات من السيرفر الخارجي" });
  }

  const data = await response.json();
  res.status(200).json(data);
}
