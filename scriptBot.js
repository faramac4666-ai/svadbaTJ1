

rsvpForm.addEventListener("submit", handleRsvpSubmit);

async function handleRsvpSubmit(event) {
    event.preventDefault();

    const rsvpForm = document.getElementById("rsvpForm");
    const formStatus = document.getElementById("formStatus");

    const formData = new FormData(rsvpForm);

    const message = `
💍 Новая регистрация на свадьбу

👤 Имя: ${formData.get("name")}
📞 Телефон: ${formData.get("phone")}
👥 Количество гостей: ${formData.get("guests")}
✅ Присутствие: ${formData.get("attendance")}

💌 Сообщение:
${formData.get("message")}
`;

    const TOKEN = "8773269789:AAHpMKkQF1m3vEjqsJvlN7ZbxCvL789Tvn0";
    const CHAT_ID = "5016912165";

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                }),
            }
        );

        const result = await response.json();
        console.log(result);

        if (result.ok) {
            formStatus.textContent = "✅ Спасибо! Ваш ответ отправлен.";
            rsvpForm.reset();
        } else {
            formStatus.textContent = "❌ Ошибка отправки.";
        }
    } catch (error) {
        console.error(error);
        formStatus.textContent = "❌ Не удалось отправить данные.";
    }
}