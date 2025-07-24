export default async function handler(req, res) {
  const { unique } = req.query;

  try {
    const response = await fetch(`http://176.241.95.201:8092/id?unique=${unique}`, {
      method: 'GET',
      headers: {
        Authorization: 'Basic YWRtaW46MjQxMDY3ODkw', // admin:241067890 مشفر بـ base64
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data from source." });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
