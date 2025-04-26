const {onRequest} = require("firebase-functions/v2/https");
const OpenAI = require("openai");

exports.streamEndpoint = onRequest({ cors: true }, async (req, res) => {
  try {
    const { prompt } = req.body;
    const key = "sk-proj-2d4foRtOeH2g9istLUdz13IAztg_bO4LhRmYeLfiZM2PxB6hAD0G-woE2NBkcRSkF3MVqD9ZG1T3BlbkFJJkcjzQ4hFF3bFOUfaKejQzXCGNim80ORSVHOBZ1DMOCFh59C50dbsU_xzpMLP8EsoWVt8IWKkA"
    const openai = new OpenAI({ apiKey: key });
    const completion = await openai.chat.completions.create({
      messages: [
        {role: "user", content: prompt},
      ],
      model: "gpt-4o-mini",
    });
    const completionContent = completion.choices[0].message.content;
    res.send(completionContent);
  } catch ( err ) {
    res.send(err)
  }
});





