const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 4: Fetch All Notes
// Get All the Notes of user using Get "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json([notes]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 5: Create Notes
// Add new Note of user using Post "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Title must be of minimum 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be of minimum 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Note({
            title, description, tag, user: req.user.id
        });

        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 6: Update Notes
// Update existing note of user using PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);

        // If note not found
        if (!note) {
            return res.status(404).send("Not found");
        }

        // Allow updation only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorised");
        }

        // Create a newNote oject
        const newNote = {};

        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 7: Delete Notes
// Delete existing note of user using DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);

        // If note not found
        if (!note) {
            return res.status(404).send("Not found");
        }

        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorised");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted.", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;