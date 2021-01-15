const Infection = require('../models/Infection');
const User = require('../models/User');

exports.list = async (req, res) => {
    console.log(req.session);
    try {
        const totalUsers = await User.find({}).count();
        const infectedUnis = await Infection.count({students_infected:{$gt:0}});
        const totalCases = await Infection.aggregate([
            {$group:{_id: null,total:{$sum:"$students_infected"}
        }
    }]);

    

    res.render("index", { totalUsers: totalUsers, infectedUnis: infectedUnis, totalCases: totalCases.pop().total });

    } catch (e) {
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}