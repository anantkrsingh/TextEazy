const Document = require("../models/doc");

const createDoc = async (req, res) => {
  try {
    const { name, content } = req.body;
    const createdBy = req.user._id;
    const newDoc = new Document({ name, content, createdBy });
    await newDoc.save();
    res
      .status(201)
      .json({ message: "Document created successfully", docId: newDoc._id });
  } catch (error) {
    res.status(500).send("Error creating document: " + error.message);
  }
};

const getDocById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id).populate("createdBy", "name email");
    if (!doc) {
      return res.status(404).send("Document not found");
    }
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).send("Error retrieving document: " + error.message);
  }
};

const removeDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).send("Document not found");
    }
    res.status(200).send(`Document with ID: ${id} removed successfully`);
  } catch (error) {
    res.status(500).send("Error removing document: " + error.message);
  }
};

const updateDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;
    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      { name, content },
      { new: true, runValidators: true }
    );
    if (!updatedDoc) {
      return res.status(404).send("Document not found");
    }
    res.status(200).send(`Document with ID: ${id} updated successfully`);
  } catch (error) {
    res.status(500).send("Error updating document: " + error.message);
  }
};

const getDocsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const docs = await Document.find({ createdBy: userId });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).send("Error retrieving documents: " + error.message);
  }
};

exports.createDoc = createDoc;
exports.getDocById = getDocById;
exports.removeDoc = removeDoc;
exports.updateDoc = updateDoc;
exports.getDocsByUser = getDocsByUser;
