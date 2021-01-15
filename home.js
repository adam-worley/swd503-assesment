const Infection = require('../models/infection');

exports.list = async (req, res) => {
    console.log(req.session);
    try {
        const totalCasesRef = await Infection.aggregate([
            { $group: { _id: null, total: { $sum:"$students_infected"  } } },
        ])
        console.log(totalCountries)
        const tasterCountSummaryRef = await Tasting.aggregate(
            [
                { $match: { taster_name: { $ne: null } } },
                {
                    $group: {
                        _id: "$taster_name",
                        total: { $sum: 1 }
                    }
                }]);

        const totalCases = totalCasesRef.map(t => ({ name: t._id, total: t.total }));
        res.render("index", { totalCases: totalCases, totalTastings: totalTastings, totalTasters: tasterCountSummary.length, totalCountries: totalCountries[0].total });

    } catch (e) {
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}