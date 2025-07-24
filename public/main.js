document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const unique = document.getElementById("unique").value.trim();
  const loader = document.getElementById("loader");
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    const res = await fetch(`/api/proxy?unique=${unique}`);
    const data = await res.json();
    loader.classList.add("hidden");

    const withSonar = [];
    const withoutSonar = [];

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.sonar_image_url) {
          withSonar.push(item);
        } else {
          withoutSonar.push(item);
        }
      });

      renderResults([...withoutSonar, ...withSonar]);
    } else {
      resultsDiv.innerHTML = `<p class="text-red-500 text-center">لم يتم العثور على نتائج.</p>`;
    }
  } catch (err) {
    loader.classList.add("hidden");
    resultsDiv.innerHTML = `<p class="text-red-500 text-center">حدث خطأ أثناء جلب البيانات.</p>`;
  }
});

function renderResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  results.forEach((item) => {
    const card = document.createElement("div");
    card.className =
      "fade-in p-4 rounded shadow-lg " +
      (item.sonar_image_url
        ? "bg-blue-50 dark:bg-blue-900"
        : "bg-yellow-50 dark:bg-yellow-900");

    card.innerHTML = `
      <h2 class="text-xl font-bold mb-2">${item.driver_name || "اسم السائق غير متوفر"}</h2>
      <p><strong>رقم السيارة:</strong> ${item.truck_number || "-"}</p>
      <p><strong>رقم الحاوية:</strong> ${item.container_number_export || "-"}</p>
      <p><strong>تاريخ دخول السونار:</strong> ${item.sonar_date || "غير متوفر"}</p>
    `;

    resultsDiv.appendChild(card);
  });
}
