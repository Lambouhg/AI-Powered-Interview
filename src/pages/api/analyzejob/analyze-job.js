export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { jobDescription, responsibilities, whoYouAre, niceToHaves } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  const prompt = `
    Từ nội dung sau, hãy liệt kê các kỹ năng, kinh nghiệm, trình độ, kỹ năng mềm, nhận xét công việc... các yếu tố cần thiết cho để tạo việc.
    Trả về kết quả theo định dạng JSON với mỗi danh mục là một mảng. Ví dụ:
    {
    "Kỹ năng": [...],
    "Kinh nghiệm": [...],
    ...
    }
    Lưu ý: Bám sát nội dung đã gửi.
    Nội dung:
      ${jobDescription}
      ${responsibilities}
      ${whoYouAre}
      ${niceToHaves}
      `;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://jobfinder-psi.vercel.app",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.choices && data.choices.length > 0) {
      res.status(200).json({ result: data.choices[0].message.content });
    } else {
      console.error("Lỗi GPT:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      res
        .status(500)
        .json({ error: "GPT-4 trả về lỗi hoặc dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.error("Lỗi gọi GPT-4:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
}
