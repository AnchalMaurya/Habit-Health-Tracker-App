document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("bmiData"));
    if (!data) {
        document.body.innerHTML = "<h2>No BMI data found. Please go back.</h2>";
    return;
    }
    // Show user details
    document.getElementById("userDetails").innerHTML = `
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Age:</b> ${data.age}</p>
        <p><b>Gender:</b> ${data.gender}</p>
        <p><b>Weight:</b> ${data.weight} kg</p>
        <p><b>Height:</b> ${data.height} cm</p>
        <p><b>BMI:</b> ${data.bmi}</p>
    `;

    const bmiValue = parseFloat(data.bmi);

    // --- Pie Chart ---
    new Chart(document.getElementById("bmiPie"), {
        type: "pie",
        data: {
            labels: [
                "Underweight (<18.5)",
                "Normal (18.5-24.9)",
                "Overweight (25-29.9)",
                "Obese Type I (30-34.9)",
                "Obese Type II (35-39.9)",
                "Obese Type III (>=40)"
            ],
            datasets: [{
                data: [18.5, 6.4, 4.9, 4.9, 4.9, 10],
                backgroundColor: ["#00BFFF", "#32CD32", "#FFD700", "#FF7F50", "#FF4500", "#FF0000"]
            }]
          }
    });

  // --- Gauge Chart ---
  const gaugeCtx = document.getElementById("bmiGauge").getContext("2d");
  const gaugeChart = new Chart(gaugeCtx, {
    type: "doughnut",
    data: {
      labels: ["Underweight", "Normal", "Overweight", "Obese I", "Obese II", "Obese III", ""],
      datasets: [{
        data: [18.5, 6.4, 4.9, 4.9, 4.9, 10, 60], // last slice invisible
        backgroundColor: ["#00BFFF", "#32CD32", "#FFD700", "#FF7F50", "#FF4500", "#FF0000", "transparent"],
        borderWidth: 0,
        cutout: "70%",
        circumference: 180,
        rotation: 270
      }]
    },
    options: { plugins: { legend: { display: false } } },
    plugins: [{
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const { width, height } = chart;
        const centerX = width / 2;
        const centerY = height - 10;
        const radius = (chart.chartArea.width / 2) * 0.8;

        // Angle mapping
        let angleDeg;
        if (bmiValue < 18.5) angleDeg = (bmiValue / 18.5) * 30;
        else if (bmiValue < 25) angleDeg = 30 + ((bmiValue - 18.5) / 6.4) * 30;
        else if (bmiValue < 30) angleDeg = 60 + ((bmiValue - 25) / 5) * 30;
        else if (bmiValue < 35) angleDeg = 90 + ((bmiValue - 30) / 5) * 30;
        else if (bmiValue < 40) angleDeg = 120 + ((bmiValue - 35) / 5) * 30;
        else angleDeg = 150 + ((bmiValue - 40) / 10) * 30;

        const rad = (Math.PI / 180) * (180 + angleDeg);
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);

        // Needle color
        let needleColor = "#000";
        if (bmiValue < 18.5) needleColor = "#00BFFF";
        else if (bmiValue < 25) needleColor = "#32CD32";
        else if (bmiValue < 30) needleColor = "#FFD700";
        else if (bmiValue < 35) needleColor = "#FF7F50";
        else if (bmiValue < 40) needleColor = "#FF4500";
        else needleColor = "#FF0000";

        // Draw needle
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = needleColor;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = needleColor;
        ctx.fill();
      }
    }]
  });

  // Show BMI text below gauge
  let category = "";
  if (bmiValue < 18.5) category = "Underweight";
  else if (bmiValue < 25) category = "Normal";
  else if (bmiValue < 30) category = "Overweight";
  else if (bmiValue < 35) category = "Obese Type I";
  else if (bmiValue < 40) category = "Obese Type II";
  else category = "Obese Type III";

  document.getElementById("bmiText").innerText =`Your BMI: ${bmiValue} (${category})` ;
  document.getElementById("bmiText").style.color = gaugeChart.data.datasets[0].backgroundColor[
    ["Underweight","Normal","Overweight","Obese Type I","Obese Type II","Obese Type III"].indexOf(category)
  ];

  // Back button
  document.getElementById("backBtn").addEventListener("click", () => {
    localStorage.setItem("goToBMI", "true"); // set flag
    window.location.href = "index.html";
  });
});