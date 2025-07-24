export default async function handler(req, res) {
  const { unique, truck_number, container_number } = req.query;

  let url = "";
  if (unique) {
    url = `http://176.241.95.201:8092/id?unique=${unique}`;
  } else if (truck_number && container_number) {
    url = `http://176.241.95.201:8092/id/customs/filtered?truck_number=${truck_number}&container_number=${container_number}`;
  } else if (truck_number) {
    url = `http://176.241.95.201:8092/id/customs/filtered?truck_number=${truck_number}`;
  } else if (container_number) {
    url = `http://176.241.95.201:8092/id/customs/filtered?container_number=${container_number}`;
  } else {
    return res.status(400).json({ error: 'يرجى تحديد رقم الموحد أو رقم السيارة أو رقم الحاوية.' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic YWRtaW46MjQxMDY3ODkw',
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب البيانات' });
  }
}
