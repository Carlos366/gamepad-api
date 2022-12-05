const router = require('express').Router();
const List = require('../models/List');
const verify = require('../verifyToken');

//CREATE

router.post('/', verify, async (req, res) => {
  const newList = new List(req.body);
  try {
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete('/:id', verify, async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.status(201).json('The list has been delete...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET

router.get('/', verify, async (req, res) => {
  const user = req.query.user_id;
  let list = [];
  try {
    list = await List.aggregate([
      {
        $match: { id_user: user },
      },
    ]);

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
