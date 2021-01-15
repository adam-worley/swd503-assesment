const Infection = require("../models/Infection");

exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;



  try {
    const infections = await Infection.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await Infection.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("statistics", {
      infections: infections,
      numberOfPages: numberOfPages,
      currentPage: page
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "could not list tastings" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Tasting.findByIdAndRemove(id);
    res.redirect("/tastings");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};