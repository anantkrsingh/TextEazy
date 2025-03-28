const Document = require("../models/doc");
const google = require("googleapis").google;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

exports.saveToDrive = async (req, res) => {
  const { docId } = req.params;
  const doc = await Document.findById(docId);

  if (!doc) {
    return res.status(404).json({ error: "Document not found" });
  }
  const { name, content } = doc;
  const jsonContent = JSON.parse(content);
  // //   const htmlContent = jsonContent.root.children

  //     .map((node) => node.text || "")
  //     .join("\n");

  const htmlContent = parseLexicalToHTML(content); // Convert to HTML

  const token = req.user.accessToken;
  oauth2Client.setCredentials({ access_token: token });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    const metadata = {
      name: `${name || "Letter"}.docx`,
      mimeType: "application/vnd.google-apps.document",
    };

    const file = await drive.files.create({
      resource: metadata,
      media: {
        mimeType: "text/html",
        body: `<p>${htmlContent.replace(/\n/g, "<br>")}</p>`,
      },
      fields: "id, name, webViewLink",
    });

    console.log(file);

    res.status(200).json({
      message: "Letter saved to Google Drive",
      fileId: file.data.id,
      link: file.data.webViewLink,
    });
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    res.status(500).json({ error: "Failed to upload to Google Drive" });
  }
};

const parseLexicalToHTML = (lexicalJSON) => {
  try {
    const parsed = JSON.parse(lexicalJSON);

    const traverse = (node) => {
      if (!node || !node.children) return "";

      return node.children
        .map((child) => {
          if (child.type === "text") {
            return `<span>${child.text}</span>`;
          }
          if (child.type === "paragraph") {
            return `<p>${traverse(child)}</p>`;
          }
          return traverse(child);
        })
        .join("");
    };

    const html = traverse(parsed.root);
    return `<div>${html}</div>`;
  } catch (error) {
    console.error("Failed to convert Lexical JSON to HTML:", error);
    return "<div>Error rendering content</div>";
  }
};
