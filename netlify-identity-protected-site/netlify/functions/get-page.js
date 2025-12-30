const PAGES = {
  "cameron": {
    "title": "Cameron Word",
    "badge": "Worldly Ambition / Identity Tension",
    "focus": "Identity before ambition. Obedience over visibility.",
    "warnings": [
      "Talks more about goals/platforms than the Word",
      "Obedience stays theoretical",
      "Increased visibility, decreased vulnerability",
      "Avoids sacrifice conversations"
    ],
    "guidance": [
      "Encourage hidden obedience",
      "Pause ambition briefly",
      "Recenter identity in Christ"
    ],
    "checkboxId": "cameron-focus"
  },
  "michelle": {
    "title": "Michelle",
    "badge": "Healing from Trauma",
    "focus": "Separating God's truth from past pain.",
    "warnings": [
      "Defensive questioning",
      "Emotional withdrawal",
      "Identifies more with pain than healing"
    ],
    "guidance": [
      "Move gently",
      "Anchor to God's character",
      "Allow healing time"
    ],
    "checkboxId": "michelle-focus"
  },
  "wayne": {
    "title": "Wayne",
    "badge": "Teachability vs Knowledge Pride",
    "focus": "Application over accumulation.",
    "warnings": [
      "Corrects others quickly",
      "Measures growth by knowledge"
    ],
    "guidance": [
      "Ask for application",
      "Limit teaching roles temporarily"
    ],
    "checkboxId": "wayne-focus"
  },
  "amari": {
    "title": "Amari Davis",
    "badge": "Faithfulness Over Feelings",
    "focus": "Faithfulness over feelings.",
    "warnings": [
      "Inconsistent Word time",
      "Busyness excuses"
    ],
    "guidance": [
      "Simplify routine",
      "Focus on consistency"
    ],
    "checkboxId": "amari-focus"
  },
  "john": {
    "title": "John Adeyemo",
    "badge": "Humility vs Doctrinal Pride",
    "focus": "Listening before speaking.",
    "warnings": [
      "Defensive posture",
      "Relies on sermons"
    ],
    "guidance": [
      "Scripture-only focus",
      "Cultivate humility"
    ],
    "checkboxId": "john-focus"
  }
};

exports.handler = async (event, context) => {
  // Netlify verifies the JWT and populates context.clientContext.user when Authorization: Bearer <jwt> is provided.
  const user = context && context.clientContext && context.clientContext.user;
  if (!user) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  const page = (event.queryStringParameters && event.queryStringParameters.page) || "";
  const key = String(page).toLowerCase();
  const data = PAGES[key];
  if (!data) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Not found" })
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
};
