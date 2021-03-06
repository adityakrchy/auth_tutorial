const router = require("express").Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

// ROUTE 1: Get All the Notes using: GET "/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user });
  res.json(notes);
});

// ROUTE 1: Create a new note using: POST "/notes/createnewnote". Login required
router.post("/createnewnote", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  const user = req.user;
  try {
    const note = new Notes({
      title,
      description,
      tag,
      user,
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.error(error.message);
  }
});
// ROUTE 2: Update a existing note using: PUT "/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Delete a note using: DELETE "/notes/deletenote/:id". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ message: "Note Deleted" });
});

module.exports = router;
