export default async function handler(req, res) {
  const { unique, truck_number, container_number } = req.query;

  let url = '';

  if (unique) {
    url = `http://176.241.95.201:8092/id?unique=${unique}`;
  } else if (truck_number && container_number) {
    url = `http://176.241.95.201:8092/id/customs/filtered?truck_number=${truck_number}&container_number=${container_number}`;
  } else if (truck_number) {
    url = `http://176.241.95.201:8092/id/customs/filtered?truck_number=${truck_number}`;
  } else if (container_number) {
    url = `http://176.241.95.201:8092/id/customs/filtered?container_number=${container_number}`;
  } else {
    return res.status(400).json({ error: "يرجى إدخال قيمة بحث صحيحة." });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic YWRtaW46MjQxMDY3ODkw',
      },
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
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
